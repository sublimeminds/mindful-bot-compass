-- Force complete navigation data reset with proper constraint handling
-- Remove all data and constraints first
SET session_replication_role = replica;

-- Drop and recreate foreign key constraints to ensure clean slate
ALTER TABLE IF EXISTS public.navigation_menu_items DROP CONSTRAINT IF EXISTS navigation_menu_items_menu_id_fkey;
ALTER TABLE IF EXISTS public.navigation_menu_items DROP CONSTRAINT IF EXISTS navigation_menu_items_category_id_fkey;
ALTER TABLE IF EXISTS public.navigation_menu_categories DROP CONSTRAINT IF EXISTS navigation_menu_categories_menu_id_fkey;

-- Truncate all tables to completely clear data
TRUNCATE public.navigation_menu_items CASCADE;
TRUNCATE public.navigation_menu_categories CASCADE;
TRUNCATE public.navigation_menus CASCADE;

-- Insert main navigation menus with text IDs
INSERT INTO public.navigation_menus (id, name, label, icon, position, is_active, created_at, updated_at) VALUES
('1', 'therapy-ai', 'Therapy AI', 'Brain', 1, true, now(), now()),
('2', 'platform', 'Platform', 'Settings', 2, true, now(), now()),
('3', 'tools-data', 'Tools & Data', 'BarChart3', 3, true, now(), now()),
('4', 'solutions', 'Solutions', 'Building', 4, true, now(), now()),
('5', 'resources', 'Resources', 'BookOpen', 5, true, now(), now());

-- Insert navigation categories
INSERT INTO public.navigation_menu_categories (id, menu_id, name, label, position, is_active, created_at, updated_at) VALUES
('cat-1', '1', 'ai-therapy', 'AI Therapy', 1, true, now(), now()),
('cat-2', '1', 'specialized', 'Specialized Approaches', 2, true, now(), now()),
('cat-3', '2', 'core', 'Core Features', 1, true, now(), now()),
('cat-4', '2', 'social', 'Social & Integration', 2, true, now(), now()),
('cat-5', '3', 'analytics', 'Analytics & Insights', 1, true, now(), now()),
('cat-6', '3', 'tools', 'Tools & Apps', 2, true, now(), now()),
('cat-7', '4', 'audience', 'By Audience', 1, true, now(), now()),
('cat-8', '4', 'pricing', 'Pricing', 2, true, now(), now()),
('cat-9', '5', 'learn', 'Learn & Support', 1, true, now(), now()),
('cat-10', '5', 'community', 'Community', 2, true, now(), now());

