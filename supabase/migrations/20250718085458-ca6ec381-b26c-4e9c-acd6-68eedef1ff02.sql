
-- Expand therapist_personalities table to include avatar assets
ALTER TABLE therapist_personalities 
ADD COLUMN avatar_image_url TEXT,
ADD COLUMN avatar_style TEXT DEFAULT '3d_animated',
ADD COLUMN avatar_characteristics JSONB DEFAULT '{}',
ADD COLUMN avatar_emotions JSONB DEFAULT '{}';

-- Create avatar_assets table for storing multiple images per therapist
CREATE TABLE avatar_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES therapist_personalities(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL, -- 'portrait', 'emotion', 'pose'
  emotion_type TEXT, -- 'happy', 'empathetic', 'thoughtful', 'calm'
  file_url TEXT NOT NULL,
  file_metadata JSONB DEFAULT '{}',
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on avatar_assets
ALTER TABLE avatar_assets ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to avatar assets
CREATE POLICY "Public can view avatar assets" 
  ON avatar_assets 
  FOR SELECT 
  USING (true);

-- Insert new specialized therapists to fill coverage gaps
INSERT INTO therapist_personalities (
  name, title, description, approach, specialties, communication_style, 
  experience_level, color_scheme, icon, education, certifications, 
  therapeutic_techniques, therapist_tier, personality_traits, effectiveness_areas,
  emotional_responses, voice_characteristics, session_availability
) VALUES 
-- Eating Disorders Specialist
(
  'Dr. Luna Martinez',
  'Eating Disorders & Body Image Specialist',
  'Specializing in eating disorders with a holistic approach that addresses both psychological and physical aspects of recovery.',
  'Integrative approach combining CBT-E, DBT, and body-positive therapy',
  ARRAY['Eating Disorders', 'Body Image', 'Self-Esteem', 'Nutrition Psychology'],
  'gentle',
  'specialized',
  'from-rose-500 to-pink-600',
  'Heart',
  ARRAY['Ph.D. in Clinical Psychology', 'M.S. in Nutrition Psychology'],
  ARRAY['Certified Eating Disorder Specialist', 'DBT Intensive Training'],
  ARRAY['CBT-E', 'Dialectical Behavior Therapy', 'Body Positive Therapy', 'Mindful Eating'],
  'premium',
  '{"empathy": 0.95, "patience": 0.9, "non_judgmental": 0.95, "encouraging": 0.85}',
  '{"eating_disorders": 0.95, "body_image": 0.9, "self_esteem": 0.85}',
  '{"supportive": 0.9, "understanding": 0.95, "gentle": 0.9}',
  '{"tone": "warm", "pace": "slow", "emphasis": "reassuring"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [30, 45, 60]}'
),

-- OCD Specialist
(
  'Dr. Felix Chen',
  'OCD & Anxiety Disorders Specialist',
  'Expert in treating OCD and related disorders using evidence-based ERP therapy and cognitive approaches.',
  'Exposure and Response Prevention (ERP) with cognitive restructuring',
  ARRAY['OCD', 'Anxiety Disorders', 'Compulsive Behaviors', 'Intrusive Thoughts'],
  'structured',
  'specialized',
  'from-blue-600 to-indigo-700',
  'Shield',
  ARRAY['Ph.D. in Clinical Psychology', 'OCD Specialization Certificate'],
  ARRAY['ERP Therapy Certification', 'IOCDF Professional Member'],
  ARRAY['Exposure Response Prevention', 'CBT', 'Acceptance Commitment Therapy', 'Mindfulness'],
  'premium',
  '{"methodical": 0.9, "patient": 0.95, "systematic": 0.9, "encouraging": 0.8}',
  '{"ocd": 0.95, "anxiety": 0.9, "compulsions": 0.95}',
  '{"structured": 0.9, "reassuring": 0.85, "methodical": 0.9}',
  '{"tone": "calm", "pace": "measured", "emphasis": "systematic"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [45, 60, 90]}'
),

-- Bipolar/Mood Disorders Specialist
(
  'Dr. River Thompson',
  'Bipolar & Mood Disorders Expert',
  'Specialized in helping individuals manage bipolar disorder and complex mood disorders through integrated therapy approaches.',
  'Mood stabilization through CBT, DBT, and psychoeducation',
  ARRAY['Bipolar Disorder', 'Mood Disorders', 'Mood Stabilization', 'Medication Management'],
  'balanced',
  'specialized',
  'from-purple-600 to-violet-700',
  'Activity',
  ARRAY['Ph.D. in Clinical Psychology', 'Bipolar Disorder Specialization'],
  ARRAY['Bipolar Disorder Certification', 'Mood Disorders Training'],
  ARRAY['Cognitive Behavioral Therapy', 'Dialectical Behavior Therapy', 'Psychoeducation', 'Mood Tracking'],
  'premium',
  '{"stability": 0.9, "understanding": 0.95, "adaptability": 0.85, "supportive": 0.9}',
  '{"bipolar": 0.95, "mood_regulation": 0.9, "crisis_management": 0.85}',
  '{"steady": 0.9, "adaptive": 0.85, "understanding": 0.95}',
  '{"tone": "steady", "pace": "adaptive", "emphasis": "stabilizing"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [45, 60, 75]}'
),

-- Sleep Disorders Specialist
(
  'Dr. Nova Sleep',
  'Sleep Disorders & Insomnia Specialist',
  'Expert in treating sleep disorders using CBT-I and sleep hygiene approaches for better rest and mental health.',
  'Cognitive Behavioral Therapy for Insomnia (CBT-I) and sleep optimization',
  ARRAY['Sleep Disorders', 'Insomnia', 'Sleep Hygiene', 'Circadian Rhythm'],
  'calming',
  'specialized',
  'from-indigo-600 to-blue-800',
  'Moon',
  ARRAY['Ph.D. in Sleep Psychology', 'Sleep Medicine Certificate'],
  ARRAY['CBT-I Certification', 'Sleep Disorders Specialist'],
  ARRAY['CBT for Insomnia', 'Sleep Restriction Therapy', 'Relaxation Training', 'Sleep Hygiene Education'],
  'premium',
  '{"calming": 0.95, "patient": 0.9, "methodical": 0.85, "soothing": 0.95}',
  '{"sleep_disorders": 0.95, "insomnia": 0.9, "sleep_hygiene": 0.9}',
  '{"soothing": 0.95, "calm": 0.9, "peaceful": 0.9}',
  '{"tone": "soothing", "pace": "slow", "emphasis": "calming"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [30, 45, 60]}'
),

-- Grief/Bereavement Specialist
(
  'Dr. Sage Williams',
  'Grief & Bereavement Counselor',
  'Compassionate support for those experiencing loss, helping navigate the grieving process with understanding and care.',
  'Grief-informed therapy with elements of acceptance and meaning-making',
  ARRAY['Grief Counseling', 'Bereavement', 'Loss', 'End of Life'],
  'compassionate',
  'specialized',
  'from-amber-600 to-orange-700',
  'Heart',
  ARRAY['M.A. in Grief Counseling', 'Thanatology Certificate'],
  ARRAY['Certified Grief Counselor', 'Bereavement Specialist'],
  ARRAY['Grief Therapy', 'Meaning-Making', 'Narrative Therapy', 'Ritual and Ceremony'],
  'free',
  '{"compassion": 0.95, "empathy": 0.95, "patience": 0.9, "wisdom": 0.85}',
  '{"grief": 0.95, "bereavement": 0.9, "loss": 0.9}',
  '{"compassionate": 0.95, "gentle": 0.9, "understanding": 0.95}',
  '{"tone": "gentle", "pace": "patient", "emphasis": "compassionate"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [45, 60, 90]}'
),

-- Career/Life Coach Enhanced
(
  'Dr. Phoenix Carter',
  'Career & Life Transformation Coach',
  'Empowering individuals to create meaningful career paths and life transitions with confidence and clarity.',
  'Solution-focused coaching with strengths-based approach',
  ARRAY['Career Coaching', 'Life Transitions', 'Goal Setting', 'Professional Development'],
  'motivational',
  'specialized',
  'from-emerald-600 to-teal-700',
  'Target',
  ARRAY['M.A. in Organizational Psychology', 'Life Coaching Certification'],
  ARRAY['Certified Professional Coach', 'Career Development Facilitator'],
  ARRAY['Solution-Focused Coaching', 'Strengths Assessment', 'Goal Setting', 'Motivational Interviewing'],
  'free',
  '{"motivational": 0.9, "goal_oriented": 0.95, "encouraging": 0.9, "practical": 0.85}',
  '{"career_development": 0.9, "goal_achievement": 0.95, "life_transitions": 0.85}',
  '{"energizing": 0.9, "focused": 0.9, "encouraging": 0.9}',
  '{"tone": "energetic", "pace": "dynamic", "emphasis": "action-oriented"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [30, 45, 60]}'
),

-- Child/Adolescent Specialist (Additional)
(
  'Dr. Sky Anderson',
  'Child & Adolescent Therapist',
  'Specialized in working with children and teens, using play therapy and age-appropriate interventions.',
  'Play therapy and developmentally appropriate interventions',
  ARRAY['Child Therapy', 'Adolescent Counseling', 'Behavioral Issues', 'School Problems'],
  'playful',
  'specialized',
  'from-cyan-500 to-blue-600',
  'Smile',
  ARRAY['M.A. in Child Psychology', 'Play Therapy Certificate'],
  ARRAY['Registered Play Therapist', 'Child Therapy Specialist'],
  ARRAY['Play Therapy', 'Art Therapy', 'Behavioral Interventions', 'Family Systems'],
  'free',
  '{"playful": 0.9, "patient": 0.95, "creative": 0.9, "understanding": 0.9}',
  '{"child_therapy": 0.95, "adolescent_issues": 0.9, "behavioral_problems": 0.85}',
  '{"playful": 0.9, "encouraging": 0.9, "creative": 0.85}',
  '{"tone": "friendly", "pace": "adaptive", "emphasis": "engaging"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [30, 45, 60]}'
),

-- Elder Care/Aging Specialist
(
  'Dr. Willow Grace',
  'Elder Care & Aging Specialist',
  'Supporting older adults through life transitions, health challenges, and maintaining mental wellness in later life.',
  'Geriatric-focused therapy with life review and adaptation strategies',
  ARRAY['Elder Care', 'Aging Issues', 'Life Transitions', 'Health Anxiety'],
  'wise',
  'specialized',
  'from-slate-600 to-gray-700',
  'Users',
  ARRAY['Ph.D. in Geropsychology', 'Aging Studies Certificate'],
  ARRAY['Geropsychology Specialist', 'Elder Care Certified'],
  ARRAY['Life Review Therapy', 'Adaptation Strategies', 'Health Psychology', 'Reminiscence Therapy'],
  'free',
  '{"wisdom": 0.95, "patience": 0.95, "respect": 0.9, "understanding": 0.9}',
  '{"aging_issues": 0.95, "life_transitions": 0.9, "health_anxiety": 0.85}',
  '{"wise": 0.95, "patient": 0.9, "respectful": 0.9}',
  '{"tone": "respectful", "pace": "patient", "emphasis": "wise"}',
  '{"availability": "24/7", "response_time": "immediate", "session_lengths": [45, 60, 75]}'
);

-- Update onboarding problem categories to include new specialties
CREATE TABLE IF NOT EXISTS onboarding_problem_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_name TEXT NOT NULL,
  subcategories TEXT[] NOT NULL,
  related_therapists UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO onboarding_problem_categories (category_name, subcategories) VALUES
('Eating & Body Image', ARRAY['Anorexia', 'Bulimia', 'Binge Eating', 'Body Dysmorphia', 'Food Anxiety']),
('OCD & Compulsions', ARRAY['Obsessive Thoughts', 'Compulsive Behaviors', 'Checking', 'Counting', 'Contamination Fears']),
('Mood Disorders', ARRAY['Bipolar I', 'Bipolar II', 'Mood Swings', 'Mania', 'Depression Episodes']),
('Sleep Issues', ARRAY['Insomnia', 'Sleep Anxiety', 'Nightmares', 'Sleep Schedule', 'Sleep Hygiene']),
('Loss & Grief', ARRAY['Death of Loved One', 'Pet Loss', 'Relationship Loss', 'Job Loss', 'Life Changes']),
('Career & Life Goals', ARRAY['Career Change', 'Job Stress', 'Life Purpose', 'Goal Setting', 'Work-Life Balance']),
('Child & Teen Issues', ARRAY['School Problems', 'Behavioral Issues', 'Teen Anxiety', 'Bullying', 'Identity Issues']),
('Aging & Elder Care', ARRAY['Retirement Adjustment', 'Health Decline', 'Loneliness', 'Memory Concerns', 'End of Life']);
