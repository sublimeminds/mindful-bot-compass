-- Create affiliate system tables

-- Affiliate tiers with different commission rates
CREATE TABLE public.affiliate_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  min_referrals INTEGER NOT NULL DEFAULT 0,
  min_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  base_commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.05, -- 5% default
  bonus_commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
  priority_level INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliates table
CREATE TABLE public.affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL UNIQUE,
  tier_id UUID REFERENCES public.affiliate_tiers(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
  total_referrals INTEGER NOT NULL DEFAULT 0,
  total_revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_commissions_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_commissions_paid DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_email TEXT,
  payment_method TEXT DEFAULT 'paypal',
  tax_id TEXT,
  notes TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Commission rules for different products/services
CREATE TABLE public.affiliate_commission_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id UUID REFERENCES public.affiliate_tiers(id) NOT NULL,
  product_type TEXT NOT NULL, -- 'subscription', 'one_time', 'service', etc.
  product_id TEXT, -- specific product ID or NULL for all
  commission_type TEXT NOT NULL DEFAULT 'percentage' CHECK (commission_type IN ('percentage', 'fixed', 'hybrid')),
  commission_rate DECIMAL(5,4), -- percentage rate (0.05 = 5%)
  fixed_amount DECIMAL(10,2), -- fixed amount
  recurring_commission BOOLEAN NOT NULL DEFAULT false,
  recurring_months INTEGER, -- how many months to pay recurring commission
  minimum_order_value DECIMAL(10,2),
  maximum_commission DECIMAL(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track affiliate referrals and clicks
CREATE TABLE public.affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id),
  referral_code TEXT NOT NULL,
  click_data JSONB NOT NULL DEFAULT '{}',
  conversion_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  referrer_url TEXT,
  landing_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  device_fingerprint TEXT,
  session_id TEXT,
  converted_at TIMESTAMP WITH TIME ZONE,
  conversion_value DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  commission_status TEXT DEFAULT 'pending' CHECK (commission_status IN ('pending', 'approved', 'paid', 'cancelled')),
  order_id TEXT,
  subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Track commission payouts
CREATE TABLE public.affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  payout_amount DECIMAL(10,2) NOT NULL,
  payout_method TEXT NOT NULL,
  payout_reference TEXT, -- PayPal transaction ID, bank reference, etc.
  payout_status TEXT NOT NULL DEFAULT 'pending' CHECK (payout_status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  commission_period_start DATE NOT NULL,
  commission_period_end DATE NOT NULL,
  referral_ids UUID[] NOT NULL, -- Array of referral IDs included in this payout
  payout_details JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Affiliate sub-affiliates (multi-level marketing)
CREATE TABLE public.affiliate_hierarchy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  child_affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  level_depth INTEGER NOT NULL DEFAULT 1,
  commission_rate DECIMAL(5,4) NOT NULL DEFAULT 0.01, -- 1% for sub-affiliate
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(parent_affiliate_id, child_affiliate_id)
);

-- Affiliate performance metrics
CREATE TABLE public.affiliate_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES public.affiliates(id) NOT NULL,
  metric_date DATE NOT NULL,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  conversion_rate DECIMAL(5,4) NOT NULL DEFAULT 0,
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0,
  commissions_earned DECIMAL(10,2) NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  returning_visitors INTEGER NOT NULL DEFAULT 0,
  avg_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(affiliate_id, metric_date)
);

-- Insert default affiliate tiers
INSERT INTO public.affiliate_tiers (name, description, min_referrals, min_revenue, base_commission_rate, bonus_commission_rate, priority_level) VALUES
('Bronze', 'Entry level affiliate tier', 0, 0, 0.05, 0, 1),
('Silver', 'Intermediate affiliate tier', 10, 1000, 0.07, 0.01, 2),
('Gold', 'Advanced affiliate tier', 25, 5000, 0.10, 0.02, 3),
('Platinum', 'Elite affiliate tier', 50, 15000, 0.12, 0.03, 4),
('Diamond', 'Premium affiliate tier', 100, 50000, 0.15, 0.05, 5);

-- Enable Row Level Security
ALTER TABLE public.affiliate_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commission_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliate_tiers (public read)
CREATE POLICY "Anyone can view affiliate tiers" ON public.affiliate_tiers
  FOR SELECT USING (is_active = true);

-- RLS Policies for affiliates
CREATE POLICY "Affiliates can view their own data" ON public.affiliates
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create affiliate accounts" ON public.affiliates
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Affiliates can update their own data" ON public.affiliates
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for affiliate_commission_rules (public read)
CREATE POLICY "Anyone can view commission rules" ON public.affiliate_commission_rules
  FOR SELECT USING (is_active = true);

