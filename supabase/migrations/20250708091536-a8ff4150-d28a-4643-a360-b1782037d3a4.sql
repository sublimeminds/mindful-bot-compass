-- Add more specialized therapists
INSERT INTO public.therapist_personalities (
  id, name, title, description, approach, specialties, communication_style, 
  experience_level, color_scheme, icon, personality_traits, effectiveness_areas, is_active
) VALUES 
-- Trauma & PTSD Specialist
(
  gen_random_uuid(),
  'Dr. Casey Williams',
  'Trauma & PTSD Specialist',
  'Specialist in trauma-informed care with extensive training in EMDR, somatic therapies, and complex PTSD treatment. Provides gentle, grounding support for healing.',
  'Trauma-Informed EMDR Therapy',
  ARRAY['Trauma Recovery', 'PTSD', 'Complex Trauma', 'EMDR', 'Somatic Therapy', 'Crisis Intervention'],
  'Gentle, grounding, and trauma-informed',
  'Expert',
  'from-slate-500 to-slate-600',
  'Shield',
  '{"safety": 5, "grounding": 5, "patience": 5, "trauma_informed": 5, "gentleness": 5}'::jsonb,
  '{"trauma_recovery": 0.97, "ptsd_treatment": 0.95, "crisis_support": 0.93, "emotional_regulation": 0.91, "grounding_techniques": 0.94}'::jsonb,
  true
),

-- Addiction & Recovery Specialist
(
  gen_random_uuid(),
  'Dr. Phoenix Rivera',
  'Addiction & Recovery Specialist',
  'Expert in addiction recovery with a compassionate, non-judgmental approach. Specializes in substance abuse, behavioral addictions, and relapse prevention strategies.',
  'Motivational Interviewing & CBT',
  ARRAY['Addiction Recovery', 'Substance Abuse', 'Relapse Prevention', 'Behavioral Addictions', 'Harm Reduction', 'Recovery Planning'],
  'Non-judgmental, motivating, and recovery-focused',
  'Expert',
  'from-emerald-500 to-teal-600',
  'TrendingUp',
  '{"non_judgment": 5, "motivation": 5, "hope": 5, "practical": 4, "understanding": 5}'::jsonb,
  '{"addiction_recovery": 0.95, "relapse_prevention": 0.93, "motivation": 0.91, "behavioral_change": 0.89, "harm_reduction": 0.87}'::jsonb,
  true
),

-- Teen & Young Adult Specialist
(
  gen_random_uuid(),
  'Dr. Alex Kim',
  'Teen & Young Adult Specialist',
  'Specialist in adolescent and young adult mental health. Expert in developmental challenges, identity formation, and the unique pressures facing modern young people.',
  'Developmental & Strengths-Based Therapy',
  ARRAY['Teen Mental Health', 'Young Adult Issues', 'Identity Development', 'Academic Stress', 'Social Anxiety', 'Life Transitions'],
  'Relatable, supportive, and youth-focused',
  'Advanced',
  'from-violet-500 to-purple-600',
  'Star',
  '{"relatability": 5, "energy": 4, "understanding": 5, "adaptability": 5, "encouragement": 5}'::jsonb,
  '{"teen_support": 0.94, "identity_development": 0.91, "academic_stress": 0.89, "social_anxiety": 0.87, "life_transitions": 0.88}'::jsonb,
  true
),

-- Anxiety & Panic Specialist
(
  gen_random_uuid(),
  'Dr. Sage Thompson',
  'Anxiety & Panic Disorder Specialist',
  'Expert in anxiety disorders with specialized training in panic disorder, social anxiety, and generalized anxiety. Provides evidence-based techniques for anxiety management.',
  'Cognitive Behavioral Therapy for Anxiety',
  ARRAY['Anxiety Disorders', 'Panic Disorder', 'Social Anxiety', 'Generalized Anxiety', 'Phobias', 'Anxiety Management'],
  'Calm, reassuring, and methodical',
  'Expert',
  'from-blue-500 to-indigo-600',
  'Brain',
  '{"calmness": 5, "reassurance": 5, "methodical": 5, "patience": 5, "expertise": 5}'::jsonb,
  '{"anxiety_treatment": 0.96, "panic_disorder": 0.94, "social_anxiety": 0.92, "coping_strategies": 0.93, "relaxation_techniques": 0.91}'::jsonb,
  true
);