
-- Fix the integrations insert to avoid duplicates
INSERT INTO public.integrations (name, type, description) VALUES
('Epic MyChart', 'ehr', 'Epic Electronic Health Records integration for patient data'),
('Cerner PowerChart', 'ehr', 'Cerner EHR system integration'),
('Allscripts', 'ehr', 'Allscripts electronic health records'),
('Outlook Calendar', 'calendar', 'Microsoft Outlook calendar sync'),
('Apple Calendar', 'calendar', 'Apple iCloud calendar integration'),
('Firebase Push', 'mobile', 'Firebase Cloud Messaging for push notifications'),
('Apple Push Notifications', 'mobile', 'Apple Push Notification service'),
('WebPush', 'mobile', 'Web Push notifications for browsers')
ON CONFLICT (name) DO NOTHING;
