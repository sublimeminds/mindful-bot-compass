-- Phase 1: Enhanced Therapist Compatibility System

-- Create therapist assessments table to store user assessment results
CREATE TABLE IF NOT EXISTS therapist_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  recommended_therapists JSONB NOT NULL DEFAULT '[]',
  selected_therapist_id UUID NULL,
  compatibility_scores JSONB NOT NULL DEFAULT '{}',
  assessment_version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create therapy plans table for AI-generated plans
CREATE TABLE IF NOT EXISTS therapy_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goals JSONB NOT NULL DEFAULT '[]',
  current_phase TEXT DEFAULT 'Phase 1: Assessment',
  total_phases INTEGER DEFAULT 4,
  progress_percentage NUMERIC(5,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create therapy assignments table for AI-generated homework
CREATE TABLE IF NOT EXISTS therapy_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapy_plan_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assignment_type TEXT NOT NULL, -- 'homework', 'exercise', 'reflection', 'practice'
  difficulty_level TEXT DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  estimated_duration_minutes INTEGER DEFAULT 15,
  due_date TIMESTAMP WITH TIME ZONE NULL,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  completion_notes TEXT NULL,
  ai_feedback TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE therapist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapy_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapist_assessments
CREATE POLICY "Users can manage their own assessments" ON therapist_assessments
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for therapy_plans  
CREATE POLICY "Users can view their own therapy plans" ON therapy_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy plans" ON therapy_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create therapy plans" ON therapy_plans
  FOR INSERT WITH CHECK (true);

-- RLS Policies for therapy_assignments
CREATE POLICY "Users can manage their own assignments" ON therapy_assignments
  FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_therapy_plans_updated_at
  BEFORE UPDATE ON therapy_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_therapy_plans_updated_at();

CREATE TRIGGER update_therapy_assignments_updated_at
  BEFORE UPDATE ON therapy_assignments  
  FOR EACH ROW
  EXECUTE FUNCTION update_therapy_assignments_updated_at();