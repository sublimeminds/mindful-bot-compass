
-- Create AI model configurations table
CREATE TABLE public.ai_model_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic')),
  model TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT false,
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
  max_tokens INTEGER NOT NULL DEFAULT 500 CHECK (max_tokens > 0),
  system_prompt TEXT NOT NULL,
  cost_per_token DECIMAL(10,8) NOT NULL DEFAULT 0.0001,
  capabilities TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapeutic approach configurations table
CREATE TABLE public.therapeutic_approach_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  techniques TEXT[] NOT NULL DEFAULT '{}',
  target_conditions TEXT[] NOT NULL DEFAULT '{}',
  effectiveness_score DECIMAL(3,2) NOT NULL DEFAULT 0.5 CHECK (effectiveness_score >= 0 AND effectiveness_score <= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  system_prompt_addition TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create personalization configurations table
CREATE TABLE public.personalization_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  communication_style TEXT NOT NULL CHECK (communication_style IN ('supportive', 'direct', 'analytical', 'encouraging')),
  adaptation_level TEXT NOT NULL CHECK (adaptation_level IN ('low', 'medium', 'high')),
  cultural_context TEXT NOT NULL DEFAULT 'general',
  preferred_techniques TEXT[] NOT NULL DEFAULT '{}',
  emotional_sensitivity DECIMAL(3,2) NOT NULL DEFAULT 0.7 CHECK (emotional_sensitivity >= 0 AND emotional_sensitivity <= 1),
  is_global BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI quality metrics table
CREATE TABLE public.ai_quality_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  response_quality DECIMAL(3,2) NOT NULL CHECK (response_quality >= 0 AND response_quality <= 1),
  therapeutic_value DECIMAL(3,2) NOT NULL CHECK (therapeutic_value >= 0 AND therapeutic_value <= 1),
  safety_score DECIMAL(3,2) NOT NULL CHECK (safety_score >= 0 AND safety_score <= 1),
  user_satisfaction DECIMAL(3,2) NOT NULL DEFAULT 0 CHECK (user_satisfaction >= 0 AND user_satisfaction <= 1),
  flagged_content BOOLEAN NOT NULL DEFAULT false,
  review_required BOOLEAN NOT NULL DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI performance stats table
CREATE TABLE public.ai_performance_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  model_id UUID REFERENCES public.ai_model_configs(id),
  response_time INTEGER NOT NULL,
  token_usage INTEGER NOT NULL,
  cost DECIMAL(10,4) NOT NULL,
  user_rating DECIMAL(3,2) CHECK (user_rating >= 0 AND user_rating <= 1),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create therapy effectiveness stats table
CREATE TABLE public.therapy_effectiveness_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  measurement_date DATE NOT NULL,
  mood_improvement DECIMAL(3,2) CHECK (mood_improvement >= -1 AND mood_improvement <= 1),
  goal_progress DECIMAL(3,2) CHECK (goal_progress >= 0 AND goal_progress <= 1),
  session_completion_rate DECIMAL(3,2) CHECK (session_completion_rate >= 0 AND session_completion_rate <= 1),
  technique_effectiveness JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create A/B testing table
CREATE TABLE public.ai_ab_tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  model_a_id UUID REFERENCES public.ai_model_configs(id),
  model_b_id UUID REFERENCES public.ai_model_configs(id),
  user_segment TEXT NOT NULL,
  target_metric TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'completed')) DEFAULT 'active',
  results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE
);

