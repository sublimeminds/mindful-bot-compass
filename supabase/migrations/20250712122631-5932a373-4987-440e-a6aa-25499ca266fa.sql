-- Create therapist_assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.therapist_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_data JSONB NOT NULL DEFAULT '{}',
  responses JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapist_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own assessments" 
ON public.therapist_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessments" 
ON public.therapist_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
ON public.therapist_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create therapist_selections table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.therapist_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  assessment_id UUID REFERENCES public.therapist_assessments(id) ON DELETE SET NULL,
  selection_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  selected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapist_selections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own selections" 
ON public.therapist_selections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own selections" 
ON public.therapist_selections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own selections" 
ON public.therapist_selections 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_therapist_assessments_updated_at
  BEFORE UPDATE ON public.therapist_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();