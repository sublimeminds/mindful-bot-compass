
-- Create tables for crisis management and safety features

-- Table for crisis assessments
CREATE TABLE public.crisis_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL DEFAULT 'self_harm', -- 'self_harm', 'suicide', 'substance_abuse', 'domestic_violence'
  risk_level TEXT NOT NULL DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
  responses jsonb NOT NULL DEFAULT '{}',
  total_score INTEGER,
  severity_indicators TEXT[],
  immediate_actions_taken TEXT[],
  professional_contact_made BOOLEAN DEFAULT false,
  emergency_services_contacted BOOLEAN DEFAULT false,
  follow_up_scheduled BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMP WITH TIME ZONE,
  counselor_notes TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'resolved', 'escalated'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for emergency contacts
CREATE TABLE public.emergency_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_type TEXT NOT NULL DEFAULT 'personal', -- 'personal', 'professional', 'hotline'
  name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  relationship TEXT,
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for crisis interventions
CREATE TABLE public.crisis_interventions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  crisis_assessment_id UUID REFERENCES public.crisis_assessments(id),
  intervention_type TEXT NOT NULL, -- 'automated_response', 'professional_referral', 'emergency_contact', 'crisis_hotline'
  intervention_data jsonb NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  response_time_minutes INTEGER,
  outcome TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Table for safety plans
CREATE TABLE public.safety_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'My Safety Plan',
  warning_signs TEXT[],
  coping_strategies TEXT[],
  social_contacts jsonb DEFAULT '{}', -- structured contact information
  professional_contacts jsonb DEFAULT '{}',
  environment_safety TEXT[],
  reasons_to_live TEXT[],
  is_active BOOLEAN DEFAULT true,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for crisis hotlines and resources
CREATE TABLE public.crisis_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- 'hotline', 'text_line', 'chat_service', 'local_service'
  phone_number TEXT,
  website_url TEXT,
  description TEXT,
  availability TEXT, -- '24/7', 'business_hours', etc.
  target_demographics TEXT[],
  specialties TEXT[],
  geographic_coverage TEXT,
  language_support TEXT[],
  is_active BOOLEAN DEFAULT true,
  priority_order INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for crisis_assessments
ALTER TABLE public.crisis_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own crisis assessments" 
  ON public.crisis_assessments 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own crisis assessments" 
  ON public.crisis_assessments 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own crisis assessments" 
  ON public.crisis_assessments 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add RLS policies for emergency_contacts
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own emergency contacts" 
  ON public.emergency_contacts 
  FOR ALL
  USING (auth.uid() = user_id);

-- Add RLS policies for crisis_interventions
ALTER TABLE public.crisis_interventions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own crisis interventions" 
  ON public.crisis_interventions 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Add RLS policies for safety_plans
ALTER TABLE public.safety_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own safety plans" 
  ON public.safety_plans 
  FOR ALL
  USING (auth.uid() = user_id);

-- Add RLS policies for crisis_resources (public readable)
ALTER TABLE public.crisis_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active crisis resources" 
  ON public.crisis_resources 
  FOR SELECT 
  USING (is_active = true);

-- Add triggers for updated_at
CREATE TRIGGER update_crisis_assessments_updated_at
  BEFORE UPDATE ON public.crisis_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_emergency_contacts_updated_at
  BEFORE UPDATE ON public.emergency_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_safety_plans_updated_at
  BEFORE UPDATE ON public.safety_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_crisis_resources_updated_at
  BEFORE UPDATE ON public.crisis_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default crisis resources
INSERT INTO public.crisis_resources (name, resource_type, phone_number, website_url, description, availability, target_demographics, specialties, geographic_coverage, language_support) VALUES
('National Suicide Prevention Lifeline', 'hotline', '988', 'https://suicidepreventionlifeline.org', 'Free and confidential emotional support for people in suicidal crisis or emotional distress', '24/7', ARRAY['all'], ARRAY['suicide_prevention', 'crisis_support'], 'United States', ARRAY['English', 'Spanish']),
('Crisis Text Line', 'text_line', '', 'https://crisistextline.org', 'Free, 24/7 support for those in crisis. Text HOME to 741741', '24/7', ARRAY['teens', 'young_adults', 'adults'], ARRAY['crisis_support', 'mental_health'], 'United States', ARRAY['English', 'Spanish']),
('SAMHSA National Helpline', 'hotline', '1-800-662-4357', 'https://samhsa.gov', 'Treatment referral and information service for mental health and substance use disorders', '24/7', ARRAY['all'], ARRAY['substance_abuse', 'mental_health'], 'United States', ARRAY['English', 'Spanish']),
('LGBTQ National Hotline', 'hotline', '1-888-843-4564', 'https://lgbthotline.org', 'Confidential support for LGBTQ individuals', 'Mon-Fri 4PM-12AM, Sat 12PM-5PM EST', ARRAY['lgbtq'], ARRAY['identity_support', 'crisis_support'], 'United States', ARRAY['English']),
('National Domestic Violence Hotline', 'hotline', '1-800-799-7233', 'https://thehotline.org', '24/7 confidential support for domestic violence survivors', '24/7', ARRAY['all'], ARRAY['domestic_violence', 'safety_planning'], 'United States', ARRAY['English', 'Spanish']);
