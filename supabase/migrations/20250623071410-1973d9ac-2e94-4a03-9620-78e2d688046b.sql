
-- Create admin WhatsApp configuration tables
CREATE TABLE public.whatsapp_global_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_account_id TEXT,
  phone_number_id TEXT,
  access_token_encrypted TEXT,
  webhook_verify_token TEXT,
  webhook_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  rate_limit_per_hour INTEGER DEFAULT 1000,
  crisis_escalation_enabled BOOLEAN DEFAULT true,
  message_monitoring_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Create WhatsApp response templates table
CREATE TABLE public.whatsapp_response_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'greeting', 'crisis', 'followup', 'general'
  template_text TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER DEFAULT 1,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Create WhatsApp system prompts table
CREATE TABLE public.whatsapp_system_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  personality_type TEXT NOT NULL, -- 'empathetic', 'professional', 'casual', 'crisis'
  system_prompt TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  effectiveness_score NUMERIC DEFAULT 0.8,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users NOT NULL
);

-- Create WhatsApp usage analytics table
CREATE TABLE public.whatsapp_usage_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_messages INTEGER DEFAULT 0,
  ai_responses INTEGER DEFAULT 0,
  user_messages INTEGER DEFAULT 0,
  crisis_interventions INTEGER DEFAULT 0,
  average_response_time NUMERIC DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_global_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_system_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_usage_analytics ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for global config
CREATE POLICY "Admins can manage global WhatsApp config" 
  ON public.whatsapp_global_config 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Admin-only policies for response templates
CREATE POLICY "Admins can manage response templates" 
  ON public.whatsapp_response_templates 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Admin-only policies for system prompts
CREATE POLICY "Admins can manage system prompts" 
  ON public.whatsapp_system_prompts 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Admin-only policies for usage analytics
CREATE POLICY "Admins can view usage analytics" 
  ON public.whatsapp_usage_analytics 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_whatsapp_global_config_active ON public.whatsapp_global_config(is_active);
CREATE INDEX idx_whatsapp_response_templates_category ON public.whatsapp_response_templates(category, is_active);
CREATE INDEX idx_whatsapp_system_prompts_personality ON public.whatsapp_system_prompts(personality_type, is_active);
CREATE INDEX idx_whatsapp_usage_analytics_date ON public.whatsapp_usage_analytics(date DESC);

-- Add updated_at triggers
CREATE TRIGGER update_whatsapp_global_config_updated_at
    BEFORE UPDATE ON public.whatsapp_global_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_response_templates_updated_at
    BEFORE UPDATE ON public.whatsapp_response_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_system_prompts_updated_at
    BEFORE UPDATE ON public.whatsapp_system_prompts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
