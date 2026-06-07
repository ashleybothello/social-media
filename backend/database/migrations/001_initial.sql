CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR NOT NULL UNIQUE,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc'),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE TABLE connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR NOT NULL DEFAULT 'instagram',
    platform_user_id VARCHAR,
    access_token_encrypted TEXT NOT NULL,
    token_expiry TIMESTAMP WITHOUT TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

CREATE TABLE instagram_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connected_account_id UUID NOT NULL UNIQUE REFERENCES connected_accounts(id) ON DELETE CASCADE,
    instagram_id VARCHAR NOT NULL UNIQUE,
    username VARCHAR NOT NULL,
    name VARCHAR,
    bio TEXT,
    profile_picture_url TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    media_count INTEGER DEFAULT 0,
    website VARCHAR,
    last_synced_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE instagram_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES instagram_profiles(id) ON DELETE CASCADE,
    instagram_media_id VARCHAR NOT NULL UNIQUE,
    media_type VARCHAR NOT NULL,
    media_url TEXT,
    thumbnail_url TEXT,
    caption TEXT,
    permalink TEXT,
    like_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    is_reel BOOLEAN DEFAULT false
);

CREATE TABLE instagram_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    media_id UUID REFERENCES instagram_media(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES instagram_profiles(id) ON DELETE CASCADE,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    saved INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    insight_date DATE NOT NULL
);

CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES instagram_profiles(id) ON DELETE CASCADE,
    recommendation_type VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    metric_basis JSONB,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_connected_accounts_user_id ON connected_accounts(user_id);
CREATE INDEX idx_instagram_media_profile_id ON instagram_media(profile_id);
CREATE INDEX idx_instagram_media_timestamp ON instagram_media(timestamp DESC);
CREATE INDEX idx_instagram_insights_profile_id ON instagram_insights(profile_id);
CREATE INDEX idx_instagram_insights_date ON instagram_insights(insight_date DESC);
CREATE INDEX idx_ai_recommendations_profile_id ON ai_recommendations(profile_id);
