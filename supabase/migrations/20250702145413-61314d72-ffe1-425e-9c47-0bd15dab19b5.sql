-- Quantum AI therapy sessions and matching
CREATE TABLE public.quantum_therapy_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id TEXT NOT NULL,
  quantum_score DECIMAL(3,2) NOT NULL DEFAULT 0.5,
  entanglement_factors JSONB DEFAULT '[]'::JSONB,
  superposition_states JSONB DEFAULT '[]'::JSONB,
  session_data JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quantum_therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own quantum sessions"
ON public.quantum_therapy_sessions FOR ALL
USING (auth.uid() = user_id);

-- AR therapy sessions
CREATE TABLE public.ar_therapy_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  environment_id TEXT NOT NULL,
  session_data JSONB DEFAULT '{}'::JSONB,
  interactions JSONB DEFAULT '[]'::JSONB,
  biometric_data JSONB DEFAULT '[]'::JSONB,
  therapeutic_goals TEXT[] DEFAULT '{}'::TEXT[],
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ar_therapy_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own AR sessions"
ON public.ar_therapy_sessions FOR ALL
USING (auth.uid() = user_id);

-- Blockchain health records
CREATE TABLE public.blockchain_health_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  record_hash TEXT NOT NULL UNIQUE,
  record_type TEXT NOT NULL,
  encrypted_data TEXT NOT NULL,
  block_height BIGINT,
  transaction_id TEXT,
  verification_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blockchain_health_records ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own blockchain records"
ON public.blockchain_health_records FOR ALL
USING (auth.uid() = user_id);

-- Neural interface data
CREATE TABLE public.neural_interface_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interface_type TEXT NOT NULL,
  neural_patterns JSONB DEFAULT '{}'::JSONB,
  biometric_feedback JSONB DEFAULT '{}'::JSONB,
  therapy_adjustments JSONB DEFAULT '{}'::JSONB,
  session_effectiveness DECIMAL(3,2) DEFAULT 0.5,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.neural_interface_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own neural sessions"
ON public.neural_interface_sessions FOR ALL
USING (auth.uid() = user_id);

-- Enterprise B2B configurations
CREATE TABLE public.enterprise_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL,
  configuration_type TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::JSONB,
  white_label_config JSONB DEFAULT '{}'::JSONB,
  integration_endpoints JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.enterprise_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage enterprise configurations"
ON public.enterprise_configurations FOR ALL
USING (is_admin(auth.uid()));

-- Healthcare provider integrations
CREATE TABLE public.healthcare_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  ehr_config JSONB DEFAULT '{}'::JSONB,
  fhir_endpoint TEXT,
  credentials_encrypted TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.healthcare_integrations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage healthcare integrations"
ON public.healthcare_integrations FOR ALL
USING (is_admin(auth.uid()));

-- Global infrastructure metrics
CREATE TABLE public.global_infrastructure_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region TEXT NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value DECIMAL NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.global_infrastructure_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can view infrastructure metrics"
ON public.global_infrastructure_metrics FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "System can create infrastructure metrics"
ON public.global_infrastructure_metrics FOR INSERT
WITH CHECK (true);

-- Add update triggers
CREATE TRIGGER update_quantum_therapy_sessions_updated_at
BEFORE UPDATE ON public.quantum_therapy_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blockchain_health_records_updated_at
BEFORE UPDATE ON public.blockchain_health_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enterprise_configurations_updated_at
BEFORE UPDATE ON public.enterprise_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_healthcare_integrations_updated_at
BEFORE UPDATE ON public.healthcare_integrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();