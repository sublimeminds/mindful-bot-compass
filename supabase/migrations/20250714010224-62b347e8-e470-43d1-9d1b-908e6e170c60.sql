-- Cultural AI Phase 2 & 3: Enhanced Features and Optimization Tables

-- Cultural Content Library
CREATE TABLE public.cultural_content_library (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content_type TEXT NOT NULL, -- 'exercise', 'technique', 'story', 'metaphor', 'meditation'
    cultural_backgrounds TEXT[] NOT NULL DEFAULT '{}',
    languages TEXT[] NOT NULL DEFAULT '{}',
    content JSONB NOT NULL,
    difficulty_level TEXT NOT NULL DEFAULT 'beginner',
    target_audience TEXT[] NOT NULL DEFAULT '{}',
    therapy_approaches TEXT[] NOT NULL DEFAULT '{}',
    effectiveness_score NUMERIC DEFAULT 4.0,
    usage_count INTEGER DEFAULT 0,
    created_by UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural Effectiveness Tracking
CREATE TABLE public.cultural_effectiveness_tracking (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    session_id UUID,
    cultural_sensitivity_score NUMERIC NOT NULL,
    user_satisfaction NUMERIC NOT NULL,
    cultural_relevance NUMERIC NOT NULL,
    adaptation_success NUMERIC NOT NULL,
    content_id UUID,
    feedback_text TEXT,
    improvement_suggestions TEXT[],
    tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural Support Groups
CREATE TABLE public.cultural_support_groups (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cultural_backgrounds TEXT[] NOT NULL,
    languages TEXT[] NOT NULL,
    group_type TEXT NOT NULL DEFAULT 'peer_support', -- 'peer_support', 'family_therapy', 'cultural_celebration'
    max_members INTEGER DEFAULT 20,
    current_members INTEGER DEFAULT 0,
    facilitator_id UUID,
    meeting_schedule JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural Group Memberships
CREATE TABLE public.cultural_group_memberships (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID NOT NULL REFERENCES cultural_support_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    role TEXT NOT NULL DEFAULT 'member', -- 'member', 'facilitator', 'moderator'
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    cultural_compatibility_score NUMERIC DEFAULT 0.0
);

-- Family Integration Profiles
CREATE TABLE public.family_integration_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    family_involvement_level TEXT NOT NULL DEFAULT 'moderate', -- 'minimal', 'moderate', 'high'
    family_members JSONB DEFAULT '[]',
    cultural_family_roles JSONB DEFAULT '{}',
    family_therapy_consent BOOLEAN DEFAULT false,
    emergency_family_contact UUID,
    cultural_decision_making TEXT DEFAULT 'individual', -- 'individual', 'consultative', 'collective'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural Bias Detection Log
CREATE TABLE public.cultural_bias_detection (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    content_type TEXT NOT NULL, -- 'ai_response', 'therapy_content', 'user_input'
    content_text TEXT NOT NULL,
    cultural_context JSONB,
    bias_score NUMERIC NOT NULL,
    bias_indicators TEXT[],
    flagged_phrases TEXT[],
    corrective_actions TEXT[],
    reviewed_by UUID,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'corrected'
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural Celebrations and Events
CREATE TABLE public.cultural_celebrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    cultural_origin TEXT NOT NULL,
    celebration_date DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT true,
    recurrence_pattern TEXT, -- 'yearly', 'lunar_calendar', etc.
    therapeutic_themes TEXT[],
    community_activities JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cultural Peer Matching
CREATE TABLE public.cultural_peer_matches (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    matched_user_id UUID NOT NULL,
    match_score NUMERIC NOT NULL,
    match_criteria JSONB NOT NULL,
    match_type TEXT NOT NULL DEFAULT 'cultural_support', -- 'cultural_support', 'language_exchange', 'therapy_buddy'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'active'
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.cultural_content_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_effectiveness_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_support_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_integration_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_bias_detection ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_celebrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_peer_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Cultural Content Library
CREATE POLICY "Anyone can view active cultural content" ON cultural_content_library
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage cultural content" ON cultural_content_library
    FOR ALL USING (is_admin(auth.uid()));

-- Cultural Effectiveness Tracking
CREATE POLICY "Users can view their own effectiveness tracking" ON cultural_effectiveness_tracking
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create effectiveness tracking" ON cultural_effectiveness_tracking
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all effectiveness tracking" ON cultural_effectiveness_tracking
    FOR SELECT USING (is_admin(auth.uid()));

-- Cultural Support Groups
CREATE POLICY "Users can view cultural support groups" ON cultural_support_groups
    FOR SELECT USING (is_active = true);

CREATE POLICY "Facilitators can manage their groups" ON cultural_support_groups
    FOR ALL USING (auth.uid() = facilitator_id OR is_admin(auth.uid()));

-- Cultural Group Memberships
CREATE POLICY "Users can view group memberships" ON cultural_group_memberships
    FOR SELECT USING (
        auth.uid() = user_id OR 
        group_id IN (SELECT id FROM cultural_support_groups WHERE facilitator_id = auth.uid())
    );

CREATE POLICY "Users can manage their own memberships" ON cultural_group_memberships
    FOR ALL USING (auth.uid() = user_id);

-- Family Integration Profiles
CREATE POLICY "Users can manage their family profiles" ON family_integration_profiles
    FOR ALL USING (auth.uid() = user_id);

-- Cultural Bias Detection
CREATE POLICY "Admins can manage bias detection" ON cultural_bias_detection
    FOR ALL USING (is_admin(auth.uid()));

-- Cultural Celebrations
CREATE POLICY "Anyone can view cultural celebrations" ON cultural_celebrations
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage celebrations" ON cultural_celebrations
    FOR ALL USING (is_admin(auth.uid()));

-- Cultural Peer Matches
CREATE POLICY "Users can view their peer matches" ON cultural_peer_matches
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

CREATE POLICY "Users can create peer matches" ON cultural_peer_matches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their peer matches" ON cultural_peer_matches
    FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = matched_user_id);

-- Indexes
CREATE INDEX idx_cultural_content_backgrounds ON cultural_content_library USING GIN(cultural_backgrounds);
CREATE INDEX idx_cultural_content_languages ON cultural_content_library USING GIN(languages);
CREATE INDEX idx_cultural_effectiveness_user ON cultural_effectiveness_tracking(user_id);
CREATE INDEX idx_cultural_groups_backgrounds ON cultural_support_groups USING GIN(cultural_backgrounds);
CREATE INDEX idx_family_integration_user ON family_integration_profiles(user_id);
CREATE INDEX idx_cultural_bias_score ON cultural_bias_detection(bias_score);
CREATE INDEX idx_peer_matches_user ON cultural_peer_matches(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_cultural_content_library_updated_at
    BEFORE UPDATE ON cultural_content_library
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cultural_support_groups_updated_at
    BEFORE UPDATE ON cultural_support_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_integration_profiles_updated_at
    BEFORE UPDATE ON family_integration_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();