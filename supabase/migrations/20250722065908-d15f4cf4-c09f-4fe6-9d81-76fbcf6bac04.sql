-- Complete navigation data reset with properly formatted UUIDs
SET session_replication_role = replica;

-- Truncate all tables to completely clear data
TRUNCATE public.navigation_menu_items CASCADE;
TRUNCATE public.navigation_menu_categories CASCADE;
TRUNCATE public.navigation_menus CASCADE;

-- Insert main navigation menus with proper UUIDs
INSERT INTO public.navigation_menus (id, name, label, icon, position, is_active, created_at, updated_at) VALUES
('00000000-1111-1111-1111-111111111111', 'therapy-ai', 'Therapy AI', 'Brain', 1, true, now(), now()),
('00000000-2222-2222-2222-222222222222', 'platform', 'Platform', 'Settings', 2, true, now(), now()),
('00000000-3333-3333-3333-333333333333', 'tools-data', 'Tools & Data', 'BarChart3', 3, true, now(), now()),
('00000000-4444-4444-4444-444444444444', 'solutions', 'Solutions', 'Building', 4, true, now(), now()),
('00000000-5555-5555-5555-555555555555', 'resources', 'Resources', 'BookOpen', 5, true, now(), now());

-- Insert navigation categories with proper UUIDs
INSERT INTO public.navigation_menu_categories (id, menu_id, name, label, position, is_active, created_at, updated_at) VALUES
('10000000-1111-1111-1111-111111111111', '00000000-1111-1111-1111-111111111111', 'ai-therapy', 'AI Therapy', 1, true, now(), now()),
('10000000-2222-2222-2222-222222222222', '00000000-1111-1111-1111-111111111111', 'specialized', 'Specialized Approaches', 2, true, now(), now()),
('10000000-3333-3333-3333-333333333333', '00000000-2222-2222-2222-222222222222', 'core', 'Core Features', 1, true, now(), now()),
('10000000-4444-4444-4444-444444444444', '00000000-2222-2222-2222-222222222222', 'social', 'Social & Integration', 2, true, now(), now()),
('10000000-5555-5555-5555-555555555555', '00000000-3333-3333-3333-333333333333', 'analytics', 'Analytics & Insights', 1, true, now(), now()),
('10000000-6666-6666-6666-666666666666', '00000000-3333-3333-3333-333333333333', 'tools', 'Tools & Apps', 2, true, now(), now()),
('10000000-7777-7777-7777-777777777777', '00000000-4444-4444-4444-444444444444', 'audience', 'By Audience', 1, true, now(), now()),
('10000000-8888-8888-8888-888888888888', '00000000-4444-4444-4444-444444444444', 'pricing', 'Pricing', 2, true, now(), now()),
('10000000-9999-9999-9999-999999999999', '00000000-5555-5555-5555-555555555555', 'learn', 'Learn & Support', 1, true, now(), now()),
('10000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-5555-5555-5555-555555555555', 'community', 'Community', 2, true, now(), now());

