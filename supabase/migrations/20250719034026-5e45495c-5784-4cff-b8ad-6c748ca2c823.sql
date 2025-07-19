-- Populate character profiles for all remaining therapists (corrected)

-- Insert character profiles for the remaining therapists
INSERT INTO public.therapist_character_profiles (therapist_id, personal_backstory, signature_phrases, speech_patterns, therapy_philosophy, personal_interests, professional_background) VALUES

-- Dr. Michael Rivers (Mindfulness)
('dr-michael-rivers', 
 '{"early_inspiration": "Found peace through meditation after burnout in corporate law", "personal_journey": "Transitioned from high-stress career to mindful living", "life_changing_moment": "Silent retreat experience led to career change"}',
 ARRAY['Let''s pause and breathe together', 'What do you notice in your body right now?', 'This moment is all we truly have'],
 '{"speaking_pace": "slow_deliberate", "tone": "serene_grounded", "uses_silence": true, "metaphors": "nature_water_based"}',
 'Believes mindfulness is the gateway to authentic living and emotional freedom through present-moment awareness',
 ARRAY['meditation', 'hiking', 'tea_ceremonies', 'zen_gardening', 'calligraphy'],
 '{"education": ["JD Law - Harvard", "Mindfulness Teacher Training"], "career_transition": "15 years law to therapy", "years_practicing": 12}'
),

-- Dr. Emma Thompson (Humanistic)
('dr-emma-thompson', 
 '{"inspiration": "Inspired by Carl Rogers during college psychology course", "core_belief": "Every person has inherent worth and growth potential", "approach_development": "Witnessed transformative power of unconditional acceptance"}',
 ARRAY['You are exactly where you need to be', 'I trust your inner wisdom', 'You have everything within you to grow'],
 '{"speaking_pace": "warm_flowing", "tone": "accepting_nurturing", "validation_frequent": true, "uses_affirmations": true}',
 'Every human has an innate tendency toward growth and self-actualization when provided with the right conditions',
 ARRAY['gardening', 'pottery', 'reading_philosophy', 'volunteering', 'painting'],
 '{"education": ["PhD Humanistic Psychology", "Rogers Institute Training"], "mentorship": "Direct student of Rogers proteges", "years_practicing": 18}'
),

-- Dr. James Martinez (Solution-Focused)
('dr-james-martinez', 
 '{"motivation": "Overcame depression through focusing on small daily wins", "philosophy_origin": "Sports psychology background shaped solution-focus", "family_influence": "Raised by optimistic immigrant parents"}',
 ARRAY['What''s working well for you right now?', 'Tell me about a time you handled this successfully', 'What would be different if this was solved?'],
 '{"speaking_pace": "energetic_focused", "tone": "optimistic_practical", "future_oriented": true, "solution_seeking": true}',
 'People already possess the resources and strengths needed to solve their problems - therapy helps uncover them',
 ARRAY['soccer_coaching', 'running', 'cooking_family_recipes', 'mentoring_youth'],
 '{"education": ["MS Sports Psychology", "Solution-Focused Therapy Certification"], "background": "Former athlete turned therapist", "years_practicing": 10}'
),

-- Dr. Maya Patel (Mindfulness Coach)
('dr-maya-patel', 
 '{"cultural_influence": "Grew up with yoga and meditation traditions", "personal_trauma": "Used mindfulness to heal from family loss", "mission": "Bridge Eastern wisdom with Western psychology"}',
 ARRAY['Breathe into this feeling', 'What is your body teaching you?', 'You are not your thoughts'],
 '{"speaking_pace": "gentle_rhythmic", "tone": "compassionate_wise", "incorporates_breathwork": true, "somatic_aware": true}',
 'Healing happens when we learn to be present with ourselves with compassion and non-judgment',
 ARRAY['yoga', 'ayurveda', 'indian_classical_music', 'spice_gardening', 'meditation_retreats'],
 '{"education": ["MA Clinical Psychology", "500-hour Yoga Teacher Training", "Mindfulness-Based Stress Reduction"], "cultural_bridge": "East-West therapeutic approaches", "years_practicing": 14}'
),

-- Dr. Jordan Kim (Trauma-Informed)
('dr-jordan-kim', 
 '{"calling": "Became therapist after surviving childhood trauma", "healing_journey": "Own therapy experience shaped trauma-sensitive approach", "dedication": "Committed to creating safety for survivors"}',
 ARRAY['You are safe here', 'Your reactions make perfect sense', 'Healing happens at your pace'],
 '{"speaking_pace": "slow_steady", "tone": "gentle_grounding", "trauma_informed": true, "safety_focused": true, "patient": true}',
 'Trauma is not what happened to you, but what happened inside you - and healing is always possible',
 ARRAY['support_groups', 'trauma_survivor_advocacy', 'gentle_yoga', 'nature_photography'],
 '{"education": ["MSW Trauma Specialization", "EMDR Training", "Somatic Experiencing"], "lived_experience": "Trauma survivor turned healer", "years_practicing": 8}'
),

