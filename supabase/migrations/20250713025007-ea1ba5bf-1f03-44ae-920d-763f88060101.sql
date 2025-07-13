-- Create session transcripts table
CREATE TABLE public.session_transcripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  transcript_data JSONB NOT NULL DEFAULT '[]',
  processing_status TEXT NOT NULL DEFAULT 'pending',
  confidence_scores JSONB NOT NULL DEFAULT '{}',
  speaker_identification JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session insights table
CREATE TABLE public.session_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  ai_analysis JSONB NOT NULL DEFAULT '{}',
  emotional_tone_timeline JSONB NOT NULL DEFAULT '[]',
  key_topics JSONB NOT NULL DEFAULT '[]',
  breakthrough_indicators JSONB NOT NULL DEFAULT '[]',
  therapy_techniques_used JSONB NOT NULL DEFAULT '[]',
  progress_indicators JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session summaries table
CREATE TABLE public.session_summaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  executive_summary TEXT NOT NULL,
  key_takeaways JSONB NOT NULL DEFAULT '[]',
  action_items JSONB NOT NULL DEFAULT '[]',
  goals_addressed JSONB NOT NULL DEFAULT '[]',
  mood_correlation JSONB NOT NULL DEFAULT '{}',
  effectiveness_score NUMERIC NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create session key moments table
CREATE TABLE public.session_key_moments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  timestamp_start NUMERIC NOT NULL,
  timestamp_end NUMERIC NOT NULL,
  moment_type TEXT NOT NULL,
  importance_score NUMERIC NOT NULL DEFAULT 0.0,
  content_summary TEXT NOT NULL,
  emotional_context JSONB NOT NULL DEFAULT '{}',
  tags JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.session_transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_key_moments ENABLE ROW LEVEL SECURITY;

-- Create policies for session_transcripts
CREATE POLICY "Users can view their own transcripts" 
ON public.session_transcripts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create transcripts" 
ON public.session_transcripts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update transcripts" 
ON public.session_transcripts 
FOR UPDATE 
USING (true);

-- Create policies for session_insights
CREATE POLICY "Users can view their own insights" 
ON public.session_insights 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create insights" 
ON public.session_insights 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update insights" 
ON public.session_insights 
FOR UPDATE 
USING (true);

-- Create policies for session_summaries
CREATE POLICY "Users can view their own summaries" 
ON public.session_summaries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create summaries" 
ON public.session_summaries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update summaries" 
ON public.session_summaries 
FOR UPDATE 
USING (true);

-- Create policies for session_key_moments
CREATE POLICY "Users can view their own key moments" 
ON public.session_key_moments 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create key moments" 
ON public.session_key_moments 
FOR INSERT 
WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_session_transcripts_updated_at
BEFORE UPDATE ON public.session_transcripts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_insights_updated_at
BEFORE UPDATE ON public.session_insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_session_summaries_updated_at
BEFORE UPDATE ON public.session_summaries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();