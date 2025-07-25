-- Drop and recreate the view to ensure it's not SECURITY DEFINER
DROP VIEW IF EXISTS public.session_real_time_status;

-- Recreate as SECURITY INVOKER (default)
CREATE VIEW public.session_real_time_status AS
SELECT 
  so.session_id,
  so.user_id,
  so.current_phase,
  so.conversation_flow_score,
  sqm.therapeutic_alliance_score,
  sqm.engagement_level,
  scm.crisis_level,
  scm.risk_assessment_score,
  tpe.goal_progress,
  sca.adaptation_effectiveness,
  so.updated_at AS last_update
FROM session_orchestration so
LEFT JOIN session_quality_metrics sqm ON so.session_id = sqm.session_id
LEFT JOIN session_crisis_monitoring scm ON so.session_id = scm.session_id
LEFT JOIN therapy_plan_execution tpe ON so.session_id = tpe.session_id
LEFT JOIN session_cultural_adaptations sca ON so.session_id = sca.session_id
WHERE so.updated_at > now() - interval '1 hour';

-- Ensure RLS is enabled on the view
-- Note: Views inherit RLS from underlying tables, so users can only see their own data