-- Insert all 28 navigation menu items with proper UUIDs
INSERT INTO public.navigation_menu_items (id, menu_id, category_id, title, description, href, icon, gradient, badge, position, is_active, created_at, updated_at) VALUES
-- Therapy AI Menu Items (7 items)
('20000000-1111-1111-1111-111111111111', '00000000-1111-1111-1111-111111111111', '10000000-1111-1111-1111-111111111111', 'AI Therapy Chat', 'Engage in personalized therapy conversations with advanced AI therapists', '/therapy-session', 'MessageSquare', 'from-therapy-500 to-therapy-600', 'Popular', 1, true, now(), now()),
('20000000-2222-2222-2222-222222222222', '00000000-1111-1111-1111-111111111111', '10000000-1111-1111-1111-111111111111', 'AI Personalization', 'Customize your AI therapist personality and communication style', '/ai-personalization', 'User', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('20000000-3333-3333-3333-333333333333', '00000000-1111-1111-1111-111111111111', '10000000-1111-1111-1111-111111111111', 'Adaptive Systems', 'Advanced AI that learns and adapts to your therapeutic needs', '/adaptive-ai', 'Zap', 'from-flow-500 to-flow-600', 'Advanced', 3, true, now(), now()),
('20000000-4444-4444-4444-444444444444', '00000000-1111-1111-1111-111111111111', '10000000-2222-2222-2222-222222222222', 'Cognitive Behavioral Therapy', 'AI-guided CBT sessions focusing on thought patterns and coping strategies', '/cbt-therapy', 'Brain', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('20000000-5555-5555-5555-555555555555', '00000000-1111-1111-1111-111111111111', '10000000-2222-2222-2222-222222222222', 'Dialectical Behavior Therapy', 'Comprehensive DBT skills training and emotion regulation', '/dbt-therapy', 'Heart', 'from-therapy-400 to-therapy-500', null, 5, true, now(), now()),
('20000000-6666-6666-6666-666666666666', '00000000-1111-1111-1111-111111111111', '10000000-2222-2222-2222-222222222222', 'Mindfulness-Based Therapy', 'Integrate mindfulness practices with therapeutic conversations', '/mindfulness-therapy', 'Compass', 'from-harmony-400 to-harmony-500', null, 6, true, now(), now()),
('20000000-7777-7777-7777-777777777777', '00000000-1111-1111-1111-111111111111', '10000000-2222-2222-2222-222222222222', 'Trauma-Focused Therapy', 'Specialized AI therapy approaches for trauma recovery and PTSD support', '/trauma-therapy', 'Shield', 'from-flow-400 to-flow-500', null, 7, true, now(), now()),

-- Platform Menu Items (6 items)
('20000000-8888-8888-8888-888888888888', '00000000-2222-2222-2222-222222222222', '10000000-3333-3333-3333-333333333333', 'Dashboard', 'Your personalized mental health dashboard with progress tracking', '/dashboard', 'LayoutDashboard', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('20000000-9999-9999-9999-999999999999', '00000000-2222-2222-2222-222222222222', '10000000-3333-3333-3333-333333333333', 'Mood & Progress Tracking', 'Track your daily mood and therapeutic progress with detailed analytics', '/mood-tracking', 'TrendingUp', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('20000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-2222-2222-2222-222222222222', '10000000-3333-3333-3333-333333333333', 'Goal Setting & Management', 'Set and achieve your mental health goals with AI-powered guidance', '/goals', 'Target', 'from-flow-500 to-flow-600', null, 3, true, now(), now()),
('20000000-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-2222-2222-2222-222222222222', '10000000-4444-4444-4444-444444444444', 'Family Account Sharing', 'Share progress with trusted family members with privacy controls', '/family-sharing', 'Users', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('20000000-cccc-cccc-cccc-cccccccccccc', '00000000-2222-2222-2222-222222222222', '10000000-4444-4444-4444-444444444444', 'Community & Groups', 'Connect with supportive peer groups and mental health discussions', '/community', 'Users', 'from-therapy-400 to-therapy-500', 'Pro', 5, true, now(), now()),
('20000000-dddd-dddd-dddd-dddddddddddd', '00000000-2222-2222-2222-222222222222', '10000000-4444-4444-4444-444444444444', 'Integrations Hub', 'Connect with your favorite apps and platforms for wellness tracking', '/integrations', 'Plug', 'from-harmony-400 to-harmony-500', null, 6, true, now(), now()),

-- Tools & Data Menu Items (6 items)
('20000000-eeee-eeee-eeee-eeeeeeeeeeee', '00000000-3333-3333-3333-333333333333', '10000000-5555-5555-5555-555555555555', 'Analytics Dashboard', 'Comprehensive analytics of your mental health journey', '/analytics', 'BarChart3', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('20000000-ffff-ffff-ffff-ffffffffffff', '00000000-3333-3333-3333-333333333333', '10000000-5555-5555-5555-555555555555', 'Progress Reports', 'Detailed monthly and quarterly reports of your therapeutic progress', '/reports', 'FileText', 'from-harmony-500 to-harmony-600', 'Premium', 2, true, now(), now()),
('21000000-1111-1111-1111-111111111111', '00000000-3333-3333-3333-333333333333', '10000000-5555-5555-5555-555555555555', 'API Access', 'Developer API for integrating TherapySync capabilities', '/api-docs', 'Code', 'from-flow-500 to-flow-600', 'Developer', 3, true, now(), now()),
('21000000-2222-2222-2222-222222222222', '00000000-3333-3333-3333-333333333333', '10000000-6666-6666-6666-666666666666', 'Mobile Apps', 'Native iOS and Android apps for therapy sessions on the go', '/mobile-apps', 'Smartphone', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('21000000-3333-3333-3333-333333333333', '00000000-3333-3333-3333-333333333333', '10000000-6666-6666-6666-666666666666', 'Data Export', 'Export your complete therapy data and progress reports', '/data-export', 'Download', 'from-therapy-400 to-therapy-500', 'Pro', 5, true, now(), now()),
('21000000-4444-4444-4444-444444444444', '00000000-3333-3333-3333-333333333333', '10000000-6666-6666-6666-666666666666', 'Custom Integrations', 'Enterprise-grade custom integrations with healthcare platforms', '/custom-integrations', 'Settings', 'from-harmony-400 to-harmony-500', 'Enterprise', 6, true, now(), now()),

-- Solutions Menu Items (4 items)
('21000000-5555-5555-5555-555555555555', '00000000-4444-4444-4444-444444444444', '10000000-7777-7777-7777-777777777777', 'For Individuals', 'Personal mental health support with AI therapy and mood tracking', '/individual', 'User', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('21000000-6666-6666-6666-666666666666', '00000000-4444-4444-4444-444444444444', '10000000-7777-7777-7777-777777777777', 'For Families', 'Family mental health plans with shared insights and parental controls', '/families', 'Users', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('21000000-7777-7777-7777-777777777777', '00000000-4444-4444-4444-444444444444', '10000000-7777-7777-7777-777777777777', 'For Organizations', 'Enterprise mental health solutions for employee wellness programs', '/organizations', 'Building', 'from-flow-500 to-flow-600', null, 3, true, now(), now()),
('21000000-8888-8888-8888-888888888888', '00000000-4444-4444-4444-444444444444', '10000000-8888-8888-8888-888888888888', 'Pricing Plans', 'Flexible pricing options from free basic access to premium solutions', '/pricing', 'CreditCard', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),

-- Resources Menu Items (5 items)
('21000000-9999-9999-9999-999999999999', '00000000-5555-5555-5555-555555555555', '10000000-9999-9999-9999-999999999999', 'How It Works', 'Learn about our AI therapy approach and safety measures', '/how-it-works', 'HelpCircle', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('21000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-5555-5555-5555-555555555555', '10000000-9999-9999-9999-999999999999', 'Support Center', 'Comprehensive help documentation and technical support', '/support', 'LifeBuoy', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('21000000-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-5555-5555-5555-555555555555', '10000000-9999-9999-9999-999999999999', 'Learning Hub', 'Educational resources and mental health articles', '/learning-hub', 'GraduationCap', 'from-flow-500 to-flow-600', null, 3, true, now(), now()),
('21000000-cccc-cccc-cccc-cccccccccccc', '00000000-5555-5555-5555-555555555555', '10000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Blog & Insights', 'Latest research and mental health insights from our expert team', '/blog', 'BookOpen', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('21000000-dddd-dddd-dddd-dddddddddddd', '00000000-5555-5555-5555-555555555555', '10000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Research & Studies', 'Academic research and evidence-based outcomes from our platform', '/research', 'FileText', 'from-therapy-400 to-therapy-500', null, 5, true, now(), now());

-- Restore normal replication role
SET session_replication_role = DEFAULT;

-- Verify the data was inserted correctly
SELECT 'Final verification - Total items: ' || COUNT(*) as result FROM public.navigation_menu_items;