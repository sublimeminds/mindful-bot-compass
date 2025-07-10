-- Enhanced Notification System - Missing Tables Only

-- Create notification queue table for processing
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  delivery_methods TEXT[] NOT NULL DEFAULT '{"in_app"}',
  data JSONB DEFAULT '{}',
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification analytics table
CREATE TABLE IF NOT EXISTS public.notification_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  delivery_method TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables if they don't have it
DO $$ 
BEGIN
    -- Enable RLS on notification_queue if it exists and doesn't have RLS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notification_queue' AND schemaname = 'public') THEN
        ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Enable RLS on notification_analytics if it exists and doesn't have RLS  
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'notification_analytics' AND schemaname = 'public') THEN
        ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create RLS policies
DO $$
BEGIN
    -- Policies for notification_queue
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_queue' AND policyname = 'Users can view their queued notifications') THEN
        CREATE POLICY "Users can view their queued notifications"
        ON public.notification_queue
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_queue' AND policyname = 'System can manage notification queue') THEN
        CREATE POLICY "System can manage notification queue"
        ON public.notification_queue
        FOR ALL
        USING (true);
    END IF;
    
    -- Policies for notification_analytics
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_analytics' AND policyname = 'Users can view their notification analytics') THEN
        CREATE POLICY "Users can view their notification analytics"
        ON public.notification_analytics
        FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'notification_analytics' AND policyname = 'System can create analytics') THEN
        CREATE POLICY "System can create analytics"
        ON public.notification_analytics
        FOR INSERT
        WITH CHECK (true);
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled_for ON public.notification_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON public.notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_analytics_user_id ON public.notification_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_analytics_event_type ON public.notification_analytics(event_type);