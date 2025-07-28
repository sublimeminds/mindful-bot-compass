-- Fix adaptive therapy planner edge function by ensuring it has proper API key validation and fallback
-- Add a configuration check function for the therapy planner

-- First, let's add a table to track therapy plan creation attempts and failures
CREATE TABLE IF NOT EXISTS public.therapy_plan_creation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  attempt_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed')),
  error_message TEXT,
  plan_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapy_plan_creation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own therapy plan logs"
  ON public.therapy_plan_creation_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create therapy plan logs"
  ON public.therapy_plan_creation_logs
  FOR INSERT
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_therapy_plan_logs_user_id ON public.therapy_plan_creation_logs(user_id);
CREATE INDEX idx_therapy_plan_logs_timestamp ON public.therapy_plan_creation_logs(attempt_timestamp);

-- Update the adaptive_therapy_plans table to ensure it has all needed columns
ALTER TABLE public.adaptive_therapy_plans 
ADD COLUMN IF NOT EXISTS creation_method TEXT DEFAULT 'edge_function',
ADD COLUMN IF NOT EXISTS api_used TEXT,
ADD COLUMN IF NOT EXISTS fallback_used BOOLEAN DEFAULT FALSE;