
-- First, let's clear the existing data and insert the complete menu structure
DELETE FROM public.navigation_menu_items;
DELETE FROM public.navigation_menu_categories;
DELETE FROM public.navigation_menus;

-- Insert the main navigation menus
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

-- Insert all navigation menu items with exact content from the original header
INSERT INTO public.navigation_menu_items (id, menu_id, title, description, href, icon, gradient, badge, category, position, is_active) VALUES

-- Therapy AI Menu Items
('item-1', '1', 'AI Therapy Chat', 'Engage in personalized therapy conversations with advanced AI therapists trained in multiple therapeutic modalities', '/therapy-session', 'MessageSquare', 'from-therapy-500 to-therapy-600', 'Popular', 'ai-therapy', 1, true),
('item-2', '1', 'AI Personalization', 'Customize your AI therapist personality, communication style, and therapeutic approach preferences', '/ai-personalization', 'User', 'from-harmony-500 to-harmony-600', null, 'ai-therapy', 2, true),
('item-3', '1', 'Adaptive Systems', 'Advanced AI that learns and adapts to your unique therapeutic needs and progress patterns', '/adaptive-ai', 'Zap', 'from-flow-500 to-flow-600', 'Advanced', 'ai-therapy', 3, true),
('item-4', '1', 'Cognitive Behavioral Therapy', 'AI-guided CBT sessions focusing on thought patterns, behavioral changes, and practical coping strategies', '/cbt-therapy', 'Brain', 'from-calm-500 to-calm-600', null, 'specialized', 4, true),
('item-5', '1', 'Dialectical Behavior Therapy (DBT)', 'Comprehensive DBT skills training including mindfulness, distress tolerance, and emotion regulation', '/dbt-therapy', 'Heart', 'from-therapy-400 to-therapy-500', null, 'specialized', 5, true),
('item-6', '1', 'Mindfulness-Based Therapy', 'Integrate mindfulness practices with therapeutic conversations for enhanced self-awareness and emotional regulation', '/mindfulness-therapy', 'Compass', 'from-harmony-400 to-harmony-500', null, 'specialized', 6, true),
('item-7', '1', 'Trauma-Focused Therapy', 'Specialized AI therapy approaches for trauma recovery, PTSD support, and healing-focused interventions', '/trauma-therapy', 'Shield', 'from-flow-400 to-flow-500', null, 'specialized', 7, true),

-- Platform Menu Items
('item-8', '2', 'Dashboard', 'Your personalized mental health dashboard with progress tracking, insights, and session history', '/dashboard', 'LayoutDashboard', 'from-therapy-500 to-therapy-600', null, 'core', 1, true),
('item-9', '2', 'Mood & Progress Tracking', 'Track your daily mood, emotions, and therapeutic progress with detailed analytics and trend analysis', '/mood-tracking', 'TrendingUp', 'from-harmony-500 to-harmony-600', null, 'core', 2, true),
('item-10', '2', 'Goal Setting & Management', 'Set, track, and achieve your mental health goals with AI-powered guidance and milestone celebrations', '/goals', 'Target', 'from-flow-500 to-flow-600', null, 'core', 3, true),
('item-11', '2', 'Family Account Sharing', 'Share progress and insights with trusted family members while maintaining privacy controls', '/family-sharing', 'Users', 'from-calm-500 to-calm-600', null, 'social', 4, true),
('item-12', '2', 'Community & Groups', 'Connect with supportive peer groups and participate in moderated mental health discussions', '/community', 'Users', 'from-therapy-400 to-therapy-500', 'Pro', 'social', 5, true),
('item-13', '2', 'Integrations Hub', 'Connect with your favorite apps, wearables, and platforms for comprehensive wellness tracking', '/integrations', 'Plug', 'from-harmony-400 to-harmony-500', null, 'social', 6, true),

-- Tools & Data Menu Items
('item-14', '3', 'Analytics Dashboard', 'Comprehensive analytics of your mental health journey with detailed insights and progress visualization', '/analytics', 'BarChart3', 'from-therapy-500 to-therapy-600', null, 'analytics', 1, true),
('item-15', '3', 'Progress Reports', 'Detailed monthly and quarterly reports of your therapeutic progress and achievements', '/reports', 'FileText', 'from-harmony-500 to-harmony-600', 'Premium', 'analytics', 2, true),
('item-16', '3', 'API Access', 'Developer API for integrating TherapySync capabilities into your own applications and workflows', '/api-docs', 'Code', 'from-flow-500 to-flow-600', 'Developer', 'analytics', 3, true),
('item-17', '3', 'Mobile Apps', 'Native iOS and Android apps for therapy sessions, mood tracking, and progress monitoring on the go', '/mobile-apps', 'Smartphone', 'from-calm-500 to-calm-600', null, 'tools', 4, true),
('item-18', '3', 'Data Export', 'Export your complete therapy data, progress reports, and insights in multiple formats', '/data-export', 'Download', 'from-therapy-400 to-therapy-500', 'Pro', 'tools', 5, true),
('item-19', '3', 'Custom Integrations', 'Enterprise-grade custom integrations with your existing healthcare and wellness platforms', '/custom-integrations', 'Settings', 'from-harmony-400 to-harmony-500', 'Enterprise', 'tools', 6, true),

-- Solutions Menu Items
('item-20', '4', 'For Individuals', 'Personal mental health support with AI therapy, mood tracking, and progress insights', '/individual', 'User', 'from-therapy-500 to-therapy-600', null, 'audience', 1, true),
('item-21', '4', 'For Families', 'Family mental health plans with shared insights, parental controls, and collaborative goal setting', '/families', 'Users', 'from-harmony-500 to-harmony-600', null, 'audience', 2, true),
('item-22', '4', 'For Organizations', 'Enterprise mental health solutions for employee wellness programs and organizational support', '/organizations', 'Building', 'from-flow-500 to-flow-600', null, 'audience', 3, true),
('item-23', '4', 'Pricing Plans', 'Flexible pricing options from free basic access to premium enterprise solutions', '/pricing', 'CreditCard', 'from-calm-500 to-calm-600', null, 'pricing', 4, true),

-- Resources Menu Items
('item-24', '5', 'How It Works', 'Learn about our AI therapy approach, safety measures, and the science behind our platform', '/how-it-works', 'HelpCircle', 'from-therapy-500 to-therapy-600', null, 'learn', 1, true),
('item-25', '5', 'Support Center', 'Comprehensive help documentation, FAQs, and technical support for all platform features', '/support', 'LifeBuoy', 'from-harmony-500 to-harmony-600', null, 'learn', 2, true),
('item-26', '5', 'Learning Hub', 'Educational resources, mental health articles, and therapeutic technique guides', '/learning-hub', 'GraduationCap', 'from-flow-500 to-flow-600', null, 'learn', 3, true),
('item-27', '5', 'Blog & Insights', 'Latest research, mental health insights, and platform updates from our expert team', '/blog', 'BookOpen', 'from-calm-500 to-calm-600', null, 'community', 4, true),
('item-28', '5', 'Research & Studies', 'Academic research, clinical studies, and evidence-based outcomes from our AI therapy platform', '/research', 'FileText', 'from-therapy-400 to-therapy-500', null, 'community', 5, true);
