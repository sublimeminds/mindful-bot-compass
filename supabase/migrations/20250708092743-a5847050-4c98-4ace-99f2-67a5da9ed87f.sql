-- Insert initial achievement badges
INSERT INTO public.achievement_badges (name, title, description, icon, category, rarity, xp_reward, requirements, unlock_criteria) VALUES
-- Breathing & Mindfulness
('first_breath_session', 'First Breath', 'Completed your first breathing exercise', 'Wind', 'mindfulness', 'common', 25, '{"sessions": 1}', '{"technique": "breathing"}'),
('breath_master', 'Breath Master', 'Completed 50 breathing sessions', 'Crown', 'mindfulness', 'rare', 500, '{"sessions": 50}', '{"technique": "breathing"}'),
('mindful_moment', 'Mindful Moment', 'Practiced mindfulness for 7 consecutive days', 'Brain', 'mindfulness', 'uncommon', 150, '{"consecutive_days": 7}', '{"technique": "mindfulness"}'),

-- Therapy & Sessions
('first_session', 'Therapy Pioneer', 'Completed your first therapy session', 'MessageCircle', 'therapy', 'common', 50, '{"sessions": 1}', '{"type": "therapy_session"}'),
('consistent_progress', 'Consistent Progress', 'Attended therapy sessions for 4 weeks straight', 'Calendar', 'therapy', 'uncommon', 200, '{"weekly_sessions": 4}', '{"consistency": true}'),
('breakthrough_moment', 'Breakthrough', 'Achieved a major therapeutic breakthrough', 'Lightbulb', 'therapy', 'epic', 1000, '{"breakthrough": 1}', '{"therapist_recognition": true}'),

-- Goals & Progress
('goal_setter', 'Goal Setter', 'Set your first personal goal', 'Target', 'goals', 'common', 25, '{"goals_set": 1}', '{"type": "goal_creation"}'),
('goal_achiever', 'Goal Achiever', 'Completed 5 personal goals', 'Trophy', 'goals', 'uncommon', 250, '{"goals_completed": 5}', '{"type": "goal_completion"}'),
('streak_master', 'Streak Master', 'Maintained a 30-day goal streak', 'Flame', 'goals', 'rare', 750, '{"streak_days": 30}', '{"type": "streak"}'),

-- Mood & Wellness
('mood_tracker', 'Mood Explorer', 'Logged your mood for 7 days', 'Heart', 'wellness', 'common', 75, '{"mood_entries": 7}', '{"type": "mood_tracking"}'),
('wellness_warrior', 'Wellness Warrior', 'Maintained positive mood trends for 2 weeks', 'Shield', 'wellness', 'uncommon', 300, '{"positive_trend_days": 14}', '{"mood_improvement": true}'),

-- Learning & Knowledge
('knowledge_seeker', 'Knowledge Seeker', 'Unlocked 10 knowledge items', 'Book', 'learning', 'common', 100, '{"knowledge_items": 10}', '{"type": "knowledge_unlock"}'),
('wisdom_keeper', 'Wisdom Keeper', 'Mastered 25 knowledge items', 'GraduationCap', 'learning', 'rare', 500, '{"mastered_items": 25}', '{"mastery_level": 3}'),

-- Community & Social
('community_member', 'Community Member', 'Joined your first support group', 'Users', 'community', 'common', 50, '{"groups_joined": 1}', '{"type": "group_participation"}'),
('supportive_friend', 'Supportive Friend', 'Helped 10 community members', 'Handshake', 'community', 'uncommon', 200, '{"help_count": 10}', '{"type": "community_support"}'),

-- Special Achievements
('early_adopter', 'Early Adopter', 'One of the first users to try the 3D avatar system', 'Rocket', 'special', 'legendary', 2000, '{"beta_feature": "avatar_system"}', '{"early_access": true}'),
('level_up', 'Level Up!', 'Reached level 10', 'Star', 'progression', 'uncommon', 500, '{"level": 10}', '{"type": "level_progression"}');

-- Insert initial knowledge items
INSERT INTO public.knowledge_items (title, content, category, unlock_requirements, xp_value, difficulty_level, tags) VALUES
-- Breathing Techniques
('Box Breathing Technique', 'Learn the 4-4-4-4 breathing pattern used by Navy SEALs and athletes to manage stress and improve focus.', 'breathing', '{}', 10, 'beginner', ARRAY['breathing', 'stress-relief', 'focus']),
('Progressive Muscle Relaxation', 'A technique that involves tensing and relaxing different muscle groups to achieve deep relaxation.', 'relaxation', '{"badges": ["first_breath_session"]}', 15, 'intermediate', ARRAY['relaxation', 'anxiety', 'sleep']),
('4-7-8 Breathing', 'A powerful breathing technique for falling asleep and managing anxiety, developed by Dr. Andrew Weil.', 'breathing', '{}', 10, 'beginner', ARRAY['breathing', 'sleep', 'anxiety']),

