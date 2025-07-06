-- Enhanced notification system - only create missing tables

-- Notification types (if not exists)
CREATE TABLE IF NOT EXISTS public.notification_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'crisis', 'therapy', 'progress', 'community', 'integration', 'administrative'
  priority_weight INTEGER DEFAULT 5,
  delivery_methods TEXT[] DEFAULT '{"push", "email"}',
  template_variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Multi-platform integrations (enhanced from existing)
CREATE TABLE IF NOT EXISTS public.platform_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  platform_type TEXT NOT NULL, -- 'whatsapp', 'slack', 'teams', 'messenger', 'discord', 'telegram', 'signal'
  platform_user_id TEXT,
  access_tokens JSONB DEFAULT '{}',
  integration_settings JSONB DEFAULT '{}',
  crisis_escalation_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cross-platform conversation tracking
CREATE TABLE IF NOT EXISTS public.conversation_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  thread_type TEXT NOT NULL, -- 'therapy', 'support', 'crisis'
  platforms TEXT[] DEFAULT '{}',
  last_platform TEXT,
  conversation_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Integration webhooks management
CREATE TABLE IF NOT EXISTS public.integration_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL, -- Will reference platform_integrations
  webhook_url TEXT NOT NULL,
  webhook_secret TEXT,
  event_types TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification delivery tracking
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id),
  delivery_method TEXT NOT NULL, -- 'push', 'email', 'whatsapp', 'slack', etc.
  platform_integration_id UUID,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'clicked'
  external_message_id TEXT,
  error_message TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.notification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active notification types" 
ON public.notification_types 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Users can manage their own push subscriptions" 
ON public.push_subscriptions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own platform integrations" 
ON public.platform_integrations 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own conversation threads" 
ON public.conversation_threads 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their integration webhooks" 
ON public.integration_webhooks 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.platform_integrations pi 
  WHERE pi.id = integration_webhooks.integration_id 
  AND pi.user_id = auth.uid()
));

CREATE POLICY "Users can view their notification deliveries" 
ON public.notification_deliveries 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.notifications n 
  WHERE n.id = notification_deliveries.notification_id 
  AND n.user_id = auth.uid()
));

-- Insert default notification types (only if table is empty)
INSERT INTO public.notification_types (name, category, priority_weight, delivery_methods) 
SELECT * FROM (VALUES
  ('Crisis Alert', 'crisis', 10, '{"push", "email", "sms", "whatsapp", "slack"}'),
  ('Mood Decline Warning', 'crisis', 9, '{"push", "email", "whatsapp"}'),
  ('Session Reminder', 'therapy', 7, '{"push", "email", "whatsapp"}'),
  ('Pre-Session Prep', 'therapy', 6, '{"push", "whatsapp"}'),
  ('Post-Session Follow-up', 'therapy', 6, '{"push", "email"}'),
  ('Goal Achievement', 'progress', 8, '{"push", "email", "slack"}'),
  ('Streak Milestone', 'progress', 7, '{"push", "email"}'),
  ('Weekly Progress Summary', 'progress', 5, '{"push", "email"}'),
  ('Community Discussion Reply', 'community', 4, '{"push", "email"}'),
  ('Peer Support Message', 'community', 6, '{"push", "whatsapp"}'),
  ('WhatsApp Connection', 'integration', 5, '{"push", "email"}'),
  ('Slack Mention', 'integration', 6, '{"push", "slack"}'),
  ('Teams Meeting Reminder', 'integration', 7, '{"push", "teams"}'),
  ('Billing Reminder', 'administrative', 5, '{"push", "email"}'),
  ('Appointment Scheduled', 'administrative', 6, '{"push", "email", "whatsapp"}')
) AS v(name, category, priority_weight, delivery_methods)
WHERE NOT EXISTS (SELECT 1 FROM public.notification_types LIMIT 1);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_platform_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_platform_integrations_updated_at
BEFORE UPDATE ON public.platform_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_platform_integrations_updated_at();

CREATE OR REPLACE FUNCTION public.update_conversation_threads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_threads_updated_at
BEFORE UPDATE ON public.conversation_threads
FOR EACH ROW
EXECUTE FUNCTION public.update_conversation_threads_updated_at();

CREATE OR REPLACE FUNCTION public.update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_push_subscriptions_updated_at
BEFORE UPDATE ON public.push_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_push_subscriptions_updated_at();