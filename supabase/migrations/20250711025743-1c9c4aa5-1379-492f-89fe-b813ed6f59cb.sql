-- Complete therapy platform database schema

-- Assessment matching results table
CREATE TABLE IF NOT EXISTS assessment_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  assessment_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  compatibility_score NUMERIC(3,2) NOT NULL DEFAULT 0.0,
  matching_factors JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crisis detection and alerts
CREATE TABLE IF NOT EXISTS crisis_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID,
  alert_type TEXT NOT NULL,
  severity_level TEXT NOT NULL DEFAULT 'medium',
  ai_confidence NUMERIC(3,2) NOT NULL DEFAULT 0.5,
  trigger_data JSONB DEFAULT '{}',
  escalated_to TEXT,
  resolution_status TEXT DEFAULT 'pending',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- WhatsApp integrations
CREATE TABLE IF NOT EXISTS whatsapp_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phone_number TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verification_code TEXT,
  webhook_url TEXT,
  api_token TEXT,
  preferences JSONB DEFAULT '{}',
  last_activity TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Progress milestones
CREATE TABLE IF NOT EXISTS progress_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  milestone_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value NUMERIC,
  current_value NUMERIC DEFAULT 0,
  achieved_at TIMESTAMP WITH TIME ZONE,
  points_earned INTEGER DEFAULT 0,
  celebration_shown BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced notifications with delivery tracking
CREATE TABLE IF NOT EXISTS notification_deliveries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL,
  delivery_method TEXT NOT NULL,
  platform_integration_id UUID,
  status TEXT DEFAULT 'pending',
  delivered_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  external_message_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time session state
CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_data JSONB DEFAULT '{}',
  crisis_indicators JSONB DEFAULT '{}',
  mood_tracking JSONB DEFAULT '{}'
);

-- Enable RLS on all new tables
ALTER TABLE assessment_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE crisis_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_matches
DROP POLICY IF EXISTS "Users can view their assessment matches" ON assessment_matches;
CREATE POLICY "Users can view their assessment matches" ON assessment_matches
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create assessment matches" ON assessment_matches;
CREATE POLICY "System can create assessment matches" ON assessment_matches
  FOR INSERT WITH CHECK (true);

-- RLS Policies for crisis_alerts
DROP POLICY IF EXISTS "Users can view their crisis alerts" ON crisis_alerts;
CREATE POLICY "Users can view their crisis alerts" ON crisis_alerts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create crisis alerts" ON crisis_alerts;
CREATE POLICY "System can create crisis alerts" ON crisis_alerts
  FOR INSERT WITH CHECK (true);

-- RLS Policies for whatsapp_integrations
DROP POLICY IF EXISTS "Users can manage their WhatsApp integrations" ON whatsapp_integrations;
CREATE POLICY "Users can manage their WhatsApp integrations" ON whatsapp_integrations
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for progress_milestones
DROP POLICY IF EXISTS "Users can view their progress milestones" ON progress_milestones;
CREATE POLICY "Users can view their progress milestones" ON progress_milestones
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create progress milestones" ON progress_milestones;
CREATE POLICY "System can create progress milestones" ON progress_milestones
  FOR INSERT WITH CHECK (true);

-- RLS Policies for active_sessions
DROP POLICY IF EXISTS "Users can view their active sessions" ON active_sessions;
CREATE POLICY "Users can view their active sessions" ON active_sessions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their active sessions" ON active_sessions;
CREATE POLICY "Users can create their active sessions" ON active_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their active sessions" ON active_sessions;
CREATE POLICY "Users can update their active sessions" ON active_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Crisis detection function
CREATE OR REPLACE FUNCTION detect_crisis_indicators(
  session_messages TEXT[],
  mood_data JSONB,
  user_history JSONB
) RETURNS JSONB AS $$
DECLARE
  crisis_score NUMERIC := 0.0;
  indicators TEXT[] := '{}';
  confidence NUMERIC := 0.0;
