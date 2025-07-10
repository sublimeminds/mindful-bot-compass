-- Enhanced Notification System Tables (excluding existing ones)

-- Create push notification subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh_key TEXT NOT NULL,
  auth_key TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create notification queue table for processing
CREATE TABLE public.notification_queue (
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
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification analytics table
CREATE TABLE public.notification_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'sent', 'delivered', 'clicked', 'dismissed', 'failed'
  delivery_method TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for push_subscriptions
CREATE POLICY "Users can manage their push subscriptions"
ON public.push_subscriptions
FOR ALL
USING (auth.uid() = user_id);

-- RLS policies for notification_queue
CREATE POLICY "Users can view their queued notifications"
ON public.notification_queue
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage notification queue"
ON public.notification_queue
FOR ALL
USING (true);

-- RLS policies for notification_analytics
CREATE POLICY "Users can view their notification analytics"
ON public.notification_analytics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create analytics"
ON public.notification_analytics
FOR INSERT
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_push_subscriptions_user_id ON public.push_subscriptions(user_id);
CREATE INDEX idx_push_subscriptions_active ON public.push_subscriptions(is_active);
CREATE INDEX idx_notification_queue_scheduled_for ON public.notification_queue(scheduled_for);
CREATE INDEX idx_notification_queue_status ON public.notification_queue(status);
CREATE INDEX idx_notification_analytics_user_id ON public.notification_analytics(user_id);
CREATE INDEX idx_notification_analytics_event_type ON public.notification_analytics(event_type);

-- Add missing indexes for existing notification_deliveries table
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_notification_id ON public.notification_deliveries(notification_id);
CREATE INDEX IF NOT EXISTS idx_notification_deliveries_status ON public.notification_deliveries(status);

-- Update notification_templates table with enhanced fields
ALTER TABLE public.notification_templates 
ADD COLUMN IF NOT EXISTS variables TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS delivery_methods TEXT[] DEFAULT '{"in_app"}';

-- Insert default notification templates (if they don't exist)
INSERT INTO public.notification_templates (name, type, title, message, priority, variables, delivery_methods) 
SELECT * FROM (VALUES
  ('Session Reminder', 'session_reminder', 'Time for Your Therapy Session', 'Take a few minutes to check in with yourself and practice some mindfulness.', 'medium', '{"userName","sessionTime"}', '{"in_app","web_push","email"}'),
  ('Milestone Achieved', 'milestone_achieved', 'Milestone Achieved! 🎉', 'Congratulations! You''ve reached a new milestone: {{milestone}}', 'high', '{"milestone","userName"}', '{"in_app","web_push","email","discord","slack"}'),
  ('Insight Generated', 'insight_generated', 'New Insight Available', 'We''ve discovered a new pattern in your progress: {{insight}}', 'medium', '{"insight","userName"}', '{"in_app","web_push","email"}'),
  ('Mood Check Reminder', 'mood_check', 'How are you feeling today?', 'Take a moment to check in with your emotions and log your mood.', 'low', '{"userName"}', '{"in_app","web_push"}'),
  ('Progress Update', 'progress_update', 'Weekly Progress Update', 'Here''s a summary of your therapy progress this week: {{progressSummary}}', 'medium', '{"progressSummary","userName","weekNumber"}', '{"in_app","email"}')
) AS new_templates(name, type, title, message, priority, variables, delivery_methods)
WHERE NOT EXISTS (
  SELECT 1 FROM public.notification_templates WHERE type = new_templates.type
);