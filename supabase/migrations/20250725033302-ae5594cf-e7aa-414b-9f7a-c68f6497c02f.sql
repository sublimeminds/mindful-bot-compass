-- Add missing TherapySync AI Core item and update all items with unique gradients and icons

-- First, add the missing TherapySync AI Core item
INSERT INTO navigation_menu_items (
  menu_id, 
  title, 
  description, 
  href, 
  icon, 
  gradient, 
  position
) VALUES (
  (SELECT id FROM navigation_menus WHERE name = 'therapy-ai'),
  'TherapySync AI Core',
  'Core AI therapy platform with integrated wellness tracking and personalized care',
  '/therapy-ai',
  'Brain',
  'from-therapy-400 via-harmony-500 to-calm-600',
  0
);

-- Update all existing items to have position + 1 to make room for the core item
UPDATE navigation_menu_items 
SET position = position + 1 
WHERE menu_id = (SELECT id FROM navigation_menus WHERE name = 'therapy-ai')
AND title != 'TherapySync AI Core';

-- Update all Therapy AI items with unique gradients and better icons
UPDATE navigation_menu_items SET 
  gradient = 'from-calm-500 via-flow-400 to-balance-500',
  icon = 'MessageCircle'
WHERE title = 'AI Therapy Chat';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-600 via-balance-400 to-therapy-500',
  icon = 'User'
WHERE title = 'AI Personalization';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-600 via-calm-500 to-therapy-400',
  icon = 'Settings'
WHERE title = 'Adaptive Systems';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-600 via-therapy-500 to-harmony-400',
  icon = 'Brain'
WHERE title = 'CBT (Cognitive Behavioral Therapy)';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-700 via-calm-400 to-flow-500',
  icon = 'Heart'
WHERE title = 'DBT (Dialectical Behavior Therapy)';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-700 via-flow-600 to-balance-400',
  icon = 'Compass'
WHERE title = 'Mindfulness & Meditation';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-800 via-balance-600 to-harmony-500',
  icon = 'Shield'
WHERE title = 'Trauma-Informed Support';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-700 via-harmony-500 to-calm-500',
  icon = 'Globe'
WHERE title = 'Cultural AI Therapy';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-700 via-therapy-500 to-harmony-400',
  icon = 'Users'
WHERE title = 'Group Therapy AI';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-800 via-flow-500 to-therapy-400',
  icon = 'Mic'
WHERE title = 'Voice AI Therapy';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-700 via-calm-600 to-balance-500',
  icon = 'BarChart3'
WHERE title = 'Mood Tracking';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-800 via-harmony-600 to-therapy-500',
  icon = 'Target'
WHERE title = 'Goal Setting';

-- Update Platform items with unique gradients
UPDATE navigation_menu_items SET 
  gradient = 'from-calm-800 via-therapy-600 to-flow-500',
  icon = 'LayoutDashboard'
WHERE title = 'Dashboard Overview';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-800 via-flow-600 to-harmony-500',
  icon = 'Calendar'
WHERE title = 'Session Scheduling';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-800 via-therapy-600 to-calm-500',
  icon = 'FileText'
WHERE title = 'Progress Reports';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-900 via-balance-700 to-flow-600',
  icon = 'UserCheck'
WHERE title = 'Therapist Matching';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-900 via-harmony-700 to-balance-600',
  icon = 'Smartphone'
WHERE title = 'Mobile App';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-900 via-therapy-700 to-harmony-600',
  icon = 'MessageSquare'
WHERE title = 'WhatsApp Integration';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-900 via-calm-700 to-therapy-600',
  icon = 'Building'
WHERE title = 'Enterprise Solutions';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-900 via-flow-700 to-balance-600',
  icon = 'Plug'
WHERE title = 'API Integration';

-- Update Tools & Data items with unique gradients
UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-600 via-flow-800 to-calm-700',
  icon = 'Activity'
WHERE title = 'Analytics Dashboard';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-600 via-balance-800 to-harmony-700',
  icon = 'TrendingUp'
WHERE title = 'Data Insights';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-600 via-harmony-800 to-therapy-700',
  icon = 'Code'
WHERE title = 'API Access';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-600 via-therapy-800 to-flow-700',
  icon = 'Download'
WHERE title = 'Data Export';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-600 via-calm-800 to-balance-700',
  icon = 'Database'
WHERE title = 'Custom Reports';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-500 via-harmony-800 to-flow-700',
  icon = 'Zap'
WHERE title = 'Real-time Monitoring';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-500 via-therapy-800 to-balance-700',
  icon = 'TrendingDown'
WHERE title = 'Predictive Analytics';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-500 via-balance-800 to-harmony-700',
  icon = 'Search'
WHERE title = 'Data Mining';

-- Update Solutions items with unique gradients
UPDATE navigation_menu_items SET 
  gradient = 'from-balance-500 via-flow-800 to-therapy-700',
  icon = 'Building'
WHERE title = 'Healthcare Systems';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-500 via-therapy-800 to-calm-700',
  icon = 'GraduationCap'
WHERE title = 'Educational Institutions';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-400 via-calm-800 to-flow-700',
  icon = 'Briefcase'
WHERE title = 'Corporate Wellness';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-400 via-harmony-800 to-balance-700',
  icon = 'Users'
WHERE title = 'Community Health';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-400 via-balance-800 to-therapy-700',
  icon = 'Heart'
WHERE title = 'Mental Health Clinics';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-400 via-therapy-800 to-harmony-700',
  icon = 'Shield'
WHERE title = 'Crisis Intervention';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-400 via-flow-800 to-calm-700',
  icon = 'Globe'
WHERE title = 'Telehealth Platforms';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-300 via-balance-800 to-flow-700',
  icon = 'Stethoscope'
WHERE title = 'Primary Care Integration';

-- Update Resources items with unique gradients
UPDATE navigation_menu_items SET 
  gradient = 'from-calm-300 via-therapy-800 to-harmony-700',
  icon = 'BookOpen'
WHERE title = 'Documentation';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-300 via-harmony-800 to-balance-700',
  icon = 'Book'
WHERE title = 'Research Library';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-300 via-calm-800 to-therapy-700',
  icon = 'Video'
WHERE title = 'Training Videos';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-300 via-flow-800 to-calm-700',
  icon = 'Headphones'
WHERE title = 'Webinars';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-200 via-harmony-800 to-flow-700',
  icon = 'BookOpenCheck'
WHERE title = 'Best Practices';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-200 via-balance-800 to-harmony-700',
  icon = 'Award'
WHERE title = 'Case Studies';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-200 via-therapy-800 to-balance-700',
  icon = 'Lightbulb'
WHERE title = 'Implementation Guides';

UPDATE navigation_menu_items SET 
  gradient = 'from-balance-200 via-flow-800 to-therapy-700',
  icon = 'LifeBuoy'
WHERE title = 'Support Center';

UPDATE navigation_menu_items SET 
  gradient = 'from-harmony-200 via-calm-800 to-balance-700',
  icon = 'Star'
WHERE title = 'Community Forum';

UPDATE navigation_menu_items SET 
  gradient = 'from-therapy-100 via-flow-800 to-harmony-700',
  icon = 'HelpCircle'
WHERE title = 'FAQ';

UPDATE navigation_menu_items SET 
  gradient = 'from-calm-100 via-harmony-800 to-therapy-700',
  icon = 'Phone'
WHERE title = 'Contact Support';

UPDATE navigation_menu_items SET 
  gradient = 'from-flow-100 via-balance-800 to-calm-700',
  icon = 'School'
WHERE title = 'Developer Resources';