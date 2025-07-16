-- Add notification deduplication and sticky behavior fields
ALTER TABLE public.notifications 
ADD COLUMN notification_key TEXT,
ADD COLUMN is_sticky BOOLEAN DEFAULT false,
ADD COLUMN last_updated TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for faster duplicate checking
CREATE INDEX idx_notifications_user_key ON public.notifications(user_id, notification_key) WHERE notification_key IS NOT NULL;

-- Create index for sticky notifications
CREATE INDEX idx_notifications_sticky_unread ON public.notifications(user_id, is_sticky, is_read) WHERE is_sticky = true;