import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SecurityValidationRequest {
  action: 'validate_input' | 'check_rate_limit' | 'detect_suspicious_activity';
  data: any;
  identifier?: string;
  ipAddress?: string;
  userAgent?: string;
}

// Rate limiting storage
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { action, data, identifier, ipAddress, userAgent }: SecurityValidationRequest = await req.json();

    // Input validation
    if (!action || !data) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    switch (action) {
      case 'validate_input': {
        // Sanitize and validate input data
        const sanitized = sanitizeInput(data);
        const validation = validateInput(sanitized);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            sanitized,
            isValid: validation.isValid,
            errors: validation.errors
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'check_rate_limit': {
        if (!identifier) {
          return new Response(
            JSON.stringify({ success: false, error: 'Identifier required for rate limiting' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          );
        }

        const allowed = checkRateLimit(identifier, data.maxRequests || 10, data.windowMs || 60000);
        
        // Log rate limit events
        if (!allowed && ipAddress) {
          await supabaseClient
            .from('security_incidents')
            .insert({
              incident_type: 'rate_limit_exceeded',
              severity: 'medium',
              description: `Rate limit exceeded for ${identifier}`,
              detection_method: 'automated_validation',
              metadata: { identifier, ipAddress, userAgent, timestamp: new Date().toISOString() }
            });
        }

        return new Response(
          JSON.stringify({ success: true, allowed }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'detect_suspicious_activity': {
        const suspicious = detectSuspiciousPatterns(data, ipAddress, userAgent);
        
        if (suspicious.score > 0.7) {
          // Log high-risk activity
          await supabaseClient
            .from('security_incidents')
            .insert({
              incident_type: 'suspicious_activity',
              severity: suspicious.score > 0.9 ? 'critical' : 'high',
              description: `Suspicious activity detected: ${suspicious.reasons.join(', ')}`,
              detection_method: 'automated_validation',
              metadata: { 
                suspiciousScore: suspicious.score,
                reasons: suspicious.reasons,
                ipAddress, 
                userAgent, 
                timestamp: new Date().toISOString() 
              }
            });
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            suspicious: suspicious.score > 0.5,
            score: suspicious.score,
            reasons: suspicious.reasons
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid action' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

  } catch (error) {
    console.error('Security validation error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    return input
      .replace(/[<>]/g, '') // Remove potential script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[sanitizeInput(key)] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

function validateInput(input: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof input === 'string') {
    if (input.length > 10000) {
      errors.push('Input too long');
    }
    if (/[<>]/.test(input)) {
      errors.push('Invalid characters detected');
    }
  }
  
  return { isValid: errors.length === 0, errors };
}

function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const stored = rateLimitStore.get(identifier);
  
  if (!stored || now > stored.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (stored.count >= maxRequests) {
    return false;
  }
  
  stored.count++;
  return true;
}

function detectSuspiciousPatterns(data: any, ipAddress?: string, userAgent?: string): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  
  // Check for SQL injection patterns
  const sqlPatterns = /(\bunion\b|\bselect\b|\binsert\b|\bdelete\b|\bdrop\b|\bupdate\b|\bexec\b)/gi;
  if (typeof data === 'string' && sqlPatterns.test(data)) {
    reasons.push('Potential SQL injection');
    score += 0.8;
  }
  
  // Check for XSS patterns
  const xssPatterns = /<script|javascript:|onerror=|onload=/gi;
  if (typeof data === 'string' && xssPatterns.test(data)) {
    reasons.push('Potential XSS attack');
    score += 0.9;
  }
  
  // Check for suspicious user agents
  if (userAgent) {
    const suspiciousAgents = /bot|crawler|spider|scraper|automation/gi;
    if (suspiciousAgents.test(userAgent)) {
      reasons.push('Suspicious user agent');
      score += 0.3;
    }
  }
  
  // Check for rapid requests (basic pattern)
  if (data?.timestamp) {
    const requestTime = new Date(data.timestamp).getTime();
    const now = Date.now();
    if (now - requestTime < 100) { // Less than 100ms between requests
      reasons.push('Rapid request pattern');
      score += 0.4;
    }
  }
  
  return { score: Math.min(score, 1), reasons };
}