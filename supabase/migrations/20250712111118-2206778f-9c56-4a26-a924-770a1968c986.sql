-- Create component registry table
CREATE TABLE IF NOT EXISTS public.component_registry (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  version TEXT NOT NULL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criticality TEXT CHECK (criticality IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  category TEXT CHECK (category IN ('therapy', 'ui', 'core', 'integration')) DEFAULT 'core',
  status TEXT CHECK (status IN ('active', 'deprecated', 'outdated', 'updated')) DEFAULT 'active',
  dependencies TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  changelog TEXT
);

-- Create system health logs table
CREATE TABLE IF NOT EXISTS public.system_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  overall_health DECIMAL(5,2) NOT NULL,
  critical_issues TEXT[] DEFAULT '{}',
  warnings TEXT[] DEFAULT '{}',
  recommendations TEXT[] DEFAULT '{}',
  checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.component_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (admin access for component registry)
CREATE POLICY "Admin can manage component registry" ON public.component_registry
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'support_admin')
      AND is_active = true
    )
  );

CREATE POLICY "Admin can view system health logs" ON public.system_health_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'support_admin')
      AND is_active = true
    )
  );

CREATE POLICY "System can insert health logs" ON public.system_health_logs
  FOR INSERT WITH CHECK (true);