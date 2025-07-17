-- Phase 1: Real-Time Session Orchestration Engine
CREATE TABLE IF NOT EXISTS public.session_orchestration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  current_phase TEXT NOT NULL,
  phase_start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expected_phase_duration INTEGER NOT NULL DEFAULT 600, -- seconds
  actual_phase_duration INTEGER,
  conversation_flow_score DECIMAL(3,2) DEFAULT 0.5,
  intervention_effectiveness DECIMAL(3,2) DEFAULT 0.5,
  emotional_state_tracking JSONB DEFAULT '{}',
  breakthrough_moments JSONB DEFAULT '[]',
  intervention_history JSONB DEFAULT '[]',
  session_extensions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 2: Intelligent Therapy Plan Integration
CREATE TABLE IF NOT EXISTS public.therapy_plan_execution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  therapy_plan_id UUID,
  session_id TEXT NOT NULL,
  current_goals TEXT[] DEFAULT '{}',
  completed_goals TEXT[] DEFAULT '{}',
  technique_sequence JSONB DEFAULT '[]',
  technique_effectiveness JSONB DEFAULT '{}',
  personalized_homework JSONB DEFAULT '{}',
  continuity_tracking JSONB DEFAULT '{}',
  goal_progress JSONB DEFAULT '{}',
  adaptation_triggers JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 3: Advanced Session Quality Metrics
CREATE TABLE IF NOT EXISTS public.session_quality_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  therapeutic_alliance_score DECIMAL(3,2) DEFAULT 0.5,
  engagement_level DECIMAL(3,2) DEFAULT 0.5,
  technique_effectiveness_scores JSONB DEFAULT '{}',
  intervention_success_rates JSONB DEFAULT '{}',
  progress_toward_goals JSONB DEFAULT '{}',
  emotional_regulation_progress DECIMAL(3,2) DEFAULT 0.5,
  session_satisfaction_predicted DECIMAL(3,2) DEFAULT 0.5,
  breakthrough_probability DECIMAL(3,2) DEFAULT 0.0,
  intervention_triggers JSONB DEFAULT '{}',
  quality_alerts JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 4: Enhanced AI Decision Making
CREATE TABLE IF NOT EXISTS public.ai_session_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  decision_point TEXT NOT NULL,
  context_analysis JSONB DEFAULT '{}',
  model_used TEXT NOT NULL,
  decision_rationale TEXT,
  technique_selected TEXT,
  predicted_outcome JSONB DEFAULT '{}',
  actual_outcome JSONB DEFAULT '{}',
  decision_effectiveness DECIMAL(3,2) DEFAULT 0.5,
  response_generation_strategy TEXT,
  cultural_adaptations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 5: Crisis Management & Safety Systems
