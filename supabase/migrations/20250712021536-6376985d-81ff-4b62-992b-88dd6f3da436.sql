-- Add Alex knowledge base content to content_library table
INSERT INTO public.content_library (title, description, category, content_type, content_url, target_audience, therapeutic_approach, tags, is_published, published_at) VALUES
-- TherapySync Platform Features
('TherapySync Dashboard Overview', 'Complete guide to using your wellness dashboard for tracking mood, progress, and goals', 'platform_guide', 'guide', null, ARRAY['all_users'], 'general', ARRAY['dashboard', 'platform', 'navigation'], true, now()),
('How to Start a Therapy Session', 'Step-by-step guide to accessing and beginning therapy sessions with AI therapists', 'platform_guide', 'guide', null, ARRAY['all_users'], 'general', ARRAY['therapy', 'getting_started', 'platform'], true, now()),
('Quick Chat vs Therapy Sessions', 'Understanding the difference between immediate support and full therapy sessions', 'platform_guide', 'guide', null, ARRAY['all_users'], 'general', ARRAY['therapy', 'quick_chat', 'support'], true, now()),
('Mood Tracking Best Practices', 'How to effectively track your mood for better mental health insights', 'wellness', 'guide', null, ARRAY['all_users'], 'general', ARRAY['mood_tracking', 'wellness', 'self_care'], true, now()),
('Setting Effective Mental Health Goals', 'Guide to creating and tracking meaningful mental health goals', 'goal_setting', 'guide', null, ARRAY['all_users'], 'general', ARRAY['goals', 'motivation', 'progress'], true, now()),

-- Mental Health Education
('Understanding Anxiety: A Comprehensive Guide', 'Educational content about anxiety symptoms, causes, and coping strategies', 'education', 'article', null, ARRAY['all_users'], 'CBT', ARRAY['anxiety', 'education', 'coping'], true, now()),
('Depression Support and Resources', 'Understanding depression and finding support through TherapySync', 'education', 'article', null, ARRAY['all_users'], 'general', ARRAY['depression', 'support', 'resources'], true, now()),
('Stress Management Techniques', 'Evidence-based stress reduction techniques and when to use them', 'wellness', 'guide', null, ARRAY['all_users'], 'mindfulness', ARRAY['stress', 'coping', 'mindfulness'], true, now()),
('Building Emotional Resilience', 'Strategies for developing emotional strength and resilience', 'wellness', 'guide', null, ARRAY['all_users'], 'DBT', ARRAY['resilience', 'emotional_regulation', 'growth'], true, now()),

-- Crisis Support Information
('Crisis Support Resources', 'Comprehensive list of crisis support resources and how to access immediate help', 'crisis_support', 'resource', null, ARRAY['all_users'], 'crisis_intervention', ARRAY['crisis', 'emergency', 'support', 'hotlines'], true, now()),
('When to Seek Immediate Help', 'Understanding crisis signs and when to escalate to professional help', 'crisis_support', 'guide', null, ARRAY['all_users'], 'crisis_intervention', ARRAY['crisis', 'safety', 'professional_help'], true, now()),

-- Self-Care and Wellness
('Daily Self-Care Checklist', 'Simple self-care activities for maintaining mental wellness', 'wellness', 'checklist', null, ARRAY['all_users'], 'general', ARRAY['self_care', 'daily_wellness', 'routine'], true, now()),
('Mindfulness for Beginners', 'Introduction to mindfulness practices and how to start your journey', 'wellness', 'guide', null, ARRAY['all_users'], 'mindfulness', ARRAY['mindfulness', 'meditation', 'beginners'], true, now()),
('Sleep and Mental Health Connection', 'Understanding how sleep affects mental health and tips for better sleep', 'wellness', 'article', null, ARRAY['all_users'], 'general', ARRAY['sleep', 'mental_health', 'wellness'], true, now()),

-- Platform Navigation
('Customizing Your TherapySync Experience', 'How to personalize settings, preferences, and your therapy approach', 'platform_guide', 'guide', null, ARRAY['all_users'], 'general', ARRAY['customization', 'settings', 'personalization'], true, now()),
('Understanding Your Analytics', 'How to interpret your wellness data and progress metrics', 'platform_guide', 'guide', null, ARRAY['all_users'], 'general', ARRAY['analytics', 'progress', 'data'], true, now()),
('Privacy and Security in TherapySync', 'Understanding how your data is protected and privacy settings', 'platform_guide', 'guide', null, ARRAY['all_users'], 'general', ARRAY['privacy', 'security', 'data_protection'], true, now());

-- Add Alex-specific AI configuration
INSERT INTO public.ai_configurations (
  name, 
  model_name, 
  model_provider, 
  configuration, 
  cultural_settings, 
  voice_settings, 
  emergency_protocols,
  is_active
) VALUES (
  'Alex - Mental Health Companion',
  'gpt-4.1-2025-04-14',
  'openai',
  jsonb_build_object(
    'temperature', 0.8,
    'max_tokens', 1200,
    'top_p', 0.9,
    'system_role', 'companion_guide',
    'personality_traits', ARRAY['enthusiastic', 'supportive', 'wise', 'empathetic', 'encouraging'],
    'communication_style', 'supportive',
    'expertise_areas', ARRAY['mental_health_guidance', 'platform_navigation', 'crisis_recognition', 'goal_setting', 'motivation', 'emotional_support']
  ),
  jsonb_build_object(
    'cultural_sensitivity', true,
    'inclusive_language', true,
    'adaptable_communication', true,
    'respectful_boundaries', true
  ),
  jsonb_build_object(
    'voice_enabled', false,
    'emotional_expression', true,
    'speaking_rate', 'moderate',
    'tone_adaptation', true
  ),
  jsonb_build_object(
    'crisis_detection', true,
    'immediate_resources', ARRAY['988', '741741', 'suicidepreventionlifeline.org'],
    'escalation_triggers', ARRAY['suicide', 'kill myself', 'end it all', 'hurt myself'],
    'professional_handoff', true
  ),
  true
);