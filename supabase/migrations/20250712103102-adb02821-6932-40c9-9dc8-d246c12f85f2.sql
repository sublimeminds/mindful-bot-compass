-- Create session preparations table
CREATE TABLE public.session_preparations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  preparation_data JSONB NOT NULL DEFAULT '{}',
  ai_config JSONB NOT NULL DEFAULT '{}',
  risk_assessment JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapy plan adaptations table
CREATE TABLE public.therapy_plan_adaptations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  adaptation_type TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]',
  severity_level TEXT NOT NULL DEFAULT 'medium',
  implementation_status TEXT NOT NULL DEFAULT 'pending',
  created_by TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_preparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_plan_adaptations ENABLE ROW LEVEL SECURITY;

-- Create policies for session_preparations
CREATE POLICY "Users can view their own session preparations" 
ON public.session_preparations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create session preparations" 
ON public.session_preparations 
FOR INSERT 
WITH CHECK (true);

-- Create policies for therapy_plan_adaptations
CREATE POLICY "Users can view their own therapy plan adaptations" 
ON public.therapy_plan_adaptations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create therapy plan adaptations" 
ON public.therapy_plan_adaptations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update therapy plan adaptations" 
ON public.therapy_plan_adaptations 
FOR UPDATE 
USING (true);

-- Create updated_at trigger for therapy_plan_adaptations
CREATE TRIGGER update_therapy_plan_adaptations_updated_at
BEFORE UPDATE ON public.therapy_plan_adaptations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();