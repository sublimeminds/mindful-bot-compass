-- Create base AI configuration tables first
CREATE TABLE IF NOT EXISTS public.ai_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  model_provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  configuration JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Now add the enhanced columns
ALTER TABLE public.ai_configurations 
ADD COLUMN IF NOT EXISTS cultural_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS voice_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS avatar_settings JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS emergency_protocols JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cost_settings JSONB DEFAULT '{}';

-- Create table for AI model performance tracking
CREATE TABLE IF NOT EXISTS public.ai_model_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  response_time_ms INTEGER,
  quality_score DECIMAL(3,2),
  user_satisfaction_score DECIMAL(3,2),
  cost_per_request DECIMAL(10,6),
  cultural_context TEXT,
  success_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for therapy context management
CREATE TABLE IF NOT EXISTS public.therapy_context (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id UUID,
  current_ai_model TEXT NOT NULL,
  current_voice_id TEXT,
  current_avatar_state TEXT,
  cultural_profile JSONB DEFAULT '{}',
  emotional_state JSONB DEFAULT '{}',
  context_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_model_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_context ENABLE ROW LEVEL SECURITY;

-- Create policies for ai_configurations
CREATE POLICY "Admins can manage AI configurations" ON public.ai_configurations
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('super_admin', 'content_admin')
  AND is_active = true
));

-- Create policies for ai_model_performance
CREATE POLICY "Admins can manage AI performance data" ON public.ai_model_performance
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('super_admin', 'content_admin')
  AND is_active = true
));

-- Create policies for therapy_context
CREATE POLICY "Users can view their therapy context" ON public.therapy_context
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their therapy context" ON public.therapy_context  
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all therapy context" ON public.therapy_context
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() 
  AND role IN ('super_admin', 'content_admin')
  AND is_active = true
));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_configurations_active ON public.ai_configurations(is_active);
CREATE INDEX IF NOT EXISTS idx_ai_model_performance_model_task ON public.ai_model_performance(model_name, task_type);
CREATE INDEX IF NOT EXISTS idx_therapy_context_user_session ON public.therapy_context(user_id, session_id);