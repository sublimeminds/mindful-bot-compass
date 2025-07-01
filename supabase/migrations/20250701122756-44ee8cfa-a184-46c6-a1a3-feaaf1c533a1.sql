
-- Create user_stats table to track user statistics
CREATE TABLE public.user_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  average_mood DECIMAL(3,1) DEFAULT 0.0,
  last_session_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_stats
CREATE POLICY "Users can view their own stats" ON public.user_stats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own stats" ON public.user_stats
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to update user stats after session completion (using existing therapy_sessions table)
CREATE OR REPLACE FUNCTION update_user_stats_after_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user stats after session completion
  INSERT INTO public.user_stats (user_id, total_sessions, total_minutes, current_streak, longest_streak, last_session_date, updated_at)
  VALUES (
    NEW.user_id,
    1,
    COALESCE(EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60, 0)::INTEGER,
    1,
    1,
    CURRENT_DATE,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_stats.total_sessions + 1,
    total_minutes = user_stats.total_minutes + COALESCE(EXTRACT(EPOCH FROM (NEW.end_time - NEW.start_time))/60, 0)::INTEGER,
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
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating stats after session completion (using existing therapy_sessions table)
CREATE TRIGGER trigger_update_user_stats_after_session
  AFTER UPDATE ON public.therapy_sessions
  FOR EACH ROW
  WHEN (NEW.end_time IS NOT NULL AND OLD.end_time IS NULL)
  EXECUTE FUNCTION update_user_stats_after_session();

-- Create function to update average mood in user_stats (using existing mood_entries table)
CREATE OR REPLACE FUNCTION update_user_mood_average()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user stats with mood average
  INSERT INTO public.user_stats (user_id, average_mood, updated_at)
  VALUES (
    NEW.user_id,
    (SELECT AVG(overall)::DECIMAL(3,1) FROM public.mood_entries WHERE user_id = NEW.user_id),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    average_mood = (SELECT AVG(overall)::DECIMAL(3,1) FROM public.mood_entries WHERE user_id = NEW.user_id),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating mood average (using existing mood_entries table)
CREATE TRIGGER trigger_update_user_mood_average
  AFTER INSERT OR UPDATE ON public.mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_mood_average();
