-- Create therapist assessments table to store user assessment responses
CREATE TABLE public.therapist_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_responses JSONB NOT NULL DEFAULT '{}',
  calculated_matches JSONB NOT NULL DEFAULT '{}',
  assessment_version TEXT NOT NULL DEFAULT '1.0',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapist favorites table for bookmark functionality
CREATE TABLE public.therapist_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notes TEXT,
  UNIQUE(user_id, therapist_id)
);

-- Create therapist selections table to track user choices
CREATE TABLE public.therapist_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id UUID NOT NULL,
  assessment_id UUID REFERENCES public.therapist_assessments(id),
  selection_reason TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  selected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapist_assessments
CREATE POLICY "Users can create their own assessments" 
ON public.therapist_assessments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own assessments" 
ON public.therapist_assessments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
ON public.therapist_assessments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for therapist_favorites
CREATE POLICY "Users can manage their own favorites" 
ON public.therapist_favorites 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for therapist_selections
CREATE POLICY "Users can create their own selections" 
ON public.therapist_selections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own selections" 
ON public.therapist_selections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own selections" 
ON public.therapist_selections 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_therapist_assessments_updated_at
  BEFORE UPDATE ON public.therapist_assessments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();