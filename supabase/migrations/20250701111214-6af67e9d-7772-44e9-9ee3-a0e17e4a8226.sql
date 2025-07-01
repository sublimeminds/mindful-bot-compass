
-- First, let's update the existing mood_entries table to match what the hooks expect
ALTER TABLE public.mood_entries 
  RENAME COLUMN overall TO mood_score;

ALTER TABLE public.mood_entries 
  RENAME COLUMN energy TO energy_level;

-- Add anxiety_level column (mapping from existing anxiety)
ALTER TABLE public.mood_entries 
  ADD COLUMN anxiety_level INTEGER;

-- Copy anxiety values to anxiety_level
UPDATE public.mood_entries 
  SET anxiety_level = anxiety;

-- Add constraints for the new columns
ALTER TABLE public.mood_entries 
  ADD CONSTRAINT mood_entries_anxiety_level_check 
  CHECK (anxiety_level >= 1 AND anxiety_level <= 10);

-- Update the user_stats table to match expected fields
ALTER TABLE public.user_stats 
  RENAME COLUMN last_updated TO updated_at;

-- Fix the triggers to use correct field names
DROP TRIGGER IF EXISTS trigger_update_user_mood_average ON public.mood_entries;

CREATE OR REPLACE FUNCTION update_user_mood_average()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user stats with mood average
  INSERT INTO public.user_stats (user_id, average_mood, updated_at)
  VALUES (
    NEW.user_id,
    (SELECT AVG(mood_score)::DECIMAL(3,1) FROM public.mood_entries WHERE user_id = NEW.user_id),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    average_mood = (SELECT AVG(mood_score)::DECIMAL(3,1) FROM public.mood_entries WHERE user_id = NEW.user_id),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER trigger_update_user_mood_average
  AFTER INSERT OR UPDATE ON public.mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_user_mood_average();

-- Update the session stats trigger to use correct table structure
DROP TRIGGER IF EXISTS trigger_update_user_stats_after_session ON public.user_sessions;

CREATE OR REPLACE FUNCTION update_user_stats_after_session()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert user stats after session completion
  INSERT INTO public.user_stats (user_id, total_sessions, total_minutes, current_streak, longest_streak, last_session_date, updated_at)
  VALUES (
    NEW.user_id,
    1,
    COALESCE(NEW.duration_minutes, 0),
    1,
    1,
    CURRENT_DATE,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_sessions = user_stats.total_sessions + 1,
    total_minutes = user_stats.total_minutes + COALESCE(NEW.duration_minutes, 0),
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

-- Recreate the trigger
CREATE TRIGGER trigger_update_user_stats_after_session
  AFTER INSERT OR UPDATE ON public.user_sessions
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION update_user_stats_after_session();
