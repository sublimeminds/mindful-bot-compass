-- Update subscription plans table to include session and therapy plan limits
-- Add session limits and therapy plan limits to subscription plans
ALTER TABLE public.subscription_plans 
ADD COLUMN IF NOT EXISTS session_limits JSONB DEFAULT '{"weekly": -1, "monthly": -1}',
ADD COLUMN IF NOT EXISTS therapy_plan_limit INTEGER DEFAULT -1;

-- Update existing subscription plans with proper limits
UPDATE public.subscription_plans 
SET 
  session_limits = CASE 
    WHEN name = 'Free' THEN '{"weekly": 1, "monthly": 4}'::jsonb
    WHEN name = 'Pro' THEN '{"weekly": -1, "monthly": -1}'::jsonb
    WHEN name = 'Premium' THEN '{"weekly": -1, "monthly": -1}'::jsonb
    ELSE session_limits
  END,
  therapy_plan_limit = CASE 
    WHEN name = 'Free' THEN 1
    WHEN name = 'Pro' THEN 5
    WHEN name = 'Premium' THEN 10
    ELSE therapy_plan_limit
  END
WHERE name IN ('Free', 'Pro', 'Premium');