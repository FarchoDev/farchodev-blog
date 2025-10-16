"""
Authentication module for FarchoDev Blog
Handles local JWT auth, Google OAuth (Emergent), and GitHub OAuth
"""
from fastapi import HTTPException, Request, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from typing import Optional, Literal
import jwt
import uuid
import httpx
import os
import secrets

# Configuration
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Admin Emails
ADMIN_EMAILS_STR = os.environ.get('ADMIN_EMAILS', '')
ADMIN_EMAILS = [email.strip().lower() for email in ADMIN_EMAILS_STR.split(',') if email.strip()]

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer(auto_error=False)

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    password_hash: Optional[str] = None  # Only for local auth
    picture: Optional[str] = None
    role: Literal["admin", "user"] = "user"
    provider: Literal["local", "google", "github"] = "local"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Session(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    provider: Literal["local", "google", "github"]
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    bio: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    website_url: Optional[str] = None
    preferences: dict = {}
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserPublic(BaseModel):
    """Public user information"""
    id: str
    email: EmailStr
    name: str
    picture: Optional[str]
    role: str
    provider: str

class TokenData(BaseModel):
    user_id: str
    email: str
    role: str

# Utility functions
def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> TokenData:
    """Decode and validate JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        email: str = payload.get("email")
        role: str = payload.get("role")
        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials"
            )
        return TokenData(user_id=user_id, email=email, role=role)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except (jwt.InvalidTokenError, jwt.DecodeError, Exception):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

async def get_current_user(request: Request, db) -> User:
    """Get current authenticated user from request"""
    # Try to get token from cookie first
    token = request.cookies.get("session_token")
    
    # If not in cookie, try Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Check if it's a session token (OAuth)
    session = await db.sessions.find_one({"session_token": token})
    if session:
        # Check if session is expired
        if datetime.now(timezone.utc) > session["expires_at"]:
            await db.sessions.delete_one({"session_token": token})
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Session has expired"
            )
        # Get user from session
        user = await db.users.find_one({"id": session["user_id"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return User(**user)
    
    # Otherwise, it's a JWT token (local auth)
    token_data = decode_token(token)
    user = await db.users.find_one({"id": token_data.user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return User(**user)

async def require_admin(request: Request, db) -> User:
    """Require admin role"""
    user = await get_current_user(request, db)
    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user

# GitHub OAuth functions
GITHUB_CLIENT_ID = os.environ.get('GITHUB_CLIENT_ID', '')
GITHUB_CLIENT_SECRET = os.environ.get('GITHUB_CLIENT_SECRET', '')
GITHUB_REDIRECT_URI = os.environ.get('GITHUB_REDIRECT_URI', '')

def create_github_auth_url(state: str) -> str:
    """Create GitHub OAuth authorization URL"""
    return (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={GITHUB_REDIRECT_URI}"
        f"&scope=user:email"
        f"&state={state}"
    )

async def exchange_github_code(code: str) -> dict:
    """Exchange GitHub authorization code for access token"""
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to exchange GitHub code"
            )
        return response.json()

async def get_github_user(access_token: str) -> dict:
    """Get GitHub user information"""
    async with httpx.AsyncClient() as client:
        # Get user info
        response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get GitHub user"
            )
        user_data = response.json()
        
        # Get user emails
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/json"
            }
        )
        if email_response.status_code == 200:
            emails = email_response.json()
            # Get primary email
            primary_email = next(
                (e["email"] for e in emails if e["primary"]),
                user_data.get("email")
            )
            user_data["email"] = primary_email
        
        return user_data

# Emergent Google OAuth functions
async def get_google_user_from_session(session_id: str) -> dict:
    """Get Google user data from Emergent Auth session"""
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to get Google session data"
            )
        return response.json()

async def create_or_update_user(db, email: str, name: str, picture: Optional[str], provider: str, password_hash: Optional[str] = None) -> User:
    """Create or update user in database"""
    # Check if user exists by email
    existing_user = await db.users.find_one({"email": email})
    
    if existing_user:
        # Update last login and picture if changed
        update_data = {
            "last_login": datetime.now(timezone.utc),
        }
        if picture and existing_user.get("picture") != picture:
            update_data["picture"] = picture
        
        await db.users.update_one(
            {"email": email},
            {"$set": update_data}
        )
        return User(**existing_user)
    
    # Create new user
    user = User(
        email=email,
        name=name,
        picture=picture,
        provider=provider,
        password_hash=password_hash,
        role="user"  # Default role
    )
    
    user_doc = user.model_dump()
    user_doc["created_at"] = user.created_at
    user_doc["last_login"] = user.last_login
    
    await db.users.insert_one(user_doc)
    
    # Create user profile
    profile = UserProfile(user_id=user.id)
    await db.user_profiles.insert_one(profile.model_dump())
    
    return user

async def create_session(db, user_id: str, provider: str, session_token: str) -> Session:
    """Create a new session"""
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session = Session(
        user_id=user_id,
        session_token=session_token,
        provider=provider,
        expires_at=expires_at
    )
    
    session_doc = session.model_dump()
    session_doc["created_at"] = session.created_at
    session_doc["expires_at"] = expires_at
    
    await db.sessions.insert_one(session_doc)
    
    return session

async def delete_session(db, session_token: str):
    """Delete a session"""
    await db.sessions.delete_one({"session_token": session_token})
