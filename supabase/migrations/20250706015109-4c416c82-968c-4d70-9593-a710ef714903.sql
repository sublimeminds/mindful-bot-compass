-- Create therapy plans table
CREATE TABLE public.therapy_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  current_phase TEXT NOT NULL DEFAULT 'Phase 1: Assessment',
  total_phases INTEGER NOT NULL DEFAULT 4,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapy assignments table
CREATE TABLE public.therapy_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapy_plan_id UUID NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  assignment_type TEXT NOT NULL DEFAULT 'exercise',
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  completion_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plan progress tracking table
CREATE TABLE public.plan_progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapy_plan_id UUID NOT NULL,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create monthly/weekly overviews table
CREATE TABLE public.progress_overviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  overview_type TEXT NOT NULL, -- 'weekly' or 'monthly'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  summary_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  insights JSONB NOT NULL DEFAULT '[]'::jsonb,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  mood_trend NUMERIC,
  session_count INTEGER DEFAULT 0,
  goals_completed INTEGER DEFAULT 0,
  assignments_completed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_progress_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_overviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for therapy_plans
CREATE POLICY "Users can view their own therapy plans" 
ON public.therapy_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own therapy plans" 
ON public.therapy_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy plans" 
ON public.therapy_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for therapy_assignments
CREATE POLICY "Users can view their own assignments" 
ON public.therapy_assignments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assignments" 
ON public.therapy_assignments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignments" 
ON public.therapy_assignments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for plan_progress_tracking
CREATE POLICY "Users can view their own progress tracking" 
ON public.plan_progress_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress tracking" 
ON public.plan_progress_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress tracking" 
ON public.plan_progress_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for progress_overviews
CREATE POLICY "Users can view their own progress overviews" 
ON public.progress_overviews 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create progress overviews" 
ON public.progress_overviews 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own progress overviews" 
ON public.progress_overviews 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_therapy_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapy_plans_updated_at
BEFORE UPDATE ON public.therapy_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_therapy_plans_updated_at();

CREATE OR REPLACE FUNCTION public.update_therapy_assignments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapy_assignments_updated_at
BEFORE UPDATE ON public.therapy_assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_therapy_assignments_updated_at();