-- Phase 2: Intelligence & Therapy Integration Tables

-- Create notification intelligence table for AI-driven optimization
CREATE TABLE IF NOT EXISTS public.notification_intelligence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  optimal_send_times JSONB DEFAULT '{}', -- ML-predicted best times by day of week
  engagement_patterns JSONB DEFAULT '{}', -- User interaction patterns
  delivery_preferences JSONB DEFAULT '{}', -- Learned preferences by notification type
  last_calculated_at TIMESTAMP WITH TIME ZONE,
  confidence_score NUMERIC(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapy session notifications table
CREATE TABLE IF NOT EXISTS public.therapy_session_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID,
  user_id UUID NOT NULL,
  notification_type TEXT NOT NULL, -- 'pre_session', 'post_session', 'reminder', 'assessment'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  session_context JSONB DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE,
  engagement_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notification context table for smart delivery
CREATE TABLE IF NOT EXISTS public.notification_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  context_type TEXT NOT NULL, -- 'session_active', 'quiet_hours', 'device_active', 'mood_state'
  context_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crisis escalation tracking
CREATE TABLE IF NOT EXISTS public.crisis_notification_escalation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trigger_notification_id UUID,
  escalation_level INTEGER NOT NULL DEFAULT 1, -- 1=mild, 2=moderate, 3=severe, 4=crisis
  escalation_data JSONB DEFAULT '{}',
  professional_notified BOOLEAN DEFAULT false,
  emergency_contacts_notified BOOLEAN DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_session_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_context ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crisis_notification_escalation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their notification intelligence"
ON public.notification_intelligence FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their therapy session notifications"
ON public.therapy_session_notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage therapy session notifications"
ON public.therapy_session_notifications FOR ALL USING (true);

CREATE POLICY "Users can manage their notification context"
ON public.notification_context FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view their crisis escalations"
ON public.crisis_notification_escalation FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage crisis escalations"
ON public.crisis_notification_escalation FOR ALL USING (true);

-- Indexes
CREATE INDEX idx_notification_intelligence_user_id ON public.notification_intelligence(user_id);
CREATE INDEX idx_therapy_session_notifications_user_id ON public.therapy_session_notifications(user_id);
CREATE INDEX idx_therapy_session_notifications_scheduled ON public.therapy_session_notifications(scheduled_for);
CREATE INDEX idx_notification_context_user_active ON public.notification_context(user_id, is_active);
CREATE INDEX idx_crisis_escalation_user_level ON public.crisis_notification_escalation(user_id, escalation_level);