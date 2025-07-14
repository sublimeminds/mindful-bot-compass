-- Get the first user from auth.users to use for sample notifications
DO $$
DECLARE
    sample_user_id uuid;
BEGIN
    -- Get the first user ID from auth.users
    SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
    
    -- Only insert if we found a user
    IF sample_user_id IS NOT NULL THEN
        INSERT INTO public.notifications (user_id, type, title, message, priority, data, is_read, created_at) VALUES
        (sample_user_id, 'session_reminder', 'Time for Your Therapy Session', 'Take a few minutes to check in with yourself and practice some mindfulness.', 'medium', '{}', false, now() - interval '5 minutes'),
        (sample_user_id, 'milestone_achieved', '🎉 5 Sessions Completed!', 'Congratulations on completing 5 therapy sessions. You''re making great progress!', 'high', '{"milestone": "sessions", "count": 5}', false, now() - interval '1 hour'),
        (sample_user_id, 'insight_generated', 'New Insight Available', 'We''ve discovered a new pattern in your progress: Your mood improves significantly during evening sessions.', 'medium', '{"insight": "evening_sessions"}', false, now() - interval '2 hours'),
        (sample_user_id, 'mood_check', 'Daily Mood Check-in', 'How are you feeling today? Take a moment to track your emotional state.', 'low', '{}', true, now() - interval '1 day'),
        (sample_user_id, 'progress_update', 'Technique Suggestion', 'Based on your recent session, practicing mindfulness between sessions could enhance your progress.', 'medium', '{"technique": "mindfulness"}', false, now() - interval '3 hours');
    END IF;
END $$;