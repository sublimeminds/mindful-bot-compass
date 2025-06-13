
-- Add trial and payment method fields to user_subscriptions table
ALTER TABLE public.user_subscriptions 
ADD COLUMN stripe_payment_method_id TEXT,
ADD COLUMN trial_start TIMESTAMPTZ,
ADD COLUMN stripe_setup_intent_id TEXT;

-- Update RLS policies to allow access to new fields
-- (existing policies will automatically apply to new columns)

-- Create function to handle trial expiration
CREATE OR REPLACE FUNCTION public.handle_trial_expiration()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update expired trials to canceled status
  UPDATE public.user_subscriptions
  SET status = 'canceled',
      canceled_at = NOW()
  WHERE status = 'trialing'
    AND trial_end < NOW()
    AND canceled_at IS NULL;
END;
$$;
