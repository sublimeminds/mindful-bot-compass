
-- Create therapy plan translations table
CREATE TABLE public.therapy_plan_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapy_plan_id UUID NOT NULL REFERENCES therapy_plans(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL DEFAULT 'en',
  title TEXT,
  description TEXT,
  goals JSONB DEFAULT '[]'::jsonb,
  milestones JSONB DEFAULT '[]'::jsonb,
  focus_areas TEXT[],
  current_phase TEXT,
  cultural_adaptations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(therapy_plan_id, language_code)
);

-- Create therapeutic terminology database
CREATE TABLE public.therapeutic_terminology (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  english_term TEXT NOT NULL,
  german_term TEXT NOT NULL,
  category TEXT NOT NULL, -- 'technique', 'disorder', 'approach', 'concept'
  definition_en TEXT,
  definition_de TEXT,
  cultural_context JSONB DEFAULT '{}'::jsonb,
  usage_examples JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(english_term, category)
);

-- Create cultural AI content translations table
CREATE TABLE public.cultural_ai_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_library_id UUID NOT NULL REFERENCES cultural_content_library(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL DEFAULT 'en',
  translated_content JSONB NOT NULL,
  cultural_adaptations JSONB DEFAULT '{}'::jsonb,
  regional_variations JSONB DEFAULT '{}'::jsonb, -- Germany, Austria, Switzerland
  quality_score NUMERIC DEFAULT 0.9,
  reviewed_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(content_library_id, language_code)
);

-- Create therapy session translations table
CREATE TABLE public.therapy_session_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'en',
  session_notes TEXT,
  homework_assignments JSONB DEFAULT '[]'::jsonb,
  techniques_used JSONB DEFAULT '[]'::jsonb,
  cultural_considerations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(session_id, language_code)
);

-- Enable RLS on all new tables
ALTER TABLE public.therapy_plan_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_terminology ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultural_ai_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_session_translations ENABLE ROW LEVEL SECURITY;

-- RLS policies for therapy plan translations
CREATE POLICY "Users can view therapy plan translations for their plans"
  ON public.therapy_plan_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM therapy_plans tp 
      WHERE tp.id = therapy_plan_translations.therapy_plan_id 
      AND tp.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage therapy plan translations"
  ON public.therapy_plan_translations FOR ALL
  USING (true);

-- RLS policies for therapeutic terminology
CREATE POLICY "Anyone can view therapeutic terminology"
  ON public.therapeutic_terminology FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage therapeutic terminology"
  ON public.therapeutic_terminology FOR ALL
  USING (is_admin(auth.uid()));

-- RLS policies for cultural AI translations
CREATE POLICY "Anyone can view cultural AI translations"
  ON public.cultural_ai_translations FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage cultural AI translations"
  ON public.cultural_ai_translations FOR ALL
  USING (is_admin(auth.uid()));

-- RLS policies for therapy session translations
CREATE POLICY "Users can view their session translations"
  ON public.therapy_session_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM therapy_sessions ts 
      WHERE ts.id = therapy_session_translations.session_id 
      AND ts.user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage therapy session translations"
  ON public.therapy_session_translations FOR ALL
  USING (true);

-- Insert initial therapeutic terminology
INSERT INTO public.therapeutic_terminology (english_term, german_term, category, definition_en, definition_de) VALUES
('Cognitive Behavioral Therapy', 'Kognitive Verhaltenstherapie', 'approach', 'A form of psychotherapy that focuses on modifying dysfunctional emotions, behaviors, and thoughts', 'Eine Form der Psychotherapie, die sich auf die Modifikation dysfunktionaler Emotionen, Verhaltensweisen und Gedanken konzentriert'),
('Dialectical Behavior Therapy', 'Dialektisch-Behaviorale Therapie', 'approach', 'A cognitive-behavioral approach that emphasizes psychosocial aspects of treatment', 'Ein kognitiv-behavioraler Ansatz, der psychosoziale Aspekte der Behandlung betont'),
('Mindfulness', 'Achtsamkeit', 'technique', 'A mental state achieved by focusing awareness on the present moment', 'Ein mentaler Zustand, der durch das Fokussieren der Aufmerksamkeit auf den gegenwärtigen Moment erreicht wird'),
('Trauma-informed', 'Traumainformiert', 'approach', 'An approach that recognizes and responds to the impact of traumatic stress', 'Ein Ansatz, der die Auswirkungen von traumatischem Stress erkennt und darauf reagiert'),
('Therapeutic Alliance', 'Therapeutische Allianz', 'concept', 'The collaborative relationship between therapist and client', 'Die kollaborative Beziehung zwischen Therapeut und Klient'),
('Exposure Therapy', 'Expositionstherapie', 'technique', 'A technique that helps people face and control their fears', 'Eine Technik, die Menschen dabei hilft, ihren Ängsten zu begegnen und sie zu kontrollieren'),
('Anxiety', 'Angst', 'disorder', 'A feeling of worry, nervousness, or unease', 'Ein Gefühl von Sorge, Nervosität oder Unruhe'),
('Depression', 'Depression', 'disorder', 'A mental health condition characterized by persistent sadness', 'Eine psychische Erkrankung, die durch anhaltende Traurigkeit gekennzeichnet ist'),
('PTSD', 'PTBS', 'disorder', 'Post-Traumatic Stress Disorder', 'Posttraumatische Belastungsstörung'),
('Coping Strategies', 'Bewältigungsstrategien', 'technique', 'Methods used to deal with stressful situations', 'Methoden, die verwendet werden, um mit stressigen Situationen umzugehen');

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_therapy_translation_timestamps()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_therapy_plan_translations_updated_at
    BEFORE UPDATE ON public.therapy_plan_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_therapy_translation_timestamps();

CREATE TRIGGER update_therapeutic_terminology_updated_at
    BEFORE UPDATE ON public.therapeutic_terminology
    FOR EACH ROW
    EXECUTE FUNCTION update_therapy_translation_timestamps();

CREATE TRIGGER update_cultural_ai_translations_updated_at
    BEFORE UPDATE ON public.cultural_ai_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_therapy_translation_timestamps();

CREATE TRIGGER update_therapy_session_translations_updated_at
    BEFORE UPDATE ON public.therapy_session_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_therapy_translation_timestamps();
