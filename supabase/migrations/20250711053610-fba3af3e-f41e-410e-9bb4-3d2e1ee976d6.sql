-- Create function to get user's active therapists by specialty
CREATE OR REPLACE FUNCTION get_user_active_therapists(user_id_param uuid, specialty_filter text DEFAULT NULL)
RETURNS TABLE(
  therapist_id text,
  specialty_focus text,
  therapy_context text,
  treatment_phase text,
  is_primary boolean,
  selection_reason text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ts.therapist_id,
    ts.specialty_focus,
    ts.therapy_context,
    ts.treatment_phase,
    ts.is_primary,
    ts.selection_reason
  FROM therapist_selections ts
  WHERE ts.user_id = user_id_param 
    AND ts.is_active = true
    AND (specialty_filter IS NULL OR ts.specialty_focus = specialty_filter)
  ORDER BY ts.is_primary DESC, ts.priority_level ASC;
END;
$$;

-- Create function to recommend therapist combinations
CREATE OR REPLACE FUNCTION recommend_therapist_combinations(
  user_id_param uuid,
  needed_specialties text[]
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  recommendations jsonb := '[]'::jsonb;
  specialty text;
  therapist_data jsonb;
BEGIN
  -- For each needed specialty, find best matching therapists
  FOREACH specialty IN ARRAY needed_specialties
  LOOP
    SELECT jsonb_agg(
      jsonb_build_object(
        'therapist_id', ts.therapist_id,
        'specialty', ts.specialty,
        'proficiency_level', ts.proficiency_level,
        'success_rate', ts.success_rate,
        'compatibility_score', 0.85 + (random() * 0.15) -- Placeholder scoring
      )
    ) INTO therapist_data
    FROM therapist_specialties ts
    WHERE ts.specialty = specialty
    ORDER BY ts.success_rate DESC, ts.years_experience DESC
    LIMIT 3;
    
    recommendations := recommendations || jsonb_build_object(
      'specialty', specialty,
      'recommended_therapists', COALESCE(therapist_data, '[]'::jsonb)
    );
  END LOOP;
  
  RETURN recommendations;
END;
$$;

-- Create trigger to update therapist_teams when selections change
CREATE OR REPLACE FUNCTION update_therapist_team_on_selection()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update or create therapist team entry
  INSERT INTO therapist_teams (user_id, primary_therapist_id)
  VALUES (
    NEW.user_id,
    CASE WHEN NEW.is_primary THEN NEW.therapist_id ELSE NULL END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    primary_therapist_id = CASE 
      WHEN NEW.is_primary THEN NEW.therapist_id 
      ELSE therapist_teams.primary_therapist_id 
    END,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create the trigger
CREATE TRIGGER update_team_on_therapist_selection
  AFTER INSERT OR UPDATE ON therapist_selections
  FOR EACH ROW
  EXECUTE FUNCTION update_therapist_team_on_selection();