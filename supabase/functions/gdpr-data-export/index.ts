import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  requestId: string;
  exportType: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''))
    
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    if (req.method === 'POST') {
      const { requestId, exportType }: ExportRequest = await req.json()

      console.log(`Processing data export for user ${user.id}, request ${requestId}`)

      // Gather all user data
      const userData = await gatherUserData(supabaseClient, user.id)

      // Create export file
      const exportData = {
        exportDate: new Date().toISOString(),
        userId: user.id,
        exportType,
        data: userData,
        metadata: {
          requestId,
          totalRecords: Object.values(userData).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 1), 0),
          exportVersion: '1.0'
        }
      }

      const exportJson = JSON.stringify(exportData, null, 2)
      const fileName = `user-data-export-${user.id}-${Date.now()}.json`

      // Store in temporary storage (in production, use cloud storage)
      const blob = new Blob([exportJson], { type: 'application/json' })
      
      // Update export request status
      await supabaseClient
        .from('data_export_requests')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          file_size_bytes: blob.size,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        })
        .eq('id', requestId)

      console.log(`Data export completed for user ${user.id}`)

      return new Response(JSON.stringify({
        success: true,
        fileName,
        fileSize: blob.size,
        recordCount: exportData.metadata.totalRecords,
        downloadData: exportJson // In production, return download URL instead
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'GET') {
      // Get export requests for user
      const { data: requests } = await supabaseClient
        .from('data_export_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('requested_at', { ascending: false })

      return new Response(JSON.stringify(requests), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders })

  } catch (error) {
    console.error('Error in GDPR data export:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function gatherUserData(supabase: any, userId: string) {
  const userData: any = {}

  try {
    // Core profile data
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
    userData.profile = profile

    // Therapy sessions
    const { data: sessions } = await supabase.from('therapy_sessions').select('*').eq('user_id', userId)
    userData.therapy_sessions = sessions || []

    // Mood entries
    const { data: moods } = await supabase.from('mood_entries').select('*').eq('user_id', userId)
    userData.mood_entries = moods || []

    // Goals
    const { data: goals } = await supabase.from('goals').select('*').eq('user_id', userId)
    userData.goals = goals || []

    // Crisis assessments
    const { data: assessments } = await supabase.from('crisis_assessments').select('*').eq('user_id', userId)
    userData.crisis_assessments = assessments || []

    // Journal entries
    const { data: journals } = await supabase.from('journal_entries').select('*').eq('user_id', userId)
    userData.journal_entries = journals || []

    // Notifications
    const { data: notifications } = await supabase.from('notifications').select('*').eq('user_id', userId)
    userData.notifications = notifications || []

    // Emergency contacts
    const { data: contacts } = await supabase.from('emergency_contacts').select('*').eq('user_id', userId)
    userData.emergency_contacts = contacts || []

    // Privacy preferences
    const { data: privacy } = await supabase.from('privacy_preferences').select('*').eq('user_id', userId).single()
    userData.privacy_preferences = privacy

    // User consent records
    const { data: consent } = await supabase.from('user_consent').select('*').eq('user_id', userId)
    userData.consent_records = consent || []

    // Cultural profiles
    const { data: cultural } = await supabase.from('user_cultural_profiles').select('*').eq('user_id', userId)
    userData.cultural_profiles = cultural || []

    // Trauma history
    const { data: trauma } = await supabase.from('trauma_history').select('*').eq('user_id', userId)
    userData.trauma_history = trauma || []

    console.log(`Gathered data for user ${userId}: ${Object.keys(userData).length} categories`)
    
    return userData
  } catch (error) {
    console.error('Error gathering user data:', error)
    throw error
  }
}