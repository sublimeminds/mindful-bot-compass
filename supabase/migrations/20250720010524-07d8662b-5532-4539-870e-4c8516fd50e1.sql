-- Create conversation memory table
CREATE TABLE IF NOT EXISTS public.conversation_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT,
  memory_type TEXT NOT NULL CHECK (memory_type IN ('personal_detail', 'concern', 'goal', 'milestone', 'preference', 'relationship', 'trigger', 'strength')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  emotional_context JSONB DEFAULT '{}',
  importance_score DECIMAL(3,2) DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_referenced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create mood pulse checks table
CREATE TABLE IF NOT EXISTS public.mood_pulse_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN ('daily', 'weekly', 'triggered', 'crisis_followup')),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  emotional_state JSONB DEFAULT '{}',
  context_notes TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create proactive care triggers table
CREATE TABLE IF NOT EXISTS public.proactive_care_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('anniversary', 'seasonal', 'mood_pattern', 'milestone', 'inactivity', 'crisis_followup')),
  trigger_condition JSONB DEFAULT '{}',
  care_action TEXT NOT NULL,
  message_template TEXT NOT NULL,
  trigger_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contextual awareness table
CREATE TABLE IF NOT EXISTS public.contextual_awareness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT,
  awareness_type TEXT NOT NULL CHECK (awareness_type IN ('emotional', 'behavioral', 'progress', 'crisis', 'breakthrough')),
  context_data JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create therapeutic relationship table
CREATE TABLE IF NOT EXISTS public.therapeutic_relationship (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  relationship_stage TEXT DEFAULT 'initial' CHECK (relationship_stage IN ('initial', 'building', 'working', 'maintenance', 'termination')),
  rapport_score DECIMAL(3,2) DEFAULT 0.5,
  trust_level DECIMAL(3,2) DEFAULT 0.5,
  communication_preferences JSONB DEFAULT '{}',
  therapeutic_goals JSONB DEFAULT '{}',
  session_count INTEGER DEFAULT 0,
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create personality interactions table
CREATE TABLE IF NOT EXISTS public.personality_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('typing_pattern', 'emotional_reaction', 'validation_response')),
  interaction_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create session continuity table
CREATE TABLE IF NOT EXISTS public.session_continuity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  previous_session_id TEXT,
  transition_context JSONB DEFAULT '{}',
  emotional_state_carry_over JSONB DEFAULT '{}',
  unresolved_topics JSONB DEFAULT '{}',
  follow_up_needed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create enhanced crisis support table
CREATE TABLE IF NOT EXISTS public.enhanced_crisis_support (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'moderate', 'high', 'critical')),
  risk_factors JSONB DEFAULT '{}',
  intervention_actions JSONB DEFAULT '{}',
  professional_contacted BOOLEAN DEFAULT false,
  emergency_services_contacted BOOLEAN DEFAULT false,
  follow_up_scheduled BOOLEAN DEFAULT false,
  resolution_status TEXT DEFAULT 'active' CHECK (resolution_status IN ('active', 'monitoring', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_pulse_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proactive_care_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contextual_awareness ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personality_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_continuity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_crisis_support ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Conversation memory policies
CREATE POLICY "Users can manage their own memories" ON public.conversation_memory
  FOR ALL USING (auth.uid() = user_id);

-- Mood pulse checks policies
CREATE POLICY "Users can manage their own mood checks" ON public.mood_pulse_checks
  FOR ALL USING (auth.uid() = user_id);

-- Proactive care triggers policies
CREATE POLICY "Users can view their own triggers" ON public.proactive_care_triggers
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage triggers" ON public.proactive_care_triggers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update triggers" ON public.proactive_care_triggers
  FOR UPDATE USING (true);

-- Contextual awareness policies
CREATE POLICY "Users can view their own context" ON public.contextual_awareness
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create context" ON public.contextual_awareness
  FOR INSERT WITH CHECK (true);

-- Therapeutic relationship policies
CREATE POLICY "Users can view their relationships" ON public.therapeutic_relationship
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage relationships" ON public.therapeutic_relationship
  FOR ALL USING (true);

-- Personality interactions policies
CREATE POLICY "Anyone can view personality interactions" ON public.personality_interactions
  FOR SELECT USING (is_active = true);

-- Session continuity policies
CREATE POLICY "Users can view their session continuity" ON public.session_continuity
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage session continuity" ON public.session_continuity
  FOR ALL USING (true);

-- Enhanced crisis support policies
CREATE POLICY "Users can view their crisis support" ON public.enhanced_crisis_support
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage crisis support" ON public.enhanced_crisis_support
  FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_memory_user_id ON public.conversation_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_memory_type ON public.conversation_memory(memory_type);
CREATE INDEX IF NOT EXISTS idx_mood_pulse_checks_user_id ON public.mood_pulse_checks(user_id);
CREATE INDEX IF NOT EXISTS idx_proactive_care_triggers_user_id ON public.proactive_care_triggers(user_id);
CREATE INDEX IF NOT EXISTS idx_contextual_awareness_user_id ON public.contextual_awareness(user_id);
CREATE INDEX IF NOT EXISTS idx_therapeutic_relationship_user_id ON public.therapeutic_relationship(user_id);
CREATE INDEX IF NOT EXISTS idx_personality_interactions_therapist_id ON public.personality_interactions(therapist_id);
CREATE INDEX IF NOT EXISTS idx_session_continuity_user_id ON public.session_continuity(user_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_crisis_support_user_id ON public.enhanced_crisis_support(user_id);