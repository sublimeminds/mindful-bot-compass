-- Populate initial therapy approaches
INSERT INTO therapeutic_approach_configs (
  id, name, description, primary_techniques, secondary_techniques, 
  effectiveness_areas, target_conditions, cultural_adaptations, severity_levels, 
  session_structure, contraindications, evidence_base, adaptation_guidelines
) VALUES
-- Cognitive Behavioral Therapy (CBT)
(
  gen_random_uuid(),
  'Cognitive Behavioral Therapy (CBT)',
  'Evidence-based therapy focusing on identifying and changing negative thought patterns and behaviors',
  ARRAY['Cognitive restructuring', 'Behavioral activation', 'Exposure therapy', 'Thought records'],
  ARRAY['Homework assignments', 'Behavioral experiments', 'Problem-solving skills'],
  ARRAY['Depression', 'Anxiety disorders', 'PTSD', 'OCD', 'Eating disorders'],
  ARRAY['Major depression', 'Generalized anxiety', 'Social anxiety', 'Panic disorder'],
  '{"collectivist_cultures": "Emphasize family harmony", "individualist_cultures": "Focus on personal achievement"}',
  ARRAY['mild', 'moderate', 'severe'],
  '{"session_length": 50, "frequency": "weekly", "duration_weeks": 16}',
  ARRAY['Active psychosis', 'Severe cognitive impairment'],
  'Strong evidence base with numerous RCTs',
  '{"cultural": "Adapt examples to cultural context", "age": "Use age-appropriate metaphors"}'
),

-- Acceptance and Commitment Therapy (ACT)
(
  gen_random_uuid(),
  'Acceptance and Commitment Therapy (ACT)',
  'Third-wave therapy focusing on psychological flexibility and values-based action',
  ARRAY['Mindfulness exercises', 'Values clarification', 'Defusion techniques', 'Acceptance strategies'],
  ARRAY['Metaphors and experiential exercises', 'Behavioral commitment', 'Present moment awareness'],
  ARRAY['Chronic pain', 'Anxiety', 'Depression', 'Substance abuse', 'Workplace stress'],
  ARRAY['Anxiety disorders', 'Depression', 'Chronic pain', 'Addiction'],
  '{"meditation_cultures": "Integrate existing mindfulness practices", "action_cultures": "Emphasize behavioral commitment"}',
  ARRAY['mild', 'moderate', 'severe'],
  '{"session_length": 50, "frequency": "weekly", "duration_weeks": 12}',
  ARRAY['Severe cognitive impairment', 'Active suicidal ideation without safety plan'],
  'Growing evidence base, effective for various conditions',
  '{"experiential": "Use culturally relevant metaphors", "values": "Explore culture-specific values"}'
),

-- Eye Movement Desensitization and Reprocessing (EMDR)
(
  gen_random_uuid(),
  'Eye Movement Desensitization and Reprocessing (EMDR)',
  'Trauma-focused therapy using bilateral stimulation to process traumatic memories',
  ARRAY['Bilateral stimulation', 'Resource installation', 'Trauma processing', 'Safe place visualization'],
  ARRAY['Grounding techniques', 'Dual awareness', 'Body scan'],
  ARRAY['PTSD', 'Single-incident trauma', 'Complex trauma', 'Phobias'],
  ARRAY['Post-traumatic stress disorder', 'Acute stress disorder', 'Specific phobias'],
  '{"trauma_stigma": "Address cultural views on trauma", "somatic_cultures": "Include body-based practices"}',
  ARRAY['mild', 'moderate', 'severe'],
  '{"session_length": 90, "frequency": "weekly", "duration_weeks": 8}',
  ARRAY['Dissociative disorders', 'Active substance abuse', 'Severe cardiac conditions'],
  'Strong evidence for PTSD treatment, WHO recommended',
  '{"preparation": "Extended preparation for complex trauma", "processing": "Slower pacing for cultural considerations"}'
),

-- Solution-Focused Brief Therapy (SFBT)
(
  gen_random_uuid(),
  'Solution-Focused Brief Therapy (SFBT)',
  'Goal-oriented therapy focusing on solutions rather than problems',
  ARRAY['Miracle question', 'Scaling questions', 'Exception finding', 'Goal setting'],
  ARRAY['Compliment giving', 'Coping questions', 'Relationship questions'],
  ARRAY['Relationship issues', 'Goal achievement', 'Brief interventions', 'Crisis resolution'],
  ARRAY['Adjustment disorders', 'Relationship problems', 'Goal-related issues'],
  '{"hierarchy_cultures": "Respect family decision-making", "direct_cultures": "Use straightforward goal-setting"}',
  ARRAY['mild', 'moderate'],
  '{"session_length": 50, "frequency": "bi-weekly", "duration_weeks": 6}',
  ARRAY['Severe mental illness', 'Active psychosis', 'Severe depression'],
  'Moderate evidence base, effective for brief interventions',
  '{"brief": "Can be delivered in 3-8 sessions", "goal_focused": "Adapt goals to cultural values"}'
),

