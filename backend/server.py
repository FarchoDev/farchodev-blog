from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import RedirectResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import re
import secrets

# Import auth module
from auth import (
    User, UserRegister, UserLogin, UserPublic, UserProfile, UserProfileUpdate,
    hash_password, verify_password, create_access_token, 
    get_current_user, require_admin,
    create_github_auth_url, exchange_github_code, get_github_user,
    get_google_user_from_session, create_or_update_user, create_session, delete_session
)
from features import PostLike, Bookmark, UserActivity

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Environment detection
IS_PRODUCTION = os.environ.get('ENV', 'development') == 'production'
COOKIE_SECURE = IS_PRODUCTION  # Only secure cookies in production
COOKIE_SAMESITE = "none" if IS_PRODUCTION else "lax"  # lax for development

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Utility functions
def create_slug(title: str) -> str:
    """Create URL-friendly slug from title"""
    slug = title.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    return slug[:100]

def calculate_reading_time(content: str) -> int:
    """Calculate reading time in minutes (assuming 200 words per minute)"""
    word_count = len(content.split())
    return max(1, round(word_count / 200))

# Models
class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None

class Post(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    content: str
    excerpt: str
    author: str = "FarchoDev"
    featured_image_url: Optional[str] = None
    category: str
    tags: List[str] = []
    published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    views_count: int = 0
    reading_time: int = 1

class PostCreate(BaseModel):
    title: str
    content: str
    excerpt: str
    featured_image_url: Optional[str] = None
    category: str
    tags: List[str] = []
    published: bool = False

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    featured_image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    published: Optional[bool] = None

class Comment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    post_id: str
    user_id: Optional[str] = None  # For authenticated users
    author_name: str
    author_email: str
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: Optional[datetime] = None
    approved: bool = False

class CommentCreate(BaseModel):
    post_id: str
    content: str

class CommentCreateAnonymous(BaseModel):
    post_id: str
    author_name: str
    author_email: str
    content: str

class CommentUpdate(BaseModel):
    content: str

class Newsletter(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True

class NewsletterSubscribe(BaseModel):
    email: str

class BookmarkCreate(BaseModel):
    post_id: str

# Public Routes
@api_router.get("/")
async def root():
    return {"message": "FarchoDev Blog API"}

@api_router.get("/posts", response_model=List[Post])
async def get_posts(
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None
):
    """Get published posts with optional filters"""
    query = {"published": True}
    
    if category:
        query["category"] = category
    if tag:
        query["tags"] = tag
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"content": {"$regex": search, "$options": "i"}},
            {"excerpt": {"$regex": search, "$options": "i"}}
        ]
    
    posts = await db.posts.find(query, {"_id": 0}).sort("published_at", -1).skip(skip).limit(limit).to_list(limit)
    
    # Convert ISO strings back to datetime
    for post in posts:
        for field in ['created_at', 'updated_at', 'published_at']:
            if field in post and isinstance(post[field], str):
                post[field] = datetime.fromisoformat(post[field])
    
    return posts

@api_router.get("/posts/{slug}", response_model=Post)
async def get_post_by_slug(slug: str):
    """Get a single post by slug"""
    post = await db.posts.find_one({"slug": slug, "published": True}, {"_id": 0})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Convert ISO strings back to datetime
    for field in ['created_at', 'updated_at', 'published_at']:
        if field in post and isinstance(post[field], str):
            post[field] = datetime.fromisoformat(post[field])
    
    return post

