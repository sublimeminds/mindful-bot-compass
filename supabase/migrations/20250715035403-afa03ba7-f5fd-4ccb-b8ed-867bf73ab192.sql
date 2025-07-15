-- Add missing unique constraint to user_country_preferences table
-- This will allow the ON CONFLICT clause in countryDetectionService to work properly

-- First check if the constraint already exists and create it if not
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'user_country_preferences_user_id_key'
    ) THEN
        ALTER TABLE public.user_country_preferences 
        ADD CONSTRAINT user_country_preferences_user_id_key UNIQUE (user_id);
    END IF;
END $$;