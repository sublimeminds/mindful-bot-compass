-- Create missing tables for the intelligent router hub

-- Create ai_routing_decisions table
CREATE TABLE IF NOT EXISTS public.ai_routing_decisions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  session_id uuid,
  selected_model text NOT NULL,
  therapy_approach text NOT NULL,
  priority_level integer NOT NULL DEFAULT 1,
  cultural_adaptations jsonb DEFAULT '{}'::jsonb,
  reasoning text,
  response_time_ms integer,
  effectiveness_score numeric(3,2),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.ai_routing_decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their routing decisions" ON public.ai_routing_decisions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create routing decisions" ON public.ai_routing_decisions
  FOR INSERT WITH CHECK (true);

-- Create adaptive_learning_profiles table
CREATE TABLE IF NOT EXISTS public.adaptive_learning_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE,
  learning_patterns jsonb DEFAULT '{}'::jsonb,
  effectiveness_metrics jsonb DEFAULT '{}'::jsonb,
  preference_adjustments jsonb DEFAULT '{}'::jsonb,
  model_performance jsonb DEFAULT '{}'::jsonb,
  cultural_adaptations jsonb DEFAULT '{}'::jsonb,
  therapy_outcomes jsonb DEFAULT '{}'::jsonb,
  last_updated timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies for adaptive learning
ALTER TABLE public.adaptive_learning_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their learning profile" ON public.adaptive_learning_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their learning profile" ON public.adaptive_learning_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create learning profiles" ON public.adaptive_learning_profiles
  FOR INSERT WITH CHECK (true);

-- Create system_intelligence_metrics table  
CREATE TABLE IF NOT EXISTS public.system_intelligence_metrics (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  user_id uuid,
  session_id uuid,
  recorded_at timestamp with time zone DEFAULT now()
);

-- Add RLS for system metrics
ALTER TABLE public.system_intelligence_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view system metrics" ON public.system_intelligence_metrics
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can create metrics" ON public.system_intelligence_metrics
  FOR INSERT WITH CHECK (true);

-- Add risk_score to crisis_assessments if not exists
ALTER TABLE public.crisis_assessments 
ADD COLUMN IF NOT EXISTS risk_score numeric(3,2) DEFAULT 0.0;

-- Update existing crisis assessments with calculated risk scores
UPDATE public.crisis_assessments 
SET risk_score = CASE 
  WHEN severity_level = 'high' THEN 0.9
  WHEN severity_level = 'medium' THEN 0.6
  WHEN severity_level = 'low' THEN 0.3
  ELSE 0.5
END
WHERE risk_score IS NULL OR risk_score = 0.0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_routing_decisions_user_id ON public.ai_routing_decisions(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_routing_decisions_created_at ON public.ai_routing_decisions(created_at);
CREATE INDEX IF NOT EXISTS idx_adaptive_learning_profiles_user_id ON public.adaptive_learning_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_system_intelligence_metrics_type ON public.system_intelligence_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_system_intelligence_metrics_recorded_at ON public.system_intelligence_metrics(recorded_at);