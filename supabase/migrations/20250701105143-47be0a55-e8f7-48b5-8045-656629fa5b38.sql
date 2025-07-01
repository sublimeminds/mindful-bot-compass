
-- Create user_sessions table for tracking therapy sessions
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'therapy',
  duration_minutes INTEGER DEFAULT 0,
  mood_before INTEGER CHECK (mood_before >= 1 AND mood_before <= 10),
  mood_after INTEGER CHECK (mood_after >= 1 AND mood_after <= 10),
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mood_entries table for mood tracking
CREATE TABLE public.mood_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_goals table for goal tracking
CREATE TABLE public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_value INTEGER DEFAULT 1,
  current_value INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_stats table for tracking streaks and overall statistics
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  average_mood DECIMAL(3,1) DEFAULT 0.0,
  last_session_date DATE,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_sessions
CREATE POLICY "Users can view their own sessions" ON public.user_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own sessions" ON public.user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own sessions" ON public.user_sessions
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own sessions" ON public.user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for mood_entries
CREATE POLICY "Users can view their own mood entries" ON public.mood_entries
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own mood entries" ON public.mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own mood entries" ON public.mood_entries
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own mood entries" ON public.mood_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_goals
CREATE POLICY "Users can view their own goals" ON public.user_goals
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own goals" ON public.user_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own goals" ON public.user_goals
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own goals" ON public.user_goals
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_stats
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update user stats after session completion
CREATE OR REPLACE FUNCTION update_user_stats_after_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user stats
  INSERT INTO public.user_stats (user_id, total_sessions, current_streak, longest_streak, last_session_date)
  VALUES (
    NEW.user_id,
    1,
    1,
    1,
    CURRENT_DATE
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_stats.total_sessions + 1,
    current_streak = CASE 
      WHEN user_stats.last_session_date = CURRENT_DATE - INTERVAL '1 day' 
        OR user_stats.last_session_date = CURRENT_DATE THEN user_stats.current_streak + 1
      ELSE 1
    END,
    longest_streak = GREATEST(
      user_stats.longest_streak,
      CASE 
        WHEN user_stats.last_session_date = CURRENT_DATE - INTERVAL '1 day' 
          OR user_stats.last_session_date = CURRENT_DATE THEN user_stats.current_streak + 1
        ELSE 1
      END
    ),
    last_session_date = CURRENT_DATE,
    last_updated = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating stats after session completion
CREATE TRIGGER trigger_update_user_stats_after_session
  AFTER INSERT OR UPDATE ON public.user_sessions
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION update_user_stats_after_session();

-- Create function to update average mood in user_stats
CREATE OR REPLACE FUNCTION update_user_mood_average()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.user_stats 
  SET average_mood = (
    SELECT AVG(mood_score)::DECIMAL(3,1) 
    FROM public.mood_entries 
    WHERE user_id = NEW.user_id
  ),
  last_updated = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating mood average
CREATE TRIGGER trigger_update_user_mood_average
  AFTER INSERT OR UPDATE ON public.mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_mood_average();

-- Create updated_at triggers
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
