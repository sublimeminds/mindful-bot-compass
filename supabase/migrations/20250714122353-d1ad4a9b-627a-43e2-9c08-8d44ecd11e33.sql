-- Create comprehensive translation management tables

-- URL translations table for multilingual routing
CREATE TABLE public.url_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL, -- e.g., 'pricing', 'about', 'dashboard'
  language_code TEXT NOT NULL,
  original_path TEXT NOT NULL, -- e.g., '/pricing'
  translated_path TEXT NOT NULL, -- e.g., '/de/preis'
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(page_key, language_code)
);

-- SEO translations table for meta tags and descriptions
CREATE TABLE public.seo_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  schema_data JSONB,
  canonical_url TEXT,
  hreflang_data JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(page_key, language_code)
);

-- Content translations table for all website content
CREATE TABLE public.content_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_key TEXT NOT NULL, -- Unique identifier for content block
  content_type TEXT NOT NULL, -- 'ui', 'page_content', 'form_label', etc.
  source_language TEXT NOT NULL DEFAULT 'en',
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  context_type TEXT DEFAULT 'general', -- 'therapeutic', 'ui', 'crisis', etc.
  quality_score NUMERIC DEFAULT 0.0,
  translation_method TEXT DEFAULT 'ai', -- 'ai', 'human', 'hybrid'
  is_approved BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(content_key, target_language)
);

-- Translation jobs table for bulk operations tracking
CREATE TABLE public.translation_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_name TEXT NOT NULL,
  job_type TEXT NOT NULL, -- 'bulk_content', 'url_generation', 'seo_optimization'
  source_language TEXT NOT NULL DEFAULT 'en',
  target_languages TEXT[] NOT NULL,
  total_items INTEGER NOT NULL DEFAULT 0,
  completed_items INTEGER NOT NULL DEFAULT 0,
  failed_items INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed', 'paused'
  job_config JSONB, -- Configuration and options for the job
  results_summary JSONB, -- Summary of results when completed
  error_details JSONB, -- Error information if failed
  estimated_cost NUMERIC,
  actual_cost NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Translation review queue for quality control
CREATE TABLE public.translation_review_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_translation_id UUID REFERENCES public.content_translations(id),
  seo_translation_id UUID REFERENCES public.seo_translations(id),
  url_translation_id UUID REFERENCES public.url_translations(id),
  review_type TEXT NOT NULL, -- 'quality', 'cultural', 'therapeutic', 'technical'
  priority_level INTEGER DEFAULT 5, -- 1-10, 10 being highest priority
  assigned_to UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_review', 'approved', 'rejected', 'needs_revision'
  reviewer_notes TEXT,
  quality_metrics JSONB, -- Detailed quality assessment
  cultural_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id)
);

-- Translation analytics table for performance tracking
CREATE TABLE public.translation_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  language_pair TEXT NOT NULL, -- e.g., 'en-de', 'en-es'
  context_type TEXT,
  total_translations INTEGER DEFAULT 0,
  successful_translations INTEGER DEFAULT 0,
  failed_translations INTEGER DEFAULT 0,
  avg_quality_score NUMERIC DEFAULT 0.0,
  total_cost NUMERIC DEFAULT 0.0,
  total_tokens_used INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  user_satisfaction_score NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, language_pair, context_type)
);

-- Enable RLS on all tables
ALTER TABLE public.url_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for URL translations
CREATE POLICY "Admins can manage URL translations" ON public.url_translations
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view active URL translations" ON public.url_translations
  FOR SELECT USING (is_active = true);

-- RLS Policies for SEO translations
CREATE POLICY "Admins can manage SEO translations" ON public.seo_translations
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view active SEO translations" ON public.seo_translations
  FOR SELECT USING (is_active = true);

-- RLS Policies for content translations
CREATE POLICY "Admins can manage content translations" ON public.content_translations
  FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can view approved content translations" ON public.content_translations
  FOR SELECT USING (is_approved = true AND is_active = true);

-- RLS Policies for translation jobs
CREATE POLICY "Admins can manage translation jobs" ON public.translation_jobs
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for translation review queue
CREATE POLICY "Admins can manage translation reviews" ON public.translation_review_queue
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for translation analytics
CREATE POLICY "Admins can view translation analytics" ON public.translation_analytics
  FOR SELECT USING (is_admin(auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_translation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_url_translations_updated_at
  BEFORE UPDATE ON public.url_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_seo_translations_updated_at
  BEFORE UPDATE ON public.seo_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_content_translations_updated_at
  BEFORE UPDATE ON public.content_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_translation_jobs_updated_at
  BEFORE UPDATE ON public.translation_jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_translation_review_queue_updated_at
  BEFORE UPDATE ON public.translation_review_queue
  FOR EACH ROW EXECUTE FUNCTION public.update_translation_updated_at();

-- Insert default URL translations for common pages
INSERT INTO public.url_translations (page_key, language_code, original_path, translated_path) VALUES
('pricing', 'de', '/pricing', '/de/preise'),
('pricing', 'es', '/pricing', '/es/precios'),
('pricing', 'fr', '/pricing', '/fr/tarifs'),
('about', 'de', '/about', '/de/uber-uns'),
('about', 'es', '/about', '/es/acerca-de'),
('about', 'fr', '/about', '/fr/a-propos'),
('features', 'de', '/features', '/de/funktionen'),
('features', 'es', '/features', '/es/caracteristicas'),
('features', 'fr', '/features', '/fr/fonctionnalites'),
('dashboard', 'de', '/dashboard', '/de/dashboard'),
('dashboard', 'es', '/dashboard', '/es/panel'),
('dashboard', 'fr', '/dashboard', '/fr/tableau-de-bord');