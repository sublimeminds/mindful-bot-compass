# Database Schema Documentation

## Overview

TherapySync AI uses PostgreSQL via Supabase with 100+ tables supporting comprehensive mental health platform functionality including user management, therapy sessions, AI interactions, crisis detection, family coordination, and enterprise features.

## Core Schema Architecture

### User Management & Authentication

```sql
-- Primary user profile table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    preferred_language TEXT DEFAULT 'en',
    preferred_currency TEXT DEFAULT 'USD',
    onboarding_complete BOOLEAN DEFAULT FALSE,
    subscription_plan TEXT DEFAULT 'Free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles system
CREATE TYPE app_role AS ENUM ('user', 'admin', 'moderator', 'support_admin', 'content_admin');

CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role)
);
```

### Therapy & Session Management

```sql
-- Therapy sessions with AI interactions
CREATE TABLE therapy_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    therapist_personality_id UUID REFERENCES therapist_personalities(id),
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    session_type TEXT NOT NULL DEFAULT 'chat',
    mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
    mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
    session_notes TEXT,
    ai_insights JSONB DEFAULT '{}',
    crisis_flags JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Therapist AI personalities
CREATE TABLE therapist_personalities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    approach TEXT NOT NULL,
    specialties TEXT[] NOT NULL DEFAULT '{}',
    communication_style TEXT NOT NULL,
    personality_traits JSONB DEFAULT '{}',
    effectiveness_areas JSONB DEFAULT '{}',
    color_scheme TEXT DEFAULT 'from-blue-500 to-blue-600',
    icon TEXT DEFAULT 'Brain',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Crisis Detection & Intervention

```sql
-- Crisis intervention tracking
CREATE TABLE crisis_interventions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    crisis_assessment_id UUID,
    intervention_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    intervention_data JSONB NOT NULL DEFAULT '{}',
    response_time_minutes INTEGER,
    outcome TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Emergency contacts for crisis situations
CREATE TABLE emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    name TEXT NOT NULL,
    phone_number TEXT,
    email TEXT,
    relationship TEXT,
    contact_type TEXT NOT NULL DEFAULT 'personal',
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### AI & Personalization

```sql
-- Conversation memory for AI continuity
CREATE TABLE conversation_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    session_id UUID REFERENCES therapy_sessions(id),
    memory_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    emotional_context JSONB DEFAULT '{}',
    importance_score NUMERIC DEFAULT 0.5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personalized AI recommendations
CREATE TABLE personalized_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    recommendation_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    priority_score NUMERIC NOT NULL,
    estimated_impact NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    shown_at TIMESTAMPTZ,
    acted_upon_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cultural context profiles
CREATE TABLE user_cultural_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    primary_language TEXT NOT NULL DEFAULT 'en',
    cultural_background TEXT,
    family_structure TEXT NOT NULL DEFAULT 'individual',
    communication_style TEXT NOT NULL DEFAULT 'direct',
    religious_considerations BOOLEAN NOT NULL DEFAULT FALSE,
    religious_details TEXT,
    therapy_approach_preferences TEXT[] NOT NULL DEFAULT '{}',
    cultural_sensitivities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Goal & Progress Tracking

```sql
-- User goals with progress tracking
CREATE TABLE goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    target_value NUMERIC,
    current_progress NUMERIC DEFAULT 0,
    target_date DATE,
    status TEXT NOT NULL DEFAULT 'active',
    priority TEXT NOT NULL DEFAULT 'medium',
    is_completed BOOLEAN DEFAULT FALSE,
    streak_count INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_progress_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goal achievements and gamification
CREATE TABLE goal_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    goal_id UUID REFERENCES goals(id),
    achievement_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points_earned INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-generated goal insights
CREATE TABLE goal_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    goal_id UUID REFERENCES goals(id),
    insight_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action_items TEXT[] DEFAULT '{}',
    confidence_score NUMERIC DEFAULT 0.5,
    priority INTEGER DEFAULT 5,
    expires_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    acted_upon_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Communication & Integrations

```sql
-- WhatsApp integration
CREATE TABLE whatsapp_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    phone_number TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code TEXT,
    webhook_url TEXT,
    access_token TEXT,
    business_account_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp messages
CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    integration_id UUID NOT NULL REFERENCES whatsapp_integrations(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    whatsapp_message_id TEXT,
    sender_type TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text',
    content TEXT NOT NULL,
    ai_response_metadata JSONB DEFAULT '{}',
    therapy_session_id UUID REFERENCES therapy_sessions(id),
    delivery_status TEXT DEFAULT 'sent',
    error_message TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- WhatsApp configuration per user
CREATE TABLE whatsapp_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    ai_personality_id TEXT DEFAULT 'default',
    response_delay_seconds INTEGER DEFAULT 2,
    business_hours_enabled BOOLEAN DEFAULT FALSE,
    business_hours_start TIME,
    business_hours_end TIME,
    business_timezone TEXT DEFAULT 'UTC',
    auto_responses_enabled BOOLEAN DEFAULT TRUE,
    crisis_escalation_enabled BOOLEAN DEFAULT TRUE,
    message_encryption_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Family & Household Management

```sql
-- Household/family management
CREATE TABLE households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    primary_account_holder_id UUID NOT NULL REFERENCES profiles(id),
    plan_type TEXT NOT NULL DEFAULT 'individual',
    max_members INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Household members
