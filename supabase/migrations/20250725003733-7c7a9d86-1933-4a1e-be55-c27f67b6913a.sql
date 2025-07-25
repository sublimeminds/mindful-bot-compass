-- Continue fixing remaining database functions with search_path security
-- Addressing the remaining 60+ function security warnings

-- Fix all remaining trigger functions
CREATE OR REPLACE FUNCTION public.update_global_translation_memory_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_footer_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_stats_after_session()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.update_user_mood_average()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
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
$function$;

-- Fix analytics and goal functions
CREATE OR REPLACE FUNCTION public.update_goal_streak(goal_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
    goal_record RECORD;
    today DATE;
    yesterday DATE;
BEGIN
    today := CURRENT_DATE;
    yesterday := today - INTERVAL '1 day';
    
    -- Get goal info
    SELECT * INTO goal_record FROM public.goals WHERE id = goal_id_param;
    
    IF goal_record.last_progress_date = today THEN
        -- Already updated today, no change
        RETURN;
    ELSIF goal_record.last_progress_date = yesterday THEN
        -- Continuous streak
        UPDATE public.goals 
        SET 
            streak_count = streak_count + 1,
            best_streak = GREATEST(best_streak, streak_count + 1),
            last_progress_date = today
        WHERE id = goal_id_param;
    ELSE
        -- Streak broken or first time
        UPDATE public.goals 
        SET 
            streak_count = 1,
            best_streak = GREATEST(best_streak, 1),
            last_progress_date = today
        WHERE id = goal_id_param;
    END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.aggregate_daily_analytics()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Aggregate user behavior analytics for yesterday
  INSERT INTO public.user_behavior_analytics (
    user_id, 
    date, 
    sessions_count,
    total_session_minutes,
    goals_created,
    goals_completed,
    assessments_taken,
    mood_entries,
    average_mood,
    engagement_score
  )
  SELECT 
    ts.user_id,
    CURRENT_DATE - INTERVAL '1 day',
    COUNT(ts.id)::INTEGER as sessions_count,
    COALESCE(SUM(EXTRACT(EPOCH FROM (ts.end_time - ts.start_time))/60), 0)::INTEGER as total_session_minutes,
    COALESCE(goal_stats.goals_created, 0),
    COALESCE(goal_stats.goals_completed, 0),
    COALESCE(assessment_stats.assessments_taken, 0),
    COALESCE(mood_stats.mood_entries, 0),
    COALESCE(mood_stats.average_mood, 0),
    CASE 
      WHEN COUNT(ts.id) > 0 THEN LEAST(1.0, COUNT(ts.id) * 0.2)
      ELSE 0 
    END as engagement_score
  FROM public.therapy_sessions ts
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day') as goals_created,
      COUNT(*) FILTER (WHERE status = 'completed' AND updated_at::date = CURRENT_DATE - INTERVAL '1 day') as goals_completed
    FROM public.goals
    WHERE created_at::date >= CURRENT_DATE - INTERVAL '1 day'
    GROUP BY user_id
  ) goal_stats ON ts.user_id = goal_stats.user_id
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as assessments_taken
    FROM public.clinical_assessments
    WHERE administered_at::date = CURRENT_DATE - INTERVAL '1 day'
    GROUP BY user_id
  ) assessment_stats ON ts.user_id = assessment_stats.user_id
  LEFT JOIN (
    SELECT 
      user_id,
      COUNT(*) as mood_entries,
      AVG(overall) as average_mood
    FROM public.mood_entries
    WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day'
    GROUP BY user_id
  ) mood_stats ON ts.user_id = mood_stats.user_id
  WHERE ts.start_time::date = CURRENT_DATE - INTERVAL '1 day'
  GROUP BY ts.user_id, goal_stats.goals_created, goal_stats.goals_completed, 
           assessment_stats.assessments_taken, mood_stats.mood_entries, mood_stats.average_mood
  ON CONFLICT (user_id, date) DO UPDATE SET
    sessions_count = EXCLUDED.sessions_count,
    total_session_minutes = EXCLUDED.total_session_minutes,
    goals_created = EXCLUDED.goals_created,
    goals_completed = EXCLUDED.goals_completed,
    assessments_taken = EXCLUDED.assessments_taken,
    mood_entries = EXCLUDED.mood_entries,
    average_mood = EXCLUDED.average_mood,
    engagement_score = EXCLUDED.engagement_score,
    updated_at = now();
END;
$function$;

-- Fix community and social functions
CREATE OR REPLACE FUNCTION public.increment_post_likes(post_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE community_posts SET like_count = like_count + 1 WHERE id = post_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_post_likes(post_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE community_posts SET like_count = GREATEST(0, like_count - 1) WHERE id = post_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_post_comments(post_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE community_posts SET comment_count = comment_count + 1 WHERE id = post_id;
END;
$function$;