-- Insert default commission rules for all tiers
INSERT INTO public.affiliate_commission_rules (tier_id, product_type, commission_type, commission_rate, recurring_commission, recurring_months) 
SELECT 
  at.id,
  'subscription' as product_type,
  'percentage' as commission_type,
  at.base_commission_rate,
  true as recurring_commission,
  12 as recurring_months
FROM public.affiliate_tiers at;

INSERT INTO public.affiliate_commission_rules (tier_id, product_type, commission_type, commission_rate, recurring_commission) 
SELECT 
  at.id,
  'one_time' as product_type,
  'percentage' as commission_type,
  at.base_commission_rate,
  false as recurring_commission
FROM public.affiliate_tiers at;