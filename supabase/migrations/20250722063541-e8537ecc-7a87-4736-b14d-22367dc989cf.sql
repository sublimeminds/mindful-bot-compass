
-- Fix the navigation menu database with proper data clearing and insertion
-- First, temporarily disable triggers and constraints for clean data replacement
SET session_replication_role = replica;

-- Clear all existing navigation data using TRUNCATE for complete removal
TRUNCATE TABLE public.navigation_menu_items RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.navigation_menu_categories RESTART IDENTITY CASCADE; 
TRUNCATE TABLE public.navigation_menus RESTART IDENTITY CASCADE;

-- Re-enable constraints
SET session_replication_role = DEFAULT;

-- Insert the main navigation menus (using TEXT IDs as designed)
INSERT INTO public.navigation_menus (id, name, label, icon, position, is_active) VALUES
('1', 'therapy-ai', 'Therapy AI', 'Brain', 1, true),
('2', 'platform', 'Platform', 'Settings', 2, true),
('3', 'tools-data', 'Tools & Data', 'BarChart3', 3, true),
('4', 'solutions', 'Solutions', 'Building', 4, true),
('5', 'resources', 'Resources', 'BookOpen', 5, true);

-- Insert categories for proper grouping  
INSERT INTO public.navigation_menu_categories (id, menu_id, name, label, position, is_active) VALUES
('cat-1', '1', 'ai-therapy', 'AI Therapy', 1, true),
('cat-2', '1', 'specialized', 'Specialized Approaches', 2, true),
('cat-3', '2', 'core', 'Core Features', 1, true),
('cat-4', '2', 'social', 'Social & Integration', 2, true),
('cat-5', '3', 'analytics', 'Analytics & Insights', 1, true),
('cat-6', '3', 'tools', 'Tools & Apps', 2, true),
('cat-7', '4', 'audience', 'By Audience', 1, true),
('cat-8', '4', 'pricing', 'Pricing', 2, true),
('cat-9', '5', 'learn', 'Learn & Support', 1, true),
('cat-10', '5', 'community', 'Community', 2, true);

-- Insert all 28 navigation menu items with complete data
INSERT INTO public.navigation_menu_items (id, menu_id, category_id, title, description, href, icon, gradient, badge, position, is_active) VALUES

-- Therapy AI Menu Items (7 items)
('item-1', '1', 'cat-1', 'AI Therapy Chat', 'Engage in personalized therapy conversations with advanced AI therapists trained in multiple therapeutic modalities', '/therapy-session', 'MessageSquare', 'from-therapy-500 to-therapy-600', 'Popular', 1, true),
('item-2', '1', 'cat-1', 'AI Personalization', 'Customize your AI therapist personality, communication style, and therapeutic approach preferences', '/ai-personalization', 'User', 'from-harmony-500 to-harmony-600', null, 2, true),
('item-3', '1', 'cat-1', 'Adaptive Systems', 'Advanced AI that learns and adapts to your unique therapeutic needs and progress patterns', '/adaptive-ai', 'Zap', 'from-flow-500 to-flow-600', 'Advanced', 3, true),
('item-4', '1', 'cat-2', 'Cognitive Behavioral Therapy', 'AI-guided CBT sessions focusing on thought patterns, behavioral changes, and practical coping strategies', '/cbt-therapy', 'Brain', 'from-calm-500 to-calm-600', null, 4, true),
('item-5', '1', 'cat-2', 'Dialectical Behavior Therapy (DBT)', 'Comprehensive DBT skills training including mindfulness, distress tolerance, and emotion regulation', '/dbt-therapy', 'Heart', 'from-therapy-400 to-therapy-500', null, 5, true),
('item-6', '1', 'cat-2', 'Mindfulness-Based Therapy', 'Integrate mindfulness practices with therapeutic conversations for enhanced self-awareness and emotional regulation', '/mindfulness-therapy', 'Compass', 'from-harmony-400 to-harmony-500', null, 6, true),
('item-7', '1', 'cat-2', 'Trauma-Focused Therapy', 'Specialized AI therapy approaches for trauma recovery, PTSD support, and healing-focused interventions', '/trauma-therapy', 'Shield', 'from-flow-400 to-flow-500', null, 7, true),

