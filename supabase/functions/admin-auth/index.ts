import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { hash, verify } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LoginRequest {
  action: 'login';
  username: string;
  password: string;
  ipAddress: string;
  userAgent: string;
}

// Secure password verification with proper hashing
async function verifyPasswordHash(password: string, hashedPassword: string): Promise<boolean> {
  try {
    if (hashedPassword.startsWith('$2')) {
      // Bcrypt hash
      return await verify(password, hashedPassword);
    }
    
    // For SHA-256 hashes (fallback for existing system)
    if (hashedPassword.length === 64) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex === hashedPassword;
    }
    
    // Reject any insecure dummy passwords
    if (hashedPassword.includes('dummy') || hashedPassword === 'admin123') {
      console.warn('Admin account using insecure password - update required');
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('Password verification failed:', error);
    return false;
  }
}

// Helper function to hash passwords securely
async function hashPassword(password: string): Promise<string> {
  try {
    // Use bcrypt for new password hashes
    return await hash(password, 12);
  } catch (error) {
    console.error('Password hashing failed:', error);
    throw error;
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

    const body: LoginRequest = await req.json();
    
    if (body.action === 'login') {
      const { username, password, ipAddress, userAgent } = body;

      // Get admin by username
      const { data: adminData, error: adminError } = await supabaseClient
        .from('super_admins')
        .select('*')
        .eq('username', username)
        .eq('is_active', true)
        .single();

      if (adminError || !adminData) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if account is locked
      if (adminData.locked_until && new Date(adminData.locked_until) > new Date()) {
        return new Response(
          JSON.stringify({ success: false, error: 'Account temporarily locked' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify password hash (remove hardcoded password)
      const isValidPassword = await verifyPasswordHash(password, adminData.password_hash);

      if (!isValidPassword) {
        // Increment failed login attempts
        const newAttempts = (adminData.login_attempts || 0) + 1;
        const shouldLock = newAttempts >= 5;
        
        await supabaseClient
          .from('super_admins')
          .update({
            login_attempts: newAttempts,
            locked_until: shouldLock ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null
          })
          .eq('id', adminData.id);

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: shouldLock ? 'Account locked due to multiple failed attempts' : 'Invalid credentials'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate session token
      const sessionToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Create admin session
      const { error: sessionError } = await supabaseClient
        .from('admin_sessions')
        .insert({
          admin_id: adminData.id,
          session_token: sessionToken,
          ip_address: ipAddress,
          user_agent: userAgent,
          expires_at: expiresAt,
          device_fingerprint: req.headers.get('user-agent') || 'unknown'
        });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to create session' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
      await supabaseClient
        .from('admin_audit_logs')
        .insert({
          admin_id: adminData.id,
          action: 'login',
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
          permissions
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Admin auth error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});