-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Anyone can view therapist personalities" ON therapist_personalities;

-- Create a new policy that allows public access to view active therapist personalities
CREATE POLICY "Public can view active therapist personalities" 
ON therapist_personalities 
FOR SELECT 
USING (is_active = true);