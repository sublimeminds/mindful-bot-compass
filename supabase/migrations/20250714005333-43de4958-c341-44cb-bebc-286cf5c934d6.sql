-- Create AI routing configuration tables

-- AI Routing Rules
CREATE TABLE public.ai_routing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL CHECK (user_type IN ('free', 'pro', 'premium', 'all')),
  feature_type TEXT NOT NULL CHECK (feature_type IN ('chat', 'adaptive', 'crisis', 'cultural', 'voice', 'emotion', 'background')),
  model_config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 1,
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Feature Toggles
CREATE TABLE public.ai_feature_toggles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('free', 'pro', 'premium', 'all')),
  enabled BOOLEAN NOT NULL DEFAULT true,
  rollout_percentage INTEGER DEFAULT 100 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI User Overrides
CREATE TABLE public.ai_user_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  override_type TEXT NOT NULL CHECK (override_type IN ('model', 'feature', 'limit')),
  override_value JSONB NOT NULL,
  reason TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL
);

-- Enable RLS
ALTER TABLE public.ai_routing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_feature_toggles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_user_overrides ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI routing rules
CREATE POLICY "Admins can manage AI routing rules" ON public.ai_routing_rules
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for AI feature toggles
CREATE POLICY "Admins can manage AI feature toggles" ON public.ai_feature_toggles
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for AI user overrides
CREATE POLICY "Admins can manage AI user overrides" ON public.ai_user_overrides
  FOR ALL USING (is_admin(auth.uid()));

-- Indexes for performance
CREATE INDEX idx_ai_routing_rules_user_type_feature ON public.ai_routing_rules(user_type, feature_type);
CREATE INDEX idx_ai_feature_toggles_user_type ON public.ai_feature_toggles(user_type, feature_name);
CREATE INDEX idx_ai_user_overrides_user_id ON public.ai_user_overrides(user_id);