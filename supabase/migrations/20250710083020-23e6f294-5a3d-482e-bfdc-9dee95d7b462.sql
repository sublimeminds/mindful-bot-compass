-- Create session assessments table for pre/post therapy session check-ins
CREATE TABLE public.session_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID NULL,
  assessment_type TEXT NOT NULL CHECK (assessment_type IN ('pre_session', 'post_session')),
  
  -- Pre-session questions
  current_mood INTEGER NULL CHECK (current_mood >= 1 AND current_mood <= 10),
  energy_level INTEGER NULL CHECK (energy_level >= 1 AND energy_level <= 10),
  stress_level INTEGER NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  sleep_quality INTEGER NULL CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  main_concerns TEXT[] NULL,
  session_goals TEXT[] NULL,
  current_symptoms TEXT[] NULL,
  medication_changes BOOLEAN NULL DEFAULT false,
  life_events TEXT NULL,
  
  -- Post-session questions
  session_helpfulness INTEGER NULL CHECK (session_helpfulness >= 1 AND session_helpfulness <= 10),
  therapist_connection INTEGER NULL CHECK (therapist_connection >= 1 AND therapist_connection <= 10),
  techniques_learned TEXT[] NULL,
  homework_assigned TEXT[] NULL,
  next_session_goals TEXT[] NULL,
  overall_satisfaction INTEGER NULL CHECK (overall_satisfaction >= 1 AND overall_satisfaction <= 10),
  would_recommend BOOLEAN NULL,
  additional_feedback TEXT NULL,
  
  -- Common fields
  emotional_state TEXT NULL,
  confidence_level INTEGER NULL CHECK (confidence_level >= 1 AND confidence_level <= 10),
  breakthrough_moments TEXT NULL,
  challenges_discussed TEXT[] NULL,
  
  -- Metadata
  responses JSONB NOT NULL DEFAULT '{}',
  assessment_score NUMERIC NULL,
  ai_insights TEXT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own assessments"
ON public.session_assessments
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create therapy session continuity table
CREATE TABLE public.therapy_session_continuity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  previous_session_id UUID NULL,
  current_session_id UUID NULL,
  
  -- Continuity data
  carry_over_topics TEXT[] NULL,
  unresolved_issues TEXT[] NULL,
  progress_indicators JSONB NULL DEFAULT '{}',
  therapist_notes TEXT NULL,
  ai_recommendations TEXT[] NULL,
  
  -- Session flow
  session_plan TEXT NULL,
  adapted_approach TEXT NULL,
  priority_areas TEXT[] NULL,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapy_session_continuity ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own session continuity"
ON public.therapy_session_continuity
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_session_assessments_user_id ON public.session_assessments(user_id);
CREATE INDEX idx_session_assessments_session_id ON public.session_assessments(session_id);
CREATE INDEX idx_session_assessments_type ON public.session_assessments(assessment_type);
CREATE INDEX idx_therapy_session_continuity_user_id ON public.therapy_session_continuity(user_id);

-- Update therapist_personalities with more detailed information
ALTER TABLE public.therapist_personalities 
ADD COLUMN IF NOT EXISTS success_rate NUMERIC DEFAULT 0.85 CHECK (success_rate >= 0 AND success_rate <= 1),
ADD COLUMN IF NOT EXISTS user_rating NUMERIC DEFAULT 4.5 CHECK (user_rating >= 0 AND user_rating <= 5),
ADD COLUMN IF NOT EXISTS total_sessions INTEGER DEFAULT 150,
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS education TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS therapeutic_techniques TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS emotional_responses JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS voice_characteristics JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_availability JSONB DEFAULT '{}';

