-- Update subscription plans with correct pricing and features
UPDATE public.subscription_plans 
SET 
  name = 'Free',
  description = 'Basic therapy features to get started',
  price_monthly = 0,
  price_yearly = 0,
  features = '["basic-chat", "mood-tracking", "basic-goals", "community-access", "email-support"]'::jsonb,
  limits = '{"sessions_per_month": 8, "therapy_plans": 1, "ai_messages_per_day": 10, "goals": 2, "ai_model": "gpt-4o-mini"}'::jsonb
WHERE name = 'Free';

-- Update Premium plan (was Pro)
UPDATE public.subscription_plans 
SET 
  name = 'Premium',
  description = 'Enhanced therapy features for regular users',
  price_monthly = 14.90,
  price_yearly = 149.00,
  features = '["basic-chat", "mood-tracking", "basic-goals", "community-access", "email-support", "unlimited-sessions", "advanced-analytics", "personalized-insights", "crisis-support", "voice-interaction", "cultural-awareness", "priority-support", "podcasts", "breathing-exercises", "meditation-library"]'::jsonb,
  limits = '{"sessions_per_month": -1, "therapy_plans": 3, "ai_messages_per_day": 100, "goals": 10, "ai_model": "gpt-4o", "data_export": true}'::jsonb
WHERE name IN ('Pro', 'Premium');

-- Update Professional plan (not for therapists)
UPDATE public.subscription_plans 
SET 
  name = 'Professional',
  description = 'Complete therapy platform with advanced features for power users',
  price_monthly = 24.90,
  price_yearly = 249.00,
  features = '["basic-chat", "mood-tracking", "basic-goals", "community-access", "email-support", "unlimited-sessions", "advanced-analytics", "personalized-insights", "crisis-support", "voice-interaction", "cultural-awareness", "priority-support", "podcasts", "breathing-exercises", "meditation-library", "advanced-dashboard", "api-access", "white-label", "phone-support", "compliance-reporting", "premium-content"]'::jsonb,
  limits = '{"sessions_per_month": -1, "therapy_plans": 10, "ai_messages_per_day": -1, "goals": -1, "ai_model": "claude-3-5-sonnet", "data_export": true, "api_calls": 1000}'::jsonb
WHERE name IN ('Premium', 'Professional') AND price_monthly > 20;

-- Insert Professional plan if it doesn't exist
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, limits)
SELECT 'Professional', 'Complete therapy platform with advanced features for power users', 24.90, 249.00,
  '["basic-chat", "mood-tracking", "basic-goals", "community-access", "email-support", "unlimited-sessions", "advanced-analytics", "personalized-insights", "crisis-support", "voice-interaction", "cultural-awareness", "priority-support", "podcasts", "breathing-exercises", "meditation-library", "advanced-dashboard", "api-access", "white-label", "phone-support", "compliance-reporting", "premium-content"]'::jsonb,
  '{"sessions_per_month": -1, "therapy_plans": 10, "ai_messages_per_day": -1, "goals": -1, "ai_model": "claude-3-5-sonnet", "data_export": true, "api_calls": 1000}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.subscription_plans WHERE name = 'Professional');

-- Update Family Premium plan
UPDATE public.subscription_plans 
SET 
  price_monthly = 34.90,
  price_yearly = 349.00,
  limits = jsonb_set(limits, '{therapy_plans}', '3')
WHERE name = 'Family Premium';

-- Update Family Professional plan  
UPDATE public.subscription_plans 
SET 
  price_monthly = 49.90,
  price_yearly = 499.00,
  limits = jsonb_set(limits, '{therapy_plans}', '10')
WHERE name = 'Family Professional';

-- Remove old Enterprise plan (will be separate later)
UPDATE public.subscription_plans 
SET is_active = false
WHERE name = 'Enterprise';