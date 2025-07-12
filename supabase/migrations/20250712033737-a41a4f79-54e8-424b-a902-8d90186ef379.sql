-- Add missing columns to existing therapy_plans table
ALTER TABLE public.therapy_plans 
ADD COLUMN IF NOT EXISTS focus_areas TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS milestones JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS sessions_per_week INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS estimated_duration_weeks INTEGER DEFAULT 12;

-- Create scheduled_sessions table
CREATE TABLE IF NOT EXISTS public.scheduled_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  therapy_plan_id UUID REFERENCES therapy_plans(id) ON DELETE CASCADE,
  therapist_id TEXT NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'therapy',
  scheduled_for TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_pattern TEXT,
  recurrence_end_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for scheduled_sessions
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scheduled_sessions
DROP POLICY IF EXISTS "Users can manage their own sessions" ON public.scheduled_sessions;
CREATE POLICY "Users can manage their own sessions" ON public.scheduled_sessions
FOR ALL USING (auth.uid() = user_id);