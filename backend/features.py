"""
User engagement features for FarchoDev Blog
Handles likes, bookmarks, and enhanced comments
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid

# Models for user engagement features

class PostLike(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    post_id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Bookmark(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    post_id: str
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserActivity(BaseModel):
    """User activity summary"""
    total_comments: int = 0
    total_likes: int = 0
    total_bookmarks: int = 0
    recent_comments: list = []
    recent_likes: list = []
    recent_bookmarks: list = []
