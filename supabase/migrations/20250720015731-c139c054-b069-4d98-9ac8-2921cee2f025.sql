
-- Create European cultural contexts table
CREATE TABLE public.european_cultural_contexts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code VARCHAR(2) NOT NULL,
  country_name TEXT NOT NULL,
  language_code VARCHAR(5) NOT NULL,
  cultural_profile JSONB NOT NULL DEFAULT '{}',
  communication_style TEXT NOT NULL DEFAULT 'direct',
  therapy_preferences JSONB NOT NULL DEFAULT '{}',
  mental_health_stigma_level TEXT NOT NULL DEFAULT 'medium',
  family_structure_importance TEXT NOT NULL DEFAULT 'medium',
  privacy_expectations TEXT NOT NULL DEFAULT 'high',
  crisis_support_info JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create European translation memory table
CREATE TABLE public.european_translation_memory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language VARCHAR(5) NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  translated_text TEXT NOT NULL,
  context_type TEXT NOT NULL DEFAULT 'general',
  therapeutic_category TEXT,
  cultural_adaptations JSONB DEFAULT '{}',
  translation_provider TEXT NOT NULL DEFAULT 'claude',
  quality_score DECIMAL(3,2) DEFAULT 0.95,
  usage_count INTEGER DEFAULT 1,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(source_text, source_language, target_language, context_type)
);

-- Create translation quality metrics table
CREATE TABLE public.translation_quality_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_id UUID REFERENCES public.european_translation_memory(id),
  provider TEXT NOT NULL,
  language_pair TEXT NOT NULL,
  quality_score DECIMAL(3,2) NOT NULL,
  response_time_ms INTEGER NOT NULL,
  user_feedback_score DECIMAL(3,2),
  cultural_accuracy_score DECIMAL(3,2),
  therapeutic_accuracy_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create real-time translation sessions table
CREATE TABLE public.realtime_translation_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  source_language VARCHAR(5) NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  cultural_context JSONB DEFAULT '{}',
  translation_count INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  quality_score DECIMAL(3,2) DEFAULT 0.95,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE public.european_cultural_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.european_translation_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_translation_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access for cultural contexts
CREATE POLICY "Public read access for cultural contexts" 
  ON public.european_cultural_contexts 
  FOR SELECT 
  USING (true);

-- Public read access for translation memory (for caching)
CREATE POLICY "Public read access for translation memory" 
  ON public.european_translation_memory 
  FOR SELECT 
  USING (true);

-- Service role can manage all translation data
CREATE POLICY "Service role can manage translation memory" 
  ON public.european_translation_memory 
  FOR ALL 
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage quality metrics" 
  ON public.translation_quality_metrics 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Users can manage their own translation sessions
CREATE POLICY "Users can manage their own translation sessions" 
  ON public.realtime_translation_sessions 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Insert European cultural contexts data
INSERT INTO public.european_cultural_contexts (country_code, country_name, language_code, cultural_profile, communication_style, therapy_preferences, mental_health_stigma_level, family_structure_importance, privacy_expectations, crisis_support_info) VALUES
-- Germanic Countries
('DE', 'Germany', 'de', '{"directness": "high", "punctuality": "critical", "authority_respect": "high"}', 'direct', '{"prefers_structured": true, "evidence_based": true}', 'medium', 'medium', 'very_high', '{"emergency": "112", "crisis_line": "0800 111 0 111"}'),
('AT', 'Austria', 'de', '{"directness": "medium", "formality": "high", "tradition": "important"}', 'formal', '{"prefers_traditional": true, "relationship_focused": true}', 'medium', 'high', 'very_high', '{"emergency": "112", "crisis_line": "142"}'),
('CH', 'Switzerland', 'de', '{"precision": "critical", "privacy": "paramount", "consensus": "important"}', 'formal', '{"prefers_evidence_based": true, "privacy_focused": true}', 'low', 'medium', 'extreme', '{"emergency": "112", "crisis_line": "143"}'),
('NL', 'Netherlands', 'nl', '{"directness": "very_high", "pragmatism": "high", "egalitarian": "high"}', 'very_direct', '{"prefers_practical": true, "solution_focused": true}', 'low', 'low', 'high', '{"emergency": "112", "crisis_line": "113"}'),

-- Nordic Countries
('SE', 'Sweden', 'sv', '{"consensus": "critical", "equality": "paramount", "introversion": "common"}', 'consensus', '{"prefers_collaborative": true, "equality_focused": true}', 'low', 'low', 'high', '{"emergency": "112", "crisis_line": "90101"}'),
('NO', 'Norway', 'nb', '{"egalitarian": "high", "nature_connection": "important", "work_life_balance": "critical"}', 'direct', '{"prefers_holistic": true, "outdoor_therapy": true}', 'low', 'medium', 'high', '{"emergency": "112", "crisis_line": "116117"}'),
('DK', 'Denmark', 'da', '{"hygge": "important", "informality": "high", "trust": "high"}', 'informal', '{"prefers_comfortable": true, "trust_based": true}', 'low', 'low', 'high', '{"emergency": "112", "crisis_line": "70201201"}'),
('FI', 'Finland', 'fi', '{"silence_comfort": "high", "sisu": "important", "introversion": "common"}', 'reserved', '{"prefers_quiet": true, "resilience_focused": true}', 'medium', 'medium', 'very_high', '{"emergency": "112", "crisis_line": "010 195 202"}'),

