-- Create missing tables for comprehensive therapy platform (fixed version)

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

-- Enable RLS on new tables
ALTER TABLE therapy_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_insights ENABLE ROW LEVEL SECURITY;

-- RLS policies for therapy_sessions
DROP POLICY IF EXISTS "Users can manage their own therapy sessions" ON therapy_sessions;
CREATE POLICY "Users can manage their own therapy sessions" ON therapy_sessions
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for goals
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
CREATE POLICY "Users can manage their own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for mood_entries
DROP POLICY IF EXISTS "Users can manage their own mood entries" ON mood_entries;
CREATE POLICY "Users can manage their own mood entries" ON mood_entries
  FOR ALL USING (auth.uid() = user_id);

-- RLS policies for session_insights
DROP POLICY IF EXISTS "Users can view their own session insights" ON session_insights;
CREATE POLICY "Users can view their own session insights" ON session_insights
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can create session insights" ON session_insights;
CREATE POLICY "System can create session insights" ON session_insights
  FOR INSERT WITH CHECK (true);

-- Triggers for updated_at columns
DROP TRIGGER IF EXISTS update_therapy_sessions_updated_at ON therapy_sessions;
CREATE TRIGGER update_therapy_sessions_updated_at
  BEFORE UPDATE ON therapy_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_goals_updated_at ON goals;
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_mood_entries_updated_at ON mood_entries;
CREATE TRIGGER update_mood_entries_updated_at
  BEFORE UPDATE ON mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();