-- Create therapist_favorites table first
CREATE TABLE therapist_favorites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  therapist_id text NOT NULL,
  therapist_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, therapist_id)
);

-- Enable RLS for therapist_favorites
ALTER TABLE therapist_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies for therapist_favorites
CREATE POLICY "Users can manage their own therapist favorites" 
ON therapist_favorites 
FOR ALL 
USING (auth.uid() = user_id);

-- Now proceed with multi-therapist architecture enhancement
-- Update therapist_selections to support multiple active therapists
ALTER TABLE therapist_selections 
ADD COLUMN specialty_focus text,
ADD COLUMN therapy_context text DEFAULT 'general',
ADD COLUMN treatment_phase text DEFAULT 'initial',
ADD COLUMN priority_level integer DEFAULT 1,
ADD COLUMN is_primary boolean DEFAULT false,
ADD COLUMN collaboration_notes text,
ADD COLUMN handoff_protocol jsonb DEFAULT '{}',
ADD COLUMN effectiveness_metrics jsonb DEFAULT '{}';

-- Create therapist specialties mapping table
CREATE TABLE therapist_specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id text NOT NULL,
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
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
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