CREATE TABLE household_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id),
    user_id UUID NOT NULL REFERENCES profiles(id),
    member_type TEXT NOT NULL DEFAULT 'member',
    permission_level TEXT NOT NULL DEFAULT 'basic',
    can_view_progress BOOLEAN DEFAULT FALSE,
    can_view_mood_data BOOLEAN DEFAULT FALSE,
    can_receive_alerts BOOLEAN DEFAULT FALSE,
    invitation_status TEXT NOT NULL DEFAULT 'pending',
    invited_by UUID REFERENCES profiles(id),
    invitation_token TEXT,
    joined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family alerts system
CREATE TABLE family_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id),
    member_user_id UUID NOT NULL REFERENCES profiles(id),
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    alert_data JSONB DEFAULT '{}',
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_by UUID REFERENCES profiles(id),
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Analytics & Monitoring

```sql
-- User behavior analytics
CREATE TABLE user_behavior_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    sessions_count INTEGER DEFAULT 0,
    total_session_minutes INTEGER DEFAULT 0,
    goals_created INTEGER DEFAULT 0,
    goals_completed INTEGER DEFAULT 0,
    assessments_taken INTEGER DEFAULT 0,
    mood_entries INTEGER DEFAULT 0,
    average_mood NUMERIC,
    engagement_score NUMERIC DEFAULT 0,
    retention_score NUMERIC DEFAULT 0,
    feature_usage JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- Platform-wide analytics
CREATE TABLE platform_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_users INTEGER NOT NULL,
    active_users INTEGER NOT NULL,
    new_signups INTEGER NOT NULL,
    total_sessions INTEGER NOT NULL,
    average_session_duration NUMERIC(5,2) NOT NULL,
    total_assessments INTEGER NOT NULL,
    crisis_interventions INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date)
);

-- Performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id),
    metric_type TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Key Database Functions

### User Management Functions

```sql
-- Check if user has specific role
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role AND is_active = TRUE
  );
$$;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id 
    AND role IN ('super_admin', 'content_admin', 'support_admin', 'analytics_admin')
    AND is_active = TRUE
  );
$$;
```

### Analytics Functions

```sql
-- Aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_daily_analytics()
RETURNS VOID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_behavior_analytics (
    user_id, date, sessions_count, total_session_minutes,
    goals_created, goals_completed, mood_entries, average_mood,
    engagement_score
  )
  SELECT 
    ts.user_id,
    CURRENT_DATE - INTERVAL '1 day',
    COUNT(ts.id)::INTEGER,
    COALESCE(SUM(EXTRACT(EPOCH FROM (ts.end_time - ts.start_time))/60), 0)::INTEGER,
    COALESCE(goal_stats.goals_created, 0),
    COALESCE(goal_stats.goals_completed, 0),
    COALESCE(mood_stats.mood_entries, 0),
    COALESCE(mood_stats.average_mood, 0),
    CASE WHEN COUNT(ts.id) > 0 THEN LEAST(1.0, COUNT(ts.id) * 0.2) ELSE 0 END
  FROM public.therapy_sessions ts
  -- Additional joins for goal and mood statistics
  WHERE ts.start_time::date = CURRENT_DATE - INTERVAL '1 day'
  GROUP BY ts.user_id
  ON CONFLICT (user_id, date) DO UPDATE SET
    sessions_count = EXCLUDED.sessions_count,
    total_session_minutes = EXCLUDED.total_session_minutes,
    updated_at = NOW();
END;
$$;
```

## Row Level Security (RLS) Policies

### User Data Protection

```sql
-- Profiles - users can only access their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Therapy sessions - users can only access their own sessions
CREATE POLICY "Users can manage their own sessions"
ON public.therapy_sessions FOR ALL
USING (auth.uid() = user_id);

-- Crisis interventions - users can view their own, admins can view all
CREATE POLICY "Users can view their own crisis interventions"
ON public.crisis_interventions FOR SELECT
USING (auth.uid() = user_id);

-- Admin access to crisis interventions
CREATE POLICY "Admins can view all crisis interventions"
ON public.crisis_interventions FOR SELECT
USING (is_admin(auth.uid()));
```

### Family & Household Access

```sql
-- Household members can view relevant family data
CREATE POLICY "Household members can view family alerts"
ON public.family_alerts FOR SELECT
USING (
  household_id IN (
    SELECT household_id FROM household_members
    WHERE user_id = auth.uid() AND can_receive_alerts = TRUE
  )
  OR
  household_id IN (
    SELECT id FROM households
    WHERE primary_account_holder_id = auth.uid()
  )
);
```

## Indexes for Performance

```sql
-- Essential indexes for query performance
CREATE INDEX idx_therapy_sessions_user_id_created ON therapy_sessions(user_id, created_at DESC);
CREATE INDEX idx_whatsapp_messages_user_id_timestamp ON whatsapp_messages(user_id, timestamp DESC);
CREATE INDEX idx_crisis_interventions_user_id_created ON crisis_interventions(user_id, created_at DESC);
CREATE INDEX idx_goals_user_id_status ON goals(user_id, status);
CREATE INDEX idx_conversation_memory_user_id_importance ON conversation_memory(user_id, importance_score DESC);

-- Full-text search indexes
CREATE INDEX idx_conversation_memory_content_fts ON conversation_memory USING gin(to_tsvector('english', content));
CREATE INDEX idx_goals_title_description_fts ON goals USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

## Data Migration Strategy

### Version Control

All schema changes are managed through Supabase migrations:

```bash
# Generate new migration
supabase migration new add_new_feature

# Apply migrations
supabase db push

# Reset database (development only)
supabase db reset
```

### Backup Strategy

- **Automated Daily Backups**: Full database backups via Supabase
- **Point-in-Time Recovery**: Available for critical data recovery
- **Schema Versioning**: All migrations tracked in version control

---

*Database schema continuously evolving to support new features and improvements.*