-- Add TherapySync AI as the main featured item
INSERT INTO public.navigation_menu_items (
  id, menu_id, category_id, title, description, href, icon, gradient, badge, position, is_active
) VALUES 
('40000000-1111-1111-1111-111111111111', '00000000-1111-1111-1111-111111111111', '10000000-1111-1111-1111-111111111111', 'TherapySync AI', 'Advanced AI therapy platform with personalized treatment plans and real-time adaptation', '/therapy-ai', 'Brain', 'from-therapy-600 to-therapy-700', 'Featured', 0, true);

-- Update all existing links to use proper routing paths that would exist in a real app
UPDATE navigation_menu_items SET href = '/ai-chat' WHERE title = 'AI Therapy Chat';
UPDATE navigation_menu_items SET href = '/personalization' WHERE title = 'AI Personalization'; 
UPDATE navigation_menu_items SET href = '/adaptive-ai' WHERE title = 'Adaptive Systems';
UPDATE navigation_menu_items SET href = '/cbt' WHERE title = 'Cognitive Behavioral Therapy';
UPDATE navigation_menu_items SET href = '/dbt' WHERE title = 'Dialectical Behavior Therapy';
UPDATE navigation_menu_items SET href = '/mindfulness' WHERE title = 'Mindfulness-Based Therapy';
UPDATE navigation_menu_items SET href = '/trauma-support' WHERE title = 'Trauma-Focused Therapy';
UPDATE navigation_menu_items SET href = '/cultural-therapy' WHERE title = 'Cultural AI';
UPDATE navigation_menu_items SET href = '/voice-therapy' WHERE title = 'Voice AI Therapy';
UPDATE navigation_menu_items SET href = '/group-sessions' WHERE title = 'Group Therapy AI';

-- Platform items
UPDATE navigation_menu_items SET href = '/dashboard' WHERE title = 'Dashboard';
UPDATE navigation_menu_items SET href = '/mood-tracker' WHERE title = 'Mood & Progress Tracking';
UPDATE navigation_menu_items SET href = '/goals' WHERE title = 'Goal Setting & Management';
UPDATE navigation_menu_items SET href = '/family' WHERE title = 'Family Account Sharing';
UPDATE navigation_menu_items SET href = '/community' WHERE title = 'Community & Groups';
UPDATE navigation_menu_items SET href = '/integrations' WHERE title = 'Integrations Hub';
UPDATE navigation_menu_items SET href = '/crisis' WHERE title = 'Crisis Support';
UPDATE navigation_menu_items SET href = '/video-chat' WHERE title = 'Video Sessions';

-- Tools & Data
UPDATE navigation_menu_items SET href = '/analytics' WHERE title = 'Analytics Dashboard';
UPDATE navigation_menu_items SET href = '/reports' WHERE title = 'Progress Reports';
UPDATE navigation_menu_items SET href = '/api' WHERE title = 'API Access';
UPDATE navigation_menu_items SET href = '/mobile' WHERE title = 'Mobile Apps';
UPDATE navigation_menu_items SET href = '/export' WHERE title = 'Data Export';
UPDATE navigation_menu_items SET href = '/enterprise-integrations' WHERE title = 'Custom Integrations';
UPDATE navigation_menu_items SET href = '/insights' WHERE title = 'AI Insights Engine';
UPDATE navigation_menu_items SET href = '/wearables' WHERE title = 'Wearable Integration';

-- Solutions
UPDATE navigation_menu_items SET href = '/individual' WHERE title = 'For Individuals';
UPDATE navigation_menu_items SET href = '/families' WHERE title = 'For Families';
UPDATE navigation_menu_items SET href = '/organizations' WHERE title = 'For Organizations';
UPDATE navigation_menu_items SET href = '/pricing' WHERE title = 'Pricing Plans';
UPDATE navigation_menu_items SET href = '/healthcare' WHERE title = 'Healthcare Providers';
UPDATE navigation_menu_items SET href = '/enterprise' WHERE title = 'Enterprise Security';

-- Resources
UPDATE navigation_menu_items SET href = '/how-it-works' WHERE title = 'How It Works';
UPDATE navigation_menu_items SET href = '/support' WHERE title = 'Support Center';
UPDATE navigation_menu_items SET href = '/learn' WHERE title = 'Learning Hub';
UPDATE navigation_menu_items SET href = '/blog' WHERE title = 'Blog & Insights';
UPDATE navigation_menu_items SET href = '/research' WHERE title = 'Research & Studies';
UPDATE navigation_menu_items SET href = '/library' WHERE title = 'Mental Health Library';
UPDATE navigation_menu_items SET href = '/therapists' WHERE title = 'Therapist Directory';