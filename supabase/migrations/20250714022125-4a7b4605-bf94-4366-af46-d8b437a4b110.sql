-- Fix Premium and Professional plans: both get Claude 4 Opus and unlimited AI therapy sessions
UPDATE public.subscription_plans 
SET 
  limits = jsonb_set(
    limits, 
    '{ai_model}', 
    '"claude-4-opus"'
  )
WHERE name IN ('Premium', 'Professional');

-- Ensure both have unlimited AI therapy sessions (sessions_per_month: -1)
UPDATE public.subscription_plans 
SET 
  limits = jsonb_set(
    limits, 
    '{sessions_per_month}', 
    '-1'
  )
WHERE name IN ('Premium', 'Professional');