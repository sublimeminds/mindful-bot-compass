-- Create therapist selections table and intelligent notifications tables

-- Therapist selections table
CREATE TABLE IF NOT EXISTS therapist_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id TEXT NOT NULL,
  assessment_id UUID,
  selection_reason TEXT,
  is_active BOOLEAN DEFAULT true,
  selected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Intelligent notifications table  
CREATE TABLE IF NOT EXISTS intelligent_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session messages table
CREATE TABLE IF NOT EXISTS session_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
  content TEXT NOT NULL,
  emotion TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session analytics table
CREATE TABLE IF NOT EXISTS session_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  effectiveness_score NUMERIC(3,2) DEFAULT 0.5,
  session_rating INTEGER,
  key_breakthrough TEXT,
  techniques_effectiveness JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Goal progress tracking table
CREATE TABLE IF NOT EXISTS goal_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID NOT NULL,
  value NUMERIC NOT NULL,
  note TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE therapist_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligent_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for therapist_selections
DROP POLICY IF EXISTS "Users can manage their own therapist selections" ON therapist_selections;
CREATE POLICY "Users can manage their own therapist selections" ON therapist_selections
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for intelligent_notifications
DROP POLICY IF EXISTS "Users can view their own notifications" ON intelligent_notifications;
CREATE POLICY "Users can view their own notifications" ON intelligent_notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create notifications" ON intelligent_notifications;
CREATE POLICY "System can create notifications" ON intelligent_notifications
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their notification status" ON intelligent_notifications;
CREATE POLICY "Users can update their notification status" ON intelligent_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for session_messages
DROP POLICY IF EXISTS "Users can view their session messages" ON session_messages;
CREATE POLICY "Users can view their session messages" ON session_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM therapy_sessions ts 
    WHERE ts.id = session_messages.session_id AND ts.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "System can create session messages" ON session_messages;
CREATE POLICY "System can create session messages" ON session_messages
  FOR INSERT WITH CHECK (true);

-- RLS policies for session_analytics
DROP POLICY IF EXISTS "Users can view their session analytics" ON session_analytics;
CREATE POLICY "Users can view their session analytics" ON session_analytics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM therapy_sessions ts 
    WHERE ts.id = session_analytics.session_id AND ts.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "System can create session analytics" ON session_analytics;
CREATE POLICY "System can create session analytics" ON session_analytics
  FOR INSERT WITH CHECK (true);

-- RLS policies for goal_progress
DROP POLICY IF EXISTS "Users can view their goal progress" ON goal_progress;
CREATE POLICY "Users can view their goal progress" ON goal_progress
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM goals g 
    WHERE g.id = goal_progress.goal_id AND g.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "System can create goal progress" ON goal_progress;
CREATE POLICY "System can create goal progress" ON goal_progress
  FOR INSERT WITH CHECK (true);