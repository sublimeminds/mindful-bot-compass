-- Update existing plans or insert if they don't exist
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, limits) VALUES
('Free', 'Basic therapy features to get started', 0, 0, 
 '["basic-chat", "mood-tracking", "basic-goals"]'::jsonb,
 '{"sessions_per_month": 3, "ai_messages_per_day": 10, "goals": 2}'::jsonb),

('Pro', 'Enhanced therapy features for regular users', 19.99, 199.99,
 '["basic-chat", "mood-tracking", "basic-goals", "advanced-chat", "ai-insights", "progress-tracking", "community-hub", "unlimited-sessions"]'::jsonb,
 '{"sessions_per_month": -1, "ai_messages_per_day": 100, "goals": 10, "therapist_personalities": 5}'::jsonb),

('Premium', 'Complete therapy platform with advanced AI', 39.99, 399.99,
 '["basic-chat", "mood-tracking", "basic-goals", "advanced-chat", "ai-insights", "progress-tracking", "community-hub", "unlimited-sessions", "advanced-analytics", "crisis-intervention", "priority-support", "personalized-insights"]'::jsonb,
 '{"sessions_per_month": -1, "ai_messages_per_day": -1, "goals": -1, "therapist_personalities": -1, "export_data": true}'::jsonb),

('Family Pro', 'Pro features with family management (2-10 seats)', 49.99, 499.99,
 '["basic-chat", "mood-tracking", "basic-goals", "advanced-chat", "ai-insights", "progress-tracking", "community-hub", "unlimited-sessions", "family-dashboard", "member-monitoring", "progress-sharing", "alerts"]'::jsonb,
 '{"sessions_per_month": -1, "ai_messages_per_day": 100, "goals": 10, "therapist_personalities": 5, "family_seats": 10, "min_seats": 2}'::jsonb),

('Family Premium', 'Premium features with family management (2-15 seats)', 79.99, 799.99,
 '["basic-chat", "mood-tracking", "basic-goals", "advanced-chat", "ai-insights", "progress-tracking", "community-hub", "unlimited-sessions", "advanced-analytics", "crisis-intervention", "priority-support", "personalized-insights", "family-dashboard", "member-monitoring", "progress-sharing", "alerts", "24-7-support", "family-therapy"]'::jsonb,
 '{"sessions_per_month": -1, "ai_messages_per_day": -1, "goals": -1, "therapist_personalities": -1, "export_data": true, "family_seats": 15, "min_seats": 2}'::jsonb),

('Enterprise', 'Complete B2B solution for therapists and organizations', 199.99, 1999.99,
 '["basic-chat", "mood-tracking", "basic-goals", "advanced-chat", "ai-insights", "progress-tracking", "community-hub", "unlimited-sessions", "advanced-analytics", "crisis-intervention", "priority-support", "personalized-insights", "api-access", "custom-integrations", "dedicated-support", "white-label", "compliance-tools", "bulk-management"]'::jsonb,
 '{"sessions_per_month": -1, "ai_messages_per_day": -1, "goals": -1, "therapist_personalities": -1, "export_data": true, "api_calls": 10000, "custom_branding": true}'::jsonb)

ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  limits = EXCLUDED.limits,
  updated_at = now();