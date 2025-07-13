-- Create session transcripts table (if not exists)
CREATE TABLE IF NOT EXISTS public.session_transcripts (
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

-- Create session summaries table (if not exists)
CREATE TABLE IF NOT EXISTS public.session_summaries (
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

-- Create session key moments table (if not exists)
CREATE TABLE IF NOT EXISTS public.session_key_moments (
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

-- Enable RLS on new tables
DO $$ 
BEGIN
  -- Only enable RLS if tables were just created
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_transcripts') THEN
    ALTER TABLE public.session_transcripts ENABLE ROW LEVEL SECURITY;
    
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_summaries') THEN
    ALTER TABLE public.session_summaries ENABLE ROW LEVEL SECURITY;
    
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
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'session_key_moments') THEN
    ALTER TABLE public.session_key_moments ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Users can view their own key moments" 
    ON public.session_key_moments 
    FOR SELECT 
    USING (auth.uid() = user_id);

    CREATE POLICY "System can create key moments" 
    ON public.session_key_moments 
    FOR INSERT 
    WITH CHECK (true);
  END IF;
END $$;