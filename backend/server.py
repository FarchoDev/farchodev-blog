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
    User, UserRegister, UserLogin, UserPublic, UserProfile,
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

@api_router.post("/comments", response_model=Comment)
async def create_comment(comment_data: CommentCreate):
    """Create a new comment (needs approval)"""
    comment_obj = Comment(**comment_data.model_dump())
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

# Admin Routes
@api_router.get("/admin/posts", response_model=List[Post])
async def get_all_posts_admin():
    """Get all posts including drafts (admin)"""
    posts = await db.posts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for post in posts:
        for field in ['created_at', 'updated_at', 'published_at']:
            if field in post and isinstance(post[field], str):
                post[field] = datetime.fromisoformat(post[field])
    
    return posts

@api_router.post("/admin/posts", response_model=Post)
async def create_post(post_data: PostCreate):
    """Create a new post (admin)"""
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
async def update_post(post_id: str, post_data: PostUpdate):
    """Update a post (admin)"""
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
async def delete_post(post_id: str):
    """Delete a post (admin)"""
    result = await db.posts.delete_one({"id": post_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    
    return {"message": "Post deleted successfully"}

@api_router.post("/admin/categories", response_model=Category)
async def create_category(category_data: CategoryCreate):
    """Create a new category (admin)"""
    slug = create_slug(category_data.name)
    category_obj = Category(slug=slug, **category_data.model_dump())
    
    doc = category_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.categories.insert_one(doc)
    return category_obj

@api_router.put("/admin/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryCreate):
    """Update a category (admin)"""
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
async def delete_category(category_id: str):
    """Delete a category (admin)"""
    result = await db.categories.delete_one({"id": category_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    
    return {"message": "Category deleted successfully"}

@api_router.get("/admin/comments", response_model=List[Comment])
async def get_all_comments_admin():
    """Get all comments including pending (admin)"""
    comments = await db.comments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for comment in comments:
        if 'created_at' in comment and isinstance(comment['created_at'], str):
            comment['created_at'] = datetime.fromisoformat(comment['created_at'])
    
    return comments

@api_router.put("/admin/comments/{comment_id}/approve")
async def approve_comment(comment_id: str):
    """Approve a comment (admin)"""
    result = await db.comments.update_one(
        {"id": comment_id},
        {"$set": {"approved": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment approved"}

@api_router.delete("/admin/comments/{comment_id}")
async def delete_comment(comment_id: str):
    """Delete a comment (admin)"""
    result = await db.comments.delete_one({"id": comment_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    return {"message": "Comment deleted successfully"}

@api_router.get("/admin/stats")
async def get_stats():
    """Get blog statistics (admin)"""
    total_posts = await db.posts.count_documents({})
    published_posts = await db.posts.count_documents({"published": True})
    total_comments = await db.comments.count_documents({})
    pending_comments = await db.comments.count_documents({"approved": False})
    total_subscribers = await db.newsletter.count_documents({"active": True})
    
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