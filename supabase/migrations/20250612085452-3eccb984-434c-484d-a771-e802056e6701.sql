
-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  limits JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- 'monthly' or 'yearly'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create usage tracking table
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  resource_type TEXT NOT NULL, -- 'session', 'goal', 'mood_entry', etc.
  usage_count INTEGER NOT NULL DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_type, period_start)
);

-- Create billing history table
CREATE TABLE public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE NOT NULL,
  stripe_invoice_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL,
  billing_period_start TIMESTAMPTZ,
  billing_period_end TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscription_plans (public read access)
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true);

-- Create RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscription"
  ON public.user_subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription"
  ON public.user_subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription"
  ON public.user_subscriptions
  FOR UPDATE
  USING (user_id = auth.uid());

-- Create RLS policies for user_usage
CREATE POLICY "Users can view their own usage"
  ON public.user_usage
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert usage data"
  ON public.user_usage
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update usage data"
  ON public.user_usage
  FOR UPDATE
  USING (true);

-- Create RLS policies for billing_history
CREATE POLICY "Users can view their own billing history"
  ON public.billing_history
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert billing records"
  ON public.billing_history
  FOR INSERT
  WITH CHECK (true);

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_yearly, features, limits) VALUES
('Free', 0.00, 0.00, 
 '{"sessions": "Basic AI therapy", "mood_tracking": "Basic tracking", "goals": "Limited goal setting", "support": "Community access", "reports": "Basic progress reports"}',
 '{"sessions_per_month": 3, "goals_max": 3, "mood_entries_per_day": 1, "techniques_access": false, "export_data": false}'
),
('Basic', 9.99, 99.99,
 '{"sessions": "Extended AI therapy", "mood_tracking": "Advanced tracking with insights", "goals": "Unlimited goals with basic templates", "support": "Email support", "reports": "Weekly progress reports", "crisis_detection": "Basic crisis detection"}',
 '{"sessions_per_month": 15, "goals_max": -1, "mood_entries_per_day": 3, "techniques_access": true, "export_data": false}'
),
('Premium', 24.99, 249.99,
 '{"sessions": "Unlimited AI therapy", "mood_tracking": "Advanced analytics and insights", "goals": "Personalized treatment plans", "support": "Priority support", "reports": "Detailed analytics", "crisis_intervention": "Crisis intervention protocols", "export": "Export session transcripts", "techniques": "Advanced therapeutic techniques"}',
 '{"sessions_per_month": -1, "goals_max": -1, "mood_entries_per_day": -1, "techniques_access": true, "export_data": true, "priority_support": true}'
);

-- Add subscription info to profiles table
ALTER TABLE public.profiles ADD COLUMN subscription_plan TEXT DEFAULT 'Free';
ALTER TABLE public.profiles ADD COLUMN subscription_status TEXT DEFAULT 'active';

-- Create function to get user's current plan limits
CREATE OR REPLACE FUNCTION public.get_user_plan_limits(user_id_param UUID)
RETURNS JSONB
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(sp.limits, '{}')
  FROM public.user_subscriptions us
  JOIN public.subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = user_id_param AND us.status = 'active'
  UNION ALL
  SELECT sp.limits
  FROM public.subscription_plans sp
  WHERE sp.name = 'Free' AND NOT EXISTS (
    SELECT 1 FROM public.user_subscriptions 
    WHERE user_id = user_id_param AND status = 'active'
  )
  LIMIT 1;
$$;

-- Create function to check if user can perform action
CREATE OR REPLACE FUNCTION public.can_user_perform_action(
  user_id_param UUID,
  action_type TEXT,
  current_usage INTEGER DEFAULT 0
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
AS $$
  SELECT 
    CASE 
      WHEN limits->action_type = '-1' THEN true  -- unlimited
      WHEN (limits->action_type)::INTEGER > current_usage THEN true
      ELSE false
    END
  FROM (
    SELECT public.get_user_plan_limits(user_id_param) as limits
  ) subquery;
$$;

-- Create trigger to update usage tracking
CREATE OR REPLACE FUNCTION public.update_usage_tracking()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_usage (user_id, resource_type, usage_count, period_start, period_end)
  VALUES (
    NEW.user_id,
    TG_ARGV[0],
    1,
    date_trunc('month', NOW()),
    date_trunc('month', NOW()) + interval '1 month' - interval '1 day'
  )
  ON CONFLICT (user_id, resource_type, period_start)
  DO UPDATE SET 
    usage_count = user_usage.usage_count + 1,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$;

-- Add usage tracking triggers
CREATE TRIGGER track_therapy_session_usage
  AFTER INSERT ON public.therapy_sessions
  FOR EACH ROW EXECUTE FUNCTION public.update_usage_tracking('sessions_per_month');

CREATE TRIGGER track_goal_usage
  AFTER INSERT ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_usage_tracking('goals_max');

CREATE TRIGGER track_mood_entry_usage
  AFTER INSERT ON public.mood_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_usage_tracking('mood_entries_per_day');
