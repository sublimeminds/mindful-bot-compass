
-- Create WhatsApp integration tables
CREATE TABLE public.whatsapp_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  phone_number TEXT NOT NULL,
  whatsapp_number TEXT,
  verification_code TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT false,
  webhook_token TEXT,
  business_account_id TEXT,
  phone_number_id TEXT,
  access_token_encrypted TEXT,
  privacy_settings JSONB DEFAULT '{"message_history": true, "data_sharing": false}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE
);

-- Create WhatsApp message history table
CREATE TABLE public.whatsapp_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  integration_id UUID REFERENCES public.whatsapp_integrations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  whatsapp_message_id TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  sender_type TEXT NOT NULL, -- 'user' or 'ai'
  ai_response_metadata JSONB DEFAULT '{}'::jsonb,
  therapy_session_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_status TEXT DEFAULT 'sent',
  error_message TEXT
);

-- Create WhatsApp configuration table
CREATE TABLE public.whatsapp_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL UNIQUE,
  ai_personality_id TEXT DEFAULT 'default',
  response_delay_seconds INTEGER DEFAULT 2,
  business_hours_enabled BOOLEAN DEFAULT false,
  business_hours_start TIME,
  business_hours_end TIME,
  business_timezone TEXT DEFAULT 'UTC',
  auto_responses_enabled BOOLEAN DEFAULT true,
  crisis_escalation_enabled BOOLEAN DEFAULT true,
  message_encryption_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for WhatsApp integrations
CREATE POLICY "Users can view their own WhatsApp integrations" 
  ON public.whatsapp_integrations 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own WhatsApp integrations" 
  ON public.whatsapp_integrations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own WhatsApp integrations" 
  ON public.whatsapp_integrations 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own WhatsApp integrations" 
  ON public.whatsapp_integrations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for WhatsApp messages
CREATE POLICY "Users can view their own WhatsApp messages" 
  ON public.whatsapp_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own WhatsApp messages" 
  ON public.whatsapp_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for WhatsApp config
CREATE POLICY "Users can view their own WhatsApp config" 
  ON public.whatsapp_config 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own WhatsApp config" 
  ON public.whatsapp_config 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own WhatsApp config" 
  ON public.whatsapp_config 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_whatsapp_integrations_user_id ON public.whatsapp_integrations(user_id);
CREATE INDEX idx_whatsapp_integrations_phone ON public.whatsapp_integrations(phone_number);
CREATE INDEX idx_whatsapp_messages_integration_id ON public.whatsapp_messages(integration_id);
CREATE INDEX idx_whatsapp_messages_timestamp ON public.whatsapp_messages(timestamp DESC);
CREATE INDEX idx_whatsapp_config_user_id ON public.whatsapp_config(user_id);

-- Add updated_at trigger for whatsapp_integrations
CREATE OR REPLACE FUNCTION update_whatsapp_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_integrations_updated_at
    BEFORE UPDATE ON public.whatsapp_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_whatsapp_integrations_updated_at();

-- Add updated_at trigger for whatsapp_config
CREATE OR REPLACE FUNCTION update_whatsapp_config_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_whatsapp_config_updated_at
    BEFORE UPDATE ON public.whatsapp_config
    FOR EACH ROW
    EXECUTE FUNCTION update_whatsapp_config_updated_at();
