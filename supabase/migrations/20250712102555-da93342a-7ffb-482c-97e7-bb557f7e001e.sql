-- Create adaptive therapy plans table
CREATE TABLE public.adaptive_therapy_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  primary_approach TEXT NOT NULL,
  secondary_approach TEXT,
  techniques TEXT[] NOT NULL DEFAULT '{}',
  goals TEXT[] NOT NULL DEFAULT '{}',
  effectiveness_score NUMERIC NOT NULL DEFAULT 0.0,
  adaptations JSONB NOT NULL DEFAULT '[]',
  next_session_recommendations JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.adaptive_therapy_plans ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own therapy plans" 
ON public.adaptive_therapy_plans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own therapy plans" 
ON public.adaptive_therapy_plans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy plans" 
ON public.adaptive_therapy_plans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create therapy plans" 
ON public.adaptive_therapy_plans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update therapy plans" 
ON public.adaptive_therapy_plans 
FOR UPDATE 
USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_adaptive_therapy_plans_updated_at
BEFORE UPDATE ON public.adaptive_therapy_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();