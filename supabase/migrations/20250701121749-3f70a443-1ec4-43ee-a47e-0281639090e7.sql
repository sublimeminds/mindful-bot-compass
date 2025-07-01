
-- Fix mood_entries table field names to match hook expectations
ALTER TABLE public.mood_entries 
  RENAME COLUMN mood_score TO overall;

ALTER TABLE public.mood_entries 
  RENAME COLUMN energy_level TO energy;

-- Ensure anxiety column exists (rename from anxiety_level if it exists)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mood_entries' AND column_name = 'anxiety_level') THEN
    ALTER TABLE public.mood_entries RENAME COLUMN anxiety_level TO anxiety;
  ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mood_entries' AND column_name = 'anxiety') THEN
    ALTER TABLE public.mood_entries ADD COLUMN anxiety INTEGER CHECK (anxiety >= 1 AND anxiety <= 10);
  END IF;
END $$;

-- Update user_stats table to match hook expectations
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
    (SELECT AVG(overall)::DECIMAL(3,1) FROM public.mood_entries WHERE user_id = NEW.user_id),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    average_mood = (SELECT AVG(overall)::DECIMAL(3,1) FROM public.mood_entries WHERE user_id = NEW.user_id),
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
