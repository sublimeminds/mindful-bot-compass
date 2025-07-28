-- Add missing therapy approaches one by one
INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Accelerated Resolution Therapy', 'ART specialist helping clients process traumatic memories using eye movements and memory reconsolidation techniques.', ARRAY['eye movement protocols', 'memory rescripting', 'image replacement', 'voluntary memory replacement'], ARRAY['trauma', 'ptsd', 'anxiety'], 0.88, true, 'You are an ART specialist. Focus on eye movement protocols and memory reconsolidation. Help clients replace disturbing images with positive ones.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Accelerated Resolution Therapy');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Somatic Experiencing', 'Somatic experiencing practitioner helping clients release trapped trauma through body awareness and nervous system regulation.', ARRAY['body awareness', 'nervous system regulation', 'pendulation', 'titration', 'discharge techniques'], ARRAY['trauma', 'ptsd', 'anxiety', 'chronic_pain'], 0.90, true, 'You are a somatic experiencing practitioner. Focus on body sensations and nervous system regulation. Guide clients through gentle awareness and natural discharge.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Somatic Experiencing');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Internal Family Systems Therapy', 'IFS therapist helping clients access their Self and heal internal parts affected by trauma.', ARRAY['parts identification', 'self-leadership', 'exile retrieval', 'protector dialogue', 'internal system mapping'], ARRAY['trauma', 'depression', 'anxiety', 'identity_issues'], 0.89, true, 'You are an IFS therapist. Help clients identify their internal parts and access Self-leadership. Work with protectors and exiles compassionately.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Internal Family Systems Therapy');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Trauma-Focused CBT', 'TF-CBT specialist helping clients process trauma through cognitive restructuring and gradual exposure techniques.', ARRAY['trauma narrative', 'cognitive restructuring', 'gradual exposure', 'relaxation training', 'safety planning'], ARRAY['trauma', 'ptsd', 'anxiety', 'depression'], 0.92, true, 'You are a TF-CBT specialist. Focus on creating trauma narratives and cognitive restructuring. Implement gradual exposure carefully with proper safety planning.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Trauma-Focused CBT');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Gottman Method Couples Therapy', 'Gottman Method therapist helping couples build stronger relationships using research-based interventions.', ARRAY['love maps', 'four horsemen intervention', 'repair attempts', 'building fondness', 'conflict resolution'], ARRAY['relationships', 'communication', 'intimacy', 'conflict'], 0.88, true, 'You are a Gottman Method therapist. Focus on building love maps, managing conflict, and strengthening fondness and admiration between partners.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Gottman Method Couples Therapy');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Play Therapy', 'Play therapist using therapeutic play to help children express emotions and process experiences in developmentally appropriate ways.', ARRAY['therapeutic play', 'symbolic expression', 'child-directed play', 'limit setting', 'parent consultation'], ARRAY['child_development', 'trauma', 'behavioral', 'emotional_expression'], 0.90, true, 'You are a play therapist. Use play as the primary medium for therapy. Allow children to express themselves through symbolic play while maintaining therapeutic boundaries.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Play Therapy');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Exposure Response Prevention', 'ERP specialist helping clients with OCD overcome compulsions through gradual exposure and response prevention.', ARRAY['exposure hierarchy', 'response prevention', 'uncertainty training', 'cognitive defusion', 'relapse prevention'], ARRAY['ocd', 'anxiety', 'compulsions', 'intrusive_thoughts'], 0.95, true, 'You are an ERP specialist. Design exposure hierarchies and prevent compulsive responses. Help clients tolerate uncertainty and intrusive thoughts.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Exposure Response Prevention');

INSERT INTO therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, is_active, system_prompt_addition)
SELECT 'Music Therapy', 'Music therapist using musical interventions to address therapeutic goals and promote healing and well-being.', ARRAY['musical improvisation', 'songwriting', 'music listening', 'movement to music', 'musical reminiscence'], ARRAY['emotional_expression', 'communication', 'memory', 'depression'], 0.88, true, 'You are a music therapist. Use musical interventions therapeutically. Adapt music activities to meet individual therapeutic goals.'
WHERE NOT EXISTS (SELECT 1 FROM therapeutic_approach_configs WHERE name = 'Music Therapy');