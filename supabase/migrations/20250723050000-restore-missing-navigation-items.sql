
-- Restore missing navigation menu items
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  -- Therapy AI menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'CulturalAI', 'Culturally-sensitive AI therapy tailored to your background', '/therapy/cultural-ai', 'Brain', 'from-purple-500 to-indigo-600', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Crisis Support', 'Immediate support for mental health emergencies', '/therapy/crisis', 'Heart', 'from-red-500 to-pink-600', 4, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Therapy Chat', 'Interactive AI therapy conversations', '/therapy/chat', 'MessageCircle', 'from-green-500 to-teal-600', 5, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Voice Therapy', 'AI therapy with voice interaction', '/therapy/voice', 'MessageCircle', 'from-teal-500 to-cyan-600', 6, true),
  
  -- Platform menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Profile', 'Manage your personal information and preferences', '/profile', 'User', 'from-blue-500 to-cyan-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Calendar', 'Schedule and manage your therapy sessions', '/calendar', 'Calendar', 'from-green-500 to-emerald-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Settings', 'Configure your account and preferences', '/settings', 'Settings', 'from-gray-500 to-slate-600', 4, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Billing', 'Manage your subscription and billing', '/billing', 'Settings', 'from-yellow-500 to-orange-500', 5, true),
  
  -- Tools & Data menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Goals Tracking', 'Set and track your mental health goals', '/goals', 'Target', 'from-yellow-500 to-orange-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Mood Insights', 'Analyze your emotional patterns and trends', '/mood-insights', 'TrendingUp', 'from-pink-500 to-rose-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Analytics', 'Detailed progress and performance analytics', '/analytics', 'BarChart3', 'from-indigo-500 to-purple-600', 4, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Therapy History', 'Review your past therapy sessions', '/therapy-history', 'FileText', 'from-blue-500 to-indigo-500', 5, true),
  
  -- Solutions menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Individuals', 'Personal mental health support and therapy', '/solutions/individuals', 'User', 'from-blue-500 to-indigo-500', 1, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Teams', 'Mental health support for organizations', '/solutions/teams', 'Users', 'from-green-500 to-teal-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Healthcare', 'Solutions for healthcare providers', '/solutions/healthcare', 'Building', 'from-purple-500 to-violet-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Schools', 'Mental health support for educational institutions', '/solutions/schools', 'BookOpen', 'from-orange-500 to-red-500', 4, true),
  
  -- Resources menu items (restore missing ones)
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Help Center', 'Find answers to common questions', '/help', 'BookOpen', 'from-purple-500 to-violet-500', 1, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Mental Health Library', 'Educational content and resources', '/library', 'Book', 'from-indigo-500 to-blue-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Community', 'Connect with others on similar journeys', '/community', 'Users', 'from-green-500 to-emerald-500', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Blog', 'Latest insights and mental health tips', '/blog', 'FileText', 'from-orange-500 to-yellow-500', 4, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Research', 'Clinical studies and research findings', '/research', 'BarChart3', 'from-cyan-500 to-blue-500', 5, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Webinars', 'Educational webinars and workshops', '/webinars', 'Calendar', 'from-violet-500 to-purple-500', 6, true)
ON CONFLICT (menu_id, title) DO UPDATE SET
  description = EXCLUDED.description,
  href = EXCLUDED.href,
  icon = EXCLUDED.icon,
  gradient = EXCLUDED.gradient,
  position = EXCLUDED.position,
  is_active = EXCLUDED.is_active;

-- Ensure all menu items are properly ordered
UPDATE public.navigation_menu_items 
SET position = subquery.new_position
FROM (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY menu_id ORDER BY position, title) as new_position
  FROM public.navigation_menu_items 
  WHERE is_active = true
) AS subquery
WHERE navigation_menu_items.id = subquery.id;