-- Update existing therapist personalities with realistic data
UPDATE public.therapist_personalities SET
  success_rate = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN 0.92
    WHEN name = 'Dr. Maya Patel' THEN 0.89
    WHEN name = 'Dr. Alex Rodriguez' THEN 0.87
    WHEN name = 'Dr. Jordan Kim' THEN 0.91
    WHEN name = 'Dr. Taylor Morgan' THEN 0.85
    WHEN name = 'Dr. River Stone' THEN 0.83
    ELSE 0.85
  END,
  user_rating = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN 4.9
    WHEN name = 'Dr. Maya Patel' THEN 4.8
    WHEN name = 'Dr. Alex Rodriguez' THEN 4.7
    WHEN name = 'Dr. Jordan Kim' THEN 4.9
    WHEN name = 'Dr. Taylor Morgan' THEN 4.6
    WHEN name = 'Dr. River Stone' THEN 4.5
    ELSE 4.5
  END,
  total_sessions = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN 250
    WHEN name = 'Dr. Maya Patel' THEN 300
    WHEN name = 'Dr. Alex Rodriguez' THEN 180
    WHEN name = 'Dr. Jordan Kim' THEN 400
    WHEN name = 'Dr. Taylor Morgan' THEN 220
    WHEN name = 'Dr. River Stone' THEN 160
    ELSE 150
  END,
  years_experience = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN 8
    WHEN name = 'Dr. Maya Patel' THEN 10
    WHEN name = 'Dr. Alex Rodriguez' THEN 6
    WHEN name = 'Dr. Jordan Kim' THEN 12
    WHEN name = 'Dr. Taylor Morgan' THEN 9
    WHEN name = 'Dr. River Stone' THEN 7
    ELSE 5
  END,
  education = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN ARRAY['PhD Clinical Psychology - Stanford University', 'MA Psychology - UC Berkeley']
    WHEN name = 'Dr. Maya Patel' THEN ARRAY['PhD Psychology - Harvard University', 'MS Mindfulness Studies - Lesley University']
    WHEN name = 'Dr. Alex Rodriguez' THEN ARRAY['PsyD Clinical Psychology - Pepperdine University', 'BA Psychology - UCLA']
    WHEN name = 'Dr. Jordan Kim' THEN ARRAY['PhD Clinical Psychology - Yale University', 'MA Trauma Studies - The New School']
    WHEN name = 'Dr. Taylor Morgan' THEN ARRAY['PhD Counseling Psychology - Columbia University', 'MS Marriage & Family Therapy - USC']
    WHEN name = 'Dr. River Stone' THEN ARRAY['PhD Holistic Psychology - California Institute of Integral Studies', 'MA Transpersonal Psychology - Naropa University']
    ELSE ARRAY['PhD Clinical Psychology', 'MA Psychology']
  END,
  therapeutic_techniques = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN ARRAY['Cognitive Behavioral Therapy', 'Dialectical Behavior Therapy', 'Mindfulness-Based CBT']
    WHEN name = 'Dr. Maya Patel' THEN ARRAY['Mindfulness-Based Stress Reduction', 'Acceptance and Commitment Therapy', 'Loving-Kindness Meditation']
    WHEN name = 'Dr. Alex Rodriguez' THEN ARRAY['Solution-Focused Brief Therapy', 'Motivational Interviewing', 'Goal-Setting Therapy']
    WHEN name = 'Dr. Jordan Kim' THEN ARRAY['EMDR', 'Trauma-Focused CBT', 'Somatic Experiencing', 'Safety-First Approaches']
    WHEN name = 'Dr. Taylor Morgan' THEN ARRAY['Gottman Method', 'Emotionally Focused Therapy', 'Nonviolent Communication']
    WHEN name = 'Dr. River Stone' THEN ARRAY['Holistic Therapy', 'Mind-Body Integration', 'Nature-Based Therapy', 'Breathwork']
    ELSE ARRAY['Cognitive Behavioral Therapy', 'Psychodynamic Therapy']
  END,
  emotional_responses = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN '{"empathy": "high", "validation": "excellent", "emotional_regulation": "strong", "active_listening": "exceptional"}'::jsonb
    WHEN name = 'Dr. Maya Patel' THEN '{"mindful_presence": "exceptional", "compassion": "high", "non_judgment": "excellent", "peaceful_energy": "strong"}'::jsonb
    WHEN name = 'Dr. Alex Rodriguez' THEN '{"motivation": "high", "optimism": "strong", "goal_focus": "excellent", "encouragement": "exceptional"}'::jsonb
    WHEN name = 'Dr. Jordan Kim' THEN '{"safety_creation": "exceptional", "trauma_sensitivity": "excellent", "grounding": "strong", "protective_presence": "high"}'::jsonb
    WHEN name = 'Dr. Taylor Morgan' THEN '{"relationship_insight": "excellent", "communication_skills": "exceptional", "conflict_resolution": "strong", "emotional_intelligence": "high"}'::jsonb
    WHEN name = 'Dr. River Stone' THEN '{"holistic_awareness": "high", "spiritual_connection": "strong", "mind_body_integration": "excellent", "natural_wisdom": "exceptional"}'::jsonb
    ELSE '{}'::jsonb
  END,
  voice_characteristics = CASE 
    WHEN name = 'Dr. Sarah Chen' THEN '{"tone": "warm and professional", "pace": "measured and thoughtful", "accent": "slight californian", "vocal_quality": "clear and reassuring"}'::jsonb
    WHEN name = 'Dr. Maya Patel' THEN '{"tone": "gentle and mindful", "pace": "slow and meditative", "accent": "slight indian", "vocal_quality": "soothing and peaceful"}'::jsonb
    WHEN name = 'Dr. Alex Rodriguez' THEN '{"tone": "energetic and motivating", "pace": "dynamic and engaging", "accent": "slight hispanic", "vocal_quality": "confident and inspiring"}'::jsonb
    WHEN name = 'Dr. Jordan Kim' THEN '{"tone": "calm and grounding", "pace": "steady and safe", "accent": "neutral american", "vocal_quality": "stable and protective"}'::jsonb
    WHEN name = 'Dr. Taylor Morgan' THEN '{"tone": "understanding and warm", "pace": "conversational and natural", "accent": "neutral american", "vocal_quality": "relatable and approachable"}'::jsonb
    WHEN name = 'Dr. River Stone' THEN '{"tone": "flowing and natural", "pace": "organic and intuitive", "accent": "slight western", "vocal_quality": "earthy and authentic"}'::jsonb
    ELSE '{}'::jsonb
  END;