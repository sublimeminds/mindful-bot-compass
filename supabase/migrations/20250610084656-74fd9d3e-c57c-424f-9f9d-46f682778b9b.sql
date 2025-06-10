
-- Create table for therapist personalities with detailed information
CREATE TABLE public.therapist_personalities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  approach TEXT NOT NULL,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  communication_style TEXT NOT NULL,
  experience_level TEXT NOT NULL DEFAULT 'all',
  color_scheme TEXT NOT NULL DEFAULT 'from-blue-500 to-blue-600',
  icon TEXT NOT NULL DEFAULT 'Brain',
  effectiveness_areas JSONB DEFAULT '{}',
  personality_traits JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for user-therapist compatibility assessments
CREATE TABLE public.therapist_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  responses JSONB NOT NULL DEFAULT '{}',
  recommended_therapists JSONB NOT NULL DEFAULT '{}',
  selected_therapist_id UUID REFERENCES therapist_personalities(id),
  assessment_version INTEGER NOT NULL DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for therapist compatibility scores and feedback
CREATE TABLE public.therapist_compatibility (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  therapist_id UUID REFERENCES therapist_personalities(id) NOT NULL,
  compatibility_score DECIMAL(3,2) NOT NULL CHECK (compatibility_score >= 0 AND compatibility_score <= 1),
  session_count INTEGER NOT NULL DEFAULT 0,
  average_rating DECIMAL(3,2),
  effectiveness_metrics JSONB DEFAULT '{}',
  last_interaction TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, therapist_id)
);

-- Add RLS policies
ALTER TABLE public.therapist_personalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_compatibility ENABLE ROW LEVEL SECURITY;

-- Therapist personalities are public (readable by all authenticated users)
CREATE POLICY "Anyone can view therapist personalities" 
  ON public.therapist_personalities 
  FOR SELECT 
  TO authenticated
  USING (is_active = true);

-- Users can only access their own assessments
CREATE POLICY "Users can view their own assessments" 
  ON public.therapist_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessments" 
  ON public.therapist_assessments 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Users can only access their own compatibility data
CREATE POLICY "Users can view their own compatibility data" 
  ON public.therapist_compatibility 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own compatibility data" 
  ON public.therapist_compatibility 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Insert initial therapist personalities
INSERT INTO public.therapist_personalities (
  name, title, description, approach, specialties, communication_style, 
  experience_level, color_scheme, icon, effectiveness_areas, personality_traits
) VALUES 
(
  'Dr. Sarah Chen',
  'CBT Specialist',
  'Focuses on identifying and changing negative thought patterns through evidence-based cognitive behavioral therapy techniques.',
  'Structured, goal-oriented, practical problem-solving',
  ARRAY['Anxiety', 'Depression', 'Thought Patterns', 'Behavioral Change'],
  'direct',
  'all',
  'from-blue-500 to-blue-600',
  'Brain',
  '{"anxiety": 0.9, "depression": 0.85, "behavioral_issues": 0.9, "goal_setting": 0.8}',
  '{"analytical": 0.9, "structured": 0.9, "empathetic": 0.7, "patient": 0.8}'
),
(
  'Dr. Maya Patel',
  'Mindfulness Coach',
  'Emphasizes present-moment awareness, meditation, and mindful living practices for emotional regulation.',
  'Gentle, reflective, mindfulness-based',
  ARRAY['Stress', 'Mindfulness', 'Emotional Regulation', 'Self-Compassion'],
  'supportive',
  'all',
  'from-green-500 to-green-600',
  'Heart',
  '{"stress": 0.9, "emotional_regulation": 0.95, "self_awareness": 0.9, "relaxation": 0.95}',
  '{"gentle": 0.95, "patient": 0.9, "wise": 0.85, "calming": 0.9}'
),
(
  'Dr. Alex Rodriguez',
  'Solution-Focused Therapist',
  'Concentrates on finding solutions and building on existing strengths rather than dwelling on problems.',
  'Optimistic, strength-based, future-focused',
  ARRAY['Goal Setting', 'Personal Growth', 'Motivation', 'Life Transitions'],
  'encouraging',
  'all',
  'from-yellow-500 to-orange-500',
  'Lightbulb',
  '{"motivation": 0.9, "goal_achievement": 0.95, "confidence_building": 0.85, "life_transitions": 0.8}',
  '{"optimistic": 0.95, "energetic": 0.85, "motivational": 0.9, "forward_thinking": 0.9}'
),
(
  'Dr. Jordan Kim',
  'Trauma-Informed Therapist',
  'Specializes in trauma-sensitive approaches with emphasis on safety, trust, and healing.',
  'Compassionate, patient, trauma-sensitive',
  ARRAY['Trauma Recovery', 'PTSD', 'Safety', 'Healing'],
  'gentle',
  'intermediate',
  'from-purple-500 to-purple-600',
  'Target',
  '{"trauma": 0.95, "ptsd": 0.9, "safety": 0.95, "trust_building": 0.9}',
  '{"compassionate": 0.95, "patient": 0.95, "gentle": 0.9, "understanding": 0.95}'
),
(
  'Dr. Taylor Morgan',
  'Relationship Counselor',
  'Focuses on improving communication, relationships, and social connections.',
  'Empathetic, communication-focused, interpersonal',
  ARRAY['Relationships', 'Communication', 'Social Skills', 'Conflict Resolution'],
  'analytical',
  'all',
  'from-pink-500 to-rose-500',
  'Users',
  '{"relationships": 0.95, "communication": 0.9, "social_skills": 0.85, "conflict_resolution": 0.9}',
  '{"empathetic": 0.95, "insightful": 0.9, "communicative": 0.95, "balanced": 0.85}'
),
(
  'Dr. River Stone',
  'Holistic Wellness Guide',
  'Takes a whole-person approach considering mental, physical, and spiritual well-being.',
  'Integrative, holistic, wellness-focused',
  ARRAY['Holistic Health', 'Life Balance', 'Wellness', 'Self-Discovery'],
  'exploratory',
  'all',
  'from-teal-500 to-cyan-500',
  'Compass',
  '{"holistic_wellness": 0.9, "life_balance": 0.95, "self_discovery": 0.9, "spiritual_growth": 0.85}',
  '{"holistic": 0.95, "intuitive": 0.9, "wise": 0.9, "integrative": 0.95}'
);
