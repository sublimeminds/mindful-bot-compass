-- Create comprehensive cost tracking and usage monitoring tables

-- Enhanced AI usage tracking with cost calculation
CREATE TABLE IF NOT EXISTS public.ai_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_id TEXT,
  model_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  task_type TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  cost_per_token DECIMAL(10,8) NOT NULL,
  total_cost DECIMAL(10,6) NOT NULL,
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  subscription_tier TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Cost forecasting table
CREATE TABLE IF NOT EXISTS public.cost_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  forecast_date DATE NOT NULL,
  forecast_period TEXT NOT NULL, -- 'daily', 'weekly', 'monthly'
  predicted_usage INTEGER NOT NULL,
  predicted_cost DECIMAL(10,6) NOT NULL,
  confidence_score DECIMAL(3,2) NOT NULL,
  subscription_tier TEXT NOT NULL,
  model_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage alerts configuration
CREATE TABLE IF NOT EXISTS public.usage_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  alert_type TEXT NOT NULL, -- 'usage_threshold', 'cost_threshold', 'anomaly_detection'
  threshold_value DECIMAL(10,6) NOT NULL,
  threshold_type TEXT NOT NULL, -- 'percentage', 'absolute', 'tokens', 'cost'
  is_active BOOLEAN DEFAULT true,
  notification_channels TEXT[] DEFAULT ARRAY['email'],
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Model performance tracking
CREATE TABLE IF NOT EXISTS public.model_performance_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  date DATE NOT NULL,
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  avg_response_time_ms DECIMAL(8,2) DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10,6) DEFAULT 0,
  quality_score DECIMAL(3,2) DEFAULT 0,
  user_satisfaction_score DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(model_id, date)
);

-- Cost optimization recommendations
CREATE TABLE IF NOT EXISTS public.cost_optimization_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  recommendation_type TEXT NOT NULL, -- 'model_downgrade', 'usage_pattern', 'plan_upgrade'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  potential_savings DECIMAL(10,6),
  confidence_score DECIMAL(3,2) NOT NULL,
  priority INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  acted_upon_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_user_timestamp ON public.ai_usage_tracking(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_model_timestamp ON public.ai_usage_tracking(model_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_tracking_subscription_tier ON public.ai_usage_tracking(subscription_tier, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cost_forecasts_user_date ON public.cost_forecasts(user_id, forecast_date DESC);
CREATE INDEX IF NOT EXISTS idx_model_performance_tracking_date ON public.model_performance_tracking(date DESC);
CREATE INDEX IF NOT EXISTS idx_usage_alerts_user_active ON public.usage_alerts(user_id, is_active);

-- Enable Row Level Security
ALTER TABLE public.ai_usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_performance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_optimization_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_usage_tracking
CREATE POLICY "Users can view their own usage tracking" ON public.ai_usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage tracking" ON public.ai_usage_tracking
  FOR INSERT WITH CHECK (true);

-- RLS Policies for cost_forecasts
CREATE POLICY "Users can view their own cost forecasts" ON public.cost_forecasts
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can manage cost forecasts" ON public.cost_forecasts
  FOR ALL USING (true);

-- RLS Policies for usage_alerts
CREATE POLICY "Users can manage their own usage alerts" ON public.usage_alerts
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for model_performance_tracking
CREATE POLICY "Admins can view model performance" ON public.model_performance_tracking
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can manage model performance" ON public.model_performance_tracking
  FOR ALL USING (true);

-- RLS Policies for cost_optimization_recommendations
CREATE POLICY "Users can view their own optimization recommendations" ON public.cost_optimization_recommendations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can manage optimization recommendations" ON public.cost_optimization_recommendations
  FOR ALL USING (true);

-- Function to calculate daily usage and cost
CREATE OR REPLACE FUNCTION public.calculate_daily_usage_cost(user_id_param UUID, date_param DATE)
RETURNS TABLE(
  total_requests INTEGER,
  total_tokens INTEGER,
  total_cost DECIMAL,
  avg_response_time DECIMAL,
  model_breakdown JSONB
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_requests,
    SUM(aut.total_tokens)::INTEGER as total_tokens,
    SUM(aut.total_cost) as total_cost,
    AVG(aut.response_time_ms) as avg_response_time,
    jsonb_object_agg(
      aut.model_id, 
      jsonb_build_object(
        'requests', COUNT(*),
        'tokens', SUM(aut.total_tokens),
        'cost', SUM(aut.total_cost)
      )
    ) as model_breakdown
  FROM public.ai_usage_tracking aut
  WHERE aut.user_id = user_id_param 
    AND DATE(aut.timestamp) = date_param;
END;
$$;

-- Function to detect usage anomalies
CREATE OR REPLACE FUNCTION public.detect_usage_anomalies(user_id_param UUID, days_lookback INTEGER DEFAULT 7)
RETURNS TABLE(
  anomaly_type TEXT,
  anomaly_score DECIMAL,
  description TEXT,
  date DATE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  avg_daily_usage DECIMAL;
  current_usage DECIMAL;
  threshold_multiplier DECIMAL := 2.5;
BEGIN
  -- Calculate average daily usage over lookback period
  SELECT AVG(daily_cost) INTO avg_daily_usage
  FROM (
    SELECT DATE(timestamp) as day, SUM(total_cost) as daily_cost
    FROM public.ai_usage_tracking 
    WHERE user_id = user_id_param 
      AND timestamp >= CURRENT_DATE - INTERVAL '%s days' % days_lookback
    GROUP BY DATE(timestamp)
  ) daily_costs;

  -- Check recent usage for anomalies
  FOR i IN 0..2 LOOP
    SELECT SUM(total_cost) INTO current_usage
    FROM public.ai_usage_tracking
    WHERE user_id = user_id_param 
      AND DATE(timestamp) = CURRENT_DATE - i;
    
    IF current_usage > (avg_daily_usage * threshold_multiplier) THEN
      RETURN QUERY SELECT 
        'high_usage'::TEXT,
        (current_usage / avg_daily_usage)::DECIMAL,
        format('Usage %.1fx higher than average', current_usage / avg_daily_usage),
        (CURRENT_DATE - i)::DATE;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$;