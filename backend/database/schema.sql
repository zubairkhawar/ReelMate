-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with OAuth support
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for OAuth users
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(50),
  timezone VARCHAR(50) DEFAULT 'UTC',
  avatar_url TEXT,
  subscription VARCHAR(50) DEFAULT 'starter',
  email_verified BOOLEAN DEFAULT false,
  oauth_provider VARCHAR(50), -- 'google', 'apple', etc.
  oauth_id VARCHAR(255), -- OAuth provider's user ID
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'ugc-video', 'ai-generated', 'user-submitted', 'branded-content'
  description TEXT,
  platforms TEXT[], -- Array of platform names
  video_format VARCHAR(50), -- 'short-form', 'medium-form', 'long-form'
  target_audience TEXT,
  video_count INTEGER DEFAULT 0,
  budget DECIMAL(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  hashtags TEXT,
  call_to_action TEXT,
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed', 'cancelled'
  settings JSONB DEFAULT '{}',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Avatars table
CREATE TABLE ai_avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  ethnicity VARCHAR(50),
  style VARCHAR(100),
  thumbnail_url TEXT,
  sample_clip_url TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Voices table
CREATE TABLE ai_voices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  accent VARCHAR(50),
  language VARCHAR(20) DEFAULT 'en',
  tone VARCHAR(50),
  sample_audio_url TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompt Templates table
CREATE TABLE prompt_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  template_text TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  is_shared BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Generation Jobs table
CREATE TABLE video_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  job_type VARCHAR(50) NOT NULL, -- 'ai-generated', 'avatar-video', 'voiceover'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed', 'cancelled'
  script TEXT,
  avatar_id UUID REFERENCES ai_avatars(id),
  voice_id UUID REFERENCES ai_voices(id),
  prompt_template_id UUID REFERENCES prompt_templates(id),
  tone_settings JSONB DEFAULT '{}',
  generation_settings JSONB DEFAULT '{}',
  output_video_url TEXT,
  output_audio_url TEXT,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  cost DECIMAL(10,4) DEFAULT 0,
  error_message TEXT,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Videos table
CREATE TABLE generated_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  job_id UUID REFERENCES video_generation_jobs(id) ON DELETE CASCADE,
  title VARCHAR(255),
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  platform VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'archived', 'deleted'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video Analytics table
CREATE TABLE video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID REFERENCES generated_videos(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  watch_time_seconds INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  ctr DECIMAL(5,2) DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API keys table
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '[]',
  last_used TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User integrations table
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  provider_user_id VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- User notification preferences table
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  security_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',
  date_format VARCHAR(20) DEFAULT 'MM/DD/YYYY',
  time_format VARCHAR(10) DEFAULT '12h',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_type ON campaigns(type);
CREATE INDEX IF NOT EXISTS idx_ai_avatars_active ON ai_avatars(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_voices_active ON ai_voices(is_active);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_category ON prompt_templates(category);
CREATE INDEX IF NOT EXISTS idx_prompt_templates_public ON prompt_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_video_generation_jobs_user_id ON video_generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_video_generation_jobs_status ON video_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_video_generation_jobs_campaign_id ON video_generation_jobs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_generated_videos_user_id ON generated_videos(user_id);
CREATE INDEX IF NOT EXISTS idx_generated_videos_campaign_id ON generated_videos(campaign_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_video_id ON video_analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_video_analytics_date ON video_analytics(date);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_integrations_provider ON user_integrations(provider);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_avatars_updated_at BEFORE UPDATE ON ai_avatars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_voices_updated_at BEFORE UPDATE ON ai_voices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_templates_updated_at BEFORE UPDATE ON prompt_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_generation_jobs_updated_at BEFORE UPDATE ON video_generation_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_videos_updated_at BEFORE UPDATE ON generated_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_analytics_updated_at BEFORE UPDATE ON video_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_password_reset_tokens_updated_at BEFORE UPDATE ON password_reset_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_integrations_updated_at BEFORE UPDATE ON user_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notifications_updated_at BEFORE UPDATE ON user_notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default AI avatars
INSERT INTO ai_avatars (name, gender, ethnicity, style, thumbnail_url, sample_clip_url) VALUES
('Sarah', 'Female', 'Caucasian', 'Professional', '/api/placeholder/80/80', '/api/placeholder/video'),
('Marcus', 'Male', 'African American', 'Casual', '/api/placeholder/80/80', '/api/placeholder/video'),
('Priya', 'Female', 'South Asian', 'Friendly', '/api/placeholder/80/80', '/api/placeholder/video'),
('Alex', 'Male', 'Hispanic', 'Energetic', '/api/placeholder/80/80', '/api/placeholder/video')
ON CONFLICT DO NOTHING;

-- Insert default AI voices
INSERT INTO ai_voices (name, gender, accent, language, tone, sample_audio_url) VALUES
('US Male Neutral', 'Male', 'American', 'en', 'Neutral', '/api/placeholder/audio'),
('UK Female Warm', 'Female', 'British', 'en', 'Warm', '/api/placeholder/audio'),
('Energetic', 'Male', 'American', 'en', 'Energetic', '/api/placeholder/audio'),
('Calm', 'Female', 'American', 'en', 'Calm', '/api/placeholder/audio')
ON CONFLICT DO NOTHING;

-- Insert default prompt templates
INSERT INTO prompt_templates (name, category, description, template_text, is_public, usage_count, rating) VALUES
('Product Showcase', 'Demo', 'Highlight product features with compelling storytelling', 'Introduce the problem your product solves. Show the product in action. Highlight key benefits. End with a strong call to action.', true, 156, 4.8),
('Customer Testimonial', 'Testimonial', 'Authentic customer story with emotional connection', 'Start with a relatable problem. Share the customer journey. Show the transformation. End with social proof and CTA.', true, 89, 4.6),
('Pain-Agitate-Solve', 'Pain-Agitate-Solve', 'Identify problem, amplify pain, present solution', 'Identify the pain point. Amplify the consequences. Present your solution. Show the transformation. Call to action.', true, 234, 4.9),
('Before & After', 'Comparison', 'Show transformation with clear before/after states', 'Show the before state. Introduce your solution. Demonstrate the process. Reveal the after results. Call to action.', true, 67, 4.7),
('Urgency CTA', 'CTA', 'Create urgency with limited-time offers', 'Create urgency with time-sensitive offer. Highlight scarcity. Show value proposition. Strong call to action with deadline.', true, 45, 4.5)
ON CONFLICT DO NOTHING;

-- Insert default notification preferences for existing users
INSERT INTO user_notifications (user_id, email_notifications, push_notifications, sms_notifications, marketing_emails, security_alerts)
SELECT id, TRUE, TRUE, FALSE, FALSE, TRUE FROM users
ON CONFLICT DO NOTHING;

-- Insert default settings for existing users
INSERT INTO user_settings (user_id, theme, language, timezone, date_format, time_format)
SELECT id, 'light', 'en', 'UTC', 'MM/DD/YYYY', '12h' FROM users
ON CONFLICT DO NOTHING;
