
-- Create family/household management tables
CREATE TABLE public.households (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  primary_account_holder_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'family_starter',
  max_members INTEGER NOT NULL DEFAULT 4,
  current_members INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create household members table
CREATE TABLE public.household_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_type TEXT NOT NULL DEFAULT 'adult', -- 'primary', 'adult', 'teen', 'child'
  relationship TEXT, -- 'spouse', 'child', 'parent', 'sibling', etc.
  age INTEGER,
  permission_level TEXT NOT NULL DEFAULT 'basic', -- 'full', 'limited', 'basic', 'view_only'
  can_view_progress BOOLEAN DEFAULT false,
  can_view_mood_data BOOLEAN DEFAULT false,
  can_receive_alerts BOOLEAN DEFAULT false,
  invitation_status TEXT DEFAULT 'active', -- 'pending', 'active', 'inactive'
  invited_email TEXT,
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family invitations table
CREATE TABLE public.family_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  invited_by_id UUID REFERENCES auth.users(id) NOT NULL,
  invited_email TEXT NOT NULL,
  member_type TEXT NOT NULL DEFAULT 'adult',
  relationship TEXT,
  age INTEGER,
  permission_level TEXT NOT NULL DEFAULT 'basic',
  invitation_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family alerts table for concerning behavior
CREATE TABLE public.family_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  member_user_id UUID REFERENCES auth.users(id) NOT NULL,
  alert_type TEXT NOT NULL, -- 'mood_decline', 'crisis_risk', 'concerning_pattern', 'missed_sessions'
  severity TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  alert_data JSONB DEFAULT '{}',
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create family dashboard permissions
CREATE TABLE public.family_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  household_id UUID REFERENCES public.households(id) ON DELETE CASCADE NOT NULL,
  member_id UUID REFERENCES public.household_members(id) ON DELETE CASCADE NOT NULL,
  target_member_id UUID REFERENCES public.household_members(id) ON DELETE CASCADE NOT NULL,
  permission_type TEXT NOT NULL, -- 'view_progress', 'view_mood', 'view_sessions', 'receive_alerts', 'manage_goals'
  granted BOOLEAN DEFAULT true,
  granted_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(member_id, target_member_id, permission_type)
);

-- Add family pricing to subscription plans
INSERT INTO public.subscription_plans (name, price_monthly, price_yearly, features, limits, is_active)
VALUES 
  ('Family Starter', 49, 490, 
   '{"family_members": "Up to 4 members", "child_monitoring": "Basic child safety features", "progress_sharing": "Limited progress sharing", "crisis_alerts": "Email alerts for concerning behavior", "individual_sessions": "10 sessions per member per month", "family_insights": "Basic family wellness dashboard"}',
   '{"family_members": 4, "sessions_per_member": 10, "progress_sharing": "limited", "crisis_monitoring": "basic"}',
   true),
   
  ('Family Pro', 89, 890,
   '{"family_members": "Up to 6 members", "child_monitoring": "Advanced child safety & COPPA compliance", "progress_sharing": "Full progress sharing with permissions", "crisis_alerts": "Real-time SMS & email alerts", "individual_sessions": "25 sessions per member per month", "family_insights": "Advanced family wellness analytics", "parental_controls": "Comprehensive parental dashboard", "family_goals": "Shared family wellness goals"}',
   '{"family_members": 6, "sessions_per_member": 25, "progress_sharing": "full", "crisis_monitoring": "advanced"}',
   true),
   
  ('Family Premium', 149, 1490,
   '{"family_members": "Up to 8 members", "child_monitoring": "Premium child safety with therapist escalation", "progress_sharing": "Full progress sharing with granular permissions", "crisis_alerts": "Immediate alerts with crisis intervention", "individual_sessions": "Unlimited sessions for all members", "family_insights": "Premium family wellness analytics with trends", "parental_controls": "Complete parental oversight dashboard", "family_goals": "Advanced shared family wellness goals", "priority_support": "24/7 priority family support", "family_therapy": "Access to family therapy sessions"}',
   '{"family_members": 8, "sessions_per_member": -1, "progress_sharing": "granular", "crisis_monitoring": "premium"}',
   true);

-- Enable RLS on all family tables
ALTER TABLE public.households ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.household_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for households
CREATE POLICY "Users can view their own households" ON public.households
  FOR SELECT USING (primary_account_holder_id = auth.uid() OR id IN (
    SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Primary account holders can manage their households" ON public.households
  FOR ALL USING (primary_account_holder_id = auth.uid());

-- RLS Policies for household_members
CREATE POLICY "Users can view household members of their households" ON public.household_members
  FOR SELECT USING (household_id IN (
    SELECT id FROM public.households WHERE primary_account_holder_id = auth.uid()
    UNION
    SELECT household_id FROM public.household_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Primary account holders can manage household members" ON public.household_members
  FOR ALL USING (household_id IN (
    SELECT id FROM public.households WHERE primary_account_holder_id = auth.uid()
  ));

-- RLS Policies for family_invitations
CREATE POLICY "Users can view invitations for their households" ON public.family_invitations
  FOR SELECT USING (household_id IN (
    SELECT id FROM public.households WHERE primary_account_holder_id = auth.uid()
  ) OR invited_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Primary account holders can manage invitations" ON public.family_invitations
  FOR ALL USING (household_id IN (
    SELECT id FROM public.households WHERE primary_account_holder_id = auth.uid()
  ));

-- RLS Policies for family_alerts
CREATE POLICY "Household members can view relevant alerts" ON public.family_alerts
  FOR SELECT USING (household_id IN (
    SELECT household_id FROM public.household_members WHERE user_id = auth.uid() AND can_receive_alerts = true
    UNION
    SELECT id FROM public.households WHERE primary_account_holder_id = auth.uid()
  ));

-- Create functions for family management
CREATE OR REPLACE FUNCTION public.create_household_for_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create household when user signs up
CREATE TRIGGER on_auth_user_created_household
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_household_for_user();

-- Function to generate invitation tokens
CREATE OR REPLACE FUNCTION public.generate_invitation_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Function to check if user can access member data
CREATE OR REPLACE FUNCTION public.can_access_member_data(
  requesting_user_id UUID,
  target_user_id UUID,
  data_type TEXT
)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