CREATE TABLE IF NOT EXISTS public.session_crisis_monitoring (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  crisis_indicators JSONB DEFAULT '{}',
  risk_assessment_score DECIMAL(3,2) DEFAULT 0.0,
  crisis_level TEXT DEFAULT 'none', -- none, low, moderate, high, immediate
  validation_layers JSONB DEFAULT '{}',
  escalation_triggered BOOLEAN DEFAULT false,
  escalation_actions JSONB DEFAULT '{}',
  safety_plan_activated BOOLEAN DEFAULT false,
  safety_plan_details JSONB DEFAULT '{}',
  intervention_protocols JSONB DEFAULT '{}',
  monitoring_frequency INTEGER DEFAULT 300, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Phase 6: Cultural & Trauma-Informed Adaptations
CREATE TABLE IF NOT EXISTS public.session_cultural_adaptations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  cultural_profile JSONB DEFAULT '{}',
  communication_style_adaptations JSONB DEFAULT '{}',
  technique_cultural_modifications JSONB DEFAULT '{}',
  religious_spiritual_integration JSONB DEFAULT '{}',
  trauma_informed_adaptations JSONB DEFAULT '{}',
  language_cultural_considerations JSONB DEFAULT '{}',
  family_system_considerations JSONB DEFAULT '{}',
  adaptation_effectiveness DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Real-time session monitoring view
CREATE OR REPLACE VIEW public.session_real_time_status AS
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
  so.updated_at as last_update
FROM public.session_orchestration so
LEFT JOIN public.session_quality_metrics sqm ON so.session_id = sqm.session_id
LEFT JOIN public.session_crisis_monitoring scm ON so.session_id = scm.session_id
LEFT JOIN public.therapy_plan_execution tpe ON so.session_id = tpe.session_id
LEFT JOIN public.session_cultural_adaptations sca ON so.session_id = sca.session_id
WHERE so.updated_at > now() - INTERVAL '1 hour';

-- Function to calculate optimal session timing
CREATE OR REPLACE FUNCTION public.calculate_optimal_session_timing(
  p_session_id TEXT,
  p_current_phase TEXT,
  p_engagement_level DECIMAL DEFAULT 0.5,
  p_breakthrough_probability DECIMAL DEFAULT 0.0
) RETURNS JSONB AS $$
DECLARE
  base_duration INTEGER := 2700; -- 45 minutes in seconds
  phase_durations JSONB := '{"opening": 480, "assessment": 720, "intervention": 1200, "practice": 480, "closing": 120}';
  recommended_extension INTEGER := 0;
  optimal_timing JSONB;
BEGIN
  -- Calculate extension based on engagement and breakthrough probability
  IF p_engagement_level > 0.8 AND p_breakthrough_probability > 0.6 THEN
    recommended_extension := 900; -- 15 minutes
  ELSIF p_engagement_level > 0.7 AND p_breakthrough_probability > 0.4 THEN
    recommended_extension := 600; -- 10 minutes
  ELSIF p_engagement_level < 0.4 THEN
    recommended_extension := -300; -- Shorten by 5 minutes
  END IF;
  
  optimal_timing := jsonb_build_object(
    'base_duration', base_duration,
    'recommended_extension', recommended_extension,
    'total_recommended_duration', base_duration + recommended_extension,
    'phase_durations', phase_durations,
    'reasoning', CASE 
      WHEN recommended_extension > 0 THEN 'High engagement suggests productive extension'
      WHEN recommended_extension < 0 THEN 'Low engagement suggests shorter session'
      ELSE 'Standard duration appropriate'
    END
  );
  
  RETURN optimal_timing;
END;
$$ LANGUAGE plpgsql;

-- Function to select optimal therapeutic technique
CREATE OR REPLACE FUNCTION public.select_optimal_technique(
  p_user_id UUID,
  p_session_id TEXT,
  p_current_phase TEXT,
  p_emotional_state JSONB DEFAULT '{}',
  p_cultural_context JSONB DEFAULT '{}'
) RETURNS JSONB AS $$
DECLARE
  technique_effectiveness JSONB;
  cultural_preferences JSONB;
  recommended_technique JSONB;
BEGIN
  -- Get historical technique effectiveness for this user
  SELECT jsonb_object_agg(technique_selected, decision_effectiveness)
  INTO technique_effectiveness
  FROM public.ai_session_decisions
  WHERE user_id = p_user_id
  AND decision_effectiveness > 0.6
  ORDER BY created_at DESC
  LIMIT 10;
  
  -- Get cultural preferences
  SELECT cultural_profile INTO cultural_preferences
  FROM public.session_cultural_adaptations
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Select technique based on phase, effectiveness, and cultural fit
  recommended_technique := jsonb_build_object(
    'technique', CASE p_current_phase
      WHEN 'opening' THEN 'rapport_building'
      WHEN 'assessment' THEN 'reflective_questioning'
      WHEN 'intervention' THEN 'cognitive_restructuring'
      WHEN 'practice' THEN 'skill_practice'
      WHEN 'closing' THEN 'session_summary'
      ELSE 'active_listening'
    END,
    'effectiveness_score', COALESCE((technique_effectiveness->>'cognitive_restructuring')::DECIMAL, 0.5),
    'cultural_adaptations', cultural_preferences,
    'rationale', 'Selected based on phase requirements and historical effectiveness'
  );
  
  RETURN recommended_technique;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on new tables
ALTER TABLE public.session_orchestration ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_plan_execution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_session_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_crisis_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_cultural_adaptations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can access their own session orchestration data"
  ON public.session_orchestration FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own therapy plan execution data"
  ON public.therapy_plan_execution FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own session quality metrics"
  ON public.session_quality_metrics FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own AI session decisions"
  ON public.ai_session_decisions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own crisis monitoring data"
  ON public.session_crisis_monitoring FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own cultural adaptations"
  ON public.session_cultural_adaptations FOR ALL
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_session_orchestration_session_id ON public.session_orchestration(session_id);
CREATE INDEX idx_session_orchestration_user_id ON public.session_orchestration(user_id);
CREATE INDEX idx_therapy_plan_execution_session_id ON public.therapy_plan_execution(session_id);
CREATE INDEX idx_session_quality_metrics_session_id ON public.session_quality_metrics(session_id);
CREATE INDEX idx_ai_session_decisions_session_id ON public.ai_session_decisions(session_id);
CREATE INDEX idx_session_crisis_monitoring_session_id ON public.session_crisis_monitoring(session_id);
CREATE INDEX idx_session_cultural_adaptations_session_id ON public.session_cultural_adaptations(session_id);