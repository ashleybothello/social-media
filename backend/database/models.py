import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Text, Date
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from .connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    connected_accounts = relationship("ConnectedAccount", back_populates="user", cascade="all, delete-orphan")

class ConnectedAccount(Base):
    __tablename__ = "connected_accounts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False, default="instagram")
    platform_user_id = Column(String, nullable=True)
    access_token_encrypted = Column(Text, nullable=False)
    token_expiry = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="connected_accounts")
    instagram_profile = relationship("InstagramProfile", back_populates="connected_account", uselist=False, cascade="all, delete-orphan")

class InstagramProfile(Base):
    __tablename__ = "instagram_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    connected_account_id = Column(UUID(as_uuid=True), ForeignKey("connected_accounts.id", ondelete="CASCADE"), nullable=False, unique=True)
    instagram_id = Column(String, unique=True, nullable=False)
    username = Column(String, nullable=False)
    name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(Text, nullable=True)
    followers_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    media_count = Column(Integer, default=0)
    website = Column(String, nullable=True)
    last_synced_at = Column(DateTime, nullable=True)

    connected_account = relationship("ConnectedAccount", back_populates="instagram_profile")
    media = relationship("InstagramMedia", back_populates="profile", cascade="all, delete-orphan")
    insights = relationship("InstagramInsight", back_populates="profile", cascade="all, delete-orphan")
    recommendations = relationship("AIRecommendation", back_populates="profile", cascade="all, delete-orphan")

class InstagramMedia(Base):
    __tablename__ = "instagram_media"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("instagram_profiles.id", ondelete="CASCADE"), nullable=False)
    instagram_media_id = Column(String, unique=True, nullable=False)
    media_type = Column(String, nullable=False)  # IMAGE, VIDEO, CAROUSEL_ALBUM
    media_url = Column(Text, nullable=True)
    thumbnail_url = Column(Text, nullable=True)
    caption = Column(Text, nullable=True)
    permalink = Column(Text, nullable=True)
    like_count = Column(Integer, default=0)
    comments_count = Column(Integer, default=0)
    timestamp = Column(DateTime, nullable=False)
    is_reel = Column(Boolean, default=False)

    profile = relationship("InstagramProfile", back_populates="media")
    insights = relationship("InstagramInsight", back_populates="media", cascade="all, delete-orphan")

class InstagramInsight(Base):
    __tablename__ = "instagram_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    media_id = Column(UUID(as_uuid=True), ForeignKey("instagram_media.id", ondelete="CASCADE"), nullable=True)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("instagram_profiles.id", ondelete="CASCADE"), nullable=False)
    reach = Column(Integer, default=0)
    impressions = Column(Integer, default=0)
    engagement = Column(Integer, default=0)
    saved = Column(Integer, default=0)
    shares = Column(Integer, default=0)
    insight_date = Column(Date, nullable=False)

    media = relationship("InstagramMedia", back_populates="insights")
    profile = relationship("InstagramProfile", back_populates="insights")

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profile_id = Column(UUID(as_uuid=True), ForeignKey("instagram_profiles.id", ondelete="CASCADE"), nullable=False)
    recommendation_type = Column(String, nullable=False)  # timing, content, format, frequency
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    metric_basis = Column(JSONB, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("InstagramProfile", back_populates="recommendations")
