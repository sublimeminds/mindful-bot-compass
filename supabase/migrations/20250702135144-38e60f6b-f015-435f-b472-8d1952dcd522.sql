-- Create analytics events table for tracking user interactions
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID,
  event_type TEXT NOT NULL, -- 'page_view', 'session_start', 'goal_created', etc.
  event_category TEXT NOT NULL, -- 'engagement', 'therapy', 'goal', 'assessment'
  event_data JSONB DEFAULT '{}',
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user behavior analytics table
CREATE TABLE public.user_behavior_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  sessions_count INTEGER DEFAULT 0,
  total_session_minutes INTEGER DEFAULT 0,
  goals_created INTEGER DEFAULT 0,
  goals_completed INTEGER DEFAULT 0,
  assessments_taken INTEGER DEFAULT 0,
  mood_entries INTEGER DEFAULT 0,
  average_mood NUMERIC(3,1),
  engagement_score NUMERIC(3,2) DEFAULT 0,
  retention_score NUMERIC(3,2) DEFAULT 0,
  feature_usage JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create platform analytics table for business intelligence
CREATE TABLE public.platform_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_signups INTEGER DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  average_session_duration NUMERIC(5,2) DEFAULT 0,
  total_assessments INTEGER DEFAULT 0,
  crisis_interventions INTEGER DEFAULT 0,
  subscription_conversions INTEGER DEFAULT 0,
  churn_rate NUMERIC(5,4) DEFAULT 0,
  revenue_metrics JSONB DEFAULT '{}',
  feature_adoption JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Create real-time metrics table
CREATE TABLE public.real_time_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL, -- 'active_users', 'response_time', 'error_rate'
  metric_value NUMERIC NOT NULL,
  metric_metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create custom reports table
CREATE TABLE public.custom_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_name TEXT NOT NULL,
  report_config JSONB NOT NULL DEFAULT '{}',
  report_type TEXT NOT NULL, -- 'user_progress', 'clinical_outcomes', 'engagement'
  schedule_frequency TEXT, -- 'daily', 'weekly', 'monthly'
  is_active BOOLEAN DEFAULT true,
  last_generated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create performance monitoring table
CREATE TABLE public.performance_monitoring (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  endpoint TEXT,
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER,
  error_message TEXT,
  user_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_behavior_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.real_time_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_monitoring ENABLE ROW LEVEL SECURITY;

-- RLS policies for analytics events
CREATE POLICY "Users can create their own analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own analytics events"
ON public.analytics_events
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policies for user behavior analytics
CREATE POLICY "Users can view their own behavior analytics"
ON public.user_behavior_analytics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage behavior analytics"
ON public.user_behavior_analytics
FOR ALL
USING (true);

-- RLS policies for platform analytics (admin only)
CREATE POLICY "Admins can view platform analytics"
ON public.platform_analytics
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "System can manage platform analytics"
ON public.platform_analytics
FOR ALL
USING (true);

-- RLS policies for real-time metrics (admin only)
CREATE POLICY "Admins can view real-time metrics"
ON public.real_time_metrics
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "System can create real-time metrics"
ON public.real_time_metrics
FOR INSERT
WITH CHECK (true);

-- RLS policies for custom reports
CREATE POLICY "Users can manage their own reports"
ON public.custom_reports
FOR ALL
USING (auth.uid() = user_id);

-- RLS policies for performance monitoring (admin only)
CREATE POLICY "Admins can view performance monitoring"
ON public.performance_monitoring
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "System can create performance monitoring data"
ON public.performance_monitoring
FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_type_category ON public.analytics_events(event_type, event_category);

CREATE INDEX idx_user_behavior_analytics_user_date ON public.user_behavior_analytics(user_id, date DESC);
CREATE INDEX idx_user_behavior_analytics_date ON public.user_behavior_analytics(date DESC);

CREATE INDEX idx_platform_analytics_date ON public.platform_analytics(date DESC);

CREATE INDEX idx_real_time_metrics_type_timestamp ON public.real_time_metrics(metric_type, timestamp DESC);
CREATE INDEX idx_real_time_metrics_timestamp ON public.real_time_metrics(timestamp DESC);

CREATE INDEX idx_performance_monitoring_service_timestamp ON public.performance_monitoring(service_name, timestamp DESC);
CREATE INDEX idx_performance_monitoring_timestamp ON public.performance_monitoring(timestamp DESC);

-- Create function to aggregate daily analytics
CREATE OR REPLACE FUNCTION aggregate_daily_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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

  -- Aggregate platform analytics for yesterday
  INSERT INTO public.platform_analytics (
    date,
    total_users,
    active_users,
    new_signups,
    total_sessions,
    average_session_duration,
    total_assessments,
    crisis_interventions
  )
  SELECT 
    CURRENT_DATE - INTERVAL '1 day',
    (SELECT COUNT(*) FROM auth.users)::INTEGER,
    (SELECT COUNT(DISTINCT user_id) FROM public.therapy_sessions 
     WHERE start_time::date = CURRENT_DATE - INTERVAL '1 day')::INTEGER,
    (SELECT COUNT(*) FROM auth.users 
     WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day')::INTEGER,
    (SELECT COUNT(*) FROM public.therapy_sessions 
     WHERE start_time::date = CURRENT_DATE - INTERVAL '1 day')::INTEGER,
    (SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (end_time - start_time))/60), 0) 
     FROM public.therapy_sessions 
     WHERE start_time::date = CURRENT_DATE - INTERVAL '1 day' AND end_time IS NOT NULL)::NUMERIC(5,2),
    (SELECT COUNT(*) FROM public.clinical_assessments 
     WHERE administered_at::date = CURRENT_DATE - INTERVAL '1 day')::INTEGER,
    (SELECT COUNT(*) FROM public.crisis_interventions 
     WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day')::INTEGER
  ON CONFLICT (date) DO UPDATE SET
    total_users = EXCLUDED.total_users,
    active_users = EXCLUDED.active_users,
    new_signups = EXCLUDED.new_signups,
    total_sessions = EXCLUDED.total_sessions,
    average_session_duration = EXCLUDED.average_session_duration,
    total_assessments = EXCLUDED.total_assessments,
    crisis_interventions = EXCLUDED.crisis_interventions;
END;
$$;