-- Create tables for Phase 5 advanced features

-- Voice clone profiles table
CREATE TABLE public.voice_clone_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    voice_name TEXT NOT NULL,
    cloned_voice_id TEXT,
    training_status TEXT NOT NULL DEFAULT 'pending',
    sample_count INTEGER NOT NULL DEFAULT 0,
    quality_score NUMERIC NOT NULL DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Voice samples table
CREATE TABLE public.voice_samples (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID NOT NULL,
    transcript TEXT NOT NULL,
    duration NUMERIC NOT NULL DEFAULT 0.0,
    quality_score NUMERIC NOT NULL DEFAULT 0.0,
    file_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enterprise integrations table
CREATE TABLE public.enterprise_integrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    integration_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    endpoint_url TEXT,
    api_key TEXT,
    configuration JSONB DEFAULT '{}',
    sync_count INTEGER NOT NULL DEFAULT 0,
    last_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance optimization metrics table
CREATE TABLE public.performance_metrics (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID,
    metric_type TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    metadata JSONB DEFAULT '{}',
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.voice_clone_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for voice_clone_profiles
CREATE POLICY "Users can manage their own voice profiles"
ON public.voice_clone_profiles
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for voice_samples
CREATE POLICY "Users can manage samples for their profiles"
ON public.voice_samples
FOR ALL
USING (EXISTS (
    SELECT 1 FROM public.voice_clone_profiles vcp
    WHERE vcp.id = voice_samples.profile_id 
    AND vcp.user_id = auth.uid()
));

-- Create RLS policies for enterprise_integrations
CREATE POLICY "Admins can manage enterprise integrations"
ON public.enterprise_integrations
FOR ALL
USING (is_admin(auth.uid()));

-- Create RLS policies for performance_metrics
CREATE POLICY "Users can view their own performance metrics"
ON public.performance_metrics
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can create performance metrics"
ON public.performance_metrics
FOR INSERT
WITH CHECK (true);

-- Create storage bucket for voice clones
INSERT INTO storage.buckets (id, name, public) VALUES ('voice-clones', 'voice-clones', false);

-- Create storage policies for voice clones
CREATE POLICY "Users can upload their own voice samples"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'voice-clones' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own voice samples"
ON storage.objects
FOR SELECT
USING (
    bucket_id = 'voice-clones' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create indexes for performance
CREATE INDEX idx_voice_clone_profiles_user_id ON public.voice_clone_profiles(user_id);
CREATE INDEX idx_voice_samples_profile_id ON public.voice_samples(profile_id);
CREATE INDEX idx_enterprise_integrations_status ON public.enterprise_integrations(status);
CREATE INDEX idx_performance_metrics_user_id ON public.performance_metrics(user_id);
CREATE INDEX idx_performance_metrics_type ON public.performance_metrics(metric_type);

-- Create trigger to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_voice_clone_profiles_updated_at
    BEFORE UPDATE ON public.voice_clone_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enterprise_integrations_updated_at
    BEFORE UPDATE ON public.enterprise_integrations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();