-- Create missing tables for comprehensive therapy platform

-- Therapy sessions table
CREATE TABLE IF NOT EXISTS therapy_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  therapist_id TEXT,
  session_type TEXT DEFAULT 'therapy',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  mood_before INTEGER,
  mood_after INTEGER,
  notes TEXT,
  techniques TEXT[],
  breakthrough_moments JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID PRIMARY KEY,
  total_sessions INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  average_mood DECIMAL(3,1) DEFAULT 5.0,
  last_session_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER DEFAULT 100,
  current_value INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  category TEXT DEFAULT 'general',
  priority TEXT DEFAULT 'medium',
  target_date DATE,
  streak_count INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_progress_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Mood entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  overall INTEGER NOT NULL CHECK (overall >= 1 AND overall <= 10),
  anxiety INTEGER CHECK (anxiety >= 1 AND anxiety <= 10),
  depression INTEGER CHECK (depression >= 1 AND depression <= 10),
  stress INTEGER CHECK (stress >= 1 AND stress <= 10),
  energy INTEGER CHECK (energy >= 1 AND energy <= 10),
  notes TEXT,
  tags TEXT[],
  context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Session insights table for AI-generated insights
CREATE TABLE IF NOT EXISTS session_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  user_id UUID NOT NULL,
  insight_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  priority TEXT DEFAULT 'medium',
  actionable_suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies for therapy_sessions
CREATE POLICY "Users can manage their own therapy sessions" ON therapy_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for user_stats
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create user stats" ON user_stats
  FOR INSERT WITH CHECK (true);

-- RLS policies for goals
CREATE POLICY "Users can manage their own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for mood_entries
CREATE POLICY "Users can manage their own mood entries" ON mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for session_insights
CREATE POLICY "Users can view their own session insights" ON session_insights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create session insights" ON session_insights
  FOR INSERT WITH CHECK (true);

-- Triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapy_sessions_updated_at
  BEFORE UPDATE ON therapy_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mood_entries_updated_at
  BEFORE UPDATE ON mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update user stats after session completion
CREATE OR REPLACE FUNCTION update_user_stats_after_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update when session is completed (end_time is set)
  IF NEW.end_time IS NOT NULL AND (OLD.end_time IS NULL OR OLD.end_time != NEW.end_time) THEN
    INSERT INTO user_stats (user_id, total_sessions, total_minutes, last_session_date, updated_at)
    VALUES (
      NEW.user_id,
      1,
      COALESCE(EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60, 0)::INTEGER,
      NEW.start_time::date,
      now()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      total_sessions = user_stats.total_sessions + 1,
      total_minutes = user_stats.total_minutes + COALESCE(EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60, 0)::INTEGER,
      last_session_date = NEW.start_time::date,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_stats_after_session_trigger
  AFTER UPDATE ON therapy_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_after_session();

-- Function to update user stats after mood entry
CREATE OR REPLACE FUNCTION update_user_mood_average()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id, average_mood, updated_at)
  VALUES (
    NEW.user_id,
    (SELECT AVG(overall)::DECIMAL(3,1) FROM mood_entries WHERE user_id = NEW.user_id),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    average_mood = (SELECT AVG(overall)::DECIMAL(3,1) FROM mood_entries WHERE user_id = NEW.user_id),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_user_mood_average_trigger
  AFTER INSERT OR UPDATE ON mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_mood_average();