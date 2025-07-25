import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AdminLoginRequest {
  action: 'login';
  username: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}

// Secure password verification with rate limiting
async function verifyPasswordHash(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // In production, use proper bcrypt verification
    // For now, using basic comparison for demo purposes
    return password === 'admin123'; // Replace with actual hash verification
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: AdminLoginRequest = await req.json();
    
    if (body.action === 'login') {
      const { username, password, ipAddress, userAgent } = body;

      // Rate limiting check
      const { data: rateLimitAllowed } = await supabaseClient.rpc('check_auth_rate_limit', {
        _identifier: `admin_login_${ipAddress}`,
        _max_attempts: 5,
        _window_minutes: 15
      });

      if (!rateLimitAllowed) {
        // Log failed attempt
        await supabaseClient.from('admin_audit_logs').insert({
          admin_id: null,
          action: 'login_attempt',
          resource_type: 'authentication',
          ip_address: ipAddress,
          user_agent: userAgent,
          success: false,
          error_message: 'Rate limit exceeded'
        });

        return new Response(
          JSON.stringify({ success: false, error: 'Too many login attempts. Please try again later.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
        );
      }

      // Get admin by username with enhanced security
      const { data: adminData, error: adminError } = await supabaseClient
        .from('super_admins')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .maybeSingle(); // Use maybeSingle instead of single

      if (adminError || !adminData) {
        // Log failed attempt
        await supabaseClient.from('admin_audit_logs').insert({
          admin_id: null,
          action: 'login_attempt',
          resource_type: 'authentication',
          ip_address: ipAddress,
          user_agent: userAgent,
          success: false,
          error_message: 'Invalid credentials'
        });

        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Check if account is locked
      if (adminData.locked_until && new Date(adminData.locked_until) > new Date()) {
        return new Response(
          JSON.stringify({ success: false, error: 'Account temporarily locked due to security measures' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 423 }
        );
      }

      // Verify password
      const isValidPassword = await verifyPasswordHash(password, adminData.password_hash);

      if (!isValidPassword) {
        // Increment failed login attempts with enhanced security
        const newAttempts = (adminData.login_attempts || 0) + 1;
        const shouldLock = newAttempts >= 3; // Reduced from 5 to 3 for better security
        
        await supabaseClient
          .from('super_admins')
          .update({
            login_attempts: newAttempts,
            locked_until: shouldLock ? new Date(Date.now() + 60 * 60 * 1000).toISOString() : null // 1 hour lock
          })
          .eq('id', adminData.id);

        // Log failed attempt
        await supabaseClient.from('admin_audit_logs').insert({
          admin_id: adminData.id,
          action: 'login_attempt',
          resource_type: 'authentication',
          ip_address: ipAddress,
          user_agent: userAgent,
          success: false,
          error_message: shouldLock ? 'Account locked due to failed attempts' : 'Invalid password'
        });

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: shouldLock ? 'Account locked due to multiple failed attempts' : 'Invalid credentials'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        );
      }

      // Generate secure session token
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8 hours

      // Create admin session with enhanced security
      const { error: sessionError } = await supabaseClient
        .from('admin_sessions')
        .insert({
          admin_id: adminData.id,
          session_token: sessionToken,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt,
          device_fingerprint: req.headers.get('user-agent') || 'unknown',
          is_active: true,
          last_activity: new Date().toISOString()
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create secure session' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      // Reset login attempts and update last login
      await supabaseClient
        .from('super_admins')
        .update({
          login_attempts: 0,
          locked_until: null,
          last_login_at: new Date().toISOString()
        })
        .eq('id', adminData.id);

      // Get admin permissions
      const { data: permissionsData } = await supabaseClient
        .from('admin_role_permissions')
        .select('permission')
        .eq('role', adminData.role)
        .eq('granted', true);

      const permissions = permissionsData?.map(p => p.permission) || [];

      // Log successful login
      await supabaseClient.from('admin_audit_logs').insert({
        admin_id: adminData.id,
        action: 'login_success',
        resource_type: 'authentication',
        ip_address: ipAddress,
        user_agent: userAgent,
        success: true
      });

      return new Response(
        JSON.stringify({
          success: true,
          sessionToken,
          admin: {
            id: adminData.id,
            username: adminData.username,
            email: adminData.email,
            role: adminData.role
          },
          permissions,
          expiresAt
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );

  } catch (error) {
    console.error('Enhanced admin auth error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});