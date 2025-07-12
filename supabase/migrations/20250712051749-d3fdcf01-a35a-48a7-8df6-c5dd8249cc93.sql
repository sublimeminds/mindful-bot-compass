-- Expand therapeutic_approach_configs with new evidence-based approaches
INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, system_prompt_addition, effectiveness_score, is_active) VALUES
('Acceptance and Commitment Therapy (ACT)', 'Focus on psychological flexibility and acceptance of difficult thoughts and feelings', ARRAY['Mindfulness exercises', 'Values clarification', 'Defusion techniques', 'Committed action planning'], ARRAY['anxiety', 'depression', 'chronic pain', 'substance abuse'], 'Use ACT principles of psychological flexibility. Help users accept difficult emotions while committing to value-based actions. Guide through mindfulness and defusion exercises.', 0.82, true),
('Eye Movement Desensitization and Reprocessing (EMDR)', 'Trauma-focused therapy using bilateral stimulation', ARRAY['Bilateral stimulation', 'Resource installation', 'Trauma processing', 'Safe place visualization'], ARRAY['PTSD', 'trauma', 'anxiety', 'phobias'], 'Adapt EMDR principles for chat format. Focus on grounding, resource building, and gentle processing. Always prioritize safety and stabilization.', 0.88, true),
('Solution-Focused Brief Therapy (SFBT)', 'Goal-oriented therapy focusing on solutions rather than problems', ARRAY['Miracle question', 'Scaling questions', 'Exception finding', 'Compliments and affirmations'], ARRAY['depression', 'anxiety', 'relationship issues', 'life transitions'], 'Use solution-focused questioning. Help users identify what works, exceptions to problems, and small steps toward goals. Focus on strengths and resources.', 0.79, true),
('Narrative Therapy', 'Helping people re-author their life stories', ARRAY['Externalization', 'Unique outcomes', 'Re-authoring conversations', 'Definitional ceremonies'], ARRAY['identity issues', 'trauma', 'self-esteem', 'life transitions'], 'Help users separate themselves from their problems. Explore preferred stories and identity. Focus on agency and unique outcomes.', 0.75, true),
('Internal Family Systems (IFS)', 'Working with different parts of the self', ARRAY['Parts identification', 'Self-leadership', 'Unburdening work', 'Protective part dialogue'], ARRAY['trauma', 'depression', 'anxiety', 'relationship issues'], 'Help users identify different internal parts. Promote Self-leadership and curiosity toward all parts. Facilitate internal dialogue and healing.', 0.81, true),
('Emotionally Focused Therapy (EFT)', 'Attachment-based approach for relationships', ARRAY['Emotion identification', 'Cycle mapping', 'Attachment responses', 'Bonding conversations'], ARRAY['relationship issues', 'attachment trauma', 'communication problems'], 'Focus on emotional connection and attachment needs. Help identify negative cycles and promote vulnerable sharing.', 0.84, true),
('Somatic Experiencing', 'Body-based trauma therapy', ARRAY['Body awareness', 'Pendulation', 'Titration', 'Resource building'], ARRAY['trauma', 'anxiety', 'chronic stress', 'panic'], 'Guide attention to body sensations. Help users notice and track sensations. Promote nervous system regulation through gentle awareness.', 0.77, true),
('Motivational Interviewing (MI)', 'Client-centered approach to behavior change', ARRAY['Open-ended questions', 'Affirmations', 'Reflective listening', 'Summarizing'], ARRAY['substance abuse', 'behavior change', 'ambivalence', 'motivation'], 'Use MI spirit of collaboration. Explore ambivalence about change. Strengthen motivation through reflective listening and change talk.', 0.80, true),
('Gestalt Therapy', 'Present-moment awareness and contact', ARRAY['Here and now focus', 'Awareness exercises', 'Contact experiments', 'Figure/ground work'], ARRAY['anxiety', 'depression', 'relationship issues', 'self-awareness'], 'Focus on present-moment experience. Encourage awareness of thoughts, feelings, and sensations. Promote authentic contact and expression.', 0.76, true),
('Psychodynamic Therapy', 'Insight-oriented exploration of unconscious patterns', ARRAY['Transference exploration', 'Dream analysis', 'Free association', 'Defense identification'], ARRAY['depression', 'anxiety', 'personality disorders', 'relationship patterns'], 'Explore unconscious patterns and early relationships. Help connect past experiences to current difficulties. Focus on insight and understanding.', 0.78, true);

-- Create therapy_approach_combinations table for dual-approach system
CREATE TABLE IF NOT EXISTS therapy_approach_combinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_approach_id UUID REFERENCES therapeutic_approach_configs(id),
    secondary_approach_id UUID REFERENCES therapeutic_approach_configs(id),
    combination_name TEXT NOT NULL,
    effectiveness_score NUMERIC(3,2) DEFAULT 0.75,
    target_conditions TEXT[] DEFAULT '{}',
    integration_strategy TEXT NOT NULL,
    session_structure JSONB DEFAULT '{}',
    contraindications TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert effective therapy combinations
