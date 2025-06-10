
-- Create notification_templates table
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  variables TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled_notifications table
CREATE TABLE public.scheduled_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.notification_templates(id),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notification_templates (readable by all authenticated users, manageable by admins)
CREATE POLICY "Users can view active notification templates" 
  ON public.notification_templates 
  FOR SELECT 
  USING (is_active = true);

-- RLS policies for scheduled_notifications (users can only see their own)
CREATE POLICY "Users can view their own scheduled notifications" 
  ON public.scheduled_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scheduled notifications" 
  ON public.scheduled_notifications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled notifications" 
  ON public.scheduled_notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Insert some default notification templates
INSERT INTO public.notification_templates (name, type, title, message, priority, variables) VALUES
('Session Reminder', 'session_reminder', 'Time for your therapy session', 'Hi {{userName}}, your therapy session is scheduled for {{time}}. Ready to continue your journey?', 'high', ARRAY['userName', 'time']),
('Milestone Achievement', 'milestone_achieved', 'Congratulations! 🎉', 'You''ve achieved a new milestone: {{milestone}}. Keep up the great work!', 'medium', ARRAY['milestone']),
('Mood Check-in', 'mood_check', 'How are you feeling today?', 'Take a moment to check in with yourself. How has your day been so far?', 'low', ARRAY[]::TEXT[]),
('Progress Update', 'progress_update', 'Your weekly progress', 'Here''s your progress summary: {{summary}}', 'medium', ARRAY['summary']),
('Insight Generated', 'insight_generated', 'New insight available', 'We''ve generated a new insight based on your recent sessions: {{insight}}', 'medium', ARRAY['insight']);
