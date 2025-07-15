-- Ensure onboarding_complete column exists and has proper default
ALTER TABLE public.profiles 
ALTER COLUMN onboarding_complete SET DEFAULT false;

-- Update any existing null values to false
UPDATE public.profiles 
SET onboarding_complete = false 
WHERE onboarding_complete IS NULL;