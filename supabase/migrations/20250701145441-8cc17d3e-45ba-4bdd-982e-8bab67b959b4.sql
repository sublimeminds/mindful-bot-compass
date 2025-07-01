-- Create conversation memories table for enhanced AI memory
CREATE TABLE public.conversation_memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID,
  emotional_context JSONB NOT NULL DEFAULT '{}',
  conversation_flow JSONB NOT NULL DEFAULT '{}',
  learnings JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create technique effectiveness tracking table
CREATE TABLE public.technique_effectiveness (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  technique TEXT NOT NULL,
  effectiveness_score NUMERIC NOT NULL,
  context JSONB DEFAULT '{}',
  tracked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversation_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technique_effectiveness ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for conversation memories
CREATE POLICY "Users can create their own conversation memories"
ON public.conversation_memories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own conversation memories"
ON public.conversation_memories
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversation memories"
ON public.conversation_memories
FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for technique effectiveness
CREATE POLICY "Users can create their own technique effectiveness data"
ON public.technique_effectiveness
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own technique effectiveness data"
ON public.technique_effectiveness
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own technique effectiveness data"
ON public.technique_effectiveness
FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_conversation_memories_user_id ON public.conversation_memories(user_id);
CREATE INDEX idx_conversation_memories_timestamp ON public.conversation_memories(timestamp DESC);
CREATE INDEX idx_technique_effectiveness_user_id ON public.technique_effectiveness(user_id);
CREATE INDEX idx_technique_effectiveness_technique ON public.technique_effectiveness(technique);
CREATE INDEX idx_technique_effectiveness_tracked_at ON public.technique_effectiveness(tracked_at DESC);