-- Add next_session_recommendations column to adaptive_learning_profiles table
ALTER TABLE public.adaptive_learning_profiles 
ADD COLUMN IF NOT EXISTS next_session_recommendations JSONB DEFAULT '{}';

-- Update existing records to have empty recommendations
UPDATE public.adaptive_learning_profiles 
SET next_session_recommendations = '{}' 
WHERE next_session_recommendations IS NULL;