-- RLS Policies for affiliate_referrals
CREATE POLICY "Affiliates can view their own referrals" ON public.affiliate_referrals
  FOR SELECT USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "System can create referral records" ON public.affiliate_referrals
  FOR INSERT WITH CHECK (true);

-- RLS Policies for affiliate_payouts
CREATE POLICY "Affiliates can view their own payouts" ON public.affiliate_payouts
  FOR SELECT USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

-- RLS Policies for affiliate_hierarchy
CREATE POLICY "Affiliates can view their hierarchy" ON public.affiliate_hierarchy
  FOR SELECT USING (
    parent_affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()) OR
    child_affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid())
  );

-- RLS Policies for affiliate_metrics
CREATE POLICY "Affiliates can view their own metrics" ON public.affiliate_metrics
  FOR SELECT USING (affiliate_id IN (SELECT id FROM public.affiliates WHERE user_id = auth.uid()));

CREATE POLICY "System can create/update metrics" ON public.affiliate_metrics
  FOR ALL USING (true);

-- Functions for affiliate tier upgrades
CREATE OR REPLACE FUNCTION public.update_affiliate_tier()
RETURNS TRIGGER AS $$
BEGIN
  -- Update affiliate tier based on performance
  UPDATE public.affiliates 
  SET tier_id = (
    SELECT id FROM public.affiliate_tiers 
    WHERE min_referrals <= NEW.total_referrals 
      AND min_revenue <= NEW.total_revenue 
      AND is_active = true
    ORDER BY priority_level DESC 
    LIMIT 1
  ),
  updated_at = now()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-upgrade affiliate tiers
CREATE TRIGGER update_affiliate_tier_trigger
  AFTER UPDATE OF total_referrals, total_revenue ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_affiliate_tier();

-- Function to calculate commission
CREATE OR REPLACE FUNCTION public.calculate_commission(
  affiliate_id_param UUID,
  product_type_param TEXT,
  product_id_param TEXT DEFAULT NULL,
  order_value_param DECIMAL DEFAULT 0
) RETURNS DECIMAL AS $$
DECLARE
  commission_amount DECIMAL := 0;
  commission_rule RECORD;
  affiliate_tier RECORD;
BEGIN
  -- Get affiliate tier
  SELECT at.* INTO affiliate_tier
  FROM public.affiliates a
  JOIN public.affiliate_tiers at ON a.tier_id = at.id
  WHERE a.id = affiliate_id_param;
  
  -- Get commission rule
  SELECT * INTO commission_rule
  FROM public.affiliate_commission_rules acr
  WHERE acr.tier_id = affiliate_tier.id
    AND acr.product_type = product_type_param
    AND (acr.product_id = product_id_param OR acr.product_id IS NULL)
    AND acr.is_active = true
    AND (acr.minimum_order_value IS NULL OR order_value_param >= acr.minimum_order_value)
  ORDER BY acr.product_id NULLS LAST
  LIMIT 1;
  
  IF commission_rule IS NOT NULL THEN
    IF commission_rule.commission_type = 'percentage' THEN
      commission_amount := order_value_param * commission_rule.commission_rate;
    ELSIF commission_rule.commission_type = 'fixed' THEN
      commission_amount := commission_rule.fixed_amount;
    ELSIF commission_rule.commission_type = 'hybrid' THEN
      commission_amount := GREATEST(
        order_value_param * commission_rule.commission_rate,
        commission_rule.fixed_amount
      );
    END IF;
    
    -- Apply maximum commission limit
    IF commission_rule.maximum_commission IS NOT NULL THEN
      commission_amount := LEAST(commission_amount, commission_rule.maximum_commission);
    END IF;
  END IF;
  
  RETURN commission_amount;
END;
$$ LANGUAGE plpgsql;

-- Indexes for performance
CREATE INDEX idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX idx_affiliates_affiliate_code ON public.affiliates(affiliate_code);
CREATE INDEX idx_affiliate_referrals_affiliate_id ON public.affiliate_referrals(affiliate_id);
CREATE INDEX idx_affiliate_referrals_referral_code ON public.affiliate_referrals(referral_code);
CREATE INDEX idx_affiliate_referrals_created_at ON public.affiliate_referrals(created_at);
CREATE INDEX idx_affiliate_metrics_affiliate_date ON public.affiliate_metrics(affiliate_id, metric_date);