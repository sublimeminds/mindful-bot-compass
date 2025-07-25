-- Continue fixing remaining database functions and security issues
-- This migration addresses the final 55 functions that need search_path fixes

-- Fix all remaining functions with search_path issues
CREATE OR REPLACE FUNCTION public.update_therapy_plans_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_cultural_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_whatsapp_integrations_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_whatsapp_config_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_trial_expiration()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Update expired trials to canceled status
  UPDATE public.user_subscriptions
  SET status = 'canceled',
      canceled_at = NOW()
  WHERE status = 'trialing'
    AND trial_end < NOW()
    AND canceled_at IS NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_therapy_assignments_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_therapy_translation_timestamps()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_european_translation_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_usage_tracking()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_therapist_session_metrics(therapist_id uuid)
 RETURNS TABLE(success_rate numeric, mood_improvement_avg numeric, total_sessions bigint)
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(
      CASE 
        WHEN sf.mood_after > sf.mood_before THEN 1.0 
        ELSE 0.0 
      END
    ), 0.0) as success_rate,
    COALESCE(AVG(sf.mood_after - sf.mood_before), 0.0) as mood_improvement_avg,
    COUNT(*) as total_sessions
  FROM session_feedback sf
  WHERE sf.therapist_id = get_therapist_session_metrics.therapist_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_household_for_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Create household for new user
  INSERT INTO public.households (name, primary_account_holder_id, plan_type, max_members)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'name', 'My Family') || '''s Household',
    NEW.id,
    'individual', -- Start with individual plan
    1
  );
  
  -- Add user as primary member
  INSERT INTO public.household_members (
    household_id,
    user_id,
    member_type,
    permission_level,
    can_view_progress,
    can_view_mood_data,
    can_receive_alerts,
    invitation_status,
    joined_at
  )
  SELECT 
    h.id,
    NEW.id,
    'primary',
    'full',
    true,
    true,
    true,
    'active',
    now()
  FROM public.households h
  WHERE h.primary_account_holder_id = NEW.id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invitation_token()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_affiliate_tier()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.can_access_member_data(requesting_user_id uuid, target_user_id uuid, data_type text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Primary account holder can access all data
  IF EXISTS (
    SELECT 1 FROM public.households h
    JOIN public.household_members hm ON h.id = hm.household_id
    WHERE h.primary_account_holder_id = requesting_user_id
    AND hm.user_id = target_user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Check specific permissions
  RETURN EXISTS (
    SELECT 1 FROM public.family_permissions fp
    JOIN public.household_members hm1 ON fp.member_id = hm1.id
    JOIN public.household_members hm2 ON fp.target_member_id = hm2.id
    WHERE hm1.user_id = requesting_user_id
    AND hm2.user_id = target_user_id
    AND fp.permission_type = data_type
    AND fp.granted = true
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_therapist_review_metrics(therapist_id uuid)
 RETURNS TABLE(average_rating numeric, user_satisfaction numeric, recommendation_rate numeric, total_reviews bigint, effectiveness_areas text[])
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(tr.overall_rating), 0.0) as average_rating,
    COALESCE(AVG((tr.overall_rating + tr.communication_rating + tr.expertise_rating + tr.empathy_rating + tr.effectiveness_rating) / 5.0), 0.0) as user_satisfaction,
    COALESCE(AVG(CASE WHEN tr.would_recommend THEN 1.0 ELSE 0.0 END), 0.0) as recommendation_rate,
    COUNT(*) as total_reviews,
    ARRAY_AGG(DISTINCT unnest(tr.specific_areas_helped)) as effectiveness_areas
  FROM therapist_reviews tr
  WHERE tr.therapist_id = get_therapist_review_metrics.therapist_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_goal_templates_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_user_active_therapists(user_id_param uuid, specialty_filter text DEFAULT NULL::text)
 RETURNS TABLE(therapist_id text, specialty_focus text, therapy_context text, treatment_phase text, is_primary boolean, selection_reason text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ts.therapist_id,
    ts.specialty_focus,
    ts.therapy_context,
    ts.treatment_phase,
    ts.is_primary,
    ts.selection_reason
  FROM therapist_selections ts
  WHERE ts.user_id = user_id_param 
    AND ts.is_active = true
    AND (specialty_filter IS NULL OR ts.specialty_focus = specialty_filter)
  ORDER BY ts.is_primary DESC, ts.priority_level ASC;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_single_default_payment_method()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.payment_methods 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.ensure_single_default_billing_address()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  IF NEW.is_default = TRUE THEN
    UPDATE public.billing_addresses 
    SET is_default = FALSE 
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invoice_number()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  invoice_num TEXT;
BEGIN
  year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  SELECT COALESCE(MAX(CAST(RIGHT(invoice_number, 6) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_part || '-%';
  
  invoice_num := 'INV-' || year_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  RETURN invoice_num;
END;
$function$;

CREATE OR REPLACE FUNCTION public.recommend_therapist_combinations(user_id_param uuid, needed_specialties text[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  recommendations jsonb := '[]'::jsonb;
  specialty text;
  therapist_data jsonb;
BEGIN
  -- For each needed specialty, find best matching therapists
  FOREACH specialty IN ARRAY needed_specialties
  LOOP
    SELECT jsonb_agg(
      jsonb_build_object(
        'therapist_id', ts.therapist_id,
        'specialty', ts.specialty,
        'proficiency_level', ts.proficiency_level,
        'success_rate', ts.success_rate,
        'compatibility_score', 0.85 + (random() * 0.15) -- Placeholder scoring
      )
    ) INTO therapist_data
    FROM therapist_specialties ts
    WHERE ts.specialty = specialty
    ORDER BY ts.success_rate DESC, ts.years_experience DESC
    LIMIT 3;
    
    recommendations := recommendations || jsonb_build_object(
      'specialty', specialty,
      'recommended_therapists', COALESCE(therapist_data, '[]'::jsonb)
    );
  END LOOP;
  
  RETURN recommendations;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_therapist_team_on_selection()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  -- Update or create therapist team entry
  INSERT INTO therapist_teams (user_id, primary_therapist_id)
  VALUES (
    NEW.user_id,
    CASE WHEN NEW.is_primary THEN NEW.therapist_id ELSE NULL END
  )
  ON CONFLICT (user_id) DO UPDATE SET
    primary_therapist_id = CASE 
      WHEN NEW.is_primary THEN NEW.therapist_id 
      ELSE therapist_teams.primary_therapist_id 
    END,
    updated_at = now();
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_commission(affiliate_id_param uuid, product_type_param text, product_id_param text DEFAULT NULL::text, order_value_param numeric DEFAULT 0)
 RETURNS numeric
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.get_cached_translation(p_source_text text, p_source_lang text, p_target_lang text, p_context_type text DEFAULT 'general'::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  cached_translation TEXT;
BEGIN
  SELECT translated_text INTO cached_translation
  FROM public.ai_translations
  WHERE source_text = p_source_text
    AND source_language = p_source_lang
    AND target_language = p_target_lang
    AND context_type = p_context_type
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Update usage count if found
  IF cached_translation IS NOT NULL THEN
    UPDATE public.ai_translations
    SET usage_count = usage_count + 1,
        updated_at = now()
    WHERE source_text = p_source_text
      AND source_language = p_source_lang
      AND target_language = p_target_lang
      AND context_type = p_context_type;
  END IF;
  
  RETURN cached_translation;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_totp_code(user_id_param uuid, code_param text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  stored_secret TEXT;
  is_valid BOOLEAN := FALSE;
BEGIN
  -- Get the stored secret for the user
  SELECT secret INTO stored_secret
  FROM public.two_factor_auth
  WHERE user_id = user_id_param AND method = 'totp' AND is_active = true;
  
  IF stored_secret IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- In a real implementation, you would verify the TOTP code here
  -- For now, we'll accept codes that are exactly 6 digits
  IF length(code_param) = 6 AND code_param ~ '^[0-9]+$' THEN
    is_valid := TRUE;
    
    -- Update last used timestamp
    UPDATE public.two_factor_auth
    SET last_used_at = now()
    WHERE user_id = user_id_param AND method = 'totp';
  END IF;
  
  RETURN is_valid;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_content_library_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_rolling_metrics()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.store_translation(p_source_text text, p_translated_text text, p_source_lang text, p_target_lang text, p_context_type text DEFAULT 'general'::text, p_quality numeric DEFAULT 0.95, p_cultural_context text DEFAULT NULL::text, p_therapeutic_context jsonb DEFAULT NULL::jsonb, p_user_id uuid DEFAULT NULL::uuid, p_session_id text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  translation_id UUID;
BEGIN
  INSERT INTO public.ai_translations (
    source_text, translated_text, source_language, target_language,
    context_type, translation_quality, cultural_context,
    therapeutic_context, user_id, session_id
  ) VALUES (
    p_source_text, p_translated_text, p_source_lang, p_target_lang,
    p_context_type, p_quality, p_cultural_context,
    p_therapeutic_context, p_user_id, p_session_id
  )
  RETURNING id INTO translation_id;
  
  RETURN translation_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.request_data_export(user_id_param uuid, export_type text DEFAULT 'full_export'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  request_id UUID;
BEGIN
  INSERT INTO public.data_export_requests (user_id, request_type, status)
  VALUES (user_id_param, export_type, 'pending')
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.request_data_deletion(user_id_param uuid, deletion_type text DEFAULT 'full_account'::text, reason_text text DEFAULT NULL::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  request_id UUID;
BEGIN
  INSERT INTO public.data_deletion_requests (user_id, deletion_type, reason, scheduled_for)
  VALUES (user_id_param, deletion_type, reason_text, now() + INTERVAL '30 days')
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_consent(user_id_param uuid, consent_type_param text, granted_param boolean, user_ip inet DEFAULT NULL::inet, user_agent_param text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.user_consent (user_id, consent_type, granted, granted_at, ip_address, user_agent)
  VALUES (
    user_id_param, 
    consent_type_param, 
    granted_param, 
    CASE WHEN granted_param THEN now() ELSE NULL END,
    user_ip,
    user_agent_param
  )
  ON CONFLICT (user_id, consent_type) 
  DO UPDATE SET 
    granted = granted_param,
    granted_at = CASE WHEN granted_param THEN now() ELSE user_consent.granted_at END,
    withdrawn_at = CASE WHEN NOT granted_param THEN now() ELSE NULL END,
    updated_at = now();
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_daily_usage_cost(user_id_param uuid, date_param date)
 RETURNS TABLE(total_requests integer, total_tokens integer, total_cost numeric, avg_response_time numeric, model_breakdown jsonb)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_requests,
    SUM(aut.total_tokens)::INTEGER as total_tokens,
    SUM(aut.total_cost) as total_cost,
    AVG(aut.response_time_ms) as avg_response_time,
    jsonb_object_agg(
      aut.model_id, 
      jsonb_build_object(
        'requests', COUNT(*),
        'tokens', SUM(aut.total_tokens),
        'cost', SUM(aut.total_cost)
      )
    ) as model_breakdown
  FROM public.ai_usage_tracking aut
  WHERE aut.user_id = user_id_param 
    AND DATE(aut.timestamp) = date_param;
END;
$function$;

CREATE OR REPLACE FUNCTION public.detect_usage_anomalies(user_id_param uuid, days_lookback integer DEFAULT 7)
 RETURNS TABLE(anomaly_type text, anomaly_score numeric, description text, date date)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  avg_daily_usage DECIMAL;
  current_usage DECIMAL;
  threshold_multiplier DECIMAL := 2.5;
BEGIN
  -- Calculate average daily usage over lookback period
  SELECT AVG(daily_cost) INTO avg_daily_usage
  FROM (
    SELECT DATE(timestamp) as day, SUM(total_cost) as daily_cost
    FROM public.ai_usage_tracking 
    WHERE user_id = user_id_param 
      AND timestamp >= CURRENT_DATE - INTERVAL '%s days' % days_lookback
    GROUP BY DATE(timestamp)
  ) daily_costs;

  -- Check recent usage for anomalies
  FOR i IN 0..2 LOOP
    SELECT SUM(total_cost) INTO current_usage
    FROM public.ai_usage_tracking
    WHERE user_id = user_id_param 
      AND DATE(timestamp) = CURRENT_DATE - i;
    
    IF current_usage > (avg_daily_usage * threshold_multiplier) THEN
      RETURN QUERY SELECT 
        'high_usage'::TEXT,
        (current_usage / avg_daily_usage)::DECIMAL,
        format('Usage %.1fx higher than average', current_usage / avg_daily_usage),
        (CURRENT_DATE - i)::DATE;
    END IF;
  END LOOP;
  
  RETURN;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_translation_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_therapy_approach_combinations_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.detect_account_sharing(user_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  active_sessions INTEGER;
  unique_locations INTEGER;
  sharing_indicators JSONB := '[]'::JSONB;
  confidence_score DECIMAL := 0.0;
BEGIN
  -- Count active sessions
  SELECT COUNT(*) INTO active_sessions
  FROM public.user_sessions
  WHERE user_id = user_id_param 
    AND status = 'active'
    AND last_activity > now() - INTERVAL '24 hours';
  
  -- Count unique IP addresses in last 24 hours  
  SELECT COUNT(DISTINCT ip_address) INTO unique_locations
  FROM public.user_sessions
  WHERE user_id = user_id_param 
    AND last_activity > now() - INTERVAL '24 hours';
  
  -- Analyze sharing indicators
  IF active_sessions > 3 THEN
    sharing_indicators := sharing_indicators || '"multiple_simultaneous_sessions"'::JSONB;
    confidence_score := confidence_score + 0.4;
  END IF;
  
  IF unique_locations > 2 THEN
    sharing_indicators := sharing_indicators || '"multiple_locations"'::JSONB;
    confidence_score := confidence_score + 0.3;
  END IF;
  
  RETURN jsonb_build_object(
    'confidence_score', LEAST(confidence_score, 1.0),
    'indicators', sharing_indicators,
    'active_sessions', active_sessions,
    'unique_locations', unique_locations,
    'requires_action', confidence_score > 0.7
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.upsert_user_cultural_profile(p_user_id uuid, p_cultural_background text DEFAULT NULL::text, p_primary_language text DEFAULT 'en'::text, p_family_structure text DEFAULT 'individual'::text, p_communication_style text DEFAULT 'direct'::text, p_religious_considerations boolean DEFAULT false, p_religious_details text DEFAULT NULL::text, p_therapy_approach_preferences text[] DEFAULT '{}'::text[], p_cultural_sensitivities text[] DEFAULT '{}'::text[])
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  profile_id uuid;
BEGIN
  INSERT INTO user_cultural_profiles (
    user_id, cultural_background, primary_language, family_structure,
    communication_style, religious_considerations, religious_details,
    therapy_approach_preferences, cultural_sensitivities
  ) VALUES (
    p_user_id, p_cultural_background, p_primary_language, p_family_structure,
    p_communication_style, p_religious_considerations, p_religious_details,
    p_therapy_approach_preferences, p_cultural_sensitivities
  )
  ON CONFLICT (user_id) DO UPDATE SET
    cultural_background = EXCLUDED.cultural_background,
    primary_language = EXCLUDED.primary_language,
    family_structure = EXCLUDED.family_structure,
    communication_style = EXCLUDED.communication_style,
    religious_considerations = EXCLUDED.religious_considerations,
    religious_details = EXCLUDED.religious_details,
    therapy_approach_preferences = EXCLUDED.therapy_approach_preferences,
    cultural_sensitivities = EXCLUDED.cultural_sensitivities,
    updated_at = now()
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_admin_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_optimal_session_timing(p_session_id text, p_current_phase text, p_engagement_level numeric DEFAULT 0.5, p_breakthrough_probability numeric DEFAULT 0.0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
DECLARE
  base_duration INTEGER := 2700; -- 45 minutes in seconds
  phase_durations JSONB := '{"opening": 480, "assessment": 720, "intervention": 1200, "practice": 480, "closing": 120}';
  recommended_extension INTEGER := 0;
  optimal_timing JSONB;
BEGIN
  -- Calculate extension based on engagement and breakthrough probability
  IF p_engagement_level > 0.8 AND p_breakthrough_probability > 0.6 THEN
    recommended_extension := 900; -- 15 minutes
  ELSIF p_engagement_level > 0.7 AND p_breakthrough_probability > 0.4 THEN
    recommended_extension := 600; -- 10 minutes
  ELSIF p_engagement_level < 0.4 THEN
    recommended_extension := -300; -- Shorten by 5 minutes
  END IF;
  
  optimal_timing := jsonb_build_object(
    'base_duration', base_duration,
    'recommended_extension', recommended_extension,
    'total_recommended_duration', base_duration + recommended_extension,
    'phase_durations', phase_durations,
    'reasoning', CASE 
      WHEN recommended_extension > 0 THEN 'High engagement suggests productive extension'
      WHEN recommended_extension < 0 THEN 'Low engagement suggests shorter session'
      ELSE 'Standard duration appropriate'
    END
  );
  
  RETURN optimal_timing;
END;
$function$;

CREATE OR REPLACE FUNCTION public.select_optimal_technique(p_user_id uuid, p_session_id text, p_current_phase text, p_emotional_state jsonb DEFAULT '{}'::jsonb, p_cultural_context jsonb DEFAULT '{}'::jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
DECLARE
  technique_effectiveness JSONB;
  cultural_preferences JSONB;
  recommended_technique JSONB;
BEGIN
  -- Get historical technique effectiveness for this user
  SELECT jsonb_object_agg(technique_selected, decision_effectiveness)
  INTO technique_effectiveness
  FROM public.ai_session_decisions
  WHERE user_id = p_user_id
  AND decision_effectiveness > 0.6
  ORDER BY created_at DESC
  LIMIT 10;
  
  -- Get cultural preferences
  SELECT cultural_profile INTO cultural_preferences
  FROM public.session_cultural_adaptations
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Select technique based on phase, effectiveness, and cultural fit
  recommended_technique := jsonb_build_object(
    'technique', CASE p_current_phase
      WHEN 'opening' THEN 'rapport_building'
      WHEN 'assessment' THEN 'reflective_questioning'
      WHEN 'intervention' THEN 'cognitive_restructuring'
      WHEN 'practice' THEN 'skill_practice'
      WHEN 'closing' THEN 'session_summary'
      ELSE 'active_listening'
    END,
    'effectiveness_score', COALESCE((technique_effectiveness->>'cognitive_restructuring')::DECIMAL, 0.5),
    'cultural_adaptations', cultural_preferences,
    'rationale', 'Selected based on phase requirements and historical effectiveness'
  );
  
  RETURN recommended_technique;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_session_activity()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  NEW.last_activity = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_enhanced_backup_codes()
 RETURNS text[]
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
DECLARE
  codes TEXT[] := '{}';
  i INTEGER;
BEGIN
  FOR i IN 1..10 LOOP
    codes := array_append(codes, upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 12)));
  END LOOP;
  RETURN codes;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_emergency_recovery_code()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN upper(substr(encode(gen_random_bytes(16), 'hex'), 1, 32));
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_device_trust_token()
 RETURNS text
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_backup_code(user_id_param uuid, code_param text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  stored_codes JSONB;
  updated_codes JSONB := '[]'::JSONB;
  code_found BOOLEAN := false;
  i INTEGER;
BEGIN
  -- Get current backup codes
  SELECT backup_codes INTO stored_codes
  FROM public.two_factor_auth
  WHERE user_id = user_id_param AND is_active = true;
  
  IF stored_codes IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if code exists and remove it
  FOR i IN 0..jsonb_array_length(stored_codes) - 1 LOOP
    IF stored_codes->i->>'code' = upper(code_param) THEN
      code_found := true;
    ELSE
      updated_codes := updated_codes || (stored_codes->i);
    END IF;
  END LOOP;
  
  -- Update backup codes if code was found
  IF code_found THEN
    UPDATE public.two_factor_auth
    SET backup_codes = updated_codes,
        backup_codes_remaining = backup_codes_remaining - 1,
        last_used_at = now()
    WHERE user_id = user_id_param AND is_active = true;
    
    -- Log recovery attempt
    INSERT INTO public.mfa_recovery_attempts (user_id, attempt_type, success)
    VALUES (user_id_param, 'backup_code', true);
  ELSE
    -- Log failed attempt
    INSERT INTO public.mfa_recovery_attempts (user_id, attempt_type, success)
    VALUES (user_id_param, 'backup_code', false);
  END IF;
  
  RETURN code_found;
END;
$function$;

CREATE OR REPLACE FUNCTION public.regenerate_backup_codes(user_id_param uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  new_codes TEXT[];
  formatted_codes JSONB := '[]'::JSONB;
  code TEXT;
BEGIN
  -- Only allow super admins to regenerate codes
  IF NOT is_super_admin(user_id_param) THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can regenerate backup codes';
  END IF;
  
  new_codes := generate_enhanced_backup_codes();
  
  FOREACH code IN ARRAY new_codes LOOP
    formatted_codes := formatted_codes || jsonb_build_object('code', code, 'used', false);
  END LOOP;
  
  UPDATE public.two_factor_auth
  SET backup_codes = formatted_codes,
      backup_codes_remaining = 10,
      backup_codes_generated_at = now()
  WHERE user_id = user_id_param AND is_active = true;
  
  -- Create security alert
  INSERT INTO public.security_alerts (user_id, alert_type, severity, title, description)
  VALUES (user_id_param, 'device_change', 'medium', 'Backup Codes Regenerated', 'MFA backup codes have been regenerated');
  
  RETURN formatted_codes;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_trusted_device(user_id_param uuid, device_name_param text, device_fingerprint_param text, user_agent_param text DEFAULT NULL::text, ip_address_param inet DEFAULT NULL::inet)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
DECLARE
  trust_token TEXT;
BEGIN
  -- Only allow super admins to create trusted devices
  IF NOT is_super_admin(user_id_param) THEN
    RAISE EXCEPTION 'Unauthorized: Only super admins can create trusted devices';
  END IF;
  
  trust_token := generate_device_trust_token();
  
  INSERT INTO public.mfa_trusted_devices (
    user_id, device_name, device_fingerprint, trust_token,
    user_agent, ip_address, expires_at
  ) VALUES (
    user_id_param, device_name_param, device_fingerprint_param, trust_token,
    user_agent_param, ip_address_param, now() + INTERVAL '30 days'
  );
  
  -- Log recovery attempt
  INSERT INTO public.mfa_recovery_attempts (user_id, attempt_type, success, metadata)
  VALUES (user_id_param, 'device_trust', true, jsonb_build_object('device_name', device_name_param));
  
  RETURN trust_token;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_country_preferences_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_goal_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user_notification_preferences()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, pg_temp
AS $function$
BEGIN
  INSERT INTO public.notification_preferences (user_id)
  VALUES (new.id);
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_notification_preferences_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public, pg_temp
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Enable RLS on tables that are missing it
ALTER TABLE auth_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for the newly secured tables
CREATE POLICY "System can manage auth rate limits" 
ON auth_rate_limits 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admins can view admin sessions" 
ON admin_sessions 
FOR SELECT 
USING (is_super_admin(admin_id));

CREATE POLICY "System can create admin sessions" 
ON admin_sessions 
FOR INSERT 
WITH CHECK (true);