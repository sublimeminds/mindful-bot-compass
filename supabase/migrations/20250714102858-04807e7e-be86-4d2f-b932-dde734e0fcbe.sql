-- Translation system tables for comprehensive multilingual support

-- Translation cache and memory
CREATE TABLE public.ai_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  context_type TEXT NOT NULL DEFAULT 'general', -- therapeutic, ui, crisis, cultural
  cultural_context TEXT, -- cultural adaptations applied
  translation_quality DECIMAL(3,2) DEFAULT 0.95,
  therapeutic_context JSONB, -- therapeutic context preservation
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  usage_count INTEGER DEFAULT 1,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  ai_model TEXT DEFAULT 'gpt-4.1-2025-04-14'
);

-- Translation versions and A/B testing
CREATE TABLE public.translation_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key TEXT NOT NULL,
  language_code TEXT NOT NULL,
  version_number INTEGER NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  context_data JSONB,
  quality_score DECIMAL(3,2),
  human_reviewed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Cultural adaptation rules
CREATE TABLE public.cultural_adaptations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code TEXT NOT NULL,
  cultural_context TEXT NOT NULL,
  adaptation_rules JSONB NOT NULL, -- rules for cultural adaptation
  therapeutic_modifications JSONB, -- therapy-specific cultural mods
  communication_style JSONB, -- formal/informal, directness, etc.
  emotional_expressions JSONB, -- how emotions are expressed culturally
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Translation quality feedback
CREATE TABLE public.translation_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_id UUID REFERENCES public.ai_translations(id),
  user_id UUID REFERENCES auth.users(id),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  feedback_type TEXT NOT NULL, -- accuracy, cultural, therapeutic, technical
  comments TEXT,
  improvements_suggested JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Real-time translation sessions
CREATE TABLE public.translation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  session_type TEXT NOT NULL, -- therapy, chat, crisis, general
  context_data JSONB,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  translation_quality_avg DECIMAL(3,2),
  cultural_adaptations_applied JSONB
);

-- Language preference learning
CREATE TABLE public.user_language_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  preferred_languages TEXT[] NOT NULL,
  communication_style TEXT DEFAULT 'balanced', -- formal, informal, balanced
  cultural_sensitivity_level TEXT DEFAULT 'high', -- low, medium, high
  auto_translate BOOLEAN DEFAULT true,
  translate_therapy_content BOOLEAN DEFAULT true,
  preserve_emotional_context BOOLEAN DEFAULT true,
  dialect_preference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Translation analytics
CREATE TABLE public.translation_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  language_pair TEXT NOT NULL, -- source-target language pair
  translation_count INTEGER DEFAULT 0,
  avg_quality_score DECIMAL(3,2),
  context_type TEXT NOT NULL,
  cultural_adaptations_count INTEGER DEFAULT 0,
  user_satisfaction_avg DECIMAL(3,2),
  api_cost DECIMAL(10,4) DEFAULT 0,
  response_time_avg DECIMAL(6,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date, language_pair, context_type)
);

-- Dynamic content localization
CREATE TABLE public.dynamic_content_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL, -- reference to original content
  content_type TEXT NOT NULL, -- ui_element, therapy_prompt, crisis_message, etc.
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_content TEXT NOT NULL,
  translated_content TEXT NOT NULL,
  localization_data JSONB, -- cultural adaptations, imagery changes, etc.
  approval_status TEXT DEFAULT 'pending', -- pending, approved, rejected
  human_reviewer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_ai_translations_lookup ON public.ai_translations(source_language, target_language, context_type);
CREATE INDEX idx_ai_translations_source_text ON public.ai_translations USING gin(to_tsvector('english', source_text));
CREATE INDEX idx_translation_versions_key ON public.translation_versions(translation_key, language_code);
CREATE INDEX idx_cultural_adaptations_lang ON public.cultural_adaptations(language_code);
CREATE INDEX idx_translation_sessions_user ON public.translation_sessions(user_id, started_at);
CREATE INDEX idx_translation_analytics_date ON public.translation_analytics(date, language_pair);

-- Enable Row Level Security
ALTER TABLE public.ai_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_adaptations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_content_translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own translations" ON public.ai_translations FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can create translations" ON public.ai_translations FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Translation versions are viewable by everyone" ON public.translation_versions FOR SELECT USING (true);
CREATE POLICY "Admins can manage translation versions" ON public.translation_versions FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Cultural adaptations are viewable by everyone" ON public.cultural_adaptations FOR SELECT USING (true);
CREATE POLICY "Admins can manage cultural adaptations" ON public.cultural_adaptations FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can manage their feedback" ON public.translation_feedback FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their translation sessions" ON public.translation_sessions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their language preferences" ON public.user_language_preferences FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Translation analytics are viewable by admins" ON public.translation_analytics FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Dynamic content translations viewable by everyone" ON public.dynamic_content_translations FOR SELECT USING (approval_status = 'approved');
CREATE POLICY "Admins can manage dynamic content translations" ON public.dynamic_content_translations FOR ALL USING (public.is_admin(auth.uid()));

-- Functions for translation management
CREATE OR REPLACE FUNCTION public.get_cached_translation(
  p_source_text TEXT,
  p_source_lang TEXT,
  p_target_lang TEXT,
  p_context_type TEXT DEFAULT 'general'
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cached_translation TEXT;
BEGIN
  SELECT translated_text INTO cached_translation
  FROM public.ai_translations
  WHERE source_text = p_source_text
    AND source_language = p_source_lang
    AND target_language = p_target_lang
    AND context_type = p_context_type
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Update usage count if found
  IF cached_translation IS NOT NULL THEN
    UPDATE public.ai_translations
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE source_text = p_source_text
      AND source_language = p_source_lang
      AND target_language = p_target_lang
      AND context_type = p_context_type;
  END IF;
  
  RETURN cached_translation;
END;
$$;

CREATE OR REPLACE FUNCTION public.store_translation(
  p_source_text TEXT,
  p_translated_text TEXT,
  p_source_lang TEXT,
  p_target_lang TEXT,
  p_context_type TEXT DEFAULT 'general',
  p_quality DECIMAL DEFAULT 0.95,
  p_cultural_context TEXT DEFAULT NULL,
  p_therapeutic_context JSONB DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  translation_id UUID;
BEGIN
  INSERT INTO public.ai_translations (
    source_text, translated_text, source_language, target_language,
    context_type, translation_quality, cultural_context,
    therapeutic_context, user_id, session_id
  ) VALUES (
    p_source_text, p_translated_text, p_source_lang, p_target_lang,
    p_context_type, p_quality, p_cultural_context,
    p_therapeutic_context, p_user_id, p_session_id
  )
  RETURNING id INTO translation_id;
  
  RETURN translation_id;
END;
$$;

-- Trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_translation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_translations_updated_at
  BEFORE UPDATE ON public.ai_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_translation_versions_updated_at
  BEFORE UPDATE ON public.translation_versions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_cultural_adaptations_updated_at
  BEFORE UPDATE ON public.cultural_adaptations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translation_updated_at();

CREATE TRIGGER update_user_language_preferences_updated_at
  BEFORE UPDATE ON public.user_language_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_translation_updated_at();