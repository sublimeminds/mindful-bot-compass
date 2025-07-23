
-- Create footer sections table for organizing footer content
CREATE TABLE IF NOT EXISTS public.footer_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  label text NOT NULL,
  position integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create footer links table for individual footer links
CREATE TABLE IF NOT EXISTS public.footer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES public.footer_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  href text NOT NULL,
  icon text,
  position integer NOT NULL DEFAULT 1,
  is_active boolean DEFAULT true,
  opens_in_new_tab boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create footer content table for dynamic text content
CREATE TABLE IF NOT EXISTS public.footer_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_key text NOT NULL UNIQUE,
  content_type text NOT NULL DEFAULT 'text',
  content_value text NOT NULL,
  language_code text DEFAULT 'en',
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content ENABLE ROW LEVEL SECURITY;

-- Create policies for footer sections
CREATE POLICY "Anyone can view active footer sections" ON public.footer_sections
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage footer sections" ON public.footer_sections
  FOR ALL USING (is_admin(auth.uid()));

-- Create policies for footer links
CREATE POLICY "Anyone can view active footer links" ON public.footer_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage footer links" ON public.footer_links
  FOR ALL USING (is_admin(auth.uid()));

-- Create policies for footer content
CREATE POLICY "Anyone can view active footer content" ON public.footer_content
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage footer content" ON public.footer_content
  FOR ALL USING (is_admin(auth.uid()));

-- Insert default footer sections
INSERT INTO public.footer_sections (name, label, position) VALUES
  ('company', 'Company', 1),
  ('product', 'Product', 2),
  ('support', 'Support', 3),
  ('legal', 'Legal', 4);

-- Insert default footer links
INSERT INTO public.footer_links (section_id, title, href, position) VALUES
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'About Us', '/about', 1),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Careers', '/careers', 2),
  ((SELECT id FROM public.footer_sections WHERE name = 'company'), 'Blog', '/blog', 3),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Features', '/#features', 1),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Pricing', '/#pricing', 2),
  ((SELECT id FROM public.footer_sections WHERE name = 'product'), 'Security', '/security', 3),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Help Center', '/help', 1),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Contact', '/contact', 2),
  ((SELECT id FROM public.footer_sections WHERE name = 'support'), 'Status', '/status', 3),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Privacy Policy', '/privacy', 1),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Terms of Service', '/terms', 2),
  ((SELECT id FROM public.footer_sections WHERE name = 'legal'), 'Cookie Policy', '/cookies', 3);

-- Insert default footer content
INSERT INTO public.footer_content (content_key, content_type, content_value) VALUES
  ('company_name', 'text', 'TherapySync'),
  ('company_description', 'text', 'AI-powered mental health support designed to help you on your wellness journey.'),
  ('copyright_text', 'text', '© 2024 TherapySync. All rights reserved.'),
  ('version', 'text', 'v2.1.0');

-- Create update triggers
CREATE OR REPLACE FUNCTION update_footer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_footer_sections_updated_at
  BEFORE UPDATE ON public.footer_sections
  FOR EACH ROW EXECUTE FUNCTION update_footer_updated_at();

CREATE TRIGGER update_footer_links_updated_at
  BEFORE UPDATE ON public.footer_links
  FOR EACH ROW EXECUTE FUNCTION update_footer_updated_at();

CREATE TRIGGER update_footer_content_updated_at
  BEFORE UPDATE ON public.footer_content
  FOR EACH ROW EXECUTE FUNCTION update_footer_updated_at();
