-- Add missing compatibility_scores column to therapist_assessments table
ALTER TABLE therapist_assessments 
ADD COLUMN IF NOT EXISTS compatibility_scores JSONB DEFAULT '{}';

-- Add missing completed_at column to therapist_assessments table  
ALTER TABLE therapist_assessments
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE NULL;