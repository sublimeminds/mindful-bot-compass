
-- Phase 1: Conversational Memory & Continuity System
CREATE TABLE conversation_memory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  memory_type text NOT NULL CHECK (memory_type IN ('personal_detail', 'concern', 'goal', 'milestone', 'preference', 'relationship', 'trigger', 'strength')),
  title text NOT NULL,
  content text NOT NULL,
  emotional_context jsonb DEFAULT '{}',
  importance_score numeric DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  last_referenced_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_conversation_memory_user_id ON conversation_memory(user_id);
CREATE INDEX idx_conversation_memory_importance ON conversation_memory(user_id, importance_score DESC);
CREATE INDEX idx_conversation_memory_type ON conversation_memory(user_id, memory_type);

-- Phase 2: Proactive Care System
CREATE TABLE proactive_care_triggers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trigger_type text NOT NULL CHECK (trigger_type IN ('anniversary', 'seasonal', 'mood_pattern', 'milestone', 'inactivity', 'crisis_followup')),
  trigger_date date,
  trigger_condition jsonb DEFAULT '{}',
  care_action text NOT NULL,
  message_template text NOT NULL,
  priority_level integer DEFAULT 5 CHECK (priority_level >= 1 AND priority_level <= 10),
  is_active boolean DEFAULT true,
  last_triggered_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

CREATE INDEX idx_proactive_care_user_triggers ON proactive_care_triggers(user_id, is_active, trigger_date);

CREATE TABLE mood_pulse_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  check_type text NOT NULL CHECK (check_type IN ('daily', 'weekly', 'situational', 'followup')),
  mood_score integer CHECK (mood_score >= 1 AND mood_score <= 10),
  emotional_state jsonb DEFAULT '{}',
  context_notes text,
  ai_followup_needed boolean DEFAULT false,
  human_escalation_needed boolean DEFAULT false,
  responded_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Phase 3: Contextual Awareness Engine
CREATE TABLE contextual_awareness (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  context_type text NOT NULL CHECK (context_type IN ('time_of_day', 'season', 'weather', 'current_events', 'life_phase', 'location')),
  context_data jsonb NOT NULL,
  adaptation_rules jsonb DEFAULT '{}',
  effectiveness_score numeric DEFAULT 0.0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Phase 4: Enhanced Micro-Interactions
CREATE TABLE personality_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id text NOT NULL,
  interaction_type text NOT NULL CHECK (interaction_type IN ('typing_pattern', 'pause_timing', 'reaction_style', 'validation_approach')),
  interaction_data jsonb NOT NULL,
  user_adaptation jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Phase 5: Advanced Therapeutic Relationship
CREATE TABLE therapeutic_relationship (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id text NOT NULL,
  trust_level integer DEFAULT 1 CHECK (trust_level >= 1 AND trust_level <= 10),
  relationship_stage text DEFAULT 'initial' CHECK (relationship_stage IN ('initial', 'building', 'established', 'deep', 'transitioning')),
  communication_style_adaptation jsonb DEFAULT '{}',
  boundary_preferences jsonb DEFAULT '{}',
  comfort_zones jsonb DEFAULT '{}',
  milestone_unlocks text[] DEFAULT '{}',
  last_interaction_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Phase 6: Crisis Support & Emotional Intelligence
CREATE TABLE crisis_support_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id text,
  crisis_level text NOT NULL CHECK (crisis_level IN ('low', 'medium', 'high', 'critical')),
  recognition_indicators jsonb DEFAULT '{}',
  ai_response_actions jsonb DEFAULT '{}',
  human_escalation_triggered boolean DEFAULT false,
  human_escalation_at timestamp with time zone,
  followup_scheduled boolean DEFAULT false,
  followup_completed_at timestamp with time zone,
  resolution_status text DEFAULT 'active' CHECK (resolution_status IN ('active', 'monitoring', 'resolved', 'escalated')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Session continuity tracking
CREATE TABLE session_continuity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  previous_session_id text,
  current_session_id text NOT NULL,
  continuity_elements jsonb DEFAULT '{}',
  callback_references text[] DEFAULT '{}',
  progress_acknowledgments text[] DEFAULT '{}',
  emotional_thread text,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE conversation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE proactive_care_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_pulse_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contextual_awareness ENABLE ROW LEVEL SECURITY;
ALTER TABLE personality_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapeutic_relationship ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_continuity ENABLE ROW LEVEL SECURITY;

-- User access policies
CREATE POLICY "Users can manage their own conversation memory" ON conversation_memory
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own proactive care triggers" ON proactive_care_triggers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage proactive care triggers" ON proactive_care_triggers
  FOR ALL USING (true);

CREATE POLICY "Users can manage their mood pulse checks" ON mood_pulse_checks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their contextual awareness" ON contextual_awareness
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage contextual awareness" ON contextual_awareness
  FOR ALL USING (true);

CREATE POLICY "Anyone can view personality interactions" ON personality_interactions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their therapeutic relationship" ON therapeutic_relationship
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their crisis support sessions" ON crisis_support_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage crisis support sessions" ON crisis_support_sessions
  FOR ALL USING (true);

CREATE POLICY "Users can view their session continuity" ON session_continuity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage session continuity" ON session_continuity
  FOR ALL USING (true);

-- Trigger functions for automatic updates
CREATE OR REPLACE FUNCTION update_conversation_memory_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_memory_updated_at
  BEFORE UPDATE ON conversation_memory
  FOR EACH ROW EXECUTE FUNCTION update_conversation_memory_updated_at();

CREATE OR REPLACE FUNCTION update_contextual_awareness_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contextual_awareness_updated_at
  BEFORE UPDATE ON contextual_awareness
  FOR EACH ROW EXECUTE FUNCTION update_contextual_awareness_updated_at();

CREATE OR REPLACE FUNCTION update_therapeutic_relationship_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER therapeutic_relationship_updated_at
  BEFORE UPDATE ON therapeutic_relationship
  FOR EACH ROW EXECUTE FUNCTION update_therapeutic_relationship_updated_at();

CREATE OR REPLACE FUNCTION update_crisis_support_sessions_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER crisis_support_sessions_updated_at
  BEFORE UPDATE ON crisis_support_sessions
  FOR EACH ROW EXECUTE FUNCTION update_crisis_support_sessions_updated_at();
