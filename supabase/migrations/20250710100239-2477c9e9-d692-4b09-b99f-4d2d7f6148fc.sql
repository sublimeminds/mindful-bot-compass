-- Phase 3: Advanced Features & Integrations
-- Platform integrations for multi-channel delivery
CREATE TABLE public.platform_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform_type TEXT NOT NULL, -- 'email', 'sms', 'push', 'whatsapp', 'slack', 'discord', 'webhook'
  platform_name TEXT NOT NULL, -- 'resend', 'twilio', 'onesignal', etc.
  configuration JSONB DEFAULT '{}',
  credentials JSONB DEFAULT '{}', -- encrypted in practice
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_data JSONB DEFAULT '{}',
  rate_limits JSONB DEFAULT '{}', -- per platform rate limiting
  usage_stats JSONB DEFAULT '{}',
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform_type, platform_name)
);

-- A/B testing for notification effectiveness
CREATE TABLE public.notification_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  variant_a JSONB NOT NULL, -- notification configuration A
  variant_b JSONB NOT NULL, -- notification configuration B
  traffic_split DECIMAL DEFAULT 0.5, -- 0.0 to 1.0
  success_metric TEXT NOT NULL, -- 'click_rate', 'conversion_rate', 'engagement_score'
  target_sample_size INTEGER DEFAULT 1000,
  current_sample_size INTEGER DEFAULT 0,
  results JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed', 'archived'
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Track A/B test assignments for users
CREATE TABLE public.notification_ab_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES notification_ab_tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  variant TEXT NOT NULL, -- 'a' or 'b'
  assigned_at TIMESTAMPTZ DEFAULT now(),
  converted BOOLEAN DEFAULT false,
  conversion_data JSONB DEFAULT '{}',
  UNIQUE(test_id, user_id)
);

-- Advanced notification templates with personalization
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- 'email', 'sms', 'push', 'in_app'
  category TEXT NOT NULL, -- 'therapy', 'goal', 'crisis', 'engagement'
  subject_template TEXT, -- for email/push
  content_template TEXT NOT NULL,
  personalization_fields JSONB DEFAULT '[]', -- available merge fields
  localization JSONB DEFAULT '{}', -- translations
  styling JSONB DEFAULT '{}', -- platform-specific styling
  engagement_score DECIMAL DEFAULT 0,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User notification preferences with granular control
CREATE TABLE public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  platform_preferences JSONB DEFAULT '{}', -- which platforms to use
  timing_preferences JSONB DEFAULT '{}', -- when to send
  frequency_limits JSONB DEFAULT '{}', -- max per day/week
  do_not_disturb JSONB DEFAULT '{}', -- quiet hours
  personalization_level TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  crisis_override BOOLEAN DEFAULT true, -- allow crisis notifications during DND
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Campaign management for bulk notifications
CREATE TABLE public.notification_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL, -- 'onboarding', 'retention', 'engagement', 'educational'
  target_audience JSONB NOT NULL, -- user selection criteria
  notification_sequence JSONB NOT NULL, -- array of timed notifications
  personalization_rules JSONB DEFAULT '{}',
  scheduling JSONB NOT NULL, -- when to run the campaign
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'running', 'completed', 'paused'
  metrics JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campaign enrollment tracking
CREATE TABLE public.campaign_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES notification_campaigns(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  enrollment_data JSONB DEFAULT '{}',
  completion_status TEXT DEFAULT 'active', -- 'active', 'completed', 'opted_out', 'failed'
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  UNIQUE(campaign_id, user_id)
);

