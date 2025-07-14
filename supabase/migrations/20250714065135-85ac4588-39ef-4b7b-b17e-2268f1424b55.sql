-- Insert sample notifications for testing
INSERT INTO public.notifications (user_id, type, title, message, priority, data, is_read, created_at) VALUES
-- Replace with your actual user ID from auth.users
(auth.uid(), 'session_reminder', 'Time for Your Therapy Session', 'Take a few minutes to check in with yourself and practice some mindfulness.', 'medium', '{}', false, now() - interval '5 minutes'),
(auth.uid(), 'milestone_achieved', '🎉 5 Sessions Completed!', 'Congratulations on completing 5 therapy sessions. You''re making great progress!', 'high', '{"milestone": "sessions", "count": 5}', false, now() - interval '1 hour'),
(auth.uid(), 'insight_generated', 'New Insight Available', 'We''ve discovered a new pattern in your progress: Your mood improves significantly during evening sessions.', 'medium', '{"insight": "evening_sessions"}', false, now() - interval '2 hours'),
(auth.uid(), 'mood_check', 'Daily Mood Check-in', 'How are you feeling today? Take a moment to track your emotional state.', 'low', '{}', true, now() - interval '1 day'),
(auth.uid(), 'progress_update', 'Technique Suggestion', 'Based on your recent session, practicing mindfulness between sessions could enhance your progress.', 'medium', '{"technique": "mindfulness"}', false, now() - interval '3 hours');