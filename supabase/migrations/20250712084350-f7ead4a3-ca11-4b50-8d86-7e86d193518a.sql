-- Populate initial therapy approaches
INSERT INTO therapeutic_approach_configs (
  name, description, techniques, target_conditions, effectiveness_score, 
  system_prompt_addition, is_active
) VALUES
-- Cognitive Behavioral Therapy (CBT)
(
  'Cognitive Behavioral Therapy (CBT)',
  'Evidence-based therapy focusing on identifying and changing negative thought patterns and behaviors',
  ARRAY['Cognitive restructuring', 'Behavioral activation', 'Exposure therapy', 'Thought records', 'Homework assignments', 'Behavioral experiments', 'Problem-solving skills'],
  ARRAY['Depression', 'Anxiety disorders', 'PTSD', 'OCD', 'Eating disorders', 'Major depression', 'Generalized anxiety', 'Social anxiety', 'Panic disorder'],
  9.2,
  'Use CBT techniques like cognitive restructuring, thought challenging, and behavioral activation. Focus on identifying negative thought patterns and replacing them with more balanced, realistic thoughts. Assign homework and behavioral experiments.',
  true
),

-- Acceptance and Commitment Therapy (ACT)
(
  'Acceptance and Commitment Therapy (ACT)',
  'Third-wave therapy focusing on psychological flexibility and values-based action',
  ARRAY['Mindfulness exercises', 'Values clarification', 'Defusion techniques', 'Acceptance strategies', 'Metaphors and experiential exercises', 'Behavioral commitment', 'Present moment awareness'],
  ARRAY['Chronic pain', 'Anxiety', 'Depression', 'Substance abuse', 'Workplace stress', 'Anxiety disorders', 'Addiction'],
  8.7,
  'Apply ACT principles focusing on psychological flexibility, mindfulness, and values-based action. Use metaphors, defusion techniques, and help the person commit to value-driven behaviors rather than avoiding difficult emotions.',
  true
),

-- Eye Movement Desensitization and Reprocessing (EMDR)
(
  'Eye Movement Desensitization and Reprocessing (EMDR)',
  'Trauma-focused therapy using bilateral stimulation to process traumatic memories',
  ARRAY['Bilateral stimulation', 'Resource installation', 'Trauma processing', 'Safe place visualization', 'Grounding techniques', 'Dual awareness', 'Body scan'],
  ARRAY['PTSD', 'Single-incident trauma', 'Complex trauma', 'Phobias', 'Post-traumatic stress disorder', 'Acute stress disorder', 'Specific phobias'],
  9.5,
  'Focus on trauma processing using EMDR principles. Help establish resources and safe place visualization before processing. Use grounding techniques and maintain dual awareness during trauma work.',
  true
),

-- Solution-Focused Brief Therapy (SFBT)
(
  'Solution-Focused Brief Therapy (SFBT)',
  'Goal-oriented therapy focusing on solutions rather than problems',
  ARRAY['Miracle question', 'Scaling questions', 'Exception finding', 'Goal setting', 'Compliment giving', 'Coping questions', 'Relationship questions'],
  ARRAY['Relationship issues', 'Goal achievement', 'Brief interventions', 'Crisis resolution', 'Adjustment disorders', 'Relationship problems', 'Goal-related issues'],
  8.1,
  'Focus on solutions rather than problems. Use the miracle question, scaling questions, and exception finding. Help identify existing strengths and resources. Keep sessions brief and goal-oriented.',
  true
),

-- Narrative Therapy
(
  'Narrative Therapy',
  'Therapy approach that views people as separate from their problems and explores alternative life stories',
  ARRAY['Externalization', 'Unique outcomes', 'Re-authoring', 'Definitional ceremony', 'Letter writing', 'Reflecting teams', 'Therapeutic documents'],
  ARRAY['Identity issues', 'Trauma recovery', 'Relationship problems', 'Self-esteem', 'Identity disorders', 'Trauma-related issues', 'Depression with identity themes'],
  7.8,
  'Help externalize problems and explore alternative life stories. Focus on unique outcomes and re-authoring experiences. The person is the expert of their own life, not the problem-saturated story.',
  true
),

-- Internal Family Systems (IFS)
(
  'Internal Family Systems (IFS)',
  'Therapy model that views the mind as having multiple parts, each with unique characteristics',
  ARRAY['Parts identification', 'Self-leadership', 'Unburdening', 'Internal dialogue', 'Protective parts work', 'Exile healing', 'Manager exploration'],
  ARRAY['Trauma', 'Personality disorders', 'Self-criticism', 'Internal conflict', 'Complex PTSD', 'Borderline personality disorder', 'Dissociative disorders'],
  8.9,
  'Work with different parts of the person''s internal system. Help identify protective parts, managers, and exiles. Focus on Self-leadership and unburdening wounded parts. Everyone has a Self that can lead.',
  true
),

-- Emotionally Focused Therapy (EFT)
(
  'Emotionally Focused Therapy (EFT)',
  'Attachment-based therapy for couples and families focusing on emotional connection',
  ARRAY['Emotion identification', 'Attachment patterns', 'Enactment', 'Emotional expression', 'Reframing', 'Tracking cycles', 'Accessing underlying emotions'],
  ARRAY['Relationship distress', 'Attachment issues', 'Family conflict', 'Intimacy problems', 'Relationship problems', 'Attachment disorders', 'Family dysfunction'],
  8.6,
  'Focus on emotional connection and attachment patterns. Help identify and express underlying emotions. Track negative cycles in relationships and help create new positive interactions.',
  true
),

-- Somatic Experiencing
(
  'Somatic Experiencing',
  'Body-oriented trauma therapy focusing on releasing trapped survival energy',
  ARRAY['Titration', 'Pendulation', 'Resource building', 'Nervous system regulation', 'Body awareness', 'Breathing techniques', 'Movement therapy'],
  ARRAY['Trauma', 'Anxiety', 'Chronic stress', 'Nervous system dysregulation', 'PTSD', 'Anxiety disorders', 'Panic disorder'],
  8.4,
  'Focus on body sensations and nervous system regulation. Use titration and pendulation to process trauma gradually. Help build internal resources and develop body awareness.',
  true
),

-- Motivational Interviewing (MI)
(
  'Motivational Interviewing (MI)',
  'Collaborative, goal-oriented style of communication to strengthen motivation for change',
  ARRAY['Reflective listening', 'Change talk elicitation', 'Rolling with resistance', 'Decisional balance', 'Scaling rulers', 'Values exploration', 'Goal setting'],
  ARRAY['Addiction', 'Health behavior change', 'Motivation issues', 'Ambivalence', 'Substance use disorders', 'Treatment resistance'],
  8.3,
  'Use collaborative approach to strengthen motivation for change. Practice reflective listening, elicit change talk, and roll with resistance. Help explore ambivalence about change.',
  true
),

-- Gestalt Therapy
(
  'Gestalt Therapy',
  'Humanistic therapy focusing on present-moment awareness and personal responsibility',
  ARRAY['Here and now focus', 'Awareness exercises', 'Contact and support', 'Experimentation', 'Empty chair technique', 'Dream work', 'Body awareness'],
  ARRAY['Self-awareness', 'Relationship issues', 'Creative blocks', 'Personal growth', 'Adjustment disorders', 'Identity issues'],
  7.6,
  'Focus on present-moment awareness and what is happening here and now. Use experiments and awareness exercises. Help the person take responsibility for their choices and actions.',
  true
);