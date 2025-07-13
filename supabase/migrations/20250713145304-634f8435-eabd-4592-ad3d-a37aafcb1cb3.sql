-- Create analytics and tracking tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.conversion_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  conversion_type TEXT NOT NULL, -- 'registration', 'subscription', 'trial_start', 'session_complete'
  conversion_value DECIMAL(10,2), -- monetary value if applicable
  currency TEXT DEFAULT 'USD',
  campaign_source TEXT,
  campaign_medium TEXT,
  campaign_name TEXT,
  conversion_data JSONB DEFAULT '{}'::jsonb,
  attributed_to JSONB DEFAULT '{}'::jsonb, -- original attribution data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_attribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  first_visit_source TEXT,
  first_visit_medium TEXT,
  first_visit_campaign TEXT,
  first_visit_term TEXT,
  first_visit_content TEXT,
  first_visit_referrer TEXT,
  last_visit_source TEXT,
  last_visit_medium TEXT,
  last_visit_campaign TEXT,
  registration_source TEXT,
  registration_medium TEXT,
  registration_campaign TEXT,
  first_visit_at TIMESTAMP WITH TIME ZONE,
  last_visit_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.campaign_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_source TEXT NOT NULL,
  campaign_medium TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_value DECIMAL(10,2) DEFAULT 0,
  cost DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(campaign_source, campaign_medium, campaign_name, date)
);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_performance ENABLE ROW LEVEL SECURITY;

-- RLS Policies for analytics_events
CREATE POLICY "Users can view their own analytics events"
  ON public.analytics_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all analytics events"
  ON public.analytics_events FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for conversion_tracking
CREATE POLICY "Users can view their own conversions"
  ON public.conversion_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert conversions"
  ON public.conversion_tracking FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all conversions"
  ON public.conversion_tracking FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for user_attribution
CREATE POLICY "Users can view their own attribution"
  ON public.user_attribution FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage attribution"
  ON public.user_attribution FOR ALL
  WITH CHECK (true);

CREATE POLICY "Admins can view all attribution"
  ON public.user_attribution FOR ALL
  USING (is_admin(auth.uid()));

-- RLS Policies for campaign_performance
CREATE POLICY "Admins can manage campaign performance"
  ON public.campaign_performance FOR ALL
  USING (is_admin(auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_name ON public.analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_user_id ON public.conversion_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_tracking_type ON public.conversion_tracking(conversion_type);
CREATE INDEX IF NOT EXISTS idx_user_attribution_user_id ON public.user_attribution(user_id);
CREATE INDEX IF NOT EXISTS idx_campaign_performance_date ON public.campaign_performance(date);

-- Function to update attribution
CREATE OR REPLACE FUNCTION public.update_user_attribution(
  user_id_param UUID,
  utm_data JSONB,
  referrer_param TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_attribution (
    user_id,
    first_visit_source,
    first_visit_medium,
    first_visit_campaign,
    first_visit_term,
    first_visit_content,
    first_visit_referrer,
    last_visit_source,
    last_visit_medium,
    last_visit_campaign,
    first_visit_at,
    last_visit_at
  )
  VALUES (
    user_id_param,
    utm_data->>'utm_source',
    utm_data->>'utm_medium',
    utm_data->>'utm_campaign',
    utm_data->>'utm_term',
    utm_data->>'utm_content',
    referrer_param,
    utm_data->>'utm_source',
    utm_data->>'utm_medium',
    utm_data->>'utm_campaign',
    now(),
    now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    last_visit_source = utm_data->>'utm_source',
    last_visit_medium = utm_data->>'utm_medium',
    last_visit_campaign = utm_data->>'utm_campaign',
    last_visit_at = now(),
    updated_at = now();
END;
$$;