BEGIN
  -- Analyze messages for crisis keywords
  IF EXISTS (
    SELECT 1 FROM unnest(session_messages) AS msg 
    WHERE msg ILIKE ANY(ARRAY['%suicide%', '%kill myself%', '%end it all%', '%hurt myself%'])
  ) THEN
    crisis_score := crisis_score + 0.8;
    indicators := array_append(indicators, 'self_harm_language');
  END IF;
  
  -- Check mood deterioration
  IF (mood_data->>'current_mood')::NUMERIC < 3 AND 
     (mood_data->>'previous_mood')::NUMERIC - (mood_data->>'current_mood')::NUMERIC > 2 THEN
    crisis_score := crisis_score + 0.5;
    indicators := array_append(indicators, 'rapid_mood_decline');
  END IF;
  
  -- Calculate confidence based on data availability
  confidence := LEAST(1.0, array_length(session_messages, 1) * 0.1 + 0.3);
  
  RETURN jsonb_build_object(
    'crisis_score', crisis_score,
    'indicators', indicators,
    'confidence', confidence,
    'requires_escalation', crisis_score > 0.6
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Progress milestone detection function
CREATE OR REPLACE FUNCTION check_milestone_achievements(user_id_param UUID) 
RETURNS VOID AS $$
DECLARE
  user_stats RECORD;
  new_milestones TEXT[] := '{}';
BEGIN
  -- Get user statistics
  SELECT 
    total_sessions,
    current_streak,
    total_minutes,
    average_mood
  INTO user_stats
  FROM user_stats 
  WHERE user_id = user_id_param;
  
  -- Check for session milestones
  IF user_stats.total_sessions >= 10 AND NOT EXISTS (
    SELECT 1 FROM progress_milestones 
    WHERE user_id = user_id_param AND milestone_type = 'sessions_10'
  ) THEN
    INSERT INTO progress_milestones (user_id, milestone_type, title, description, target_value, current_value, achieved_at, points_earned)
    VALUES (user_id_param, 'sessions_10', '10 Sessions Complete', 'Completed your first 10 therapy sessions', 10, user_stats.total_sessions, now(), 100);
  END IF;
  
  -- Check for streak milestones
  IF user_stats.current_streak >= 7 AND NOT EXISTS (
    SELECT 1 FROM progress_milestones 
    WHERE user_id = user_id_param AND milestone_type = 'streak_7'
  ) THEN
    INSERT INTO progress_milestones (user_id, milestone_type, title, description, target_value, current_value, achieved_at, points_earned)
    VALUES (user_id_param, 'streak_7', '7-Day Streak', 'Maintained 7 consecutive days of engagement', 7, user_stats.current_streak, now(), 150);
  END IF;
  
  -- Check for mood improvement
  IF user_stats.average_mood >= 7.5 AND NOT EXISTS (
    SELECT 1 FROM progress_milestones 
    WHERE user_id = user_id_param AND milestone_type = 'mood_high'
  ) THEN
    INSERT INTO progress_milestones (user_id, milestone_type, title, description, target_value, current_value, achieved_at, points_earned)
    VALUES (user_id_param, 'mood_high', 'Positive Mindset', 'Achieved consistently positive mood ratings', 7.5, user_stats.average_mood, now(), 200);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic milestone checking
CREATE OR REPLACE FUNCTION trigger_milestone_check()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM check_milestone_achievements(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS check_milestones_on_session_update ON therapy_sessions;
CREATE TRIGGER check_milestones_on_session_update
  AFTER INSERT OR UPDATE ON therapy_sessions
  FOR EACH ROW
  EXECUTE FUNCTION trigger_milestone_check();

DROP TRIGGER IF EXISTS check_milestones_on_mood_entry ON mood_entries;  
CREATE TRIGGER check_milestones_on_mood_entry
  AFTER INSERT ON mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION trigger_milestone_check();