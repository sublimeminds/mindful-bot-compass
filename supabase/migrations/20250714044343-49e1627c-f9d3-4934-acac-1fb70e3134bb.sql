-- Phase 2: Create community enhancement tables (non-conflicting)

-- Create wellness challenges table
CREATE TABLE IF NOT EXISTS public.wellness_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('wellness', 'mindfulness', 'habit_building', 'cultural', 'family')),
  category TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_by UUID,
  participant_count INTEGER DEFAULT 0,
  max_participants INTEGER,
  reward_points INTEGER DEFAULT 100,
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  cultural_themes TEXT[],
  required_commitment TEXT,
  is_active BOOLEAN DEFAULT true,
  challenge_rules JSONB DEFAULT '{}',
  progress_tracking JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community peer matching table  
CREATE TABLE IF NOT EXISTS public.community_peer_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL,
  requested_id UUID NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('buddy', 'mentor', 'peer', 'cultural_buddy', 'family_support', 'language_exchange')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'blocked')),
  compatibility_score DECIMAL(3,2),
  shared_goals TEXT[],
  cultural_compatibility DECIMAL(3,2),
  connection_reason TEXT,
  matched_by TEXT DEFAULT 'user', -- 'user', 'ai', 'system'
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(requester_id, requested_id)
);

-- Create community resource library
CREATE TABLE IF NOT EXISTS public.community_resource_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'audio', 'pdf', 'link', 'tool', 'worksheet')),
  content_url TEXT,
  content_data JSONB,
  category TEXT NOT NULL,
  cultural_relevance TEXT[],
  target_audience TEXT[],
  difficulty_level TEXT DEFAULT 'all' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'all')),
  therapeutic_approaches TEXT[],
  languages TEXT[] DEFAULT '{"English"}',
  created_by UUID,
  upvotes INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  verified_by UUID,
  tags TEXT[],
  accessibility_features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community support groups enhancement
CREATE TABLE IF NOT EXISTS public.community_support_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  cultural_focus TEXT[],
  languages TEXT[] DEFAULT '{"English"}',
  privacy_level TEXT DEFAULT 'public' CHECK (privacy_level IN ('public', 'private', 'invite_only')),
  max_members INTEGER DEFAULT 50,
  member_count INTEGER DEFAULT 0,
  facilitator_id UUID,
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  meeting_schedule JSONB DEFAULT '{}',
  group_rules TEXT,
  therapeutic_focus TEXT[],
  age_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community live events
CREATE TABLE IF NOT EXISTS public.community_live_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('support_group', 'workshop', 'cultural_celebration', 'peer_session', 'meditation', 'storytelling')),
  facilitator_id UUID,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  max_participants INTEGER DEFAULT 50,
  participant_count INTEGER DEFAULT 0,
  is_virtual BOOLEAN DEFAULT true,
  meeting_link TEXT,
  meeting_password TEXT,
  location TEXT,
  cultural_focus TEXT[],
  languages TEXT[] DEFAULT '{"English"}',
  accessibility_features TEXT[],
  content_warnings TEXT[],
  registration_required BOOLEAN DEFAULT true,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern JSONB,
  tags TEXT[],
  created_by UUID,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mentorship programs
CREATE TABLE IF NOT EXISTS public.community_mentorship_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_name TEXT NOT NULL,
  description TEXT,
  program_type TEXT NOT NULL CHECK (program_type IN ('peer_mentorship', 'cultural_mentorship', 'family_mentorship', 'professional_mentorship')),
  mentor_id UUID NOT NULL,
  mentee_id UUID NOT NULL,
  matching_criteria JSONB DEFAULT '{}',
  program_duration INTEGER, -- in weeks
  meeting_frequency TEXT,
  goals TEXT[],
  progress_tracking JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('pending', 'active', 'completed', 'paused', 'terminated')),
  cultural_focus TEXT[],
  language_support TEXT[],
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.wellness_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_resource_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_live_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_mentorship_programs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Wellness Challenges Policies
CREATE POLICY "Anyone can view active challenges" ON public.wellness_challenges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create challenges" ON public.wellness_challenges
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their challenges" ON public.wellness_challenges
  FOR UPDATE USING (auth.uid() = created_by);

-- Peer Connections Policies
CREATE POLICY "Users can manage their peer connections" ON public.community_peer_connections
  FOR ALL USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Resource Library Policies
CREATE POLICY "Anyone can view verified resources" ON public.community_resource_library
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Users can create resources" ON public.community_resource_library
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their resources" ON public.community_resource_library
  FOR UPDATE USING (auth.uid() = created_by);

-- Support Groups Policies
CREATE POLICY "Anyone can view public support groups" ON public.community_support_groups
  FOR SELECT USING (privacy_level = 'public');

CREATE POLICY "Users can create support groups" ON public.community_support_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators and facilitators can update groups" ON public.community_support_groups
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = facilitator_id);

-- Live Events Policies
CREATE POLICY "Anyone can view active events" ON public.community_live_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create events" ON public.community_live_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators and facilitators can update events" ON public.community_live_events
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = facilitator_id);

-- Mentorship Programs Policies
CREATE POLICY "Users can view their mentorship programs" ON public.community_mentorship_programs
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentors and mentees can update programs" ON public.community_mentorship_programs
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Create indexes for performance
CREATE INDEX idx_wellness_challenges_type ON public.wellness_challenges(challenge_type);
CREATE INDEX idx_wellness_challenges_active ON public.wellness_challenges(is_active);
CREATE INDEX idx_community_peer_connections_users ON public.community_peer_connections(requester_id, requested_id);
CREATE INDEX idx_community_resource_library_category ON public.community_resource_library(category);
CREATE INDEX idx_community_resource_library_cultural ON public.community_resource_library USING GIN(cultural_relevance);
CREATE INDEX idx_community_support_groups_category ON public.community_support_groups(category);
CREATE INDEX idx_community_support_groups_cultural_focus ON public.community_support_groups USING GIN(cultural_focus);
CREATE INDEX idx_community_live_events_time ON public.community_live_events(start_time);
CREATE INDEX idx_community_mentorship_programs_mentor ON public.community_mentorship_programs(mentor_id);
CREATE INDEX idx_community_mentorship_programs_mentee ON public.community_mentorship_programs(mentee_id);

-- Create updated_at triggers
CREATE TRIGGER update_wellness_challenges_updated_at
  BEFORE UPDATE ON public.wellness_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_peer_connections_updated_at
  BEFORE UPDATE ON public.community_peer_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_resource_library_updated_at
  BEFORE UPDATE ON public.community_resource_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_support_groups_updated_at
  BEFORE UPDATE ON public.community_support_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_live_events_updated_at
  BEFORE UPDATE ON public.community_live_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_mentorship_programs_updated_at
  BEFORE UPDATE ON public.community_mentorship_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();