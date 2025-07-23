
-- Clear existing footer data and add comprehensive footer content
DELETE FROM public.footer_links;
DELETE FROM public.footer_sections;
DELETE FROM public.footer_content;

-- Create comprehensive footer sections
INSERT INTO public.footer_sections (name, label, position) VALUES
  ('company', 'Company', 1),
  ('product', 'Product', 2),
  ('platform', 'Platform', 3),
  ('resources', 'Resources', 4),
  ('connect', 'Connect', 5),
  ('legal', 'Legal', 6);

-- Insert comprehensive footer links
INSERT INTO public.footer_links (section_id, title, href, position, opens_in_new_tab) VALUES
  -- Company section
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'About Us', '/about', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Our Mission', '/mission', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Team', '/team', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Careers', '/careers', 4, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Press', '/press', 5, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Blog', '/blog', 6, false),
  
  -- Product section
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'AI Therapy', '/ai-therapy', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Mood Tracking', '/mood-tracking', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Progress Analytics', '/analytics', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Crisis Support', '/crisis-support', 4, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Mobile App', '/mobile', 5, false),
  
  -- Platform section
  ((SELECT id FROM public.footer_sections WHERE name = 'platform'), 'Dashboard', '/dashboard', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'platform'), 'Settings', '/settings', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'platform'), 'Integrations', '/integrations', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'platform'), 'API', '/api', 4, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'platform'), 'Security', '/security', 5, false),
  
  -- Resources section
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Help Center', '/help', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Documentation', '/docs', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Community', '/community', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Mental Health Resources', '/mental-health-resources', 4, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Research', '/research', 5, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'resources'), 'Webinars', '/webinars', 6, false),
  
  -- Connect section
  ((SELECT id FROM public.footer_sections WHERE name = 'connect'), 'Contact Us', '/contact', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'connect'), 'Support', '/support', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'connect'), 'Twitter', 'https://twitter.com/therapysync', 3, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'connect'), 'LinkedIn', 'https://linkedin.com/company/therapysync', 4, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'connect'), 'Instagram', 'https://instagram.com/therapysync', 5, true),
  ((SELECT id FROM public.footer_sections WHERE name = 'connect'), 'YouTube', 'https://youtube.com/therapysync', 6, true),
  
  -- Legal section
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Privacy Policy', '/privacy', 1, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Terms of Service', '/terms', 2, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Cookie Policy', '/cookies', 3, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'HIPAA Compliance', '/hipaa', 4, false),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Accessibility', '/accessibility', 5, false);

-- Update footer content with comprehensive information
INSERT INTO public.footer_content (content_key, content_type, content_value) VALUES
  ('company_name', 'text', 'TherapySync'),
  ('company_description', 'text', 'AI-powered mental health support designed to help you on your wellness journey. Our platform combines cutting-edge artificial intelligence with evidence-based therapy practices to provide personalized, accessible mental health care.'),
  ('copyright_text', 'text', '© 2024 TherapySync. All rights reserved.'),
  ('version', 'text', 'v2.1.0'),
  ('newsletter_title', 'text', 'Stay Connected'),
  ('newsletter_description', 'text', 'Get the latest updates on mental health, AI therapy insights, and wellness tips delivered to your inbox.'),
  ('contact_email', 'text', 'hello@therapysync.com'),
  ('support_email', 'text', 'support@therapysync.com'),
  ('phone_number', 'text', '+1 (555) 123-4567'),
  ('address', 'text', '123 Wellness Street, Mental Health City, CA 94102'),
  ('tagline', 'text', 'Your AI-powered companion for mental wellness');