-- Romance Countries
('FR', 'France', 'fr', '{"intellectualism": "high", "formality": "important", "debate": "valued"}', 'intellectual', '{"prefers_analytical": true, "philosophy_integrated": true}', 'medium', 'high', 'very_high', '{"emergency": "112", "crisis_line": "3114"}'),
('ES', 'Spain', 'es', '{"family": "central", "expressiveness": "high", "social": "important"}', 'expressive', '{"prefers_family_integrated": true, "expressive_therapy": true}', 'medium', 'very_high', 'medium', '{"emergency": "112", "crisis_line": "717003717"}'),
('IT', 'Italy', 'it', '{"family": "paramount", "emotion": "valued", "tradition": "important"}', 'emotional', '{"prefers_family_therapy": true, "emotional_expression": true}', 'high', 'very_high', 'medium', '{"emergency": "112", "crisis_line": "199284284"}'),
('PT', 'Portugal', 'pt', '{"family": "important", "respect": "valued", "tradition": "important"}', 'respectful', '{"prefers_respectful": true, "family_involved": true}', 'high', 'high', 'medium', '{"emergency": "112", "crisis_line": "213544545"}'),
('RO', 'Romania', 'ro', '{"family": "central", "respect_elders": "important", "tradition": "valued"}', 'formal', '{"prefers_respectful": true, "elder_consultation": true}', 'high', 'very_high', 'medium', '{"emergency": "112", "crisis_line": "0800801200"}'),

-- Slavic Countries
('PL', 'Poland', 'pl', '{"family": "central", "respect": "important", "tradition": "valued"}', 'formal', '{"prefers_traditional": true, "family_integrated": true}', 'high', 'very_high', 'high', '{"emergency": "112", "crisis_line": "116123"}'),
('CZ', 'Czech Republic', 'cs', '{"skepticism": "common", "humor": "important", "pragmatism": "valued"}', 'pragmatic', '{"prefers_practical": true, "humor_integrated": true}', 'medium', 'medium', 'high', '{"emergency": "112", "crisis_line": "116111"}'),
('HU', 'Hungary', 'hu', '{"pessimism": "cultural", "intellectual": "valued", "formality": "important"}', 'formal', '{"prefers_intellectual": true, "structured_approach": true}', 'high', 'high', 'high', '{"emergency": "112", "crisis_line": "116123"}'),
('HR', 'Croatia', 'hr', '{"family": "important", "pride": "valued", "tradition": "important"}', 'proud', '{"prefers_respectful": true, "pride_sensitive": true}', 'medium', 'high', 'medium', '{"emergency": "112", "crisis_line": "01 4833 888"}'),

-- Other European Countries
('GR', 'Greece', 'el', '{"family": "paramount", "honor": "important", "tradition": "valued"}', 'passionate', '{"prefers_family_therapy": true, "honor_sensitive": true}', 'high', 'very_high', 'medium', '{"emergency": "112", "crisis_line": "1018"}'),
('EE', 'Estonia', 'et', '{"digital": "advanced", "efficiency": "valued", "introversion": "common"}', 'efficient', '{"prefers_digital": true, "efficiency_focused": true}', 'medium', 'low', 'very_high', '{"emergency": "112", "crisis_line": "6558088"}'),
('LV', 'Latvia', 'lv', '{"nature": "important", "resilience": "valued", "introversion": "common"}', 'reserved', '{"prefers_nature_integrated": true, "resilience_focused": true}', 'medium', 'medium', 'high', '{"emergency": "112", "crisis_line": "67222922"}'),
('LT', 'Lithuania', 'lt', '{"tradition": "important", "resilience": "valued", "family": "important"}', 'traditional', '{"prefers_traditional": true, "family_respectful": true}', 'medium', 'high', 'high', '{"emergency": "112", "crisis_line": "116123"}');

-- Create update triggers
CREATE OR REPLACE FUNCTION public.update_european_translation_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE TRIGGER update_european_cultural_contexts_updated_at
    BEFORE UPDATE ON public.european_cultural_contexts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_european_translation_updated_at();

CREATE TRIGGER update_european_translation_memory_updated_at
    BEFORE UPDATE ON public.european_translation_memory
    FOR EACH ROW
    EXECUTE FUNCTION public.update_european_translation_updated_at();
