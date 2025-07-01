-- Create clinical assessments table for standardized mental health screenings
CREATE TABLE public.clinical_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_type TEXT NOT NULL, -- 'phq9', 'gad7', 'ptsd5', 'ace', etc.
  questions JSONB NOT NULL DEFAULT '{}',
  responses JSONB NOT NULL DEFAULT '{}',
  total_score INTEGER NOT NULL DEFAULT 0,
  severity_level TEXT NOT NULL DEFAULT 'normal', -- 'normal', 'mild', 'moderate', 'severe'
  interpretation TEXT,
  recommendations JSONB DEFAULT '{}',
  administered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session protocols table for different therapy types
CREATE TABLE public.session_protocols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  therapy_type TEXT NOT NULL, -- 'cbt', 'dbt', 'mindfulness', 'crisis_intervention'
  duration_minutes INTEGER NOT NULL DEFAULT 45,
  preparation_steps JSONB DEFAULT '[]',
  session_structure JSONB DEFAULT '{}',
  post_session_tasks JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enhanced session analytics table
CREATE TABLE public.session_analytics_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  protocol_id UUID,
  real_time_metrics JSONB DEFAULT '{}',
  engagement_score NUMERIC(3,2) DEFAULT 0.5,
  emotional_progression JSONB DEFAULT '{}',
  technique_effectiveness JSONB DEFAULT '{}',
  clinical_observations JSONB DEFAULT '{}',
  ai_insights JSONB DEFAULT '{}',
  intervention_suggestions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professional oversight table
CREATE TABLE public.professional_oversight (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  professional_id UUID,
  oversight_type TEXT NOT NULL, -- 'supervision', 'consultation', 'referral'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'completed'
  priority_level TEXT NOT NULL DEFAULT 'routine', -- 'routine', 'urgent', 'crisis'
  reason TEXT NOT NULL,
  context_data JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  notes TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create treatment outcomes table
CREATE TABLE public.treatment_outcomes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  measurement_type TEXT NOT NULL, -- 'symptom_reduction', 'functional_improvement', 'quality_of_life'
  baseline_score NUMERIC,
  current_score NUMERIC,
  improvement_percentage NUMERIC,
  measurement_period TEXT NOT NULL, -- 'weekly', 'monthly', 'quarterly'
  clinical_significance BOOLEAN DEFAULT false,
  goals_met JSONB DEFAULT '[]',
  next_targets JSONB DEFAULT '[]',
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.clinical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_analytics_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_oversight ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_outcomes ENABLE ROW LEVEL SECURITY;

-- RLS policies for clinical assessments
CREATE POLICY "Users can create their own assessments"
ON public.clinical_assessments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments"
ON public.clinical_assessments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments"
ON public.clinical_assessments
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for session protocols
CREATE POLICY "Anyone can view active session protocols"
ON public.session_protocols
FOR SELECT
USING (is_active = true);

-- RLS policies for enhanced session analytics
CREATE POLICY "Users can view analytics for their sessions"
ON public.session_analytics_enhanced
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create session analytics"
ON public.session_analytics_enhanced
FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update session analytics"
ON public.session_analytics_enhanced
FOR UPDATE
USING (true);

-- RLS policies for professional oversight
CREATE POLICY "Users can view their own oversight records"
ON public.professional_oversight
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create oversight records"
ON public.professional_oversight
FOR INSERT
WITH CHECK (true);

-- RLS policies for treatment outcomes
CREATE POLICY "Users can view their own treatment outcomes"
ON public.treatment_outcomes
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage treatment outcomes"
ON public.treatment_outcomes
FOR ALL
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_clinical_assessments_user_type ON public.clinical_assessments(user_id, assessment_type);
CREATE INDEX idx_clinical_assessments_administered_at ON public.clinical_assessments(administered_at DESC);
CREATE INDEX idx_session_analytics_enhanced_session_id ON public.session_analytics_enhanced(session_id);
CREATE INDEX idx_session_analytics_enhanced_user_id ON public.session_analytics_enhanced(user_id);
CREATE INDEX idx_professional_oversight_user_priority ON public.professional_oversight(user_id, priority_level);
CREATE INDEX idx_treatment_outcomes_user_type ON public.treatment_outcomes(user_id, measurement_type);

-- Insert default session protocols
INSERT INTO public.session_protocols (name, description, therapy_type, duration_minutes, preparation_steps, session_structure, post_session_tasks) VALUES
('Cognitive Behavioral Therapy', 'Structured CBT session focusing on thought patterns and behavioral changes', 'cbt', 50, 
 '["Review homework", "Check mood", "Set session agenda"]',
 '{"opening": 10, "main_intervention": 30, "closing": 10}',
 '["Assign homework", "Schedule follow-up", "Practice exercises"]'),
('Dialectical Behavior Therapy', 'DBT session emphasizing mindfulness and emotional regulation', 'dbt', 45,
 '["Mindfulness check-in", "Review distress tolerance skills", "Set intentions"]',
 '{"mindfulness": 10, "skill_building": 25, "practice": 10}',
 '["Practice new skills", "Log emotions", "Plan skill usage"]'),
('Mindfulness Session', 'Guided mindfulness and meditation practice', 'mindfulness', 30,
 '["Breathing preparation", "Set comfortable position", "Clear distractions"]',
 '{"centering": 5, "guided_practice": 20, "reflection": 5}',
 '["Continue practice", "Note insights", "Schedule next session"]'),
('Crisis Intervention', 'Immediate crisis support and safety planning', 'crisis_intervention', 60,
 '["Assess immediate safety", "Contact support person if needed", "Review safety plan"]',
 '{"safety_assessment": 15, "crisis_counseling": 35, "safety_planning": 10}',
 '["Update safety plan", "Schedule immediate follow-up", "Activate support network"]');