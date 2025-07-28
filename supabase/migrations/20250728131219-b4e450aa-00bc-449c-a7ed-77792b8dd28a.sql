-- Create ai_test_results table for storing comprehensive test results
CREATE TABLE public.ai_test_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  test_suite_id UUID NOT NULL DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  test_category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'warning', 'timeout', 'pending')),
  duration INTEGER,
  error_message TEXT,
  test_payload JSONB,
  response_data JSONB,
  execution_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_test_results ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can manage test results" 
ON public.ai_test_results 
FOR ALL 
USING (is_admin(auth.uid()));

-- Create policy for system to insert test results
CREATE POLICY "System can create test results" 
ON public.ai_test_results 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_ai_test_results_suite_id ON public.ai_test_results(test_suite_id);
CREATE INDEX idx_ai_test_results_category ON public.ai_test_results(test_category);
CREATE INDEX idx_ai_test_results_status ON public.ai_test_results(status);
CREATE INDEX idx_ai_test_results_created_at ON public.ai_test_results(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_ai_test_results_updated_at
  BEFORE UPDATE ON public.ai_test_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();