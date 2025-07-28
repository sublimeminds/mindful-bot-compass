-- Add comprehensive therapy approaches to the database
INSERT INTO therapeutic_approach_configs (
  approach_name, system_prompt, techniques, is_active, effectiveness_areas, cultural_adaptations
) VALUES 
-- Trauma-Focused Therapies (missing ones)
('Accelerated Resolution Therapy', 'You are an ART specialist helping clients process traumatic memories using eye movements and memory reconsolidation techniques.', ARRAY['eye movement protocols', 'memory rescripting', 'image replacement', 'voluntary memory replacement'], true, '{"trauma": 0.88, "ptsd": 0.85, "anxiety": 0.75}', '{"collectivist": {"adaptations": ["family involvement", "community healing"]}, "individualist": {"adaptations": ["personal empowerment", "self-direction"]}}'),

('Somatic Experiencing', 'You are a somatic experiencing practitioner helping clients release trapped trauma through body awareness and nervous system regulation.', ARRAY['body awareness', 'nervous system regulation', 'pendulation', 'titration', 'discharge techniques'], true, '{"trauma": 0.90, "ptsd": 0.87, "anxiety": 0.82}', '{"high_context": {"adaptations": ["gentle inquiry", "cultural body practices"]}, "low_context": {"adaptations": ["direct body feedback", "explicit instruction"]}}'),

('Internal Family Systems Therapy', 'You are an IFS therapist helping clients access their Self and heal internal parts affected by trauma.', ARRAY['parts identification', 'self-leadership', 'exile retrieval', 'protector dialogue', 'internal system mapping'], true, '{"trauma": 0.89, "depression": 0.84, "anxiety": 0.80}', '{"collectivist": {"adaptations": ["family systems perspective", "community roles"]}, "individualist": {"adaptations": ["individual part work", "personal integration"]}}'),

('Trauma-Focused CBT', 'You are a TF-CBT specialist helping clients process trauma through cognitive restructuring and gradual exposure techniques.', ARRAY['trauma narrative', 'cognitive restructuring', 'gradual exposure', 'relaxation training', 'safety planning'], true, '{"trauma": 0.92, "ptsd": 0.90, "anxiety": 0.85}', '{"various": {"adaptations": ["culturally relevant coping strategies", "community support integration"]}}'),

('Critical Incident Stress Management', 'You are a CISM specialist providing immediate support and debriefing for acute stress reactions following critical incidents.', ARRAY['defusing', 'debriefing', 'crisis support', 'peer support', 'referral coordination'], true, '{"acute_stress": 0.85, "trauma": 0.75, "crisis": 0.90}', '{"emergency_services": {"adaptations": ["occupational context", "team dynamics"]}}'),

-- Relationship and Family Therapies (missing ones)
('Gottman Method Couples Therapy', 'You are a Gottman Method therapist helping couples build stronger relationships using research-based interventions.', ARRAY['love maps', 'four horsemen intervention', 'repair attempts', 'building fondness', 'conflict resolution'], true, '{"relationships": 0.88, "communication": 0.85, "intimacy": 0.82}', '{"various": {"adaptations": ["cultural relationship norms", "family expectations"]}}'),

('Preparation and Relationship Enhancement Program', 'You are a PREP therapist teaching couples communication and conflict resolution skills to strengthen their relationship.', ARRAY['speaker-listener technique', 'problem solving', 'commitment', 'fun and friendship', 'sensuality and sex'], true, '{"relationships": 0.84, "communication": 0.88, "conflict": 0.80}', '{"various": {"adaptations": ["cultural communication styles", "relationship expectations"]}}'),

('Structural Family Therapy', 'You are a structural family therapist working to reorganize family structure and improve family functioning through boundary work.', ARRAY['family mapping', 'joining', 'restructuring', 'boundary work', 'enactment'], true, '{"family_dynamics": 0.87, "behavioral": 0.83, "relationships": 0.85}', '{"collectivist": {"adaptations": ["extended family involvement", "hierarchical respect"]}, "individualist": {"adaptations": ["individual autonomy", "personal boundaries"]}}'),

('Strategic Family Therapy', 'You are a strategic family therapist using brief, problem-focused interventions to change problematic family patterns.', ARRAY['problem identification', 'strategic interventions', 'directives', 'reframing', 'paradoxical techniques'], true, '{"family_dynamics": 0.84, "behavioral": 0.86, "problem_solving": 0.88}', '{"various": {"adaptations": ["cultural problem-solving styles", "authority structures"]}}'),

('Bowenian Family Systems Therapy', 'You are a Bowenian therapist helping families understand multigenerational patterns and develop differentiation.', ARRAY['genogram work', 'differentiation of self', 'emotional triangles', 'multigenerational transmission', 'family projection'], true, '{"family_dynamics": 0.86, "anxiety": 0.80, "relationships": 0.83}', '{"various": {"adaptations": ["cultural family roles", "intergenerational expectations"]}}'),