-- Platform Menu Items (6 items)
('item-8', '2', 'cat-3', 'Dashboard', 'Your personalized mental health dashboard with progress tracking, insights, and session history', '/dashboard', 'LayoutDashboard', 'from-therapy-500 to-therapy-600', null, 1, true),
('item-9', '2', 'cat-3', 'Mood & Progress Tracking', 'Track your daily mood, emotions, and therapeutic progress with detailed analytics and trend analysis', '/mood-tracking', 'TrendingUp', 'from-harmony-500 to-harmony-600', null, 2, true),
('item-10', '2', 'cat-3', 'Goal Setting & Management', 'Set, track, and achieve your mental health goals with AI-powered guidance and milestone celebrations', '/goals', 'Target', 'from-flow-500 to-flow-600', null, 3, true),
('item-11', '2', 'cat-4', 'Family Account Sharing', 'Share progress and insights with trusted family members while maintaining privacy controls', '/family-sharing', 'Users', 'from-calm-500 to-calm-600', null, 4, true),
('item-12', '2', 'cat-4', 'Community & Groups', 'Connect with supportive peer groups and participate in moderated mental health discussions', '/community', 'Users', 'from-therapy-400 to-therapy-500', 'Pro', 5, true),
('item-13', '2', 'cat-4', 'Integrations Hub', 'Connect with your favorite apps, wearables, and platforms for comprehensive wellness tracking', '/integrations', 'Plug', 'from-harmony-400 to-harmony-500', null, 6, true),

-- Tools & Data Menu Items (6 items)
('item-14', '3', 'cat-5', 'Analytics Dashboard', 'Comprehensive analytics of your mental health journey with detailed insights and progress visualization', '/analytics', 'BarChart3', 'from-therapy-500 to-therapy-600', null, 1, true),
('item-15', '3', 'cat-5', 'Progress Reports', 'Detailed monthly and quarterly reports of your therapeutic progress and achievements', '/reports', 'FileText', 'from-harmony-500 to-harmony-600', 'Premium', 2, true),
('item-16', '3', 'cat-5', 'API Access', 'Developer API for integrating TherapySync capabilities into your own applications and workflows', '/api-docs', 'Code', 'from-flow-500 to-flow-600', 'Developer', 3, true),
('item-17', '3', 'cat-6', 'Mobile Apps', 'Native iOS and Android apps for therapy sessions, mood tracking, and progress monitoring on the go', '/mobile-apps', 'Smartphone', 'from-calm-500 to-calm-600', null, 4, true),
('item-18', '3', 'cat-6', 'Data Export', 'Export your complete therapy data, progress reports, and insights in multiple formats', '/data-export', 'Download', 'from-therapy-400 to-therapy-500', 'Pro', 5, true),
('item-19', '3', 'cat-6', 'Custom Integrations', 'Enterprise-grade custom integrations with your existing healthcare and wellness platforms', '/custom-integrations', 'Settings', 'from-harmony-400 to-harmony-500', 'Enterprise', 6, true),

-- Solutions Menu Items (4 items)
('item-20', '4', 'cat-7', 'For Individuals', 'Personal mental health support with AI therapy, mood tracking, and progress insights', '/individual', 'User', 'from-therapy-500 to-therapy-600', null, 1, true),
('item-21', '4', 'cat-7', 'For Families', 'Family mental health plans with shared insights, parental controls, and collaborative goal setting', '/families', 'Users', 'from-harmony-500 to-harmony-600', null, 2, true),
('item-22', '4', 'cat-7', 'For Organizations', 'Enterprise mental health solutions for employee wellness programs and organizational support', '/organizations', 'Building', 'from-flow-500 to-flow-600', null, 3, true),
('item-23', '4', 'cat-8', 'Pricing Plans', 'Flexible pricing options from free basic access to premium enterprise solutions', '/pricing', 'CreditCard', 'from-calm-500 to-calm-600', null, 4, true),

-- Resources Menu Items (5 items)
('item-24', '5', 'cat-9', 'How It Works', 'Learn about our AI therapy approach, safety measures, and the science behind our platform', '/how-it-works', 'HelpCircle', 'from-therapy-500 to-therapy-600', null, 1, true),
('item-25', '5', 'cat-9', 'Support Center', 'Comprehensive help documentation, FAQs, and technical support for all platform features', '/support', 'LifeBuoy', 'from-harmony-500 to-harmony-600', null, 2, true),
('item-26', '5', 'cat-9', 'Learning Hub', 'Educational resources, mental health articles, and therapeutic technique guides', '/learning-hub', 'GraduationCap', 'from-flow-500 to-flow-600', null, 3, true),
('item-27', '5', 'cat-10', 'Blog & Insights', 'Latest research, mental health insights, and platform updates from our expert team', '/blog', 'BookOpen', 'from-calm-500 to-calm-600', null, 4, true),
('item-28', '5', 'cat-10', 'Research & Studies', 'Academic research, clinical studies, and evidence-based outcomes from our AI therapy platform', '/research', 'FileText', 'from-therapy-400 to-therapy-500', null, 5, true);

-- Verify data insertion
SELECT 'Menus inserted: ' || COUNT(*) FROM public.navigation_menus;
SELECT 'Categories inserted: ' || COUNT(*) FROM public.navigation_menu_categories;  
SELECT 'Items inserted: ' || COUNT(*) FROM public.navigation_menu_items;
