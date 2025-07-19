
-- Enhanced therapist personality system
-- Add more detailed personality and character tracking

-- Create expanded therapist personality traits
CREATE TABLE IF NOT EXISTS public.therapist_character_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id TEXT NOT NULL UNIQUE,
  personal_backstory JSONB DEFAULT '{}',
  signature_phrases TEXT[] DEFAULT '{}',
  speech_patterns JSONB DEFAULT '{}',
  cultural_stories JSONB DEFAULT '{}',
  therapy_philosophy TEXT,
  personal_interests TEXT[] DEFAULT '{}',
  professional_background JSONB DEFAULT '{}',
  emotional_intelligence_profile JSONB DEFAULT '{}',
  crisis_response_style JSONB DEFAULT '{}',
  session_style_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapist-client relationship tracking
CREATE TABLE IF NOT EXISTS public.therapist_client_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  relationship_stage TEXT NOT NULL DEFAULT 'initial',
  rapport_level NUMERIC DEFAULT 0.5,
  communication_preferences JSONB DEFAULT '{}',
  shared_memories JSONB DEFAULT '[]',
  therapeutic_progress JSONB DEFAULT '{}',
  last_interaction TIMESTAMP WITH TIME ZONE,
  total_sessions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, therapist_id)
);

-- Create therapist note styles table
CREATE TABLE IF NOT EXISTS public.therapist_note_styles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id TEXT NOT NULL UNIQUE,
  note_taking_style TEXT NOT NULL DEFAULT 'structured',
  documentation_format JSONB DEFAULT '{}',
  focus_areas TEXT[] DEFAULT '{}',
  observation_style TEXT,
  progress_tracking_method TEXT,
  homework_assignment_style JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dynamic character expressions table
CREATE TABLE IF NOT EXISTS public.therapist_expressions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id TEXT NOT NULL,
  context_type TEXT NOT NULL, -- 'session_start', 'crisis', 'breakthrough', etc.
  emotional_context TEXT NOT NULL,
  expression_data JSONB NOT NULL,
  usage_frequency INTEGER DEFAULT 0,
  effectiveness_score NUMERIC DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.therapist_character_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_client_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_note_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_expressions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view therapist character profiles" ON public.therapist_character_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can view their relationships" ON public.therapist_client_relationships
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their relationships" ON public.therapist_client_relationships
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can manage relationships" ON public.therapist_client_relationships
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view note styles" ON public.therapist_note_styles
FOR SELECT USING (true);

CREATE POLICY "Public can view expressions" ON public.therapist_expressions
FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_therapist_relationships_user ON public.therapist_client_relationships(user_id);
CREATE INDEX IF NOT EXISTS idx_therapist_relationships_therapist ON public.therapist_client_relationships(therapist_id);
CREATE INDEX IF NOT EXISTS idx_therapist_expressions_context ON public.therapist_expressions(therapist_id, context_type);

-- Insert sample enhanced character data
INSERT INTO public.therapist_character_profiles (therapist_id, personal_backstory, signature_phrases, speech_patterns, therapy_philosophy, personal_interests, professional_background) VALUES
('dr-sarah-chen', 
 '{"early_inspiration": "Became a therapist after helping her younger sister through anxiety", "personal_journey": "Overcame her own perfectionism through therapy", "cultural_influence": "First-generation immigrant experience shaped her empathy"}',
 ARRAY['Let''s take a moment to breathe through this', 'What does your inner wisdom tell you?', 'You''re being incredibly brave right now'],
 '{"speaking_pace": "measured", "tone": "warm_professional", "uses_metaphors": true, "cultural_references": "subtle_asian_wisdom"}',
 'Believes in the inherent strength within every person and uses a blend of Western CBT with Eastern mindfulness practices',
 ARRAY['meditation', 'hiking', 'tea_ceremony', 'reading_poetry'],
 '{"education": ["PhD Clinical Psychology - Stanford", "Mindfulness Certification"], "specializations": ["anxiety_disorders", "cultural_identity"], "years_practicing": 8}'
),
('dr-alex-rivera', 
 '{"motivation": "Lost a close friend to depression, dedicated life to mental health", "approach_development": "Combines street-smart wisdom with clinical training", "community_connection": "Grew up in diverse urban community"}',
 ARRAY['I hear you, and that matters', 'Let''s break this down together', 'Your feelings make complete sense given what you''ve been through'],
 '{"speaking_pace": "conversational", "tone": "warm_direct", "uses_humor": "appropriately", "validation_focused": true}',
 'Everyone deserves to be heard and understood. Therapy should feel like talking to a wise, caring friend who happens to have professional training',
 ARRAY['community_work', 'salsa_dancing', 'cooking', 'basketball'],
 '{"education": ["MSW Social Work", "Trauma-Informed Care Specialist"], "specializations": ["depression", "life_transitions", "LGBTQ_affirmative"], "years_practicing": 6}'
);

INSERT INTO public.therapist_note_styles (therapist_id, note_taking_style, documentation_format, focus_areas, observation_style, progress_tracking_method) VALUES
('dr-sarah-chen', 'holistic_narrative', 
 '{"structure": "narrative_with_mindfulness_notes", "includes_body_awareness": true, "cultural_context_noted": true}',
 ARRAY['emotional_regulation', 'mindfulness_practice', 'cultural_identity_integration'],
 'Notices subtle emotional shifts and somatic responses',
 'Weekly mindfulness check-ins with mood tracking'
),
('dr-alex-rivera', 'strength_based_structured',
 '{"structure": "strengths_and_challenges", "includes_social_context": true, "action_oriented": true}',
 ARRAY['resilience_building', 'social_connections', 'practical_coping_skills'],
 'Focuses on client strengths and community resources',
 'Goal-oriented milestones with celebration of small wins'
);