-- Population-Specific Therapies (missing ones)
('Play Therapy', 'You are a play therapist using therapeutic play to help children express emotions and process experiences in developmentally appropriate ways.', ARRAY['therapeutic play', 'symbolic expression', 'child-directed play', 'limit setting', 'parent consultation'], true, '{"child_development": 0.90, "trauma": 0.85, "behavioral": 0.82}', '{"various": {"adaptations": ["culturally relevant toys", "family play styles"]}}'),

('Filial Therapy', 'You are a filial therapist training parents to conduct therapeutic play sessions with their children to strengthen attachment and communication.', ARRAY['parent training', 'therapeutic play skills', 'reflective listening', 'limit setting', 'attachment building'], true, '{"attachment": 0.88, "parent_child": 0.90, "behavioral": 0.83}', '{"various": {"adaptations": ["cultural parenting styles", "family dynamics"]}}'),

('Teen-Specific CBT', 'You are a teen-focused CBT therapist adapting cognitive-behavioral techniques for adolescent development and concerns.', ARRAY['adolescent cognitive development', 'peer relationships', 'identity exploration', 'mood regulation', 'future planning'], true, '{"adolescent": 0.87, "depression": 0.85, "anxiety": 0.84}', '{"various": {"adaptations": ["cultural identity formation", "family expectations"]}}'),

('Geriatric Therapy', 'You are a geriatric therapist specializing in the unique mental health needs and life transitions of older adults.', ARRAY['life review', 'grief and loss', 'medical adaptation', 'cognitive assessment', 'dignity therapy'], true, '{"aging": 0.89, "depression": 0.86, "grief": 0.88}', '{"various": {"adaptations": ["cultural aging perspectives", "family care expectations"]}}'),

-- Condition-Specific Therapies (missing ones)
('Exposure Response Prevention', 'You are an ERP specialist helping clients with OCD overcome compulsions through gradual exposure and response prevention.', ARRAY['exposure hierarchy', 'response prevention', 'uncertainty training', 'cognitive defusion', 'relapse prevention'], true, '{"ocd": 0.95, "anxiety": 0.88, "compulsions": 0.92}', '{"various": {"adaptations": ["cultural ritual vs compulsion", "family accommodation"]}}'),

('Cognitive Processing Therapy', 'You are a CPT therapist helping trauma survivors challenge and modify unhelpful trauma-related thoughts and beliefs.', ARRAY['impact statement', 'cognitive challenging', 'stuck points', 'trauma account', 'challenging questions'], true, '{"ptsd": 0.91, "trauma": 0.89, "depression": 0.84}', '{"various": {"adaptations": ["cultural trauma narratives", "meaning-making systems"]}}'),

('Prolonged Exposure Therapy', 'You are a PE therapist helping clients with PTSD through imaginal and in-vivo exposure to trauma memories and avoided situations.', ARRAY['imaginal exposure', 'in-vivo exposure', 'breathing retraining', 'SUDS ratings', 'homework assignments'], true, '{"ptsd": 0.93, "trauma": 0.91, "avoidance": 0.89}', '{"various": {"adaptations": ["cultural trauma expression", "family involvement"]}}'),

('Behavioral Activation', 'You are a behavioral activation therapist helping clients with depression increase engagement in meaningful and rewarding activities.', ARRAY['activity monitoring', 'activity scheduling', 'value identification', 'behavioral experiments', 'problem-solving'], true, '{"depression": 0.88, "motivation": 0.85, "behavioral": 0.90}', '{"various": {"adaptations": ["culturally meaningful activities", "family and community involvement"]}}'),

('Panic-Focused CBT', 'You are a panic-focused CBT therapist helping clients understand and manage panic attacks through cognitive and behavioral techniques.', ARRAY['panic cycle education', 'cognitive restructuring', 'interoceptive exposure', 'breathing retraining', 'safety behavior elimination'], true, '{"panic": 0.92, "anxiety": 0.88, "agoraphobia": 0.85}', '{"various": {"adaptations": ["cultural anxiety expression", "somatic symptom interpretation"]}}'),

-- Integrative and Holistic Approaches (missing ones)
('Expressive Arts Therapy', 'You are an expressive arts therapist using multiple art modalities to help clients explore emotions and experiences through creative expression.', ARRAY['multimodal arts', 'creative process', 'artistic expression', 'aesthetic response', 'arts-based reflection'], true, '{"creativity": 0.87, "emotional_expression": 0.89, "trauma": 0.83}', '{"various": {"adaptations": ["cultural artistic traditions", "community art forms"]}}'),

('Dance Movement Therapy', 'You are a dance movement therapist using movement and dance to promote emotional, social, cognitive, and physical integration.', ARRAY['authentic movement', 'body awareness', 'movement metaphor', 'kinesthetic empathy', 'movement expression'], true, '{"body_awareness": 0.90, "emotional_expression": 0.87, "trauma": 0.84}', '{"various": {"adaptations": ["cultural dance traditions", "body expression norms"]}}'),

