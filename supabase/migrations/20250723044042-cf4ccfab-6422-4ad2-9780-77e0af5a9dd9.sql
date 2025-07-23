
-- Add missing navigation menu items and fix footer structure
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  -- Therapy AI menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'CulturalAI', 'Culturally-sensitive AI therapy tailored to your background', '/therapy/cultural-ai', 'Brain', 'from-purple-500 to-indigo-600', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Crisis Support', 'Immediate support for mental health emergencies', '/therapy/crisis', 'Heart', 'from-red-500 to-pink-600', 4, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Therapy Chat', 'Interactive AI therapy conversations', '/therapy/chat', 'MessageCircle', 'from-green-500 to-teal-600', 5, true),
  
  -- Platform menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Profile', 'Manage your personal information and preferences', '/profile', 'User', 'from-blue-500 to-cyan-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Calendar', 'Schedule and manage your therapy sessions', '/calendar', 'Calendar', 'from-green-500 to-emerald-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Settings', 'Configure your account and preferences', '/settings', 'Settings', 'from-gray-500 to-slate-600', 4, true),
  
  -- Tools & Data menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Goals Tracking', 'Set and track your mental health goals', '/goals', 'Target', 'from-yellow-500 to-orange-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Mood Insights', 'Analyze your emotional patterns and trends', '/mood-insights', 'TrendingUp', 'from-pink-500 to-rose-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Analytics', 'Detailed progress and performance analytics', '/analytics', 'BarChart3', 'from-indigo-500 to-purple-600', 4, true),
  
  -- Solutions menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Individuals', 'Personal mental health support and therapy', '/solutions/individuals', 'User', 'from-blue-500 to-indigo-500', 1, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Teams', 'Mental health support for organizations', '/solutions/teams', 'Users', 'from-green-500 to-teal-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Healthcare', 'Solutions for healthcare providers', '/solutions/healthcare', 'Building', 'from-purple-500 to-violet-500', 3, true),
  
  -- Resources menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Help Center', 'Find answers to common questions', '/help', 'BookOpen', 'from-purple-500 to-violet-500', 1, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Mental Health Library', 'Educational content and resources', '/library', 'Book', 'from-indigo-500 to-blue-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Community', 'Connect with others on similar journeys', '/community', 'Users', 'from-green-500 to-emerald-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Blog', 'Latest insights and mental health tips', '/blog', 'FileText', 'from-orange-500 to-yellow-500', 4, true)
ON CONFLICT (menu_id, title) DO NOTHING;

-- Remove the connect category from footer and restore social icons directly in support section
DELETE FROM public.footer_links WHERE section_id = (SELECT id FROM public.footer_sections WHERE name = 'connect');
DELETE FROM public.footer_sections WHERE name = 'connect';

-- Add social media links directly to the support section
INSERT INTO public.footer_links (section_id, title, href, position, opens_in_new_tab) VALUES
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Twitter', 'https://twitter.com/therapysync', 3, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'LinkedIn', 'https://linkedin.com/company/therapysync', 4, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Instagram', 'https://instagram.com/therapysync', 5, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'YouTube', 'https://youtube.com/therapysync', 6, true)
ON CONFLICT DO NOTHING;
