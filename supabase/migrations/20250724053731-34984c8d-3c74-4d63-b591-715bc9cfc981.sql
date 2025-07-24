-- Add missing navigation items for Cultural AI, Voice AI, and other missing features

-- First, let's add some missing items to the Therapy AI menu
INSERT INTO public.navigation_menu_items (
  id, menu_id, category_id, title, description, href, icon, gradient, badge, position, is_active
) VALUES 
-- Cultural AI Features
('30000000-1111-1111-1111-111111111111', '00000000-1111-1111-1111-111111111111', '10000000-1111-1111-1111-111111111111', 'Cultural AI', 'AI therapists trained in diverse cultural backgrounds and communication styles', '/cultural-ai', 'Globe', 'from-purple-500 to-purple-600', 'New', 8, true),
('30000000-2222-2222-2222-222222222222', '00000000-1111-1111-1111-111111111111', '10000000-1111-1111-1111-111111111111', 'Voice AI Therapy', 'Natural voice conversations with AI therapists using advanced speech technology', '/voice-ai', 'Mic', 'from-blue-500 to-blue-600', 'Beta', 9, true),
('30000000-3333-3333-3333-333333333333', '00000000-1111-1111-1111-111111111111', '10000000-2222-2222-2222-222222222222', 'Group Therapy AI', 'AI-facilitated group therapy sessions with peer support', '/group-therapy', 'Users', 'from-green-500 to-green-600', null, 8, true),

-- Platform enhancements
('30000000-4444-4444-4444-444444444444', '00000000-2222-2222-2222-222222222222', '10000000-3333-3333-3333-333333333333', 'Crisis Support', '24/7 AI-powered crisis intervention and emergency resources', '/crisis-support', 'Shield', 'from-red-500 to-red-600', 'Critical', 7, true),
('30000000-5555-5555-5555-555555555555', '00000000-2222-2222-2222-222222222222', '10000000-4444-4444-4444-444444444444', 'Video Sessions', 'Face-to-face video therapy sessions with AI avatars', '/video-sessions', 'Video', 'from-purple-500 to-purple-600', 'Pro', 7, true),

-- Tools & Data additions
('30000000-6666-6666-6666-666666666666', '00000000-3333-3333-3333-333333333333', '10000000-5555-5555-5555-555555555555', 'AI Insights Engine', 'Advanced analytics and personalized recommendations based on your therapy data', '/ai-insights', 'Brain', 'from-orange-500 to-orange-600', 'Premium', 7, true),
('30000000-7777-7777-7777-777777777777', '00000000-3333-3333-3333-333333333333', '10000000-6666-6666-6666-666666666666', 'Wearable Integration', 'Connect fitness trackers and health devices for comprehensive wellness tracking', '/wearable-integration', 'Watch', 'from-teal-500 to-teal-600', null, 7, true),

-- Solutions enhancements  
('30000000-8888-8888-8888-888888888888', '00000000-4444-4444-4444-444444444444', '10000000-7777-7777-7777-777777777777', 'Healthcare Providers', 'Professional tools for therapists and healthcare institutions', '/healthcare-providers', 'Stethoscope', 'from-blue-600 to-blue-700', null, 5, true),
('30000000-9999-9999-9999-999999999999', '00000000-4444-4444-4444-444444444444', '10000000-8888-8888-8888-888888888888', 'Enterprise Security', 'HIPAA-compliant enterprise solutions with advanced security features', '/enterprise-security', 'Lock', 'from-gray-600 to-gray-700', 'Enterprise', 6, true),

-- Resources additions
('30000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-5555-5555-5555-555555555555', '10000000-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mental Health Library', 'Comprehensive collection of mental health resources and educational materials', '/mental-health-library', 'BookOpen', 'from-indigo-500 to-indigo-600', null, 6, true),
('30000000-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-5555-5555-5555-555555555555', '10000000-9999-9999-9999-999999999999', 'Therapist Directory', 'Find and connect with human therapists in your area', '/therapist-directory', 'UserCheck', 'from-emerald-500 to-emerald-600', null, 6, true);

-- Update icon mappings to include missing icons
-- The icons should already be in the iconUtils file, but let's make sure they're properly mapped