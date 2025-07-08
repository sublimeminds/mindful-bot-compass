-- Clean up duplicate Dr. Sarah Chen entries and fix scoring inconsistencies
-- Keep only the original Dr. Sarah Chen and update all scores to 0-1 scale
DELETE FROM therapist_personalities 
WHERE name = 'Dr. Sarah Chen' AND created_at > '2025-06-10 09:00:00+00';

-- Update all effectiveness_areas and personality_traits to be in 0-1 scale
UPDATE therapist_personalities 
SET 
  effectiveness_areas = CASE 
    WHEN name = 'Dr. Michael Rivers' THEN jsonb_build_object(
      'anxiety_disorders', 0.8,
      'emotional_regulation', 0.9,
      'mindfulness_training', 1.0,
      'stress_management', 1.0,
      'trauma_recovery', 0.7
    )
    WHEN name = 'Dr. Emma Thompson' THEN jsonb_build_object(
      'identity_exploration', 0.8,
      'life_transitions', 0.9,
      'personal_growth', 1.0,
      'relationship_counseling', 0.9,
      'self_esteem_building', 1.0
    )
    WHEN name = 'Dr. James Rodriguez' THEN jsonb_build_object(
      'brief_interventions', 1.0,
      'goal_achievement', 1.0,
      'motivation_building', 0.9,
      'problem_solving', 0.9,
      'strength_identification', 0.9
    )
    ELSE effectiveness_areas
  END,
  personality_traits = CASE 
    WHEN name = 'Dr. Michael Rivers' THEN jsonb_build_object(
      'analytical', 0.6,
      'directness', 0.4,
      'empathy', 0.9,
      'patience', 1.0,
      'warmth', 0.9
    )
    WHEN name = 'Dr. Emma Thompson' THEN jsonb_build_object(
      'analytical', 0.5,
      'directness', 0.3,
      'empathy', 1.0,
      'patience', 0.9,
      'warmth', 1.0
    )
    WHEN name = 'Dr. James Rodriguez' THEN jsonb_build_object(
      'analytical', 0.7,
      'directness', 0.8,
      'empathy', 0.7,
      'patience', 0.7,
      'warmth', 0.8
    )
    ELSE personality_traits
  END
WHERE name IN ('Dr. Michael Rivers', 'Dr. Emma Thompson', 'Dr. James Rodriguez');

-- Improve personality traits for all therapists to be more encouraging (0.7-0.95 range)
UPDATE therapist_personalities 
SET personality_traits = CASE 
  WHEN name = 'Dr. Sarah Chen' THEN jsonb_build_object(
    'analytical', 0.9,
    'empathetic', 0.8,
    'patient', 0.85,
    'structured', 0.9,
    'supportive', 0.85
  )
  WHEN name = 'Dr. Maya Patel' THEN jsonb_build_object(
    'calming', 0.95,
    'gentle', 0.95,
    'patient', 0.9,
    'wise', 0.9,
    'nurturing', 0.9
  )
  WHEN name = 'Dr. Alex Rodriguez' THEN jsonb_build_object(
    'energetic', 0.9,
    'forward_thinking', 0.95,
    'motivational', 0.95,
    'optimistic', 0.95,
    'solution_focused', 0.9
  )
  WHEN name = 'Dr. Jordan Kim' THEN jsonb_build_object(
    'compassionate', 0.95,
    'gentle', 0.9,
    'patient', 0.95,
    'understanding', 0.95,
    'safe', 0.9
  )
  WHEN name = 'Dr. Taylor Morgan' THEN jsonb_build_object(
    'balanced', 0.85,
    'communicative', 0.95,
    'empathetic', 0.95,
    'insightful', 0.9,
    'relational', 0.9
  )
  WHEN name = 'Dr. River Stone' THEN jsonb_build_object(
    'holistic', 0.95,
    'integrative', 0.95,
    'intuitive', 0.9,
    'wise', 0.9,
    'spiritual', 0.85
  )
  ELSE personality_traits
END
WHERE name IN ('Dr. Sarah Chen', 'Dr. Maya Patel', 'Dr. Alex Rodriguez', 'Dr. Jordan Kim', 'Dr. Taylor Morgan', 'Dr. River Stone');