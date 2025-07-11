-- Phase 1: Database & Multi-Therapist Architecture Enhancement

-- First, update therapist_selections to support multiple active therapists
ALTER TABLE therapist_selections 
ADD COLUMN specialty_focus text,
ADD COLUMN therapy_context text DEFAULT 'general',
ADD COLUMN treatment_phase text DEFAULT 'initial',
ADD COLUMN priority_level integer DEFAULT 1,
ADD COLUMN is_primary boolean DEFAULT false,
ADD COLUMN collaboration_notes text,
ADD COLUMN handoff_protocol jsonb DEFAULT '{}',
ADD COLUMN effectiveness_metrics jsonb DEFAULT '{}';

-- Remove the unique constraint on user_id to allow multiple therapists per user
-- (We'll keep the existing constraint but modify the logic)

-- Create therapist specialties mapping table
CREATE TABLE therapist_specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id uuid NOT NULL,
  specialty text NOT NULL,
  proficiency_level text DEFAULT 'intermediate',
  certification_details jsonb DEFAULT '{}',
  years_experience integer DEFAULT 0,
  success_rate numeric DEFAULT 0.0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for therapist_specialties
ALTER TABLE therapist_specialties ENABLE ROW LEVEL SECURITY;

-- Create policies for therapist_specialties
CREATE POLICY "Anyone can view therapist specialties" 
ON therapist_specialties 
FOR SELECT 
USING (true);

-- Create therapist teams table for coordinated care
CREATE TABLE therapist_teams (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  team_name text DEFAULT 'My Therapy Team',
  primary_therapist_id text,
  coordination_level text DEFAULT 'basic',
  shared_notes text,
  team_goals jsonb DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for therapist_teams
ALTER TABLE therapist_teams ENABLE ROW LEVEL SECURITY;

-- Create policies for therapist_teams
CREATE POLICY "Users can manage their own therapy teams" 
ON therapist_teams 
FOR ALL 
USING (auth.uid() = user_id);

-- Create therapist context switching logs
CREATE TABLE therapist_context_switches (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  from_therapist_id text,
  to_therapist_id text NOT NULL,
  switch_reason text,
  context_data jsonb DEFAULT '{}',
  session_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for therapist_context_switches
ALTER TABLE therapist_context_switches ENABLE ROW LEVEL SECURITY;

-- Create policies for therapist_context_switches
CREATE POLICY "Users can view their own context switches" 
ON therapist_context_switches 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create context switches" 
ON therapist_context_switches 
FOR INSERT 
WITH CHECK (true);

-- Update therapist_favorites to support specialty-based favorites
ALTER TABLE therapist_favorites 
ADD COLUMN specialty_preference text,
ADD COLUMN priority_ranking integer DEFAULT 1;

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