-- Update subscription plans with new therapy plan and session limits
UPDATE subscription_plans 
SET 
  limits = jsonb_set(
    jsonb_set(limits, '{therapy_plans}', '1'),
    '{sessions_per_month}', '8'
  )
WHERE name = 'Free';

UPDATE subscription_plans 
SET 
  limits = jsonb_set(
    jsonb_set(limits, '{therapy_plans}', '3'),
    '{sessions_per_month}', '-1'
  )
WHERE name = 'Pro';

UPDATE subscription_plans 
SET 
  limits = jsonb_set(
    jsonb_set(limits, '{therapy_plans}', '-1'),
    '{sessions_per_month}', '-1'
  )
WHERE name = 'Premium';

-- Add AI model configuration to subscription plans
UPDATE subscription_plans 
SET 
  features = jsonb_set(
    COALESCE(features, '{}'),
    '{ai_model}', '"gpt-4.1-2025-04-14"'
  )
WHERE name = 'Free';

UPDATE subscription_plans 
SET 
  features = jsonb_set(
    COALESCE(features, '{}'),
    '{ai_model}', '"claude-sonnet-3-5-20241022"'
  )
WHERE name = 'Pro';

UPDATE subscription_plans 
SET 
  features = jsonb_set(
    COALESCE(features, '{}'),
    '{ai_model}', '"claude-opus-20240229"'
  )
WHERE name = 'Premium';