-- Fix header navigation by replacing dashboard functionality with informational pages

-- First, delete the current problematic menu items from Platform and Tools & Data menus
DELETE FROM public.navigation_menu_items 
WHERE menu_id IN (
  SELECT id FROM public.navigation_menus WHERE name IN ('platform', 'tools-data')
) 
AND title IN (
  'Dashboard', 'Goal Setting & Management', 'Analytics Dashboard', 
  'Progress Reports', 'AI Insights Engine', 'Video Sessions'
);

-- Delete existing items that need to be recreated with correct menu assignments
DELETE FROM public.navigation_menu_items 
WHERE id::text IN (
  '40000000-1111-1111-1111-111111111111',
  '20000000-9999-9999-9999-999999999999',
  '20000000-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '20000000-cccc-cccc-cccc-cccccccccccc',
  '20000000-dddd-dddd-dddd-dddddddddddd'
);

-- Insert correct Platform menu items (informational pages)
INSERT INTO public.navigation_menu_items (
  id, menu_id, title, description, href, icon, gradient, position, is_active
) VALUES 
-- Platform menu items
(
  gen_random_uuid(),
  (SELECT id FROM public.navigation_menus WHERE name = 'platform'),
  'AI Therapist Team',
  'Discover our diverse team of AI therapists, each specialized in different therapeutic approaches',
  '/therapist-discovery',
  'Users',
  'from-blue-500 to-blue-600',
  1,
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM public.navigation_menus WHERE name = 'platform'),
  'Mood & Progress Tracking',
  'Advanced mood tracking and progress monitoring tools to understand your mental health journey',
  '/mood-tracking',
  'TrendingUp',
  'from-green-500 to-green-600',
  2,
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM public.navigation_menus WHERE name = 'platform'),
  'Crisis Support System',
  '24/7 crisis intervention and emergency mental health resources when you need them most',
  '/crisis-support',
  'Shield',
  'from-red-500 to-red-600',
  3,
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM public.navigation_menus WHERE name = 'platform'),
  'Family Account Sharing',
  'Secure family mental health management with privacy controls and progress sharing',
  '/family-features',
  'Users',
  'from-purple-500 to-purple-600',
  4,
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM public.navigation_menus WHERE name = 'platform'),
  'Community & Groups',
  'Connect with supportive communities and join group therapy sessions with peers',
  '/community-features',
  'Users',
  'from-indigo-500 to-indigo-600',
  5,
  true
),
(
  gen_random_uuid(),
  (SELECT id FROM public.navigation_menus WHERE name = 'platform'),
  'Integrations Hub',
  'Connect with healthcare providers, wearables, and third-party mental health tools',
  '/integrations',
  'Link',
  'from-teal-500 to-teal-600',
  6,
  true
);

-- Update Tools & Data menu items to ensure they point to informational pages
UPDATE public.navigation_menu_items 
SET 
  href = '/api',
  description = 'Comprehensive API documentation for healthcare providers and developers'
WHERE menu_id = (SELECT id FROM public.navigation_menus WHERE name = 'tools-data')
  AND title = 'API Access';

UPDATE public.navigation_menu_items 
SET 
  href = '/mobile',
  description = 'Download our mobile apps for iOS and Android devices'
WHERE menu_id = (SELECT id FROM public.navigation_menus WHERE name = 'tools-data')
  AND title = 'Mobile Apps';

UPDATE public.navigation_menu_items 
SET 
  href = '/data-export',
  description = 'Learn about secure data export options and HIPAA-compliant data portability'
WHERE menu_id = (SELECT id FROM public.navigation_menus WHERE name = 'tools-data')
  AND title = 'Data Export';

UPDATE public.navigation_menu_items 
SET 
  href = '/custom-integrations',
  description = 'Enterprise-grade custom integrations with EHR systems and healthcare platforms'
WHERE menu_id = (SELECT id FROM public.navigation_menus WHERE name = 'tools-data')
  AND title = 'Custom Integrations';