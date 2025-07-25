-- Remove "View All" navigation items if any exist
DELETE FROM navigation_menu_items WHERE title LIKE '%View All%';

-- Update all navigation items with unique 3-color gradients and new icons
-- THERAPY AI CATEGORY (11 items) - Therapy-focused color schemes
UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-400 via-therapy-500 to-harmony-600',
  icon = 'therapy-ai-core'
WHERE id = '5d70ee9e-48f3-4536-8145-0390e270a654'; -- TherapySync AI Core

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-500 via-therapy-400 to-flow-600',
  icon = 'ai-therapy-chat'
WHERE id = '20000000-1111-1111-1111-111111111111'; -- AI Therapy Chat

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-500 via-balance-600 to-therapy-700',
  icon = 'ai-personalization'
WHERE id = '20000000-2222-2222-2222-222222222222'; -- AI Personalization

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-600 via-calm-500 to-balance-700',
  icon = 'adaptive-systems'
WHERE id = '20000000-3333-3333-3333-333333333333'; -- Adaptive Systems

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-600 via-harmony-500 to-calm-700',
  icon = 'cognitive-behavioral-therapy'
WHERE id = '20000000-4444-4444-4444-444444444444'; -- Cognitive Behavioral Therapy

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-500 via-therapy-600 to-harmony-700',
  icon = 'dialectical-behavior-therapy'
WHERE id = '20000000-5555-5555-5555-555555555555'; -- Dialectical Behavior Therapy

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-600 via-flow-500 to-therapy-700',
  icon = 'mindfulness-based-therapy'
WHERE id = '20000000-6666-6666-6666-666666666666'; -- Mindfulness-Based Therapy

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-600 via-therapy-700 to-balance-800',
  icon = 'trauma-focused-therapy'
WHERE id = '20000000-7777-7777-7777-777777777777'; -- Trauma-Focused Therapy

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-500 via-harmony-600 to-therapy-700',
  icon = 'cultural-ai'
WHERE id = '30000000-1111-1111-1111-111111111111'; -- Cultural AI

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-500 via-calm-600 to-flow-700',
  icon = 'voice-ai-therapy'
WHERE id = '30000000-2222-2222-2222-222222222222'; -- Voice AI Therapy

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-600 via-harmony-700 to-therapy-800',
  icon = 'Users'
WHERE id = '30000000-3333-3333-3333-333333333333'; -- Group Therapy AI

-- PLATFORM CATEGORY (7 items) - Platform-focused color schemes
UPDATE navigation_menu_items SET 
  gradient = 'from-calm-400 via-flow-500 to-balance-600',
  icon = 'Stethoscope'
WHERE id = 'e8292c9f-f1af-453f-9246-163134cc885b'; -- AI Therapist Team

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-500 via-harmony-400 to-calm-600',
  icon = 'TrendingUp'
WHERE id = 'e6b93816-90d4-4919-b7a7-c50e77cb1dff'; -- Mood & Progress Tracking

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-600 via-balance-500 to-flow-700',
  icon = 'Shield'
WHERE id = '303242c9-3ceb-4b2d-b3de-f5cbff7d8a57'; -- Crisis Support System

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-400 via-calm-600 to-harmony-700',
  icon = 'Users'
WHERE id = '000a9124-7211-4a3d-b30e-d449d0424fe2'; -- Family Account Sharing

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-500 via-therapy-400 to-balance-700',
  icon = 'Users'
WHERE id = 'ec81040d-9580-4a52-a1b4-557b2d09f84d'; -- Community & Groups

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-600 via-calm-500 to-harmony-700',
  icon = 'Plug'
WHERE id = '1b57d7c3-6d03-4d77-8339-25b06b08a3d3'; -- Integrations Hub

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-700 via-harmony-600 to-flow-800',
  icon = 'LifeBuoy'
WHERE id = '30000000-4444-4444-4444-444444444444'; -- Crisis Support

-- TOOLS & DATA CATEGORY (5 items) - Technical color schemes
UPDATE navigation_menu_items SET 
  gradient = 'from-balance-600 via-flow-700 to-therapy-800',
  icon = 'Code'
WHERE id = '21000000-1111-1111-1111-111111111111'; -- API Access

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-500 via-calm-600 to-balance-700',
  icon = 'Smartphone'
WHERE id = '21000000-2222-2222-2222-222222222222'; -- Mobile Apps

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-600 via-therapy-700 to-harmony-800',
  icon = 'Download'
WHERE id = '21000000-3333-3333-3333-333333333333'; -- Data Export

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-600 via-balance-700 to-flow-800',
  icon = 'Plug'
WHERE id = '21000000-4444-4444-4444-444444444444'; -- Custom Integrations

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-600 via-harmony-700 to-calm-800',
  icon = 'Watch'
WHERE id = '30000000-7777-7777-7777-777777777777'; -- Wearable Integration

-- SOLUTIONS CATEGORY (6 items) - Solution-focused color schemes
UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-400 via-therapy-500 to-calm-600',
  icon = 'User'
WHERE id = '21000000-5555-5555-5555-555555555555'; -- For Individuals

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-500 via-harmony-600 to-therapy-700',
  icon = 'Users'
WHERE id = '21000000-6666-6666-6666-666666666666'; -- For Families

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-500 via-balance-600 to-flow-700',
  icon = 'Building'
WHERE id = '21000000-7777-7777-7777-777777777777'; -- For Organizations

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-500 via-therapy-600 to-harmony-700',
  icon = 'CreditCard'
WHERE id = '21000000-8888-8888-8888-888888888888'; -- Pricing Plans

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-600 via-calm-700 to-therapy-800',
  icon = 'Stethoscope'
WHERE id = '30000000-8888-8888-8888-888888888888'; -- Healthcare Providers

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-600 via-flow-700 to-balance-800',
  icon = 'Lock'
WHERE id = '30000000-9999-9999-9999-999999999999'; -- Enterprise Security

-- RESOURCES CATEGORY (7 items) - Educational color schemes
UPDATE navigation_menu_items SET 
  gradient = 'from-flow-400 via-harmony-500 to-calm-600',
  icon = 'Lightbulb'
WHERE id = '21000000-9999-9999-9999-999999999999'; -- How It Works

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-600 via-therapy-500 to-balance-700',
  icon = 'LifeBuoy'
WHERE id = '21000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; -- Support Center

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-400 via-flow-600 to-harmony-700',
  icon = 'GraduationCap'
WHERE id = '21000000-bbbb-bbbb-bbbb-bbbbbbbbbbbb'; -- Learning Hub

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-500 via-calm-600 to-therapy-700',
  icon = 'BookOpen'
WHERE id = '21000000-cccc-cccc-cccc-cccccccccccc'; -- Blog & Insights

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-500 via-therapy-600 to-flow-700',
  icon = 'FileText'
WHERE id = '21000000-dddd-dddd-dddd-dddddddddddd'; -- Research & Studies

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-600 via-balance-700 to-harmony-800',
  icon = 'Users'
WHERE id = '30000000-bbbb-bbbb-bbbb-bbbbbbbbbbbb'; -- Therapist Directory

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-700 via-harmony-600 to-therapy-800',
  icon = 'BookOpenCheck'
WHERE id = '30000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; -- Mental Health Library