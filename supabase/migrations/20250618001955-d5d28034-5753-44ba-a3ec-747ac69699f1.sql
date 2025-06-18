
-- Create comprehensive intake data table
CREATE TABLE public.user_intake_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Demographics
  age INTEGER,
  gender TEXT,
  cultural_background TEXT,
  location TEXT,
  
  -- Health History
  medical_conditions TEXT[],
  current_medications TEXT[],
  sleep_hours_avg NUMERIC,
  exercise_frequency TEXT,
  diet_quality TEXT,
  
  -- Mental Health History
  previous_therapy BOOLEAN DEFAULT false,
  previous_therapy_details TEXT,
  mental_health_diagnoses TEXT[],
  family_mental_health_history TEXT,
  hospitalization_history BOOLEAN DEFAULT false,
  
  -- Social Context
  relationship_status TEXT,
  living_situation TEXT,
  employment_status TEXT,
  financial_stress_level INTEGER CHECK (financial_stress_level >= 1 AND financial_stress_level <= 10),
  social_support_level INTEGER CHECK (social_support_level >= 1 AND social_support_level <= 10),
  
  -- Additional Context
  primary_concerns TEXT[],
  therapy_goals TEXT[],
  preferred_communication_style TEXT,
  session_frequency_preference TEXT,
  crisis_contacts JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mental health assessments table for standardized scores
CREATE TABLE public.mental_health_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_type TEXT NOT NULL, -- 'PHQ-9', 'GAD-7', 'PCL-5', etc.
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_score INTEGER,
  severity_level TEXT,
  interpretation TEXT,
  recommendations TEXT[],
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk assessments table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Suicide Risk
  suicidal_ideation_level INTEGER CHECK (suicidal_ideation_level >= 0 AND suicidal_ideation_level <= 5),
  suicide_plan BOOLEAN DEFAULT false,
  previous_attempts BOOLEAN DEFAULT false,
  
  -- Self-Harm
  self_harm_history BOOLEAN DEFAULT false,
  self_harm_frequency TEXT,
  
  -- Substance Use
  alcohol_use_frequency TEXT,
  drug_use_frequency TEXT,
  substance_abuse_concern BOOLEAN DEFAULT false,
  
  -- Crisis Indicators
  risk_level TEXT NOT NULL DEFAULT 'low', -- 'low', 'moderate', 'high', 'crisis'
  requires_immediate_intervention BOOLEAN DEFAULT false,
  intervention_notes TEXT,
  safety_plan JSONB DEFAULT '{}'::jsonb,
  
  assessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trauma history table (encrypted sensitive data)
CREATE TABLE public.trauma_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- ACE Score (Adverse Childhood Experiences)
  ace_score INTEGER,
  ace_responses JSONB DEFAULT '{}'::jsonb,
  
  -- Trauma Types
  childhood_trauma BOOLEAN DEFAULT false,
  adult_trauma BOOLEAN DEFAULT false,
  trauma_types TEXT[],
  
  -- PTSD Assessment
  ptsd_symptoms JSONB DEFAULT '{}'::jsonb,
  ptsd_severity TEXT,
  
  -- Additional Context
  trauma_details TEXT, -- This should be encrypted in production
  coping_mechanisms TEXT[],
  triggers TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create enhanced therapy preferences table
CREATE TABLE public.enhanced_therapy_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- Communication Preferences
  communication_style TEXT, -- 'direct', 'gentle', 'analytical', 'intuitive'
  learning_style TEXT, -- 'visual', 'auditory', 'kinesthetic'
  feedback_preference TEXT, -- 'frequent', 'moderate', 'minimal'
  
  -- Session Preferences
  session_frequency TEXT, -- 'weekly', 'bi-weekly', 'monthly'
  session_duration INTEGER DEFAULT 50, -- minutes
  preferred_time_of_day TEXT,
  preferred_days TEXT[],
  
  -- Therapeutic Approach Preferences
  therapy_modalities TEXT[], -- 'CBT', 'DBT', 'EMDR', 'mindfulness', etc.
  homework_comfort_level INTEGER CHECK (homework_comfort_level >= 1 AND homework_comfort_level <= 5),
  group_therapy_interest BOOLEAN DEFAULT false,
  
  -- Therapist Matching Criteria
  therapist_gender_preference TEXT,
  cultural_competency_needs TEXT[],
  specialty_requirements TEXT[],
  experience_level_preference TEXT, -- 'new', 'experienced', 'expert', 'no_preference'
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI analysis results table
CREATE TABLE public.ai_therapy_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- AI Analysis Results
  personality_profile JSONB DEFAULT '{}'::jsonb,
  treatment_recommendations JSONB DEFAULT '{}'::jsonb,
  therapist_match_scores JSONB DEFAULT '{}'::jsonb,
  predicted_outcomes JSONB DEFAULT '{}'::jsonb,
  
  -- Risk Analysis
  computed_risk_level TEXT,
  risk_factors TEXT[],
  protective_factors TEXT[],
  
  -- Personalization Data
  communication_adaptations JSONB DEFAULT '{}'::jsonb,
  intervention_priorities TEXT[],
  estimated_therapy_duration INTEGER, -- weeks
  
  -- Analysis Metadata
  analysis_version TEXT NOT NULL DEFAULT '1.0',
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 1),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to all tables
ALTER TABLE public.user_intake_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trauma_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_therapy_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_therapy_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_intake_data
CREATE POLICY "Users can view their own intake data" 
  ON public.user_intake_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intake data" 
  ON public.user_intake_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intake data" 
  ON public.user_intake_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for mental_health_assessments
CREATE POLICY "Users can view their own assessments" 
  ON public.mental_health_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
  ON public.mental_health_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for risk_assessments
CREATE POLICY "Users can view their own risk assessments" 
  ON public.risk_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own risk assessments" 
  ON public.risk_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for trauma_history
CREATE POLICY "Users can view their own trauma history" 
  ON public.trauma_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trauma history" 
  ON public.trauma_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trauma history" 
  ON public.trauma_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for enhanced_therapy_preferences
CREATE POLICY "Users can view their own therapy preferences" 
  ON public.enhanced_therapy_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own therapy preferences" 
  ON public.enhanced_therapy_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy preferences" 
  ON public.enhanced_therapy_preferences 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for ai_therapy_analysis
CREATE POLICY "Users can view their own AI analysis" 
  ON public.ai_therapy_analysis 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI analysis" 
  ON public.ai_therapy_analysis 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI analysis" 
  ON public.ai_therapy_analysis 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create update triggers for timestamp maintenance
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_intake_data_updated_at 
  BEFORE UPDATE ON public.user_intake_data 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_trauma_history_updated_at 
  BEFORE UPDATE ON public.trauma_history 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_enhanced_therapy_preferences_updated_at 
  BEFORE UPDATE ON public.enhanced_therapy_preferences 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_ai_therapy_analysis_updated_at 
  BEFORE UPDATE ON public.ai_therapy_analysis 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
