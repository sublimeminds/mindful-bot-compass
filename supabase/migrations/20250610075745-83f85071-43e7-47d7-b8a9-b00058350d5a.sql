
-- Create user_preferences table for personalization
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  communication_style TEXT DEFAULT 'supportive',
  preferred_approaches TEXT[] DEFAULT '{}',
  session_preferences JSONB DEFAULT '{}',
  emotional_patterns JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_interactions table for tracking user behavior
CREATE TABLE public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  interaction_type TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Create policies for user_interactions
CREATE POLICY "Users can view their own interactions" 
  ON public.user_interactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own interactions" 
  ON public.user_interactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