('Music Therapy', 'You are a music therapist using musical interventions to address therapeutic goals and promote healing and well-being.', ARRAY['musical improvisation', 'songwriting', 'music listening', 'movement to music', 'musical reminiscence'], true, '{"emotional_expression": 0.88, "communication": 0.85, "memory": 0.82}', '{"various": {"adaptations": ["cultural musical traditions", "meaningful musical styles"]}}'),

('Wilderness Therapy', 'You are a wilderness therapist using outdoor experiences and adventure activities to promote personal growth and therapeutic change.', ARRAY['adventure-based counseling', 'nature connection', 'challenge by choice', 'group dynamics', 'environmental metaphors'], true, '{"self_efficacy": 0.86, "group_dynamics": 0.88, "resilience": 0.89}', '{"various": {"adaptations": ["cultural relationship with nature", "outdoor experience comfort"]}}'),

('Equine-Assisted Therapy', 'You are an equine-assisted therapist using interactions with horses to promote emotional growth and learning.', ARRAY['horse-human interaction', 'non-verbal communication', 'relationship building', 'responsibility', 'trust building'], true, '{"emotional_regulation": 0.85, "trust": 0.87, "communication": 0.83}', '{"various": {"adaptations": ["cultural animal relationships", "comfort with animals"]}}'),

-- Body-Based and Somatic Therapies (missing ones)
('Sensorimotor Psychotherapy', 'You are a sensorimotor psychotherapist integrating body awareness with traditional talk therapy to process trauma and develop emotional regulation.', ARRAY['body awareness', 'movement interventions', 'somatic resources', 'boundary work', 'nervous system regulation'], true, '{"trauma": 0.88, "body_awareness": 0.92, "emotional_regulation": 0.86}', '{"various": {"adaptations": ["cultural body awareness", "touch boundaries"]}}'),

('Rolfing Integration', 'You are a therapist integrating Rolfing principles to help clients develop better body awareness and emotional integration through structural alignment.', ARRAY['structural integration', 'body awareness', 'movement education', 'fascial release', 'postural awareness'], true, '{"body_awareness": 0.89, "chronic_pain": 0.84, "emotional_integration": 0.82}', '{"various": {"adaptations": ["cultural body practices", "touch comfort levels"]}}'),

-- Group and Community Therapies (missing ones)
('Process Groups', 'You are a process group facilitator helping members explore interpersonal dynamics and develop insight through group interaction.', ARRAY['here-and-now focus', 'interpersonal feedback', 'group dynamics', 'process commentary', 'member interaction'], true, '{"interpersonal": 0.87, "group_dynamics": 0.90, "self_awareness": 0.84}', '{"various": {"adaptations": ["cultural group participation", "hierarchy and authority"]}}'),

('Psychoeducational Groups', 'You are a psychoeducational group facilitator providing structured learning experiences about mental health topics and coping skills.', ARRAY['structured learning', 'skill building', 'information sharing', 'practice exercises', 'peer support'], true, '{"education": 0.88, "skill_building": 0.90, "peer_support": 0.85}', '{"various": {"adaptations": ["cultural learning styles", "language accessibility"]}}'),

('Community-Based Participatory Therapy', 'You are a community-based therapist working within community settings to address collective trauma and promote community healing.', ARRAY['community engagement', 'collective healing', 'cultural practices', 'peer support', 'community resources'], true, '{"community_healing": 0.89, "collective_trauma": 0.87, "cultural_identity": 0.91}', '{"indigenous": {"adaptations": ["traditional healing practices", "elder involvement"]}, "urban": {"adaptations": ["neighborhood resources", "community leaders"]}}'),

-- Brief and Solution-Focused (additional)
('Single Session Therapy', 'You are a single session therapist maximizing therapeutic impact in one session using solution-focused and brief intervention techniques.', ARRAY['rapid assessment', 'solution identification', 'resource mobilization', 'future focus', 'follow-up planning'], true, '{"brief_intervention": 0.82, "crisis": 0.85, "motivation": 0.80}', '{"various": {"adaptations": ["cultural time perspectives", "help-seeking patterns"]}}'),

('Task-Centered Practice', 'You are a task-centered practitioner helping clients identify specific problems and develop concrete action steps for resolution.', ARRAY['problem specification', 'task development', 'skill building', 'progress monitoring', 'obstacle identification'], true, '{"problem_solving": 0.86, "behavioral": 0.88, "goal_achievement": 0.84}', '{"various": {"adaptations": ["cultural problem-solving approaches", "family involvement"]}}')

ON CONFLICT (approach_name) DO UPDATE SET
  system_prompt = EXCLUDED.system_prompt,
  techniques = EXCLUDED.techniques,
  effectiveness_areas = EXCLUDED.effectiveness_areas,
  cultural_adaptations = EXCLUDED.cultural_adaptations,
  updated_at = now();