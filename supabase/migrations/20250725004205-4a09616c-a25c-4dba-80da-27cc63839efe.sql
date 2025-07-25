-- Continue fixing more database functions and RLS issues
-- Reduced from 78 to 69 warnings, continuing with remaining functions

-- Fix more critical functions with search_path
CREATE OR REPLACE FUNCTION public.increment_event_participants(event_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE community_events SET participant_count = participant_count + 1 WHERE id = event_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrement_event_participants(event_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE community_events SET participant_count = GREATEST(0, participant_count - 1) WHERE id = event_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_milestone_celebrations(milestone_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE community_milestones SET celebration_count = celebration_count + 1 WHERE id = milestone_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_review_helpful_count(review_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  UPDATE therapist_reviews SET helpful_count = helpful_count + 1 WHERE id = review_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_two_factor_auth_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Mark sessions as terminated if inactive for 30 days
  UPDATE public.user_sessions
  SET terminated_at = now()
  WHERE terminated_at IS NULL 
    AND last_activity < now() - INTERVAL '30 days';
    
  -- Delete terminated sessions older than 90 days
  DELETE FROM public.user_sessions
  WHERE terminated_at IS NOT NULL 
    AND terminated_at < now() - INTERVAL '90 days';
END;
$function$;

CREATE OR REPLACE FUNCTION public.detect_crisis_indicators(session_messages text[], mood_data jsonb, user_history jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.check_milestone_achievements(user_id_param uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.trigger_milestone_check()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  PERFORM check_milestone_achievements(NEW.user_id);
  RETURN NEW;
END;
$function$;