-- Create only missing tables for the comprehensive notification system

-- Email templates table with multi-language support
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  text_content TEXT,
  variables JSONB DEFAULT '[]'::jsonb,
  category TEXT NOT NULL DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(template_key, language_code)
);

-- Newsletter campaigns table
CREATE TABLE public.newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_key TEXT NOT NULL,
  subject TEXT NOT NULL,
  send_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  target_audience JSONB DEFAULT '{}'::jsonb,
  segmentation_rules JSONB DEFAULT '{}'::jsonb,
  a_b_test_config JSONB,
  analytics_data JSONB DEFAULT '{}'::jsonb,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Campaign recipients tracking
CREATE TABLE public.campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES newsletter_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'complained')),
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounce_reason TEXT,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscription lifecycle events
CREATE TABLE public.subscription_lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  subscription_id UUID,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  triggered_notifications JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enhanced notification preferences with granular controls
CREATE TABLE public.enhanced_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT true,
  subscription_warnings BOOLEAN DEFAULT true,
  payment_notifications BOOLEAN DEFAULT true,
  newsletter_subscribed BOOLEAN DEFAULT true,
  marketing_emails BOOLEAN DEFAULT true,
  product_updates BOOLEAN DEFAULT true,
  educational_content BOOLEAN DEFAULT true,
  upsell_offers BOOLEAN DEFAULT true,
  language_preference TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  frequency_limit INTEGER DEFAULT 5,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  preferred_send_time TIME DEFAULT '09:00:00',
  unsubscribe_categories TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Upselling campaigns and tracking
CREATE TABLE public.upselling_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_conditions JSONB NOT NULL,
  target_plan TEXT NOT NULL,
  discount_percentage INTEGER DEFAULT 0,
  valid_until TIMESTAMPTZ,
  email_template_key TEXT,
  is_active BOOLEAN DEFAULT true,
  success_metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Upselling interactions tracking
CREATE TABLE public.upselling_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES upselling_campaigns(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  interaction_type TEXT NOT NULL,
  interaction_context JSONB DEFAULT '{}'::jsonb,
  conversion_value DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Email analytics and performance tracking
CREATE TABLE public.email_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT,
  campaign_id UUID,
  user_id UUID,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- A/B testing for email templates
CREATE TABLE public.email_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_key_a TEXT NOT NULL,
  template_key_b TEXT NOT NULL,
  traffic_split INTEGER DEFAULT 50,
  success_metric TEXT NOT NULL,
  test_status TEXT DEFAULT 'running' CHECK (test_status IN ('running', 'paused', 'completed')),
  results JSONB DEFAULT '{}'::jsonb,
  winner TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_lifecycle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enhanced_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upselling_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upselling_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_ab_tests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active email templates" ON email_templates FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage email templates" ON email_templates FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage newsletter campaigns" ON newsletter_campaigns FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Users can view their campaign recipient records" ON campaign_recipients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can manage campaign recipients" ON campaign_recipients FOR ALL USING (true);
CREATE POLICY "Users can view their lifecycle events" ON subscription_lifecycle_events FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create lifecycle events" ON subscription_lifecycle_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can manage their notification preferences" ON enhanced_notification_preferences FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Anyone can view active upselling campaigns" ON upselling_campaigns FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage upselling campaigns" ON upselling_campaigns FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Users can view their upselling interactions" ON upselling_interactions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can track upselling interactions" ON upselling_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view email analytics" ON email_analytics FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "System can track email analytics" ON email_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage A/B tests" ON email_ab_tests FOR ALL USING (is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_email_templates_key_lang ON email_templates(template_key, language_code);
CREATE INDEX idx_campaign_recipients_campaign ON campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_user ON campaign_recipients(user_id);
CREATE INDEX idx_subscription_events_user ON subscription_lifecycle_events(user_id);
CREATE INDEX idx_email_analytics_template ON email_analytics(template_key);
CREATE INDEX idx_email_analytics_user ON email_analytics(user_id);
CREATE INDEX idx_upselling_interactions_user ON upselling_interactions(user_id);

-- Triggers
CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_campaigns_updated_at BEFORE UPDATE ON newsletter_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enhanced_notification_preferences_updated_at BEFORE UPDATE ON enhanced_notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_upselling_campaigns_updated_at BEFORE UPDATE ON upselling_campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();