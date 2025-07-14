-- Update existing affiliate tiers with new enhanced structure
UPDATE public.affiliate_tiers SET 
  name = 'Starter',
  description = 'Perfect for beginners - start earning immediately',
  min_referrals = 0,
  min_revenue = 0,
  base_commission_rate = 0.05,
  bonus_commission_rate = 0.00,
  priority_level = 1
WHERE name = 'Bronze';

UPDATE public.affiliate_tiers SET 
  name = 'Bronze',
  description = 'Growing affiliate with consistent referrals',
  min_referrals = 5,
  min_revenue = 500,
  base_commission_rate = 0.08,
  bonus_commission_rate = 0.01,
  priority_level = 2
WHERE name = 'Silver';

UPDATE public.affiliate_tiers SET 
  name = 'Silver',
  description = 'Experienced affiliate with strong performance',
  min_referrals = 20,
  min_revenue = 2000,
  base_commission_rate = 0.12,
  bonus_commission_rate = 0.02,
  priority_level = 3
WHERE name = 'Gold';

UPDATE public.affiliate_tiers SET 
  name = 'Gold',
  description = 'Top-tier affiliate with exceptional results',
  min_referrals = 50,
  min_revenue = 5000,
  base_commission_rate = 0.15,
  bonus_commission_rate = 0.03,
  priority_level = 4
WHERE name = 'Platinum';

UPDATE public.affiliate_tiers SET 
  name = 'Platinum',
  description = 'Elite affiliate with premium benefits',
  min_referrals = 100,
  min_revenue = 10000,
  base_commission_rate = 0.18,
  bonus_commission_rate = 0.05,
  priority_level = 5
WHERE name = 'Diamond';

INSERT INTO public.affiliate_tiers (name, description, min_referrals, min_revenue, base_commission_rate, bonus_commission_rate, priority_level, is_active)
VALUES ('Diamond', 'Exclusive top-performer with maximum earning potential', 200, 25000, 0.22, 0.08, 6, true);

-- Add new columns for enhanced tier tracking
ALTER TABLE public.affiliate_tiers ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '{}';
ALTER TABLE public.affiliate_tiers ADD COLUMN IF NOT EXISTS monthly_min_referrals INTEGER DEFAULT 0;
ALTER TABLE public.affiliate_tiers ADD COLUMN IF NOT EXISTS monthly_min_revenue NUMERIC DEFAULT 0;

-- Update tier benefits
UPDATE public.affiliate_tiers SET benefits = jsonb_build_object(
  'priority_support', false,
  'marketing_materials', 'basic',
  'account_manager', false,
  'custom_landing_pages', false,
  'monthly_calls', false,
  'payment_threshold', 50
) WHERE name = 'Starter';

UPDATE public.affiliate_tiers SET benefits = jsonb_build_object(
  'priority_support', false,
  'marketing_materials', 'standard',
  'account_manager', false,
  'custom_landing_pages', false,
  'monthly_calls', false,
  'payment_threshold', 50
) WHERE name = 'Bronze';

UPDATE public.affiliate_tiers SET benefits = jsonb_build_object(
  'priority_support', true,
  'marketing_materials', 'premium',
  'account_manager', false,
  'custom_landing_pages', false,
  'monthly_calls', false,
  'payment_threshold', 25
) WHERE name = 'Silver';

UPDATE public.affiliate_tiers SET benefits = jsonb_build_object(
  'priority_support', true,
  'marketing_materials', 'premium',
  'account_manager', true,
  'custom_landing_pages', true,
  'monthly_calls', false,
  'payment_threshold', 25
) WHERE name = 'Gold';

UPDATE public.affiliate_tiers SET benefits = jsonb_build_object(
  'priority_support', true,
  'marketing_materials', 'exclusive',
  'account_manager', true,
  'custom_landing_pages', true,
  'monthly_calls', true,
  'payment_threshold', 10
) WHERE name = 'Platinum';

UPDATE public.affiliate_tiers SET benefits = jsonb_build_object(
  'priority_support', true,
  'marketing_materials', 'exclusive',
  'account_manager', true,
  'custom_landing_pages', true,
  'monthly_calls', true,
  'payment_threshold', 10
) WHERE name = 'Diamond';

-- Create affiliate applications table
CREATE TABLE IF NOT EXISTS public.affiliate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT,
  website_url TEXT,
  social_profiles JSONB DEFAULT '{}',
  marketing_experience TEXT,
  marketing_channels TEXT[],
  expected_monthly_referrals INTEGER,
  previous_affiliate_experience TEXT,
  tax_id TEXT,
  marketing_plan TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  application_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for affiliate applications
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

-- RLS policies for affiliate applications
CREATE POLICY "Users can create their own applications"
  ON public.affiliate_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own applications"
  ON public.affiliate_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all applications"
  ON public.affiliate_applications FOR ALL
  USING (is_admin(auth.uid()));

-- Create marketing materials table
CREATE TABLE IF NOT EXISTS public.affiliate_marketing_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  material_type TEXT NOT NULL CHECK (material_type IN ('banner', 'email_template', 'social_post', 'landing_page', 'video')),
  file_url TEXT,
  preview_url TEXT,
  dimensions TEXT,
  tier_required TEXT DEFAULT 'Starter',
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for marketing materials
ALTER TABLE public.affiliate_marketing_materials ENABLE ROW LEVEL SECURITY;

-- RLS policies for marketing materials
CREATE POLICY "Affiliates can view materials for their tier"
  ON public.affiliate_marketing_materials FOR SELECT
  USING (
    is_active = true AND 
    EXISTS (
      SELECT 1 FROM affiliates a
      JOIN affiliate_tiers t ON a.tier_id = t.id
      WHERE a.user_id = auth.uid() 
      AND t.priority_level >= (
        SELECT priority_level 
        FROM affiliate_tiers 
        WHERE name = affiliate_marketing_materials.tier_required
      )
    )
  );

-- Update affiliate metrics to track rolling performance
ALTER TABLE public.affiliate_metrics ADD COLUMN IF NOT EXISTS rolling_12m_referrals INTEGER DEFAULT 0;
ALTER TABLE public.affiliate_metrics ADD COLUMN IF NOT EXISTS rolling_12m_revenue NUMERIC DEFAULT 0;

-- Create function to update rolling metrics
CREATE OR REPLACE FUNCTION update_rolling_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update rolling 12-month metrics for the affiliate
  UPDATE affiliate_metrics 
  SET 
    rolling_12m_referrals = (
      SELECT COALESCE(SUM(conversions), 0)
      FROM affiliate_metrics 
      WHERE affiliate_id = NEW.affiliate_id 
      AND metric_date >= CURRENT_DATE - INTERVAL '12 months'
    ),
    rolling_12m_revenue = (
      SELECT COALESCE(SUM(revenue), 0)
      FROM affiliate_metrics 
      WHERE affiliate_id = NEW.affiliate_id 
      AND metric_date >= CURRENT_DATE - INTERVAL '12 months'
    )
  WHERE affiliate_id = NEW.affiliate_id 
  AND metric_date = NEW.metric_date;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for rolling metrics
DROP TRIGGER IF EXISTS trigger_update_rolling_metrics ON affiliate_metrics;
CREATE TRIGGER trigger_update_rolling_metrics
  AFTER INSERT OR UPDATE ON affiliate_metrics
  FOR EACH ROW
  EXECUTE FUNCTION update_rolling_metrics();