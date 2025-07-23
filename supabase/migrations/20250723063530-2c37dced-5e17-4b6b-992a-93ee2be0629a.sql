
-- First, let's check what's currently in the database and add all missing items
-- This will ensure we have all the navigation items that should appear in the dropdowns

-- Add missing items to Therapy AI menu
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Voice Therapy', 'AI therapy with voice interaction', '/therapy/voice', 'Mic', 'from-teal-500 to-cyan-600', 6, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Video Therapy', 'AI therapy with video interaction', '/therapy/video', 'Video', 'from-violet-500 to-purple-600', 7, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Mindfulness', 'Guided mindfulness and meditation', '/therapy/mindfulness', 'Brain', 'from-emerald-500 to-green-600', 8, true)
ON CONFLICT (menu_id, title) DO NOTHING;

-- Add missing items to Platform menu
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Billing', 'Manage your subscription and billing', '/billing', 'CreditCard', 'from-yellow-500 to-orange-500', 5, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Security', 'Manage your account security settings', '/security', 'Shield', 'from-red-500 to-pink-500', 6, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Integrations', 'Connect with third-party services', '/integrations', 'Globe', 'from-purple-500 to-indigo-500', 7, true)
ON CONFLICT (menu_id, title) DO NOTHING;

-- Add missing items to Tools & Data menu
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Therapy History', 'Review your past therapy sessions', '/therapy-history', 'FileText', 'from-blue-500 to-indigo-500', 5, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Export Data', 'Export your therapy data and reports', '/export', 'FileText', 'from-gray-500 to-slate-600', 6, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Wellness Tracking', 'Track your overall wellness metrics', '/wellness', 'Heart', 'from-rose-500 to-red-500', 7, true)
ON CONFLICT (menu_id, title) DO NOTHING;

-- Add missing items to Solutions menu
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Schools', 'Mental health support for educational institutions', '/solutions/schools', 'BookOpen', 'from-orange-500 to-red-500', 4, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Therapists', 'Tools and resources for mental health professionals', '/solutions/therapists', 'Users', 'from-teal-500 to-cyan-500', 5, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'Enterprise', 'Large-scale mental health solutions', '/solutions/enterprise', 'Building', 'from-slate-500 to-gray-600', 6, true)
ON CONFLICT (menu_id, title) DO NOTHING;

-- Add missing items to Resources menu
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Research', 'Clinical studies and research findings', '/research', 'BarChart3', 'from-cyan-500 to-blue-500', 5, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Webinars', 'Educational webinars and workshops', '/webinars', 'Calendar', 'from-violet-500 to-purple-500', 6, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Certification', 'Professional certification programs', '/certification', 'Shield', 'from-amber-500 to-orange-500', 7, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Support Groups', 'Join peer support communities', '/support-groups', 'Users', 'from-emerald-500 to-green-500', 8, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Crisis Resources', 'Immediate help and crisis support', '/crisis-resources', 'Phone', 'from-red-500 to-rose-500', 9, true)
ON CONFLICT (menu_id, title) DO NOTHING;

-- Update positions to ensure proper ordering
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
