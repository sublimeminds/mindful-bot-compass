-- Enhanced notification system with elite features

-- Add new notification types and enhanced columns
ALTER TYPE notification_type ADD VALUE 'session_followup';
ALTER TYPE notification_type ADD VALUE 'technique_suggestion';
ALTER TYPE notification_type ADD VALUE 'breathing_reminder';
ALTER TYPE notification_type ADD VALUE 'streak_celebration';
ALTER TYPE notification_type ADD VALUE 'goal_progress';
ALTER TYPE notification_type ADD VALUE 'crisis_detected';
ALTER TYPE notification_type ADD VALUE 'emergency_contacts';
ALTER TYPE notification_type ADD VALUE 'safety_plan_reminder';
ALTER TYPE notification_type ADD VALUE 'professional_escalation';
ALTER TYPE notification_type ADD VALUE 'inactive_user';
ALTER TYPE notification_type ADD VALUE 'new_content';
ALTER TYPE notification_type ADD VALUE 'community_invite';
ALTER TYPE notification_type ADD VALUE 'challenge_invitation';
ALTER TYPE notification_type ADD VALUE 'cross_platform_sync';
ALTER TYPE notification_type ADD VALUE 'integration_status';
ALTER TYPE notification_type ADD VALUE 'backup_reminder';

-- Add enhanced notification columns
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS deep_link_url TEXT;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_buttons JSONB DEFAULT '[]';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS rich_content JSONB DEFAULT '{}';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS delivery_channels TEXT[] DEFAULT ARRAY['in_app'];
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS interaction_data JSONB DEFAULT '{}';
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS personalization_score DECIMAL(3,2) DEFAULT 0.5;

-- Create notification routing rules table
CREATE TABLE IF NOT EXISTS public.notification_routing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_type TEXT NOT NULL,
  priority TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT ARRAY['in_app'],
  conditions JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification analytics table
CREATE TABLE IF NOT EXISTS public.notification_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL, -- 'delivered', 'opened', 'clicked', 'dismissed', 'action_taken'
  channel TEXT NOT NULL, -- 'in_app', 'whatsapp', 'slack', 'email', 'push'
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create smart notification preferences table
CREATE TABLE IF NOT EXISTS public.smart_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL,
  preferred_channels TEXT[] DEFAULT ARRAY['in_app'],
  preferred_times JSONB DEFAULT '{"start": "09:00", "end": "21:00"}',
  frequency_limit INTEGER DEFAULT 5, -- max per day
  quiet_hours JSONB DEFAULT '{"start": "22:00", "end": "08:00"}',
  ai_optimization_enabled BOOLEAN DEFAULT true,
  crisis_override BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Enable RLS on new tables
ALTER TABLE public.notification_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_routing_rules
CREATE POLICY "Admins can manage routing rules" ON public.notification_routing_rules
FOR ALL USING (is_admin(auth.uid()));

-- RLS policies for notification_analytics
CREATE POLICY "Users can view their notification analytics" ON public.notification_analytics
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create analytics" ON public.notification_analytics
FOR INSERT WITH CHECK (true);

-- RLS policies for smart_notification_preferences
CREATE POLICY "Users can manage their smart preferences" ON public.smart_notification_preferences
FOR ALL USING (auth.uid() = user_id);

-- Insert default routing rules
INSERT INTO public.notification_routing_rules (notification_type, priority, channels, conditions) VALUES
('crisis_detected', 'high', ARRAY['whatsapp', 'push', 'email', 'in_app'], '{"immediate": true}'),
('emergency_contacts', 'high', ARRAY['whatsapp', 'email'], '{"notify_contacts": true}'),
('safety_plan_reminder', 'high', ARRAY['push', 'in_app'], '{"urgent": true}'),
('session_reminder', 'medium', ARRAY['push', 'in_app'], '{"timing": "15_minutes_before"}'),
('milestone_achieved', 'medium', ARRAY['push', 'in_app'], '{"celebratory": true}'),
('mood_check', 'low', ARRAY['in_app'], '{"gentle": true}'),
('technique_suggestion', 'medium', ARRAY['in_app'], '{"contextual": true}'),
('breathing_reminder', 'medium', ARRAY['push', 'in_app'], '{"stress_triggered": true}'),
('goal_progress', 'low', ARRAY['in_app'], '{"encouraging": true}'),
('new_content', 'low', ARRAY['in_app'], '{"personalized": true}');

-- Function to get smart routing for notifications
CREATE OR REPLACE FUNCTION get_notification_routing(
  p_notification_type TEXT,
  p_priority TEXT,
  p_user_id UUID DEFAULT NULL
) 
RETURNS TABLE(channels TEXT[], conditions JSONB) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Get base routing rules
  RETURN QUERY
  SELECT nrr.channels, nrr.conditions
  FROM public.notification_routing_rules nrr
  WHERE nrr.notification_type = p_notification_type
    AND nrr.priority = p_priority
    AND nrr.is_active = true
  ORDER BY nrr.created_at DESC
  LIMIT 1;
  
  -- If no specific rule found, return default
  IF NOT FOUND THEN
    RETURN QUERY SELECT ARRAY['in_app']::TEXT[], '{}'::JSONB;
  END IF;
END;
$$;

-- Function to create intelligent notification
CREATE OR REPLACE FUNCTION create_intelligent_notification(
  p_user_id UUID,
  p_type TEXT,
  p_title TEXT,
  p_message TEXT,
  p_priority TEXT DEFAULT 'medium',
  p_data JSONB DEFAULT '{}',
  p_deep_link_url TEXT DEFAULT NULL,
  p_action_buttons JSONB DEFAULT '[]'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id UUID;
  routing_info RECORD;
BEGIN
  -- Get smart routing
  SELECT * INTO routing_info FROM get_notification_routing(p_type, p_priority, p_user_id);
  
  -- Create notification
  INSERT INTO public.notifications (
    user_id, type, title, message, priority, data, 
    deep_link_url, action_buttons, delivery_channels,
    expires_at
  ) VALUES (
    p_user_id, p_type, p_title, p_message, p_priority, p_data,
    p_deep_link_url, p_action_buttons, routing_info.channels,
    CASE 
      WHEN p_priority = 'high' THEN now() + INTERVAL '7 days'
      WHEN p_priority = 'medium' THEN now() + INTERVAL '3 days' 
      ELSE now() + INTERVAL '1 day'
    END
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;