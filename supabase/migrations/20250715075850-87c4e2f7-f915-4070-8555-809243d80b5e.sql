-- Add therapist_tier column to therapist_personalities table
ALTER TABLE therapist_personalities 
ADD COLUMN IF NOT EXISTS therapist_tier text DEFAULT 'free' CHECK (therapist_tier IN ('free', 'premium', 'professional'));

-- Update existing therapist tiers based on ratings and specialties
UPDATE therapist_personalities 
SET therapist_tier = CASE 
    WHEN user_rating >= 4.8 AND success_rate >= 0.90 THEN 'professional'
    WHEN user_rating >= 4.6 AND success_rate >= 0.87 THEN 'premium'
    ELSE 'free'
END;

-- Ensure we have exactly 3 free tier therapists (highest rated from the free category)
WITH ranked_therapists AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY user_rating DESC, success_rate DESC) as rank
  FROM therapist_personalities 
  WHERE therapist_tier = 'free'
),
top_3_free AS (
  SELECT id FROM ranked_therapists WHERE rank <= 3
)
UPDATE therapist_personalities 
SET therapist_tier = 'premium'
WHERE therapist_tier = 'free' 
  AND id NOT IN (SELECT id FROM top_3_free);

-- Fix the cultural profiles upsert by creating a function for safe insertion
CREATE OR REPLACE FUNCTION public.upsert_user_cultural_profile(
  p_user_id uuid,
  p_cultural_background text DEFAULT NULL,
  p_primary_language text DEFAULT 'en',
  p_family_structure text DEFAULT 'individual',
  p_communication_style text DEFAULT 'direct',
  p_religious_considerations boolean DEFAULT false,
  p_religious_details text DEFAULT NULL,
  p_therapy_approach_preferences text[] DEFAULT '{}',
  p_cultural_sensitivities text[] DEFAULT '{}'
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id uuid;
BEGIN
  INSERT INTO user_cultural_profiles (
    user_id, cultural_background, primary_language, family_structure,
    communication_style, religious_considerations, religious_details,
    therapy_approach_preferences, cultural_sensitivities
  ) VALUES (
    p_user_id, p_cultural_background, p_primary_language, p_family_structure,
    p_communication_style, p_religious_considerations, p_religious_details,
    p_therapy_approach_preferences, p_cultural_sensitivities
  )
  ON CONFLICT (user_id) DO UPDATE SET
    cultural_background = EXCLUDED.cultural_background,
    primary_language = EXCLUDED.primary_language,
    family_structure = EXCLUDED.family_structure,
    communication_style = EXCLUDED.communication_style,
    religious_considerations = EXCLUDED.religious_considerations,
    religious_details = EXCLUDED.religious_details,
    therapy_approach_preferences = EXCLUDED.therapy_approach_preferences,
    cultural_sensitivities = EXCLUDED.cultural_sensitivities,
    updated_at = now()
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$$;