-- Create personalized recommendations table
CREATE TABLE public.personalized_recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  recommendation_type TEXT NOT NULL CHECK (recommendation_type IN ('session', 'technique', 'content', 'timing')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reasoning TEXT NOT NULL,
  priority_score DECIMAL(3,2) NOT NULL CHECK (priority_score >= 0 AND priority_score <= 1),
  estimated_impact DECIMAL(3,2) NOT NULL CHECK (estimated_impact >= 0 AND estimated_impact <= 1),
  is_active BOOLEAN NOT NULL DEFAULT true,
  shown_at TIMESTAMP WITH TIME ZONE,
  acted_upon_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default AI model configuration
INSERT INTO public.ai_model_configs (name, provider, model, is_active, temperature, max_tokens, system_prompt, capabilities) VALUES
('GPT-4o Mini (Default)', 'openai', 'gpt-4o-mini', true, 0.7, 500, 
'You are MindfulAI, a compassionate and professional AI therapist. Your role is to provide supportive, evidence-based mental health guidance while maintaining appropriate boundaries.

Guidelines:
- Be empathetic, non-judgmental, and supportive
- Use evidence-based therapeutic techniques (CBT, mindfulness, etc.)
- Encourage professional help when appropriate
- Maintain confidentiality and respect
- Ask thoughtful follow-up questions
- Provide practical coping strategies
- Always prioritize user safety

Remember: You are a supportive tool, not a replacement for professional therapy.',
ARRAY['text_generation', 'conversation', 'emotional_support']);

-- Insert default therapeutic approaches
INSERT INTO public.therapeutic_approach_configs (name, description, techniques, target_conditions, effectiveness_score, system_prompt_addition) VALUES
('Cognitive Behavioral Therapy', 'Focus on identifying and changing negative thought patterns and behaviors', 
ARRAY['Thought challenging', 'Behavioral activation', 'Cognitive restructuring', 'Exposure therapy'],
ARRAY['Depression', 'Anxiety', 'Panic disorder', 'PTSD'],
0.85,
'Use CBT techniques to help users identify thought patterns, challenge negative thinking, and develop healthy coping strategies. Focus on the connection between thoughts, feelings, and behaviors.'),

('Mindfulness-Based Therapy', 'Emphasize present-moment awareness and acceptance',
ARRAY['Breathing exercises', 'Body scan', 'Meditation', 'Mindful observation'],
ARRAY['Stress', 'Anxiety', 'Depression', 'Chronic pain'],
0.80,
'Guide users through mindfulness practices, encourage present-moment awareness, and help them develop a non-judgmental relationship with their thoughts and feelings.'),

('Dialectical Behavior Therapy', 'Focus on emotional regulation and distress tolerance',
ARRAY['Distress tolerance', 'Emotion regulation', 'Interpersonal effectiveness', 'Mindfulness'],
ARRAY['Borderline personality disorder', 'Self-harm', 'Emotional dysregulation'],
0.75,
'Help users learn to tolerate distress, regulate emotions, and improve interpersonal relationships. Emphasize acceptance and change strategies.'),

('Solution-Focused Therapy', 'Concentrate on solutions and positive outcomes rather than problems',
ARRAY['Goal setting', 'Scaling questions', 'Exception finding', 'Future focus'],
ARRAY['Relationship issues', 'Life transitions', 'Goal achievement'],
0.70,
'Focus on user strengths, help identify what is already working, and collaboratively develop specific, achievable goals for positive change.');

-- Insert default personalization config
INSERT INTO public.personalization_configs (communication_style, adaptation_level, cultural_context, preferred_techniques, emotional_sensitivity, is_global) VALUES
('supportive', 'medium', 'general', ARRAY['Active listening', 'Validation', 'Empathy'], 0.7, true);

-- Enable Row Level Security
ALTER TABLE public.ai_model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_approach_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_performance_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapy_effectiveness_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalized_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI model configs (admin only)
CREATE POLICY "Admins can manage AI model configs" ON public.ai_model_configs
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for therapeutic approach configs (admin only)
CREATE POLICY "Admins can manage therapeutic approaches" ON public.therapeutic_approach_configs
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for personalization configs
CREATE POLICY "Users can view personalization configs" ON public.personalization_configs
  FOR SELECT USING (auth.uid() = user_id OR is_global = true);

CREATE POLICY "Admins can manage personalization configs" ON public.personalization_configs
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for quality metrics (admin only)
CREATE POLICY "Admins can view quality metrics" ON public.ai_quality_metrics
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for performance stats (admin only)
CREATE POLICY "Admins can view performance stats" ON public.ai_performance_stats
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for therapy effectiveness stats
CREATE POLICY "Users can view their own therapy stats" ON public.therapy_effectiveness_stats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all therapy stats" ON public.therapy_effectiveness_stats
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for A/B tests (admin only)
CREATE POLICY "Admins can manage A/B tests" ON public.ai_ab_tests
  FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for personalized recommendations
CREATE POLICY "Users can view their own recommendations" ON public.personalized_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create recommendations" ON public.personalized_recommendations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own recommendations" ON public.personalized_recommendations
  FOR UPDATE USING (auth.uid() = user_id);
