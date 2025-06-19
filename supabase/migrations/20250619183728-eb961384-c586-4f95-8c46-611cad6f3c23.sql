
-- Create tables for personalization and emotional intelligence features

-- Table for storing personalization profiles
CREATE TABLE public.personalization_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  learning_style TEXT,
  therapy_preferences JSONB DEFAULT '{}',
  communication_style TEXT,
  motivation_factors TEXT[] DEFAULT '{}',
  avoidance_triggers TEXT[] DEFAULT '{}',
  progress_patterns JSONB DEFAULT '{}',
  adaptive_rules JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for storing emotional states
CREATE TABLE public.emotional_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  primary_emotion TEXT NOT NULL,
  secondary_emotion TEXT,
  intensity NUMERIC NOT NULL DEFAULT 0.5,
  valence NUMERIC NOT NULL DEFAULT 0,
  arousal NUMERIC NOT NULL DEFAULT 0.5,
  confidence NUMERIC NOT NULL DEFAULT 0.8,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for storing user progress data
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  progress_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for personalization_profiles
ALTER TABLE public.personalization_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own personalization profile" 
  ON public.personalization_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own personalization profile" 
  ON public.personalization_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personalization profile" 
  ON public.personalization_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for emotional_states
ALTER TABLE public.emotional_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own emotional states" 
  ON public.emotional_states 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emotional states" 
  ON public.emotional_states 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress" 
  ON public.user_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own progress" 
  ON public.user_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
  ON public.user_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_personalization_profiles_updated_at
  BEFORE UPDATE ON public.personalization_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
