-- Create global cultural contexts table
CREATE TABLE IF NOT EXISTS public.global_cultural_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  language_code TEXT NOT NULL,
  region TEXT NOT NULL,
  cultural_profile JSONB NOT NULL DEFAULT '{}',
  communication_style TEXT NOT NULL DEFAULT 'direct',
  therapy_preferences JSONB NOT NULL DEFAULT '{}',
  mental_health_stigma_level TEXT NOT NULL DEFAULT 'medium',
  family_structure_importance TEXT NOT NULL DEFAULT 'medium',
  privacy_expectations TEXT NOT NULL DEFAULT 'medium',
  religious_cultural_factors JSONB NOT NULL DEFAULT '{}',
  crisis_support_info JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create global translation memory table
CREATE TABLE IF NOT EXISTS public.global_translation_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  source_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  context_type TEXT NOT NULL DEFAULT 'general',
  therapeutic_category TEXT,
  cultural_adaptations JSONB DEFAULT '{}',
  quality_score NUMERIC DEFAULT 0.95,
  usage_count INTEGER DEFAULT 1,
  user_id UUID,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_cultural_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_translation_memory ENABLE ROW LEVEL SECURITY;

-- RLS policies for global_cultural_contexts
CREATE POLICY "Anyone can view active cultural contexts" 
ON public.global_cultural_contexts 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage cultural contexts" 
ON public.global_cultural_contexts 
FOR ALL 
USING (is_admin(auth.uid()));

-- RLS policies for global_translation_memory
CREATE POLICY "Users can view their own translations" 
ON public.global_translation_memory 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can create translations" 
ON public.global_translation_memory 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update translations" 
ON public.global_translation_memory 
FOR UPDATE 
USING (true);

-- Insert comprehensive global cultural contexts
INSERT INTO public.global_cultural_contexts (country_code, country_name, language_code, region, cultural_profile, communication_style, therapy_preferences, mental_health_stigma_level, family_structure_importance, privacy_expectations, religious_cultural_factors, crisis_support_info) VALUES

-- Asia-Pacific
('CN', 'China', 'zh', 'Asia-Pacific', '{"collectivist": true, "hierarchy_respect": "high", "face_saving": "critical"}', 'indirect', '{"family_involvement": "high", "group_therapy": "preferred", "traditional_medicine_integration": true}', 'high', 'very_high', 'high', '{"traditional_medicine": true, "ancestral_wisdom": "important", "harmony_focus": true}', '{"family_notification": "required", "community_support": "available", "traditional_healers": "respected"}'),

('JP', 'Japan', 'ja', 'Asia-Pacific', '{"collectivist": true, "harmony": "critical", "perfectionism": "high"}', 'very_indirect', '{"individual_therapy": "preferred", "medication_acceptance": "high", "workplace_integration": true}', 'very_high', 'high', 'very_high', '{"meditation": true, "spiritual_cleansing": "important", "ancestor_reverence": true}', '{"family_involvement": "cautious", "workplace_considerations": "critical", "cultural_shame_awareness": true}'),

('IN', 'India', 'hi', 'Asia-Pacific', '{"collectivist": true, "spiritual": "high", "family_centered": "critical"}', 'indirect', '{"family_therapy": "essential", "spiritual_integration": "critical", "ayurveda_integration": true}', 'high', 'very_high', 'medium', '{"hinduism": true, "karma_beliefs": "important", "yoga_meditation": "integrated", "multiple_religions": true}', '{"extended_family": "involved", "religious_leaders": "consulted", "community_elders": "respected"}'),

-- Middle East & North Africa
('SA', 'Saudi Arabia', 'ar', 'Middle East', '{"collectivist": true, "islamic_values": "central", "gender_considerations": "critical"}', 'indirect', '{"gender_separated": "required", "family_involvement": "high", "religious_integration": "essential"}', 'very_high', 'very_high', 'very_high', '{"islam": "central", "prayer_integration": true, "islamic_counseling": "preferred", "gender_roles": "traditional"}', '{"religious_leader": "consulted", "family_patriarch": "involved", "community_imam": "available"}'),

('EG', 'Egypt', 'ar', 'Middle East', '{"collectivist": true, "hospitality": "high", "family_honor": "important"}', 'expressive', '{"family_therapy": "preferred", "religious_integration": "high", "community_support": true}', 'high', 'very_high', 'medium', '{"islam": "primary", "coptic_christian": "minority", "sufi_traditions": "present"}', '{"family_consultation": "expected", "religious_guidance": "sought", "community_networks": "strong"}'),

-- Sub-Saharan Africa
('NG', 'Nigeria', 'en', 'Africa', '{"collectivist": true, "respect_for_elders": "critical", "spiritual_beliefs": "central"}', 'expressive', '{"community_therapy": "preferred", "traditional_healing": "integrated", "extended_family": "involved"}', 'high', 'very_high', 'low', '{"christianity": true, "islam": true, "traditional_beliefs": "integrated", "spiritual_healing": "important"}', '{"community_leaders": "involved", "traditional_healers": "consulted", "religious_leaders": "central"}'),

('ZA', 'South Africa', 'en', 'Africa', '{"ubuntu_philosophy": true, "multicultural": "complex", "historical_trauma": "present"}', 'direct', '{"trauma_informed": "essential", "multicultural_therapy": "required", "community_healing": true}', 'medium', 'high', 'medium', '{"christianity": true, "traditional_african": true, "multiple_beliefs": "common"}', '{"ubuntu_principles": "applied", "community_support": "strong", "cultural_healing": "integrated"}'),

