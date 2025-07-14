-- Update Free plan AI message limit from 10 to 50 per day
UPDATE public.subscription_plans 
SET 
  limits = jsonb_set(limits, '{ai_messages_per_day}', '50')
WHERE name = 'Free';

-- Update Family Premium plan pricing structure (base includes 2 members, additional $19.99 each)
UPDATE public.subscription_plans 
SET 
  price_monthly = 34.90,
  price_yearly = 349.00,
  limits = jsonb_set(
    jsonb_set(limits, '{base_members}', '2'),
    '{additional_member_cost_monthly}', '19.99'
  )
WHERE name = 'Family Premium';

-- Update Family Professional plan pricing structure (base includes 2 members, additional $12.99 each)
UPDATE public.subscription_plans 
SET 
  price_monthly = 49.90,
  price_yearly = 499.00,
  limits = jsonb_set(
    jsonb_set(limits, '{base_members}', '2'),
    '{additional_member_cost_monthly}', '12.99'
  )
WHERE name = 'Family Professional';