INSERT INTO therapy_approach_combinations (primary_approach_id, secondary_approach_id, combination_name, effectiveness_score, target_conditions, integration_strategy) VALUES
((SELECT id FROM therapeutic_approach_configs WHERE name = 'Cognitive Behavioral Therapy (CBT)'), (SELECT id FROM therapeutic_approach_configs WHERE name = 'Dialectical Behavior Therapy (DBT)'), 'CBT-DBT Integration', 0.87, ARRAY['anxiety', 'depression', 'emotional dysregulation'], 'Use CBT for thought restructuring combined with DBT skills for emotion regulation'),
((SELECT id FROM therapeutic_approach_configs WHERE name = 'Eye Movement Desensitization and Reprocessing (EMDR)'), (SELECT id FROM therapeutic_approach_configs WHERE name = 'Somatic Experiencing'), 'EMDR-Somatic Integration', 0.91, ARRAY['PTSD', 'trauma', 'anxiety'], 'Combine EMDR processing with somatic awareness and regulation'),
((SELECT id FROM therapeutic_approach_configs WHERE name = 'Acceptance and Commitment Therapy (ACT)'), (SELECT id FROM therapeutic_approach_configs WHERE name = 'Mindfulness-Based Cognitive Therapy (MBCT)'), 'ACT-MBCT Integration', 0.85, ARRAY['anxiety', 'depression', 'chronic pain'], 'Integrate mindfulness practices with psychological flexibility principles'),
((SELECT id FROM therapeutic_approach_configs WHERE name = 'Internal Family Systems (IFS)'), (SELECT id FROM therapeutic_approach_configs WHERE name = 'Emotionally Focused Therapy (EFT)'), 'IFS-EFT Integration', 0.83, ARRAY['trauma', 'relationship issues', 'attachment'], 'Use IFS for internal work combined with EFT for relational healing');

-- Create real_time_session_analytics table
CREATE TABLE IF NOT EXISTS real_time_session_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL,
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    emotion_scores JSONB DEFAULT '{}', -- Current emotional state scores
    technique_effectiveness JSONB DEFAULT '{}', -- Effectiveness of techniques used
    crisis_indicators JSONB DEFAULT '{}', -- Crisis risk assessment
    breakthrough_moments JSONB DEFAULT '[]', -- Detected breakthrough moments
    approach_recommendations JSONB DEFAULT '{}', -- Recommended therapy approaches
    engagement_metrics JSONB DEFAULT '{}', -- User engagement measurements
    session_quality_score NUMERIC(3,2) DEFAULT 0.0,
    intervention_needed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_therapy_preferences table
CREATE TABLE IF NOT EXISTS user_therapy_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    preferred_approaches TEXT[] DEFAULT '{}',
    approach_effectiveness JSONB DEFAULT '{}', -- User-specific effectiveness scores
    communication_style TEXT DEFAULT 'balanced',
    session_preferences JSONB DEFAULT '{}',
    crisis_protocols JSONB DEFAULT '{}',
    cultural_adaptations JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create session_technique_tracking table
CREATE TABLE IF NOT EXISTS session_technique_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL,
    technique_name TEXT NOT NULL,
    approach_type TEXT NOT NULL,
    implementation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_response_score NUMERIC(3,2) DEFAULT 0.0,
    effectiveness_metrics JSONB DEFAULT '{}',
    user_feedback TEXT,
    ai_confidence NUMERIC(3,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create live_analytics_events table for real-time tracking
CREATE TABLE IF NOT EXISTS live_analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'message', 'mood_change', 'crisis_indicator', 'breakthrough'
    session_id UUID,
    user_id UUID NOT NULL,
    event_data JSONB DEFAULT '{}',
    severity_level TEXT DEFAULT 'normal', -- 'normal', 'elevated', 'high', 'crisis'
    requires_intervention BOOLEAN DEFAULT false,
    processed BOOLEAN DEFAULT false,
    processing_result JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_real_time_session_analytics_session_id ON real_time_session_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_real_time_session_analytics_user_id ON real_time_session_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_real_time_session_analytics_timestamp ON real_time_session_analytics(analysis_timestamp);
CREATE INDEX IF NOT EXISTS idx_live_analytics_events_user_id ON live_analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_live_analytics_events_timestamp ON live_analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_live_analytics_events_requires_intervention ON live_analytics_events(requires_intervention);
CREATE INDEX IF NOT EXISTS idx_session_technique_tracking_session_id ON session_technique_tracking(session_id);

-- Enable RLS on new tables
ALTER TABLE therapy_approach_combinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE real_time_session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_therapy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_technique_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_analytics_events ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view approach combinations" ON therapy_approach_combinations FOR SELECT USING (is_active = true);

CREATE POLICY "Users can view their session analytics" ON real_time_session_analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create session analytics" ON real_time_session_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their therapy preferences" ON user_therapy_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their technique tracking" ON session_technique_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create technique tracking" ON session_technique_tracking FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their analytics events" ON live_analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create analytics events" ON live_analytics_events FOR INSERT WITH CHECK (true);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_therapy_approach_combinations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapy_approach_combinations_updated_at
    BEFORE UPDATE ON therapy_approach_combinations
    FOR EACH ROW
    EXECUTE FUNCTION update_therapy_approach_combinations_updated_at();

CREATE TRIGGER update_user_therapy_preferences_updated_at
    BEFORE UPDATE ON user_therapy_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();