-- Phase 1: Compliance & Safety Enhancement
-- User Risk Assessment table
CREATE TABLE public.user_risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL DEFAULT 'initial',
  risk_level TEXT NOT NULL DEFAULT 'low',
  risk_factors JSONB DEFAULT '{}',
  protective_factors JSONB DEFAULT '{}',
  crisis_score INTEGER DEFAULT 0,
  suicide_risk_level TEXT DEFAULT 'none',
  recommendations JSONB DEFAULT '{}',
  assessed_by TEXT DEFAULT 'ai_system',
  reviewed_by UUID NULL,
  next_assessment_due TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Digital Consent table
CREATE TABLE public.digital_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  consent_version TEXT NOT NULL DEFAULT '1.0',
  consented_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  consent_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  withdrawal_requested_at TIMESTAMP WITH TIME ZONE NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Phase 2: Gamification System
-- User XP and Levels
CREATE TABLE public.user_experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  xp_to_next_level INTEGER NOT NULL DEFAULT 100,
  weekly_xp INTEGER NOT NULL DEFAULT 0,
  monthly_xp INTEGER NOT NULL DEFAULT 0,
  xp_sources JSONB DEFAULT '{}',
  level_rewards_claimed JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Achievement Badges
CREATE TABLE public.achievement_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  rarity TEXT NOT NULL DEFAULT 'common',
  xp_reward INTEGER NOT NULL DEFAULT 10,
  requirements JSONB NOT NULL DEFAULT '{}',
  unlock_criteria JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Badge Achievements
CREATE TABLE public.user_badge_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  progress_data JSONB DEFAULT '{}',
  xp_earned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, badge_id)
);

-- Knowledge Collection System
CREATE TABLE public.knowledge_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  unlock_requirements JSONB DEFAULT '{}',
  xp_value INTEGER NOT NULL DEFAULT 5,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner',
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Knowledge Progress
CREATE TABLE public.user_knowledge_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  knowledge_item_id UUID NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  mastery_level INTEGER NOT NULL DEFAULT 1,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  review_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, knowledge_item_id)
);

-- Phase 3: 3D User Avatar System
-- User Avatar Profiles
CREATE TABLE public.user_avatar_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  avatar_name TEXT NOT NULL DEFAULT 'My Avatar',
  appearance_config JSONB NOT NULL DEFAULT '{}',
  mood_expressions JSONB NOT NULL DEFAULT '{}',
  animation_preferences JSONB NOT NULL DEFAULT '{}',
  voice_settings JSONB NOT NULL DEFAULT '{}',
  current_mood TEXT NOT NULL DEFAULT 'neutral',
  mood_history JSONB DEFAULT '{}',
  customization_level INTEGER NOT NULL DEFAULT 1,
  unlocked_features TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Avatar Mood History
CREATE TABLE public.avatar_mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_value TEXT NOT NULL,
  mood_intensity NUMERIC NOT NULL DEFAULT 0.5,
  context_data JSONB DEFAULT '{}',
  detected_by TEXT NOT NULL DEFAULT 'user_input',
  session_id UUID NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Avatar Customization Items
CREATE TABLE public.avatar_customization_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  item_type TEXT NOT NULL,
  config_data JSONB NOT NULL DEFAULT '{}',
  unlock_requirements JSONB DEFAULT '{}',
  rarity TEXT NOT NULL DEFAULT 'common',
  xp_cost INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  preview_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Avatar Inventory
CREATE TABLE public.user_avatar_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_id UUID NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, item_id)
);

-- Therapy Session Avatar Interactions
CREATE TABLE public.session_avatar_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  interaction_type TEXT NOT NULL,
  user_avatar_state JSONB DEFAULT '{}',
  therapist_avatar_state JSONB DEFAULT '{}',
  emotion_data JSONB DEFAULT '{}',
  interaction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badge_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_knowledge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatar_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatar_customization_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_avatar_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_avatar_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for User Risk Assessments
CREATE POLICY "Users can view their own risk assessments" 
ON public.user_risk_assessments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create risk assessments" 
ON public.user_risk_assessments FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all risk assessments" 
ON public.user_risk_assessments FOR SELECT 
USING (is_admin(auth.uid()));

-- RLS Policies for Digital Consents
CREATE POLICY "Users can manage their own consents" 
ON public.digital_consents FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for User Experience
CREATE POLICY "Users can manage their own XP" 
ON public.user_experience FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for Achievement Badges
CREATE POLICY "Everyone can view available badges" 
ON public.achievement_badges FOR SELECT 
USING (is_active = true);

-- RLS Policies for User Badge Achievements
CREATE POLICY "Users can view their own badge achievements" 
ON public.user_badge_achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create badge achievements" 
ON public.user_badge_achievements FOR INSERT 
WITH CHECK (true);

-- RLS Policies for Knowledge Items
CREATE POLICY "Everyone can view knowledge items" 
ON public.knowledge_items FOR SELECT 
USING (true);

-- RLS Policies for User Knowledge Progress
CREATE POLICY "Users can manage their own knowledge progress" 
ON public.user_knowledge_progress FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for User Avatar Profiles
CREATE POLICY "Users can manage their own avatar profiles" 
ON public.user_avatar_profiles FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for Avatar Mood Entries
CREATE POLICY "Users can manage their own mood entries" 
ON public.avatar_mood_entries FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for Avatar Customization Items
CREATE POLICY "Everyone can view customization items" 
ON public.avatar_customization_items FOR SELECT 
USING (true);

-- RLS Policies for User Avatar Inventory
CREATE POLICY "Users can manage their own avatar inventory" 
ON public.user_avatar_inventory FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for Session Avatar Interactions
CREATE POLICY "Users can view their own session interactions" 
ON public.session_avatar_interactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create session interactions" 
ON public.session_avatar_interactions FOR INSERT 
WITH CHECK (true);

-- Triggers for updated_at columns
CREATE TRIGGER update_user_risk_assessments_updated_at
BEFORE UPDATE ON public.user_risk_assessments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_experience_updated_at
BEFORE UPDATE ON public.user_experience
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_avatar_profiles_updated_at
BEFORE UPDATE ON public.user_avatar_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();