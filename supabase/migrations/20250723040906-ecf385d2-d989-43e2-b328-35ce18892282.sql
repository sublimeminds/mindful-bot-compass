
-- Clear existing footer data and restore exact previous footer content
DELETE FROM public.footer_links;
DELETE FROM public.footer_sections;
DELETE FROM public.footer_content;

-- Create the exact footer sections from before
INSERT INTO public.footer_sections (name, label, position) VALUES
  ('company', 'Company', 1),
  ('product', 'Product', 2),
  ('resources', 'Resources', 3),
  ('support', 'Support', 4),
  ('legal', 'Legal', 5);

-- Insert the exact footer links from before
INSERT INTO public.footer_links (section_id, title, href, position, opens_in_new_tab) VALUES
  -- Company section
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'About', '/about', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Team', '/team', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Careers', '/careers', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Press', '/press', 4, false),
  
  -- Product section
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'AI Therapy', '/ai-therapy', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Mood Tracking', '/mood-tracking', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Progress Analytics', '/analytics', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Crisis Support', '/crisis-support', 4, false),
  
  -- Resources section
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Help Center', '/help', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Documentation', '/docs', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Community', '/community', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Blog', '/blog', 4, false),
  
  -- Support section
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Contact Us', '/contact', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Support Center', '/support', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Twitter', 'https://twitter.com/therapysync', 3, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'LinkedIn', 'https://linkedin.com/company/therapysync', 4, true),
  
  -- Legal section
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Privacy Policy', '/privacy', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Terms of Service', '/terms', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'HIPAA Compliance', '/hipaa', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Accessibility', '/accessibility', 4, false);

-- Update footer content (no newsletter)
INSERT INTO public.footer_content (content_key, content_type, content_value) VALUES
  ('company_name', 'text', 'TherapySync'),
  ('company_description', 'text', 'AI-powered mental health support designed to help you on your wellness journey.'),
  ('copyright_text', 'text', '© 2024 TherapySync. All rights reserved.'),
  ('contact_email', 'text', 'hello@therapysync.com'),
  ('support_email', 'text', 'support@therapysync.com'),
  ('tagline', 'text', 'Your AI-powered companion for mental wellness');

-- Add missing navigation menu items including CulturalAI under Therapy AI
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position, is_active) VALUES
  -- Add CulturalAI under Therapy AI menu
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'CulturalAI', 'Culturally-sensitive AI therapy tailored to your background', '/therapy/cultural-ai', 'Brain', 'from-purple-500 to-indigo-600', 3, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'therapy-ai'), 'Crisis Support', 'Immediate support for mental health emergencies', '/therapy/crisis', 'Heart', 'from-red-500 to-pink-600', 4, true),
  
  -- Add more platform items
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Profile', 'Manage your personal information and preferences', '/profile', 'User', 'from-blue-500 to-cyan-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'platform'), 'Calendar', 'Schedule and manage your therapy sessions', '/calendar', 'Calendar', 'from-green-500 to-emerald-500', 3, true),
  
  -- Add more tools & data items
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Goals Tracking', 'Set and track your mental health goals', '/goals', 'Target', 'from-yellow-500 to-orange-500', 2, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'tools-data'), 'Mood Insights', 'Analyze your emotional patterns and trends', '/mood-insights', 'TrendingUp', 'from-pink-500 to-rose-500', 3, true),
  
  -- Add solutions items
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Individuals', 'Personal mental health support and therapy', '/solutions/individuals', 'User', 'from-blue-500 to-indigo-500', 1, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'solutions'), 'For Teams', 'Mental health support for organizations', '/solutions/teams', 'Users', 'from-green-500 to-teal-500', 2, true),
  
  -- Add resources items
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Help Center', 'Find answers to common questions', '/help', 'BookOpen', 'from-purple-500 to-violet-500', 1, true),
  ((SELECT id FROM public.navigation_menus WHERE name = 'resources'), 'Mental Health Library', 'Educational content and resources', '/library', 'Book', 'from-indigo-500 to-blue-500', 2, true)
ON CONFLICT (menu_id, title) DO NOTHING;