-- Americas
('MX', 'Mexico', 'es', 'Americas', '{"collectivist": true, "familismo": "central", "machismo_considerations": "present"}', 'warm_expressive', '{"family_therapy": "essential", "gender_considerations": "important", "cultural_identity": true}', 'medium', 'very_high', 'medium', '{"catholicism": "dominant", "indigenous_beliefs": "integrated", "day_of_dead": "cultural"}', '{"extended_family": "central", "godparents": "involved", "community_church": "supportive"}'),

('BR', 'Brazil', 'pt', 'Americas', '{"collectivist": true, "warmth": "high", "emotional_expression": "encouraged"}', 'very_expressive', '{"group_therapy": "preferred", "emotional_expression": "encouraged", "music_therapy": true}', 'medium', 'high', 'low', '{"catholicism": true, "spiritualism": "present", "candomble": "minority", "evangelical": "growing"}', '{"family_networks": "strong", "religious_community": "supportive", "carnival_therapy": "cultural"}'),

('CA', 'Canada', 'en', 'Americas', '{"individualist": true, "multiculturalism": "valued", "politeness": "important"}', 'polite_direct', '{"individual_therapy": "preferred", "multicultural_competency": "required", "indigenous_approaches": "respected"}', 'low', 'medium', 'high', '{"christianity": true, "secularism": "growing", "indigenous_spirituality": "respected", "multifaith": "common"}', '{"healthcare_system": "public", "multicultural_services": "available", "indigenous_protocols": "respected"}'),

-- Europe (additional)
('FR', 'France', 'fr', 'Europe', '{"individualist": true, "intellectual": "valued", "secularism": "important"}', 'direct_intellectual', '{"psychoanalysis": "traditional", "individual_therapy": "preferred", "philosophical_approach": true}', 'medium', 'medium', 'high', '{"secularism": "strong", "catholicism": "cultural", "rationalism": "valued"}', '{"public_healthcare": "available", "intellectual_discourse": "valued", "privacy_protected": true}'),

('IT', 'Italy', 'it', 'Europe', '{"collectivist": true, "family_centered": "high", "emotional_expression": "valued"}', 'expressive', '{"family_involvement": "high", "emotional_expression": "encouraged", "cultural_identity": true}', 'medium', 'very_high', 'medium', '{"catholicism": "cultural", "family_traditions": "important", "regional_identity": "strong"}', '{"family_consultation": "expected", "regional_approaches": "varied", "cultural_warmth": "healing"}'),

('ES', 'Spain', 'es', 'Europe', '{"collectivist": true, "family_oriented": "high", "regional_identity": "strong"}', 'warm_expressive', '{"family_therapy": "valued", "regional_approaches": "varied", "cultural_identity": true}', 'medium', 'high', 'medium', '{"catholicism": "cultural", "regional_traditions": "important", "secularism": "growing"}', '{"family_support": "strong", "regional_services": "varied", "cultural_integration": "important"}'),

-- Additional major regions
('RU', 'Russia', 'ru', 'Europe', '{"collectivist": true, "stoicism": "valued", "hierarchy_respect": "important"}', 'reserved_direct', '{"individual_therapy": "emerging", "traditional_values": "important", "family_consultation": true}', 'high', 'high', 'high', '{"orthodox_christianity": "cultural", "traditional_values": "important", "skepticism": "present"}', '{"family_involvement": "traditional", "formal_services": "developing", "cultural_barriers": "present"}'),

('TR', 'Turkey', 'tr', 'Europe', '{"collectivist": true, "hospitality": "high", "family_honor": "important"}', 'warm_indirect', '{"family_therapy": "preferred", "cultural_bridge": "east_west", "religious_integration": "variable"}', 'medium', 'very_high', 'medium', '{"islam": "majority", "secularism": "present", "cultural_diversity": "regional"}', '{"family_consultation": "expected", "religious_guidance": "available", "cultural_sensitivity": "required"}'),

('AU', 'Australia', 'en', 'Asia-Pacific', '{"individualist": true, "egalitarian": "valued", "outdoor_culture": "important"}', 'direct_casual', '{"individual_therapy": "preferred", "indigenous_approaches": "respected", "practical_solutions": true}', 'low', 'medium', 'medium', '{"secularism": "growing", "christianity": "cultural", "indigenous_spirituality": "respected"}', '{"public_healthcare": "available", "indigenous_protocols": "respected", "rural_considerations": "important"}'),

('KR', 'South Korea', 'ko', 'Asia-Pacific', '{"collectivist": true, "education_focused": "high", "technology_integrated": "advanced"}', 'indirect_formal', '{"individual_therapy": "growing", "family_involvement": "complex", "technology_integration": true}', 'very_high', 'high', 'high', '{"confucianism": "cultural", "buddhism": "present", "christianity": "growing", "ancestor_respect": true}', '{"family_pressure": "complex", "academic_stress": "acknowledged", "technology_solutions": "embraced"}');

-- Create indexes for better performance
CREATE INDEX idx_global_cultural_contexts_country_code ON public.global_cultural_contexts(country_code);
CREATE INDEX idx_global_cultural_contexts_language_code ON public.global_cultural_contexts(language_code);
CREATE INDEX idx_global_cultural_contexts_region ON public.global_cultural_contexts(region);
CREATE INDEX idx_global_translation_memory_lookup ON public.global_translation_memory(source_language, target_language, context_type);
CREATE INDEX idx_global_translation_memory_user ON public.global_translation_memory(user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_global_translation_memory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_global_translation_memory_updated_at
    BEFORE UPDATE ON public.global_translation_memory
    FOR EACH ROW
    EXECUTE FUNCTION update_global_translation_memory_updated_at();

CREATE TRIGGER update_global_cultural_contexts_updated_at
    BEFORE UPDATE ON public.global_cultural_contexts
    FOR EACH ROW
    EXECUTE FUNCTION update_global_translation_memory_updated_at();