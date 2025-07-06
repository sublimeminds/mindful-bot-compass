-- Enhanced notification system - final version

-- Notification types
CREATE TABLE IF NOT EXISTS public.notification_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  priority_weight INTEGER DEFAULT 5,
  delivery_methods TEXT[] DEFAULT ARRAY['push', 'email'],
  template_variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Push notification subscriptions
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
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
  platform_type TEXT NOT NULL,
  platform_user_id TEXT,
  access_tokens JSONB DEFAULT '{}',
  integration_settings JSONB DEFAULT '{}',
  crisis_escalation_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform_type)
);

-- Cross-platform conversation tracking
CREATE TABLE IF NOT EXISTS public.conversation_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  thread_type TEXT NOT NULL,
  platforms TEXT[] DEFAULT ARRAY[]::TEXT[],
  last_platform TEXT,
  conversation_data JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Integration webhooks management
CREATE TABLE IF NOT EXISTS public.integration_webhooks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_secret TEXT,
  event_types TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_triggered TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification delivery tracking
CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id),
  delivery_method TEXT NOT NULL,
  platform_integration_id UUID,
  status TEXT NOT NULL DEFAULT 'pending',
  external_message_id TEXT,
  error_message TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables  
DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'notification_types') THEN
    ALTER TABLE public.notification_types ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Anyone can view active notification types" 
    ON public.notification_types 
    FOR SELECT 
    USING (is_active = true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'push_subscriptions') THEN
    ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their own push subscriptions" 
    ON public.push_subscriptions 
    FOR ALL 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'platform_integrations') THEN
    ALTER TABLE public.platform_integrations ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their own platform integrations" 
    ON public.platform_integrations 
    FOR ALL 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'conversation_threads') THEN
    ALTER TABLE public.conversation_threads ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can manage their own conversation threads" 
    ON public.conversation_threads 
    FOR ALL 
    USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'integration_webhooks') THEN
    ALTER TABLE public.integration_webhooks ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view their integration webhooks" 
    ON public.integration_webhooks 
    FOR SELECT 
    USING (EXISTS (
      SELECT 1 FROM public.platform_integrations pi 
      WHERE pi.id = integration_webhooks.integration_id 
      AND pi.user_id = auth.uid()
    ));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE tablename = 'notification_deliveries') THEN
    ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view their notification deliveries" 
    ON public.notification_deliveries 
    FOR SELECT 
    USING (EXISTS (
      SELECT 1 FROM public.notifications n 
      WHERE n.id = notification_deliveries.notification_id 
      AND n.user_id = auth.uid()
    ));
  END IF;
END $$;

-- Insert default notification types if empty
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.notification_types LIMIT 1) THEN
    INSERT INTO public.notification_types (name, category, priority_weight, delivery_methods) VALUES
      ('Crisis Alert', 'crisis', 10, ARRAY['push', 'email', 'sms', 'whatsapp', 'slack']),
      ('Mood Decline Warning', 'crisis', 9, ARRAY['push', 'email', 'whatsapp']),
      ('Session Reminder', 'therapy', 7, ARRAY['push', 'email', 'whatsapp']),
      ('Pre-Session Prep', 'therapy', 6, ARRAY['push', 'whatsapp']),
      ('Post-Session Follow-up', 'therapy', 6, ARRAY['push', 'email']),
      ('Goal Achievement', 'progress', 8, ARRAY['push', 'email', 'slack']),
      ('Streak Milestone', 'progress', 7, ARRAY['push', 'email']),
      ('Weekly Progress Summary', 'progress', 5, ARRAY['push', 'email']),
      ('Community Discussion Reply', 'community', 4, ARRAY['push', 'email']),
      ('Peer Support Message', 'community', 6, ARRAY['push', 'whatsapp']),
      ('WhatsApp Connection', 'integration', 5, ARRAY['push', 'email']),
      ('Slack Mention', 'integration', 6, ARRAY['push', 'slack']),
      ('Teams Meeting Reminder', 'integration', 7, ARRAY['push', 'teams']),
      ('Billing Reminder', 'administrative', 5, ARRAY['push', 'email']),
      ('Appointment Scheduled', 'administrative', 6, ARRAY['push', 'email', 'whatsapp']);
  END IF;
END $$;