-- Narrative Therapy
(
  gen_random_uuid(),
  'Narrative Therapy',
  'Therapy approach that views people as separate from their problems and explores alternative life stories',
  ARRAY['Externalization', 'Unique outcomes', 'Re-authoring', 'Definitional ceremony'],
  ARRAY['Letter writing', 'Reflecting teams', 'Therapeutic documents'],
  ARRAY['Identity issues', 'Trauma recovery', 'Relationship problems', 'Self-esteem'],
  ARRAY['Identity disorders', 'Trauma-related issues', 'Depression with identity themes'],
  '{"storytelling_cultures": "Build on cultural storytelling traditions", "oral_cultures": "Use spoken narratives"}',
  ARRAY['mild', 'moderate'],
  '{"session_length": 60, "frequency": "weekly", "duration_weeks": 12}',
  ARRAY['Severe cognitive impairment', 'Active psychosis'],
  'Moderate evidence base, particularly for identity-related issues',
  '{"cultural_stories": "Incorporate cultural narratives", "community": "Include community voices when appropriate"}'
),

-- Internal Family Systems (IFS)
(
  gen_random_uuid(),
  'Internal Family Systems (IFS)',
  'Therapy model that views the mind as having multiple parts, each with unique characteristics',
  ARRAY['Parts identification', 'Self-leadership', 'Unburdening', 'Internal dialogue'],
  ARRAY['Protective parts work', 'Exile healing', 'Manager exploration'],
  ARRAY['Trauma', 'Personality disorders', 'Self-criticism', 'Internal conflict'],
  ARRAY['Complex PTSD', 'Borderline personality disorder', 'Dissociative disorders'],
  '{"collective_self": "Adapt individual parts concept", "spiritual_cultures": "Connect to spiritual traditions"}',
  ARRAY['mild', 'moderate', 'severe'],
  '{"session_length": 60, "frequency": "weekly", "duration_weeks": 20}',
  ARRAY['Active psychosis', 'Severe dissociation without stabilization'],
  'Growing evidence base, effective for trauma and personality disorders',
  '{"parts_language": "Use culturally appropriate metaphors", "self_concept": "Adapt to cultural views of self"}'
),

-- Emotionally Focused Therapy (EFT)
(
  gen_random_uuid(),
  'Emotionally Focused Therapy (EFT)',
  'Attachment-based therapy for couples and families focusing on emotional connection',
  ARRAY['Emotion identification', 'Attachment patterns', 'Enactment', 'Emotional expression'],
  ARRAY['Reframing', 'Tracking cycles', 'Accessing underlying emotions'],
  ARRAY['Relationship distress', 'Attachment issues', 'Family conflict', 'Intimacy problems'],
  ARRAY['Relationship problems', 'Attachment disorders', 'Family dysfunction'],
  '{"family_systems": "Include extended family", "emotion_expression": "Respect cultural emotion norms"}',
  ARRAY['mild', 'moderate'],
  '{"session_length": 60, "frequency": "weekly", "duration_weeks": 16}',
  ARRAY['Active domestic violence', 'Severe substance abuse', 'Untreated mental illness'],
  'Strong evidence base for couples therapy',
  '{"couples": "8-20 sessions typical", "family": "Adapt for family structures"}'
),

-- Somatic Experiencing
(
  gen_random_uuid(),
  'Somatic Experiencing',
  'Body-oriented trauma therapy focusing on releasing trapped survival energy',
  ARRAY['Titration', 'Pendulation', 'Resource building', 'Nervous system regulation'],
  ARRAY['Body awareness', 'Breathing techniques', 'Movement therapy'],
  ARRAY['Trauma', 'Anxiety', 'Chronic stress', 'Nervous system dysregulation'],
  ARRAY['PTSD', 'Anxiety disorders', 'Panic disorder'],
  '{"body_practices": "Build on cultural body practices", "touch_boundaries": "Respect cultural touch norms"}',
  ARRAY['mild', 'moderate', 'severe'],
  '{"session_length": 60, "frequency": "weekly", "duration_weeks": 12}',
  ARRAY['Severe dissociation', 'Active substance abuse'],
  'Growing evidence base for trauma treatment',
  '{"body_awareness": "Develop slowly with cultural sensitivity", "touch": "Always consensual and culturally appropriate"}'
),