@api_router.post("/posts/{post_id}/view")
async def increment_view(post_id: str):
    """Increment view count for a post"""
    result = await db.posts.update_one(
        {"id": post_id},
        {"$inc": {"views_count": 1}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "View count incremented"}

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    """Get all categories"""
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    
    for cat in categories:
        if 'created_at' in cat and isinstance(cat['created_at'], str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
    
    return categories

@api_router.post("/comments/anonymous", response_model=Comment)
async def create_comment_anonymous(comment_data: CommentCreateAnonymous):
    """Create a new comment (anonymous users - needs approval)"""
    comment_obj = Comment(
        post_id=comment_data.post_id,
        author_name=comment_data.author_name,
        author_email=comment_data.author_email,
        content=comment_data.content,
        approved=False  # Needs approval for anonymous users
    )
    doc = comment_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.comments.insert_one(doc)
    return comment_obj

@api_router.get("/posts/{post_id}/comments", response_model=List[Comment])
async def get_post_comments(post_id: str):
    """Get approved comments for a post"""
    comments = await db.comments.find(
        {"post_id": post_id, "approved": True},
        {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    
    for comment in comments:
        if 'created_at' in comment and isinstance(comment['created_at'], str):
            comment['created_at'] = datetime.fromisoformat(comment['created_at'])
    
    return comments

@api_router.post("/newsletter/subscribe", response_model=Newsletter)
async def subscribe_newsletter(data: NewsletterSubscribe):
    """Subscribe to newsletter"""
    # Check if already subscribed
    existing = await db.newsletter.find_one({"email": data.email})
    
    if existing:
        if not existing.get('active', True):
            # Reactivate subscription
            await db.newsletter.update_one(
                {"email": data.email},
                {"$set": {"active": True}}
            )
        return Newsletter(**{k: v for k, v in existing.items() if k != '_id'})
    
    newsletter_obj = Newsletter(email=data.email)
    doc = newsletter_obj.model_dump()
    doc['subscribed_at'] = doc['subscribed_at'].isoformat()
    
    await db.newsletter.insert_one(doc)
    return newsletter_obj

# ============================================================================
# AUTHENTICATION ROUTES
# ============================================================================

@api_router.post("/auth/register", response_model=UserPublic)
async def register(user_data: UserRegister, response: Response):
    """Register a new user with local auth"""
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    password_hash = hash_password(user_data.password)
    user = await create_or_update_user(
        db,
        email=user_data.email,
        name=user_data.name,
        picture=None,
        provider="local",
        password_hash=password_hash
    )
    
    # Create JWT token
    token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    return UserPublic(
        id=user.id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role,
        provider=user.provider
    )

@api_router.post("/auth/login", response_model=UserPublic)
async def login(credentials: UserLogin, response: Response):
    """Login with local auth"""
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user = User(**user_doc)
    
    # Verify password
    if not user.password_hash or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.now(timezone.utc)}}
    )
    
    # Create JWT token
    token = create_access_token({
        "user_id": user.id,
        "email": user.email,
        "role": user.role
    })
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    return UserPublic(
        id=user.id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role,
        provider=user.provider
    )

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    token = request.cookies.get("session_token")
    if token:
        # Delete session if it's an OAuth session
        await delete_session(db, token)
    
    # Clear cookie
    response.delete_cookie(
        key="session_token",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE
    )
    
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me", response_model=UserPublic)
async def get_me(request: Request):
    """Get current user"""
    user = await get_current_user(request, db)
    return UserPublic(
        id=user.id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role,
        provider=user.provider
    )

# Google OAuth (Emergent Auth)
@api_router.get("/auth/google/login")
async def google_login(redirect_url: str):
    """Redirect to Emergent Google OAuth"""
    auth_url = f"https://auth.emergentagent.com/?redirect={redirect_url}"
    return {"auth_url": auth_url}

@api_router.post("/auth/google/callback")
async def google_callback(session_id: str, response: Response):
    """Handle Google OAuth callback"""
    # Get user data from Emergent
    google_data = await get_google_user_from_session(session_id)
    
    # Create or update user
    user = await create_or_update_user(
        db,
        email=google_data["email"],
        name=google_data["name"],
        picture=google_data.get("picture"),
        provider="google"
    )
    
    # Create session with the Emergent session_token
    session_token = google_data["session_token"]
    await create_session(db, user.id, "google", session_token)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    return UserPublic(
        id=user.id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role,
        provider=user.provider
    )

# GitHub OAuth
@api_router.get("/auth/github/login")
async def github_login():
    """Initiate GitHub OAuth flow"""
    state = secrets.token_urlsafe(32)
    auth_url = create_github_auth_url(state)
    
    # In a real implementation, you'd store the state temporarily
    # For simplicity, we're returning it to be validated later
    return {"auth_url": auth_url, "state": state}

@api_router.get("/auth/github/callback")
async def github_callback(code: str, state: str, response: Response):
    """Handle GitHub OAuth callback"""
    # Exchange code for access token
    token_data = await exchange_github_code(code)
    access_token = token_data.get("access_token")
    
    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token")
    
    # Get user info from GitHub
    github_user = await get_github_user(access_token)
    
    if not github_user.get("email"):
        raise HTTPException(status_code=400, detail="Email not available from GitHub")
    
    # Create or update user
    user = await create_or_update_user(
        db,
        email=github_user["email"],
        name=github_user.get("name") or github_user.get("login"),
        picture=github_user.get("avatar_url"),
        provider="github"
    )
    
    # Create session token
    session_token = secrets.token_urlsafe(32)
    await create_session(db, user.id, "github", session_token)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7  # 7 days
    )
    
    return UserPublic(
        id=user.id,
        email=user.email,
        name=user.name,
        picture=user.picture,
        role=user.role,
        provider=user.provider
    )

