import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'image/gif'
};

// 1x1 transparent GIF pixel
const pixel = new Uint8Array([
  0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x01, 0x00, 0x01, 0x00, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x21, 0xF9, 0x04, 0x01, 0x00, 0x00, 0x00, 0x00, 0x2C, 0x00, 0x00, 0x00, 0x00,
  0x01, 0x00, 0x01, 0x00, 0x00, 0x02, 0x02, 0x04, 0x01, 0x00, 0x3B
]);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const affiliateCode = url.searchParams.get('aff');
    const event = url.searchParams.get('event') || 'pageview';
    const timestamp = url.searchParams.get('t');
    const fingerprint = url.searchParams.get('fp');

    if (affiliateCode) {
      // Log tracking pixel hit
      console.log('Tracking pixel hit:', {
        affiliateCode,
        event,
        timestamp,
        fingerprint,
        userAgent: req.headers.get('user-agent'),
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
      });

      // Here you could store this data in analytics_events table
      // For now, we'll just log it as the main tracking happens via JS
    }

    // Return tracking pixel
    return new Response(pixel, {
      headers: {
        ...corsHeaders,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Tracking pixel error:', error);
    return new Response(pixel, { headers: corsHeaders });
  }
});