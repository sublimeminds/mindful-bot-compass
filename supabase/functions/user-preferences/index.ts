
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { action, ...params } = await req.json()

    switch (action) {
      case 'get_user_preferences':
        const { data: preferences } = await supabaseClient
          .from('user_preferences')
          .select('*')
          .eq('user_id', params.target_user_id || user.id)
          .single()

        return new Response(JSON.stringify([preferences]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'upsert_user_preferences':
        const { error } = await supabaseClient
          .from('user_preferences')
          .upsert({
            user_id: params.target_user_id || user.id,
            communication_style: params.communication_style,
            preferred_approaches: params.preferred_approaches,
            session_preferences: params.session_preferences,
            emotional_patterns: params.emotional_patterns,
            updated_at: new Date().toISOString()
          })

        return new Response(JSON.stringify({ success: !error }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'track_user_interaction':
        await supabaseClient
          .from('user_interactions')
          .insert({
            user_id: params.target_user_id || user.id,
            interaction_type: params.interaction_type,
            data: params.interaction_data,
            timestamp: new Date().toISOString()
          })

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'get_user_interactions':
        const { data: interactions } = await supabaseClient
          .from('user_interactions')
          .select('*')
          .eq('user_id', params.target_user_id || user.id)
          .order('timestamp', { ascending: false })

        return new Response(JSON.stringify(interactions), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
