
-- Create navigation menu tables for dynamic header management

-- Main navigation menus (Therapy AI, Platform, Tools & Data, etc.)
CREATE TABLE public.navigation_menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  label text NOT NULL,
  icon text NOT NULL,
  position integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Navigation menu categories (for grouping items within dropdowns)
CREATE TABLE public.navigation_menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid NOT NULL REFERENCES public.navigation_menus(id) ON DELETE CASCADE,
  name text NOT NULL,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Individual navigation menu items
CREATE TABLE public.navigation_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid NOT NULL REFERENCES public.navigation_menus(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.navigation_menu_categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  href text NOT NULL,
  icon text NOT NULL,
  gradient text NOT NULL,
  badge text,
  position integer NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_menu_items ENABLE ROW LEVEL SECURITY;

-- Public read access for active items
CREATE POLICY "Public can view active navigation menus" ON public.navigation_menus
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active navigation categories" ON public.navigation_menu_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active navigation items" ON public.navigation_menu_items
  FOR SELECT USING (is_active = true);

-- Admin management policies
CREATE POLICY "Admins can manage navigation menus" ON public.navigation_menus
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage navigation categories" ON public.navigation_menu_categories
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage navigation items" ON public.navigation_menu_items
  FOR ALL USING (is_admin(auth.uid()));

-- Insert main navigation menus
INSERT INTO public.navigation_menus (name, label, icon, position) VALUES
  ('therapy-ai', 'Therapy AI', 'Brain', 1),
  ('platform', 'Platform', 'Settings', 2),
  ('tools-data', 'Tools & Data', 'BarChart3', 3),
  ('solutions', 'Solutions', 'Building', 4),
  ('resources', 'Resources', 'BookOpen', 5);

-- Insert categories for Therapy AI menu
INSERT INTO public.navigation_menu_categories (menu_id, name, label, position)
SELECT id, 'ai-technology', 'AI Technology', 1 FROM public.navigation_menus WHERE name = 'therapy-ai'
UNION ALL
SELECT id, 'therapy-approaches', 'Therapy Approaches', 2 FROM public.navigation_menus WHERE name = 'therapy-ai';

-- Insert categories for Platform menu
INSERT INTO public.navigation_menu_categories (menu_id, name, label, position)
SELECT id, 'core-features', 'Core Features', 1 FROM public.navigation_menus WHERE name = 'platform'
UNION ALL
SELECT id, 'advanced-tools', 'Advanced Tools', 2 FROM public.navigation_menus WHERE name = 'platform';

-- Insert Therapy AI menu items
INSERT INTO public.navigation_menu_items (menu_id, category_id, title, description, href, icon, gradient, position)
SELECT 
  nm.id,
  nmc.id,
  'TherapySync AI Core',
  'Advanced AI-powered therapy sessions with personalized treatment plans and real-time adaptation',
  '/therapy/ai-core',
  'Brain',
  'from-therapy-500 to-therapy-600',
  1
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'therapy-ai' AND nmc.name = 'ai-technology'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'Cultural AI',
  'Culturally-aware AI that adapts to your background, values, and communication preferences',
  '/therapy/cultural-ai',
  'Globe',
  'from-harmony-500 to-harmony-600',
  2
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'therapy-ai' AND nmc.name = 'ai-technology'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'Voice AI Technology',
  'Natural voice interactions with emotion recognition and therapeutic voice responses',
  '/therapy/voice-ai',
  'Mic',
  'from-flow-500 to-flow-600',
  3
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'therapy-ai' AND nmc.name = 'ai-technology'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'Cognitive Behavioral Therapy',
  'AI-guided CBT sessions with thought pattern analysis and behavioral intervention strategies',
  '/therapy/cbt',
  'Target',
  'from-calm-500 to-calm-600',
  1
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'therapy-ai' AND nmc.name = 'therapy-approaches'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'Mindfulness & Meditation',
  'Guided mindfulness practices with AI-powered meditation sessions and stress reduction techniques',
  '/therapy/mindfulness',
  'Heart',
  'from-therapy-400 to-therapy-500',
  2
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'therapy-ai' AND nmc.name = 'therapy-approaches';

-- Insert Platform menu items
INSERT INTO public.navigation_menu_items (menu_id, category_id, title, description, href, icon, gradient, badge, position)
SELECT 
  nm.id,
  nmc.id,
  'AI Therapist Team',
  'Access to specialized AI therapists with different personalities and therapeutic approaches',
  '/platform/therapists',
  'Users',
  'from-therapy-500 to-therapy-600',
  'New',
  1
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'platform' AND nmc.name = 'core-features'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'Crisis Support System',
  '24/7 crisis intervention with immediate professional escalation and emergency protocols',
  '/platform/crisis-support',
  'Shield',
  'from-red-500 to-red-600',
  'Critical',
  2
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'platform' AND nmc.name = 'core-features'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'Analytics Dashboard',
  'Comprehensive analytics for tracking progress, mood patterns, and therapeutic outcomes',
  '/platform/analytics',
  'BarChart3',
  'from-flow-500 to-flow-600',
  NULL,
  1
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'platform' AND nmc.name = 'advanced-tools'

UNION ALL

SELECT 
  nm.id,
  nmc.id,
  'API Access',
  'RESTful APIs for healthcare providers to integrate therapy AI into existing systems',
  '/platform/api',
  'Code',
  'from-gray-500 to-gray-600',
  'Pro',
  2
FROM public.navigation_menus nm
JOIN public.navigation_menu_categories nmc ON nm.id = nmc.menu_id
WHERE nm.name = 'platform' AND nmc.name = 'advanced-tools';

-- Continue with remaining menus...
-- Insert Tools & Data items
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position)
SELECT 
  id,
  'Mood Tracking',
  'Advanced mood analytics with pattern recognition and predictive insights',
  '/tools/mood-tracking',
  'TrendingUp',
  'from-therapy-500 to-therapy-600',
  1
FROM public.navigation_menus WHERE name = 'tools-data'

UNION ALL

SELECT 
  id,
  'Progress Reports',
  'Detailed progress tracking with personalized insights and milestone celebrations',
  '/tools/progress',
  'FileText',
  'from-harmony-500 to-harmony-600',
  2
FROM public.navigation_menus WHERE name = 'tools-data';

-- Insert Solutions items
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position)
SELECT 
  id,
  'For Individuals',
  'Personal therapy AI designed for individual mental wellness and growth',
  '/solutions/individuals',
  'User',
  'from-therapy-500 to-therapy-600',
  1
FROM public.navigation_menus WHERE name = 'solutions'

UNION ALL

SELECT 
  id,
  'For Healthcare Providers',
  'Enterprise solutions for clinics, hospitals, and mental health organizations',
  '/solutions/healthcare',
  'Building',
  'from-flow-500 to-flow-600',
  2
FROM public.navigation_menus WHERE name = 'solutions';

-- Insert Resources items
INSERT INTO public.navigation_menu_items (menu_id, title, description, href, icon, gradient, position)
SELECT 
  id,
  'Getting Started',
  'Complete guide to using therapy AI effectively and safely',
  '/resources/getting-started',
  'BookOpen',
  'from-therapy-500 to-therapy-600',
  1
FROM public.navigation_menus WHERE name = 'resources'

UNION ALL

SELECT 
  id,
  'Security & Compliance',
  'HIPAA compliance, data security, and privacy protection information',
  '/resources/security',
  'Shield',
  'from-calm-500 to-calm-600',
  2
FROM public.navigation_menus WHERE name = 'resources';