-- Motivational Interviewing (MI)
(
  gen_random_uuid(),
  'Motivational Interviewing (MI)',
  'Collaborative, goal-oriented style of communication to strengthen motivation for change',
  ARRAY['Reflective listening', 'Change talk elicitation', 'Rolling with resistance', 'Decisional balance'],
  ARRAY['Scaling rulers', 'Values exploration', 'Goal setting'],
  ARRAY['Addiction', 'Health behavior change', 'Motivation issues', 'Ambivalence'],
  ARRAY['Substance use disorders', 'Health behavior change', 'Treatment resistance'],
  '{"authority_respect": "Maintain collaborative stance", "change_readiness": "Respect cultural change pace"}',
  ARRAY['mild', 'moderate'],
  '{"session_length": 45, "frequency": "weekly", "duration_weeks": 8}',
  ARRAY['Severe cognitive impairment', 'Active psychosis'],
  'Strong evidence base for behavior change',
  '{"brief": "Can be delivered in 1-4 sessions", "health": "Effective for health behavior change"}'
),

-- Gestalt Therapy
(
  gen_random_uuid(),
  'Gestalt Therapy',
  'Humanistic therapy focusing on present-moment awareness and personal responsibility',
  ARRAY['Here and now focus', 'Awareness exercises', 'Contact and support', 'Experimentation'],
  ARRAY['Empty chair technique', 'Dream work', 'Body awareness'],
  ARRAY['Self-awareness', 'Relationship issues', 'Creative blocks', 'Personal growth'],
  ARRAY['Adjustment disorders', 'Relationship problems', 'Identity issues'],
  '{"present_focus": "Adapt to cultural time orientations", "individual_focus": "Balance with collective values"}',
  ARRAY['mild', 'moderate'],
  '{"session_length": 60, "frequency": "weekly", "duration_weeks": 16}',
  ARRAY['Severe mental illness', 'Active psychosis', 'Severe personality disorders'],
  'Moderate evidence base, strong theoretical foundation',
  '{"experiential": "Use culturally appropriate experiments", "awareness": "Develop gradually"}'
);

-- Populate therapy approach combinations
INSERT INTO therapy_approach_combinations (
  id, primary_approach_id, secondary_approach_id, combination_name, 
  effectiveness_score, evidence_level, target_conditions, session_structure, notes
)
SELECT 
  gen_random_uuid(),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Cognitive Behavioral Therapy (CBT)'),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Acceptance and Commitment Therapy (ACT)'),
  'CBT + ACT Integration',
  8.5,
  'high',
  ARRAY['Depression with acceptance issues', 'Anxiety with avoidance patterns'],
  '{"phase1": "CBT skills building", "phase2": "ACT values and acceptance"}',
  'Combine cognitive restructuring with acceptance strategies'
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Eye Movement Desensitization and Reprocessing (EMDR)'),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Somatic Experiencing'),
  'EMDR + Somatic Integration',
  9.2,
  'high',
  ARRAY['Complex PTSD', 'Childhood trauma', 'Body-based trauma responses'],
  '{"preparation": "Somatic stabilization", "processing": "EMDR with somatic awareness"}',
  'Powerful combination for complex trauma with somatic components'
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Internal Family Systems (IFS)'),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Eye Movement Desensitization and Reprocessing (EMDR)'),
  'IFS + EMDR Integration',
  8.8,
  'moderate',
  ARRAY['Complex trauma', 'Dissociative symptoms', 'Self-criticism'],
  '{"phase1": "IFS parts stabilization", "phase2": "EMDR processing with parts awareness"}',
  'Effective for complex trauma with internal conflict'
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Solution-Focused Brief Therapy (SFBT)'),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Motivational Interviewing (MI)'),
  'SFBT + MI Integration',
  7.8,
  'moderate',
  ARRAY['Goal achievement', 'Motivation issues', 'Brief interventions'],
  '{"assessment": "MI for motivation", "intervention": "SFBT for solutions"}',
  'Excellent for brief, goal-oriented work'
UNION ALL
SELECT 
  gen_random_uuid(),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Emotionally Focused Therapy (EFT)'),
  (SELECT id FROM therapeutic_approach_configs WHERE name = 'Narrative Therapy'),
  'EFT + Narrative Integration',
  8.1,
  'moderate',
  ARRAY['Relationship issues', 'Identity in relationships', 'Couple therapy'],
  '{"exploration": "Narrative identity work", "connection": "EFT emotional processing"}',
  'Powerful for relationship work with identity themes';