-- Mindfulness & Meditation
('Mindfulness Basics', 'Understanding the fundamentals of mindfulness: present-moment awareness without judgment.', 'mindfulness', '{}', 15, 'beginner', ARRAY['mindfulness', 'awareness', 'meditation']),
('Body Scan Meditation', 'A guided practice to develop body awareness and release physical tension.', 'meditation', '{"xp": 50}', 20, 'intermediate', ARRAY['meditation', 'body-awareness', 'relaxation']),
('Loving-Kindness Meditation', 'Cultivate compassion and positive emotions toward yourself and others.', 'meditation', '{"level": 3}', 25, 'intermediate', ARRAY['compassion', 'relationships', 'self-love']),

-- Cognitive Techniques
('Cognitive Restructuring', 'Learn to identify and challenge negative thought patterns using CBT techniques.', 'cognitive', '{"badges": ["first_session"]}', 30, 'intermediate', ARRAY['cbt', 'thoughts', 'reframing']),
('Thought Records', 'A structured way to examine your thoughts and their impact on emotions and behaviors.', 'cognitive', '{"badges": ["first_session"]}', 25, 'intermediate', ARRAY['cbt', 'self-awareness', 'emotions']),
('Mindful Observation', 'Practice observing thoughts and emotions without getting caught up in them.', 'mindfulness', '{}', 20, 'beginner', ARRAY['mindfulness', 'thoughts', 'emotions']),

-- Emotional Regulation
('Emotion Regulation Skills', 'Learn TIPP and other DBT techniques for managing intense emotions.', 'emotions', '{"level": 2}', 35, 'advanced', ARRAY['dbt', 'emotions', 'coping']),
('Distress Tolerance', 'Skills for surviving crisis situations without making them worse.', 'crisis', '{"badges": ["mood_tracker"]}', 40, 'advanced', ARRAY['dbt', 'crisis', 'survival']),

-- Trauma & Healing
('Understanding Trauma', 'Learn about how trauma affects the brain and body, and paths to healing.', 'trauma', '{"level": 5}', 50, 'advanced', ARRAY['trauma', 'healing', 'neuroscience']),
('Grounding Techniques', 'Five practical grounding techniques to manage flashbacks and dissociation.', 'trauma', '{}', 25, 'beginner', ARRAY['trauma', 'grounding', 'safety']);

-- Insert initial avatar customization items
INSERT INTO public.avatar_customization_items (name, category, item_type, config_data, unlock_requirements, rarity, xp_cost) VALUES
-- Basic appearance items (free)
('Default Male', 'base', 'body_type', '{"gender": "male", "body_shape": "default"}', '{}', 'common', 0),
('Default Female', 'base', 'body_type', '{"gender": "female", "body_shape": "default"}', '{}', 'common', 0),
('Default Non-Binary', 'base', 'body_type', '{"gender": "non-binary", "body_shape": "default"}', '{}', 'common', 0),

-- Hair styles
('Short Brown Hair', 'hair', 'hairstyle', '{"style": "short", "color": "#8B4513"}', '{}', 'common', 0),
('Long Blonde Hair', 'hair', 'hairstyle', '{"style": "long", "color": "#FFD700"}', '{"xp": 100}', 'common', 50),
('Curly Black Hair', 'hair', 'hairstyle', '{"style": "curly", "color": "#000000"}', '{"level": 2}', 'uncommon', 100),
('Rainbow Hair', 'hair', 'hairstyle', '{"style": "long", "color": "rainbow"}', '{"badges": ["breakthrough_moment"]}', 'epic', 500),

-- Clothing
('Casual T-Shirt', 'clothing', 'top', '{"type": "tshirt", "color": "#4A90E2"}', '{}', 'common', 0),
('Therapy Hoodie', 'clothing', 'top', '{"type": "hoodie", "color": "#6B73FF", "text": "Mindful"}', '{"badges": ["first_session"]}', 'uncommon', 150),
('Zen Robe', 'clothing', 'outfit', '{"type": "robe", "color": "#8B4513", "style": "meditation"}', '{"badges": ["mindful_moment"]}', 'rare', 300),

-- Accessories
('Meditation Beads', 'accessories', 'jewelry', '{"type": "beads", "material": "wood"}', '{"badges": ["mindful_moment"]}', 'uncommon', 200),
('Therapy Badge', 'accessories', 'pin', '{"type": "badge", "text": "Therapy Warrior"}', '{"badges": ["consistent_progress"]}', 'rare', 250),
('Stress Ball', 'accessories', 'hand_item', '{"type": "stress_ball", "color": "#FF6B6B"}', '{"xp": 50}', 'common', 75),

-- Mood expressions
('Happy Glow', 'expressions', 'aura', '{"type": "glow", "color": "#FFD700", "trigger": "happy"}', '{"badges": ["wellness_warrior"]}', 'uncommon', 200),
('Calm Waves', 'expressions', 'aura', '{"type": "waves", "color": "#4A90E2", "trigger": "calm"}', '{"badges": ["breath_master"]}', 'rare', 400),
('Confident Spark', 'expressions', 'aura', '{"type": "sparks", "color": "#FF4757", "trigger": "confident"}', '{"level": 5}', 'rare', 350);