-- Insert all 28 navigation menu items
INSERT INTO public.navigation_menu_items (id, menu_id, category_id, title, description, href, icon, gradient, badge, position, is_active, created_at, updated_at) VALUES
-- Therapy AI Menu Items (7 items)
('item-1', '1', 'cat-1', 'AI Therapy Chat', 'Engage in personalized therapy conversations with advanced AI therapists', '/therapy-session', 'MessageSquare', 'from-therapy-500 to-therapy-600', 'Popular', 1, true, now(), now()),
('item-2', '1', 'cat-1', 'AI Personalization', 'Customize your AI therapist personality and communication style', '/ai-personalization', 'User', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('item-3', '1', 'cat-1', 'Adaptive Systems', 'Advanced AI that learns and adapts to your therapeutic needs', '/adaptive-ai', 'Zap', 'from-flow-500 to-flow-600', 'Advanced', 3, true, now(), now()),
('item-4', '1', 'cat-2', 'Cognitive Behavioral Therapy', 'AI-guided CBT sessions focusing on thought patterns and coping strategies', '/cbt-therapy', 'Brain', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('item-5', '1', 'cat-2', 'Dialectical Behavior Therapy', 'Comprehensive DBT skills training and emotion regulation', '/dbt-therapy', 'Heart', 'from-therapy-400 to-therapy-500', null, 5, true, now(), now()),
('item-6', '1', 'cat-2', 'Mindfulness-Based Therapy', 'Integrate mindfulness practices with therapeutic conversations', '/mindfulness-therapy', 'Compass', 'from-harmony-400 to-harmony-500', null, 6, true, now(), now()),
('item-7', '1', 'cat-2', 'Trauma-Focused Therapy', 'Specialized AI therapy approaches for trauma recovery and PTSD support', '/trauma-therapy', 'Shield', 'from-flow-400 to-flow-500', null, 7, true, now(), now()),

-- Platform Menu Items (6 items)
('item-8', '2', 'cat-3', 'Dashboard', 'Your personalized mental health dashboard with progress tracking', '/dashboard', 'LayoutDashboard', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('item-9', '2', 'cat-3', 'Mood & Progress Tracking', 'Track your daily mood and therapeutic progress with detailed analytics', '/mood-tracking', 'TrendingUp', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('item-10', '2', 'cat-3', 'Goal Setting & Management', 'Set and achieve your mental health goals with AI-powered guidance', '/goals', 'Target', 'from-flow-500 to-flow-600', null, 3, true, now(), now()),
('item-11', '2', 'cat-4', 'Family Account Sharing', 'Share progress with trusted family members with privacy controls', '/family-sharing', 'Users', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('item-12', '2', 'cat-4', 'Community & Groups', 'Connect with supportive peer groups and mental health discussions', '/community', 'Users', 'from-therapy-400 to-therapy-500', 'Pro', 5, true, now(), now()),
('item-13', '2', 'cat-4', 'Integrations Hub', 'Connect with your favorite apps and platforms for wellness tracking', '/integrations', 'Plug', 'from-harmony-400 to-harmony-500', null, 6, true, now(), now()),

-- Tools & Data Menu Items (6 items)
('item-14', '3', 'cat-5', 'Analytics Dashboard', 'Comprehensive analytics of your mental health journey', '/analytics', 'BarChart3', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('item-15', '3', 'cat-5', 'Progress Reports', 'Detailed monthly and quarterly reports of your therapeutic progress', '/reports', 'FileText', 'from-harmony-500 to-harmony-600', 'Premium', 2, true, now(), now()),
('item-16', '3', 'cat-5', 'API Access', 'Developer API for integrating TherapySync capabilities', '/api-docs', 'Code', 'from-flow-500 to-flow-600', 'Developer', 3, true, now(), now()),
('item-17', '3', 'cat-6', 'Mobile Apps', 'Native iOS and Android apps for therapy sessions on the go', '/mobile-apps', 'Smartphone', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('item-18', '3', 'cat-6', 'Data Export', 'Export your complete therapy data and progress reports', '/data-export', 'Download', 'from-therapy-400 to-therapy-500', 'Pro', 5, true, now(), now()),
('item-19', '3', 'cat-6', 'Custom Integrations', 'Enterprise-grade custom integrations with healthcare platforms', '/custom-integrations', 'Settings', 'from-harmony-400 to-harmony-500', 'Enterprise', 6, true, now(), now()),

-- Solutions Menu Items (4 items)
('item-20', '4', 'cat-7', 'For Individuals', 'Personal mental health support with AI therapy and mood tracking', '/individual', 'User', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('item-21', '4', 'cat-7', 'For Families', 'Family mental health plans with shared insights and parental controls', '/families', 'Users', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('item-22', '4', 'cat-7', 'For Organizations', 'Enterprise mental health solutions for employee wellness programs', '/organizations', 'Building', 'from-flow-500 to-flow-600', null, 3, true, now(), now()),
('item-23', '4', 'cat-8', 'Pricing Plans', 'Flexible pricing options from free basic access to premium solutions', '/pricing', 'CreditCard', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),

-- Resources Menu Items (5 items)
('item-24', '5', 'cat-9', 'How It Works', 'Learn about our AI therapy approach and safety measures', '/how-it-works', 'HelpCircle', 'from-therapy-500 to-therapy-600', null, 1, true, now(), now()),
('item-25', '5', 'cat-9', 'Support Center', 'Comprehensive help documentation and technical support', '/support', 'LifeBuoy', 'from-harmony-500 to-harmony-600', null, 2, true, now(), now()),
('item-26', '5', 'cat-9', 'Learning Hub', 'Educational resources and mental health articles', '/learning-hub', 'GraduationCap', 'from-flow-500 to-flow-600', null, 3, true, now(), now()),
('item-27', '5', 'cat-10', 'Blog & Insights', 'Latest research and mental health insights from our expert team', '/blog', 'BookOpen', 'from-calm-500 to-calm-600', null, 4, true, now(), now()),
('item-28', '5', 'cat-10', 'Research & Studies', 'Academic research and evidence-based outcomes from our platform', '/research', 'FileText', 'from-therapy-400 to-therapy-500', null, 5, true, now(), now());

-- Restore normal replication role
SET session_replication_role = DEFAULT;

-- Verify the data was inserted correctly
SELECT 'Final verification - Total items:' || COUNT(*) FROM public.navigation_menu_items;