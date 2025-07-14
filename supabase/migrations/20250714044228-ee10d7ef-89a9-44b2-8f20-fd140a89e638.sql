-- Phase 2: Create comprehensive community database tables

-- Support Groups with enhanced features
CREATE TABLE IF NOT EXISTS public.support_groups (
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

-- Group Discussions (threaded)
CREATE TABLE IF NOT EXISTS public.group_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.support_groups(id) ON DELETE CASCADE,
  author_id UUID NOT NULL,
  parent_id UUID REFERENCES public.group_discussions(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  cultural_context TEXT,
  content_warnings TEXT[],
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community Challenges and Wellness Activities
CREATE TABLE IF NOT EXISTS public.community_challenges (
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

-- Peer Connections and Matching
CREATE TABLE IF NOT EXISTS public.peer_connections (
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

-- Community Resources Library
CREATE TABLE IF NOT EXISTS public.community_resources (
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

-- Community Moderation and Safety
CREATE TABLE IF NOT EXISTS public.community_moderation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_content_type TEXT NOT NULL CHECK (reported_content_type IN ('post', 'comment', 'user', 'group', 'message')),
  reported_content_id UUID NOT NULL,
  reporter_id UUID NOT NULL,
  reported_user_id UUID,
  reason TEXT NOT NULL,
  detailed_reason TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  moderator_id UUID,
  moderator_notes TEXT,
  action_taken TEXT,
  resolution_date TIMESTAMP WITH TIME ZONE,
  ai_flagged BOOLEAN DEFAULT false,
  ai_confidence DECIMAL(3,2),
  cultural_sensitivity_flag BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Cultural Celebrations and Events
CREATE TABLE IF NOT EXISTS public.cultural_celebrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  cultural_origin TEXT NOT NULL,
  celebration_date DATE,
  celebration_type TEXT NOT NULL CHECK (celebration_type IN ('holiday', 'tradition', 'ceremony', 'festival', 'observance')),
  significance TEXT,
  therapeutic_connection TEXT,
  participating_cultures TEXT[],
  suggested_activities JSONB DEFAULT '{}',
  resources TEXT[],
  community_interest_level DECIMAL(3,2) DEFAULT 0.5,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mentorship Programs
CREATE TABLE IF NOT EXISTS public.mentorship_programs (
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

-- Community Achievements and Gamification
CREATE TABLE IF NOT EXISTS public.community_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('participation', 'helping_others', 'cultural_sharing', 'milestone_celebration', 'consistency', 'leadership')),
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Award',
  points_earned INTEGER DEFAULT 0,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  cultural_significance TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  visible_to_community BOOLEAN DEFAULT true,
  related_content_id UUID,
  related_content_type TEXT,
  badge_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community Analytics
CREATE TABLE IF NOT EXISTS public.community_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL,
  total_active_users INTEGER DEFAULT 0,
  new_connections INTEGER DEFAULT 0,
  cultural_interactions INTEGER DEFAULT 0,
  support_group_participation INTEGER DEFAULT 0,
  peer_matching_success_rate DECIMAL(3,2),
  cultural_content_engagement DECIMAL(3,2),
  crisis_interventions INTEGER DEFAULT 0,
  community_health_score DECIMAL(3,2),
  top_cultural_backgrounds TEXT[],
  most_active_groups TEXT[],
  trending_topics TEXT[],
  safety_incidents INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Community Live Events
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

-- Enable RLS on all tables
ALTER TABLE public.support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.peer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_moderation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_celebrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_live_events ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Support Groups Policies
CREATE POLICY "Anyone can view public support groups" ON public.support_groups
  FOR SELECT USING (privacy_level = 'public' OR id IN (
    SELECT group_id FROM public.group_memberships WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create support groups" ON public.support_groups
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators and facilitators can update groups" ON public.support_groups
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = facilitator_id);

-- Group Discussions Policies
CREATE POLICY "Group members can view discussions" ON public.group_discussions
  FOR SELECT USING (group_id IN (
    SELECT group_id FROM public.group_memberships 
    WHERE user_id = auth.uid() AND is_active = true
  ));

CREATE POLICY "Group members can create discussions" ON public.group_discussions
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND 
    group_id IN (
      SELECT group_id FROM public.group_memberships 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Authors can update their discussions" ON public.group_discussions
  FOR UPDATE USING (auth.uid() = author_id);

-- Community Challenges Policies
CREATE POLICY "Anyone can view challenges" ON public.community_challenges
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create challenges" ON public.community_challenges
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their challenges" ON public.community_challenges
  FOR UPDATE USING (auth.uid() = created_by);

-- Peer Connections Policies
CREATE POLICY "Users can manage their connections" ON public.peer_connections
  FOR ALL USING (auth.uid() = requester_id OR auth.uid() = requested_id);

-- Community Resources Policies
CREATE POLICY "Anyone can view verified resources" ON public.community_resources
  FOR SELECT USING (is_verified = true);

CREATE POLICY "Users can create resources" ON public.community_resources
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their resources" ON public.community_resources
  FOR UPDATE USING (auth.uid() = created_by);

-- Community Moderation Policies
CREATE POLICY "Users can report content" ON public.community_moderation
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their reports" ON public.community_moderation
  FOR SELECT USING (auth.uid() = reporter_id);

-- Cultural Celebrations Policies
CREATE POLICY "Anyone can view celebrations" ON public.cultural_celebrations
  FOR SELECT USING (true);

CREATE POLICY "Users can create celebrations" ON public.cultural_celebrations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Mentorship Programs Policies
CREATE POLICY "Users can view their mentorship programs" ON public.mentorship_programs
  FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

CREATE POLICY "Mentors and mentees can update programs" ON public.mentorship_programs
  FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = mentee_id);

-- Community Achievements Policies
CREATE POLICY "Users can view their achievements" ON public.community_achievements
  FOR SELECT USING (auth.uid() = user_id OR visible_to_community = true);

CREATE POLICY "System can create achievements" ON public.community_achievements
  FOR INSERT WITH CHECK (true);

-- Community Analytics Policies
CREATE POLICY "Admins can view analytics" ON public.community_analytics
  FOR SELECT USING (is_admin(auth.uid()));

-- Community Live Events Policies
CREATE POLICY "Anyone can view active events" ON public.community_live_events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can create events" ON public.community_live_events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators and facilitators can update events" ON public.community_live_events
  FOR UPDATE USING (auth.uid() = created_by OR auth.uid() = facilitator_id);

-- Create indexes for performance
CREATE INDEX idx_support_groups_category ON public.support_groups(category);
CREATE INDEX idx_support_groups_cultural_focus ON public.support_groups USING GIN(cultural_focus);
CREATE INDEX idx_group_discussions_group_id ON public.group_discussions(group_id);
CREATE INDEX idx_group_discussions_author_id ON public.group_discussions(author_id);
CREATE INDEX idx_community_challenges_type ON public.community_challenges(challenge_type);
CREATE INDEX idx_peer_connections_users ON public.peer_connections(requester_id, requested_id);
CREATE INDEX idx_community_resources_category ON public.community_resources(category);
CREATE INDEX idx_community_resources_cultural ON public.community_resources USING GIN(cultural_relevance);
CREATE INDEX idx_community_live_events_time ON public.community_live_events(start_time);
CREATE INDEX idx_community_achievements_user ON public.community_achievements(user_id);

-- Create updated_at triggers
CREATE TRIGGER update_support_groups_updated_at
  BEFORE UPDATE ON public.support_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_group_discussions_updated_at
  BEFORE UPDATE ON public.group_discussions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_challenges_updated_at
  BEFORE UPDATE ON public.community_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_peer_connections_updated_at
  BEFORE UPDATE ON public.peer_connections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_resources_updated_at
  BEFORE UPDATE ON public.community_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_moderation_updated_at
  BEFORE UPDATE ON public.community_moderation
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cultural_celebrations_updated_at
  BEFORE UPDATE ON public.cultural_celebrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentorship_programs_updated_at
  BEFORE UPDATE ON public.mentorship_programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_community_live_events_updated_at
  BEFORE UPDATE ON public.community_live_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();