-- Create enhanced therapy plans table
CREATE TABLE public.therapy_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  therapist_id TEXT REFERENCES therapist_personalities(name),
  title TEXT NOT NULL,
  description TEXT,
  focus_areas TEXT[] NOT NULL DEFAULT '{}',
  current_phase TEXT NOT NULL DEFAULT 'assessment',
  total_phases INTEGER NOT NULL DEFAULT 4,
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  goals JSONB DEFAULT '[]',
  milestones JSONB DEFAULT '[]',
  sessions_per_week INTEGER DEFAULT 2,
  estimated_duration_weeks INTEGER DEFAULT 12,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scheduled sessions table
CREATE TABLE public.scheduled_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  therapy_plan_id UUID REFERENCES therapy_plans(id) ON DELETE CASCADE,
  therapist_id TEXT NOT NULL,
  session_type TEXT NOT NULL DEFAULT 'therapy',
  scheduled_for TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  is_recurring BOOLEAN NOT NULL DEFAULT false,
  recurrence_pattern TEXT, -- 'weekly', 'biweekly', 'monthly'
  recurrence_end_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
  notes TEXT,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notifications table (replace mock system)
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'session_reminder', 'milestone_achieved', 'crisis_alert', 'progress_update'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  is_read BOOLEAN NOT NULL DEFAULT false,
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create scheduled notifications table
CREATE TABLE public.scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  template_id UUID,
  scheduled_for TIMESTAMPTZ NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'sent', 'cancelled'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create notification templates table
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'medium',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.therapy_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for therapy_plans
CREATE POLICY "Users can create their own therapy plans" ON public.therapy_plans
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own therapy plans" ON public.therapy_plans
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own therapy plans" ON public.therapy_plans
FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for scheduled_sessions
CREATE POLICY "Users can manage their own sessions" ON public.scheduled_sessions
FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON public.notifications
FOR INSERT WITH CHECK (true);

-- RLS Policies for scheduled_notifications
CREATE POLICY "Users can view their own scheduled notifications" ON public.scheduled_notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage scheduled notifications" ON public.scheduled_notifications
FOR ALL WITH CHECK (true);

-- RLS Policies for notification_templates
CREATE POLICY "Everyone can view active templates" ON public.notification_templates
FOR SELECT USING (is_active = true);

-- Insert default notification templates
INSERT INTO public.notification_templates (name, type, title, message, variables) VALUES
('session_reminder_24h', 'session_reminder', 'Session Reminder', 'You have a therapy session with {{therapist_name}} scheduled for {{session_time}} tomorrow.', ARRAY['therapist_name', 'session_time']),
('session_reminder_1h', 'session_reminder', 'Session Starting Soon', 'Your therapy session with {{therapist_name}} starts in 1 hour.', ARRAY['therapist_name']),
('milestone_achievement', 'milestone_achieved', 'Milestone Achieved! 🎉', 'Congratulations! You''ve achieved a new milestone: {{milestone_name}}', ARRAY['milestone_name']),
('progress_update', 'progress_update', 'Weekly Progress Update', 'Your therapy progress this week: {{progress_summary}}', ARRAY['progress_summary']),
('crisis_alert', 'crisis_alert', 'Support Available', 'We noticed you might need extra support. Please reach out if you need immediate help.', ARRAY[]);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapy_plans_updated_at BEFORE UPDATE ON public.therapy_plans
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_sessions_updated_at BEFORE UPDATE ON public.scheduled_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON public.notification_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();