-- Continue with more therapists in batches...
('dr-marcus-bennett', 
 '{"background": "Former military officer who found strength-based leadership", "transition": "Applied military problem-solving to therapy", "philosophy": "Every setback contains seeds of comeback"}',
 ARRAY['What''s your next right step?', 'You''ve overcome challenges before', 'Let''s build on what''s working'],
 '{"speaking_pace": "confident_clear", "tone": "encouraging_direct", "strength_focused": true, "action_oriented": true}',
 'Focus on solutions, leverage existing strengths, and take decisive action toward positive change',
 ARRAY['mountain_climbing', 'leadership_coaching', 'fitness_training', 'reading_biographies'],
 '{"education": ["MA Counseling Psychology", "Military Leadership Training"], "background": "20 years military service", "years_practicing": 7}'
),

('dr-taylor-morgan', 
 '{"family_influence": "Grew up in blended family, learned communication skills early", "relationship_focus": "Fascinated by human connection dynamics", "couples_work": "Specializes in rebuilding trust and intimacy"}',
 ARRAY['Help me understand your perspective', 'What would connection look like?', 'Relationships are our greatest teachers'],
 '{"speaking_pace": "balanced_thoughtful", "tone": "curious_analytical", "relationship_focused": true, "communication_skills": "expert"}',
 'Healthy relationships are the foundation of wellbeing - they require skill, intention, and ongoing nurturing',
 ARRAY['couples_dancing', 'hosting_dinner_parties', 'relationship_research', 'community_mediation'],
 '{"education": ["PhD Relationship Psychology", "Gottman Method Training"], "specialization": "15 years couples therapy", "years_practicing": 15}'
),

('dr-river-stone', 
 '{"spiritual_journey": "Studied various healing traditions worldwide", "integration": "Combines psychology with ancient wisdom", "holistic_calling": "Believes in mind-body-spirit unity"}',
 ARRAY['How is your whole self feeling?', 'What does your intuition tell you?', 'We are more than our symptoms'],
 '{"speaking_pace": "flowing_intuitive", "tone": "wise_integrative", "holistic_perspective": true, "spiritual_openness": true}',
 'True healing addresses the whole person - mind, body, spirit, and connection to something greater',
 ARRAY['energy_healing', 'herbal_medicine', 'shamanic_journeying', 'crystal_work', 'nature_ceremonies'],
 '{"education": ["PhD Transpersonal Psychology", "Various healing modalities"], "world_travel": "Studied with healers globally", "years_practicing": 20}'
),

('dr-jordan-taylor', 
 '{"personal_discovery": "Diagnosed with ADHD as adult therapist", "advocacy": "Passionate neurodiversity advocate", "understanding": "Combines lived experience with clinical expertise"}',
 ARRAY['Your brain is beautifully different', 'Let''s work with your neurodivergence', 'ADHD is a superpower with the right tools'],
 '{"speaking_pace": "energetic_adaptable", "tone": "understanding_enthusiastic", "neurodiversity_affirming": true, "practical_focus": true}',
 'ADHD brains are not broken - they''re different and magnificent with the right support and strategies',
 ARRAY['fidget_collecting', 'organizing_systems', 'neurodiversity_conferences', 'brain_science_research'],
 '{"education": ["PhD Clinical Psychology", "ADHD Specialization"], "lived_experience": "ADHD diagnosed adult", "years_practicing": 12}'
),

('dr-riley-chen', 
 '{"identity_journey": "Own coming out experience shaped therapeutic approach", "advocacy": "Active in LGBTQ+ rights movement", "safe_spaces": "Dedicated to creating affirming environments"}',
 ARRAY['Your identity is valid and beautiful', 'You belong exactly as you are', 'Authenticity is your birthright'],
 '{"speaking_pace": "warm_affirming", "tone": "validating_supportive", "identity_affirming": true, "culturally_sensitive": true}',
 'Every person deserves to live authentically and be celebrated for who they truly are',
 ARRAY['lgbtq_advocacy', 'pride_events', 'gender_studies', 'chosen_family_gatherings', 'art_therapy'],
 '{"education": ["PhD Clinical Psychology", "LGBTQ+ Specialization"], "advocacy": "10 years community work", "years_practicing": 9}'
);