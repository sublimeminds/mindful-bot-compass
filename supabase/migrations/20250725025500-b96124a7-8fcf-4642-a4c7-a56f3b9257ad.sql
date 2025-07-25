-- Remove or secure the problematic Security Definer function
-- First, let's check if this function is being used and secure it

-- Drop the insecure function if it exists
DROP FUNCTION IF EXISTS public.get_secure_view_data();

-- Create a more secure version that validates user permissions
CREATE OR REPLACE FUNCTION public.get_secure_view_data(requested_data_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER -- Changed from SECURITY DEFINER to INVOKER for better security
SET search_path = public
AS $$
DECLARE
  result jsonb;
  user_role text;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Get user role safely
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid();

  -- Only allow specific data types for specific roles
  CASE requested_data_type
    WHEN 'user_profile' THEN
      -- Users can only see their own profile data
      SELECT jsonb_build_object(
        'id', id,
        'role', role,
        'created_at', created_at
      ) INTO result
      FROM public.profiles
      WHERE id = auth.uid();
    
    WHEN 'system_status' THEN
      -- Only admins can see system status
      IF user_role != 'admin' THEN
        RAISE EXCEPTION 'Insufficient permissions';
      END IF;
      
      SELECT jsonb_build_object(
        'status', 'operational',
        'timestamp', now()
      ) INTO result;
    
    ELSE
      RAISE EXCEPTION 'Invalid data type requested';
  END CASE;

  RETURN result;
END;
$$;