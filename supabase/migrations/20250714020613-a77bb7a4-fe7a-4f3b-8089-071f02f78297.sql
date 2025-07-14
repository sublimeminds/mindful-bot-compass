-- Update Free plan: 100 AI messages per day, better AI model (GPT-4o)
UPDATE public.subscription_plans 
SET 
  limits = jsonb_set(
    jsonb_set(limits, '{ai_messages_per_day}', '100'),
    '{ai_model}', '"gpt-4o"'
  )
WHERE name = 'Free';

-- Update Premium plan: Unlimited AI messages, Claude Opus model
UPDATE public.subscription_plans 
SET 
  limits = jsonb_set(
    jsonb_set(limits, '{ai_messages_per_day}', '-1'),
    '{ai_model}', '"claude-3-opus"'
  )
WHERE name = 'Premium';

-- Update Professional plan: Unlimited AI messages, keep Claude-3.5-Sonnet, remove enterprise features
UPDATE public.subscription_plans 
SET 
  features = features - 'white-label' - 'compliance-reporting',
  limits = jsonb_set(limits, '{ai_messages_per_day}', '-1')
WHERE name = 'Professional';