# ============================================================================
# USER ENGAGEMENT ROUTES (Authenticated users only)
# ============================================================================

@api_router.post("/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    """Like a post"""
    user = await get_current_user(request, db)
    
    # Check if already liked
    existing = await db.post_likes.find_one({"post_id": post_id, "user_id": user.id})
    if existing:
        raise HTTPException(status_code=400, detail="Already liked")
    
    # Create like
    like = PostLike(post_id=post_id, user_id=user.id)
    doc = like.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.post_likes.insert_one(doc)
    
    # Get total likes count
    total_likes = await db.post_likes.count_documents({"post_id": post_id})
    
    return {"message": "Post liked", "total_likes": total_likes}

@api_router.delete("/posts/{post_id}/like")
async def unlike_post(post_id: str, request: Request):
    """Unlike a post"""
    user = await get_current_user(request, db)
    
    result = await db.post_likes.delete_one({"post_id": post_id, "user_id": user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Like not found")
    
    # Get total likes count
    total_likes = await db.post_likes.count_documents({"post_id": post_id})
    
    return {"message": "Post unliked", "total_likes": total_likes}

@api_router.get("/posts/{post_id}/likes")
async def get_post_likes(post_id: str, request: Request):
    """Get likes count and user's like status"""
    total_likes = await db.post_likes.count_documents({"post_id": post_id})
    
    user_liked = False
    try:
        user = await get_current_user(request, db)
        existing = await db.post_likes.find_one({"post_id": post_id, "user_id": user.id})
        user_liked = existing is not None
    except HTTPException:
        pass  # User not authenticated
    
    return {"total_likes": total_likes, "user_liked": user_liked}

class BookmarkCreate(BaseModel):
    post_id: str

@api_router.post("/bookmarks")
async def add_bookmark(bookmark_data: BookmarkCreate, request: Request):
    """Add a bookmark"""
    user = await get_current_user(request, db)
    
    # Check if already bookmarked
    existing = await db.bookmarks.find_one({"post_id": bookmark_data.post_id, "user_id": user.id})
    if existing:
        raise HTTPException(status_code=400, detail="Already bookmarked")
    
    # Create bookmark
    bookmark = Bookmark(post_id=bookmark_data.post_id, user_id=user.id)
    doc = bookmark.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookmarks.insert_one(doc)
    
    return {"message": "Bookmark added"}

@api_router.delete("/bookmarks/{post_id}")
async def remove_bookmark(post_id: str, request: Request):
    """Remove a bookmark"""
    user = await get_current_user(request, db)
    
    result = await db.bookmarks.delete_one({"post_id": post_id, "user_id": user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Bookmark not found")
    
    return {"message": "Bookmark removed"}

@api_router.get("/bookmarks")
async def get_bookmarks(request: Request):
    """Get user's bookmarked posts"""
    user = await get_current_user(request, db)
    
    # Get bookmarks
    bookmarks = await db.bookmarks.find({"user_id": user.id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    # Get posts
    post_ids = [b["post_id"] for b in bookmarks]
    posts = await db.posts.find({"id": {"$in": post_ids}}, {"_id": 0}).to_list(1000)
    
    # Convert datetime strings
    for post in posts:
        for field in ['created_at', 'updated_at', 'published_at']:
            if field in post and isinstance(post[field], str):
                post[field] = datetime.fromisoformat(post[field])
    
    return posts

@api_router.get("/posts/{post_id}/bookmark-status")
async def get_bookmark_status(post_id: str, request: Request):
    """Check if user has bookmarked a post"""
    try:
        user = await get_current_user(request, db)
        existing = await db.bookmarks.find_one({"post_id": post_id, "user_id": user.id})
        return {"is_bookmarked": existing is not None}
    except HTTPException:
        return {"is_bookmarked": False}

# Enhanced comments for authenticated users
@api_router.post("/comments", response_model=Comment)
async def create_comment_auth(comment_data: CommentCreate, request: Request):
    """Create a comment (authenticated users)"""
    user = await get_current_user(request, db)
    
    comment_obj = Comment(
        post_id=comment_data.post_id,
        user_id=user.id,
        author_name=user.name,
        author_email=user.email,
        content=comment_data.content,
        approved=True  # Auto-approve for authenticated users
    )
    
    doc = comment_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.comments.insert_one(doc)
    return comment_obj

@api_router.put("/comments/{comment_id}", response_model=Comment)
async def update_comment(comment_id: str, comment_data: CommentUpdate, request: Request):
    """Update own comment"""
    user = await get_current_user(request, db)
    
    # Check if comment exists and belongs to user
    comment = await db.comments.find_one({"id": comment_id, "user_id": user.id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or unauthorized")
    
    # Update comment
    update_dict = {
        "content": comment_data.content,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.comments.update_one({"id": comment_id}, {"$set": update_dict})
    
    # Get updated comment
    updated_comment = await db.comments.find_one({"id": comment_id}, {"_id": 0})
    
    for field in ['created_at', 'updated_at']:
        if field in updated_comment and updated_comment[field] and isinstance(updated_comment[field], str):
            updated_comment[field] = datetime.fromisoformat(updated_comment[field])
    
    return Comment(**updated_comment)

@api_router.delete("/comments/{comment_id}")
async def delete_own_comment(comment_id: str, request: Request):
    """Delete own comment"""
    user = await get_current_user(request, db)
    
    # Check if comment exists and belongs to user
    result = await db.comments.delete_one({"id": comment_id, "user_id": user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found or unauthorized")
    
    return {"message": "Comment deleted"}

# User profile routes
@api_router.get("/users/profile", response_model=UserProfile)
async def get_user_profile(request: Request):
    """Get user profile"""
    user = await get_current_user(request, db)
    
    profile = await db.user_profiles.find_one({"user_id": user.id}, {"_id": 0})
    if not profile:
        # Create profile if doesn't exist
        profile = UserProfile(user_id=user.id)
        await db.user_profiles.insert_one(profile.model_dump())
    
    return profile

@api_router.put("/users/profile")
async def update_user_profile(profile_data: UserProfileUpdate, request: Request):
    """Update user profile - only updates provided fields"""
    user = await get_current_user(request, db)
    
    # Build update dict only with provided fields (not None)
    update_dict = {
        k: v for k, v in profile_data.model_dump(exclude_unset=True).items() 
        if v is not None
    }
    
    # Always update the timestamp
    update_dict["updated_at"] = datetime.now(timezone.utc)
    
    # Ensure user_id is set
    update_dict["user_id"] = user.id
    
    # Update or create profile
    await db.user_profiles.update_one(
        {"user_id": user.id},
        {"$set": update_dict},
        upsert=True
    )
    
    # Return updated profile
    updated_profile = await db.user_profiles.find_one({"user_id": user.id}, {"_id": 0})
    return updated_profile

@api_router.get("/users/activity", response_model=UserActivity)
async def get_user_activity(request: Request):
    """Get user activity summary"""
    user = await get_current_user(request, db)
    
    # Get counts
    total_comments = await db.comments.count_documents({"user_id": user.id})
    total_likes = await db.post_likes.count_documents({"user_id": user.id})
    total_bookmarks = await db.bookmarks.count_documents({"user_id": user.id})
    
    # Get recent items
    recent_comments = await db.comments.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    recent_likes = await db.post_likes.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    recent_bookmarks = await db.bookmarks.find(
        {"user_id": user.id}, {"_id": 0}
    ).sort("created_at", -1).limit(5).to_list(5)
    
    return UserActivity(
        total_comments=total_comments,
        total_likes=total_likes,
        total_bookmarks=total_bookmarks,
        recent_comments=recent_comments,
        recent_likes=recent_likes,
        recent_bookmarks=recent_bookmarks
    )

# ============================================================================
# ADMIN ROUTES (Protected - Admin only)
# ============================================================================

@api_router.get("/admin/posts", response_model=List[Post])
async def get_all_posts_admin(request: Request):
    """Get all posts including drafts (admin)"""
    await require_admin(request, db)
    
    posts = await db.posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for post in posts:
        for field in ['created_at', 'updated_at', 'published_at']:
            if field in post and isinstance(post[field], str):
                post[field] = datetime.fromisoformat(post[field])
    
    return posts

@api_router.post("/admin/posts", response_model=Post)
async def create_post(post_data: PostCreate, request: Request):
    """Create a new post (admin)"""
    await require_admin(request, db)
    
    slug = create_slug(post_data.title)
    reading_time = calculate_reading_time(post_data.content)
    
    post_dict = post_data.model_dump()
    post_dict['slug'] = slug
    post_dict['reading_time'] = reading_time
    
    if post_data.published:
        post_dict['published_at'] = datetime.now(timezone.utc)
    
    post_obj = Post(**post_dict)
    doc = post_obj.model_dump()
    
    # Serialize datetime fields
    for field in ['created_at', 'updated_at', 'published_at']:
        if field in doc and doc[field] is not None:
            doc[field] = doc[field].isoformat()
    
    await db.posts.insert_one(doc)
    return post_obj

@api_router.put("/admin/posts/{post_id}", response_model=Post)
async def update_post(post_id: str, post_data: PostUpdate, request: Request):
    """Update a post (admin)"""
    await require_admin(request, db)
    
    existing_post = await db.posts.find_one({"id": post_id})
    
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    update_dict = {k: v for k, v in post_data.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    if 'title' in update_dict:
        update_dict['slug'] = create_slug(update_dict['title'])
    
    if 'content' in update_dict:
        update_dict['reading_time'] = calculate_reading_time(update_dict['content'])
    
    if 'published' in update_dict and update_dict['published'] and not existing_post.get('published'):
        update_dict['published_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.posts.update_one({"id": post_id}, {"$set": update_dict})
    
    updated_post = await db.posts.find_one({"id": post_id}, {"_id": 0})
    
    for field in ['created_at', 'updated_at', 'published_at']:
        if field in updated_post and isinstance(updated_post[field], str):
            updated_post[field] = datetime.fromisoformat(updated_post[field])
    
    return Post(**updated_post)

@api_router.delete("/admin/posts/{post_id}")
async def delete_post(post_id: str, request: Request):
    """Delete a post (admin)"""
    await require_admin(request, db)
    
    result = await db.posts.delete_one({"id": post_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "Post deleted successfully"}

@api_router.post("/admin/categories", response_model=Category)
async def create_category(category_data: CategoryCreate, request: Request):
    """Create a new category (admin)"""
    await require_admin(request, db)
    
    slug = create_slug(category_data.name)
    category_obj = Category(slug=slug, **category_data.model_dump())
    
    doc = category_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.categories.insert_one(doc)
    return category_obj

@api_router.put("/admin/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryCreate, request: Request):
    """Update a category (admin)"""
    await require_admin(request, db)
    
    existing_category = await db.categories.find_one({"id": category_id})
    
    if not existing_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    slug = create_slug(category_data.name)
    update_dict = {
        "name": category_data.name,
        "slug": slug,
        "description": category_data.description
    }
    
    await db.categories.update_one({"id": category_id}, {"$set": update_dict})
    
    updated_category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    
    if 'created_at' in updated_category and isinstance(updated_category['created_at'], str):
        updated_category['created_at'] = datetime.fromisoformat(updated_category['created_at'])
    
    return Category(**updated_category)

@api_router.delete("/admin/categories/{category_id}")
async def delete_category(category_id: str, request: Request):
    """Delete a category (admin)"""
    await require_admin(request, db)
    
    result = await db.categories.delete_one({"id": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

@api_router.get("/admin/comments", response_model=List[Comment])
async def get_all_comments_admin(request: Request):
    """Get all comments including pending (admin)"""
    await require_admin(request, db)
    
    comments = await db.comments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for comment in comments:
        if 'created_at' in comment and isinstance(comment['created_at'], str):
            comment['created_at'] = datetime.fromisoformat(comment['created_at'])
    
    return comments

@api_router.put("/admin/comments/{comment_id}/approve")
async def approve_comment(comment_id: str, request: Request):
    """Approve a comment (admin)"""
    await require_admin(request, db)
    
    result = await db.comments.update_one(
        {"id": comment_id},
        {"$set": {"approved": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment approved"}

@api_router.delete("/admin/comments/{comment_id}")
async def delete_comment_admin(comment_id: str, request: Request):
    """Delete a comment (admin)"""
    await require_admin(request, db)
    
    result = await db.comments.delete_one({"id": comment_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment deleted successfully"}

@api_router.get("/admin/stats")
async def get_stats(request: Request):
    """Get blog statistics (admin)"""
    await require_admin(request, db)
    
    total_posts = await db.posts.count_documents({})
    published_posts = await db.posts.count_documents({"published": True})
    total_comments = await db.comments.count_documents({})
    pending_comments = await db.comments.count_documents({"approved": False})
    total_subscribers = await db.newsletter.count_documents({"active": True})
    total_users = await db.users.count_documents({})
    
    # Get total views
    pipeline = [
        {"$group": {"_id": None, "total_views": {"$sum": "$views_count"}}}
    ]
    views_result = await db.posts.aggregate(pipeline).to_list(1)
    total_views = views_result[0]['total_views'] if views_result else 0
    
    return {
        "total_posts": total_posts,
        "published_posts": published_posts,
        "draft_posts": total_posts - published_posts,
        "total_comments": total_comments,
        "pending_comments": pending_comments,
        "approved_comments": total_comments - pending_comments,
        "total_subscribers": total_subscribers,
        "total_users": total_users,
        "total_views": total_views
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()