-- Enhanced analytics with segmentation
CREATE TABLE public.notification_performance_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  user_segment JSONB DEFAULT '{}', -- demographic/behavioral segments
  delivery_performance JSONB DEFAULT '{}', -- timing, success rates by platform
  engagement_metrics JSONB DEFAULT '{}', -- detailed engagement data
  conversion_data JSONB DEFAULT '{}', -- goal completions, session starts, etc.
  sentiment_analysis JSONB DEFAULT '{}', -- if user provides feedback
  cohort_data JSONB DEFAULT '{}', -- user cohort information
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- Notification automation rules
CREATE TABLE public.notification_automation_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  trigger_conditions JSONB NOT NULL, -- what triggers this rule
  target_criteria JSONB NOT NULL, -- which users to target
  notification_config JSONB NOT NULL, -- what notification to send
  frequency_limits JSONB DEFAULT '{}', -- max frequency per user
  effectiveness_threshold DECIMAL DEFAULT 0.1, -- pause if below this engagement
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Multi-channel orchestration logs
CREATE TABLE public.notification_orchestration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  orchestration_strategy TEXT NOT NULL, -- 'sequential', 'parallel', 'fallback'
  channel_sequence JSONB NOT NULL, -- order and timing of channel attempts
  delivery_attempts JSONB DEFAULT '[]', -- detailed attempt logs
  final_status TEXT NOT NULL,
  total_delivery_time_ms INTEGER,
  optimization_data JSONB DEFAULT '{}', -- learning data for future optimization
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_ab_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_orchestration_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platform_integrations
CREATE POLICY "Users can manage their own platform integrations"
  ON platform_integrations FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for notification_ab_tests
CREATE POLICY "Admins can manage A/B tests"
  ON notification_ab_tests FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can view active A/B tests"
  ON notification_ab_tests FOR SELECT 
  USING (status = 'active');

-- RLS Policies for notification_ab_assignments
CREATE POLICY "Users can view their own A/B assignments"
  ON notification_ab_assignments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage A/B assignments"
  ON notification_ab_assignments FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update A/B assignments"
  ON notification_ab_assignments FOR UPDATE 
  USING (true);

-- RLS Policies for notification_templates
CREATE POLICY "Admins can manage notification templates"
  ON notification_templates FOR ALL 
  USING (is_admin(auth.uid()));

CREATE POLICY "Users can view active templates"
  ON notification_templates FOR SELECT 
  USING (is_active = true);

-- RLS Policies for user_notification_preferences
CREATE POLICY "Users can manage their own notification preferences"
  ON user_notification_preferences FOR ALL 
  USING (auth.uid() = user_id);

-- RLS Policies for notification_campaigns
CREATE POLICY "Admins can manage notification campaigns"
  ON notification_campaigns FOR ALL 
  USING (is_admin(auth.uid()));

-- RLS Policies for campaign_enrollments
CREATE POLICY "Users can view their own campaign enrollments"
  ON campaign_enrollments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage campaign enrollments"
  ON campaign_enrollments FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update campaign enrollments"
  ON campaign_enrollments FOR UPDATE 
  USING (true);

-- RLS Policies for notification_performance_analytics
CREATE POLICY "Admins can view performance analytics"
  ON notification_performance_analytics FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "System can create performance analytics"
  ON notification_performance_analytics FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for notification_automation_rules
CREATE POLICY "Admins can manage automation rules"
  ON notification_automation_rules FOR ALL 
  USING (is_admin(auth.uid()));

-- RLS Policies for notification_orchestration_logs
CREATE POLICY "Admins can view orchestration logs"
  ON notification_orchestration_logs FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "System can create orchestration logs"
  ON notification_orchestration_logs FOR INSERT 
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_platform_integrations_user_type ON platform_integrations(user_id, platform_type);
CREATE INDEX idx_platform_integrations_active ON platform_integrations(is_active, platform_type);
CREATE INDEX idx_notification_ab_tests_status ON notification_ab_tests(status);
CREATE INDEX idx_ab_assignments_test_user ON notification_ab_assignments(test_id, user_id);
CREATE INDEX idx_notification_templates_category ON notification_templates(category, is_active);
CREATE INDEX idx_user_preferences_user_type ON user_notification_preferences(user_id, notification_type);
CREATE INDEX idx_campaigns_status ON notification_campaigns(status);
CREATE INDEX idx_campaign_enrollments_status ON campaign_enrollments(campaign_id, completion_status);
CREATE INDEX idx_performance_analytics_notification ON notification_performance_analytics(notification_id);
CREATE INDEX idx_automation_rules_active ON notification_automation_rules(is_active);
CREATE INDEX idx_orchestration_logs_notification ON notification_orchestration_logs(notification_id);

-- Triggers for updated_at
CREATE TRIGGER update_platform_integrations_updated_at
  BEFORE UPDATE ON platform_integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at
  BEFORE UPDATE ON user_notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_campaigns_updated_at
  BEFORE UPDATE ON notification_campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
  BEFORE UPDATE ON notification_automation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();