
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Running intelligent notification generation...')

    // Check for inactive users (haven't had a session in 3+ days)
    await checkInactiveUsers(supabaseClient)

    // Generate weekly progress reports (run on Sundays)
    const today = new Date()
    if (today.getDay() === 0) { // Sunday
      await generateWeeklyReports(supabaseClient)
    }

    // Generate session reminders for users who typically session at this time
    await generateSessionReminders(supabaseClient)

    return new Response(
      JSON.stringify({ success: true, message: 'Intelligent notifications generated' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error generating notifications:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function checkInactiveUsers(supabase: any) {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  // Get users who haven't had a session recently
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name')

  if (error) {
    console.error('Error fetching profiles:', error)
    return
  }

  for (const profile of profiles || []) {
    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('start_time')
      .eq('user_id', profile.id)
      .gte('start_time', threeDaysAgo.toISOString())
      .limit(1)

    // If no recent sessions, create a gentle reminder
    if (!recentSessions || recentSessions.length === 0) {
      await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'session_reminder',
          title: 'We miss you! 💙',
          message: "It's been a few days since your last session. Even a few minutes of self-care can make a difference.",
          priority: 'medium'
        })
    }
  }
}

async function generateWeeklyReports(supabase: any) {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name')

  if (error) return

  for (const profile of profiles || []) {
    const { data: sessions } = await supabase
      .from('therapy_sessions')
      .select('mood_before, mood_after, techniques')
      .eq('user_id', profile.id)
      .gte('start_time', oneWeekAgo.toISOString())

    if (sessions && sessions.length > 0) {
      const moodImprovements = sessions
        .filter(s => s.mood_before && s.mood_after)
        .map(s => s.mood_after - s.mood_before)

      const avgImprovement = moodImprovements.length > 0
        ? Math.round((moodImprovements.reduce((sum, imp) => sum + imp, 0) / moodImprovements.length) * 10) / 10
        : 0

      await supabase
        .from('notifications')
        .insert({
          user_id: profile.id,
          type: 'progress_update',
          title: 'Weekly Progress Report 📊',
          message: `This week you completed ${sessions.length} sessions with an average mood improvement of ${avgImprovement}. Keep up the great work!`,
          priority: 'low',
          data: { sessionsThisWeek: sessions.length, avgMoodImprovement: avgImprovement }
        })
    }
  }
}

async function generateSessionReminders(supabase: any) {
  const now = new Date()
  const currentHour = now.getHours()

  // Send reminders during typical therapy hours (9 AM, 1 PM, 6 PM)
  if ([9, 13, 18].includes(currentHour)) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')

    for (const profile of profiles || []) {
      // Check if user typically sessions around this time
      const { data: historicalSessions } = await supabase
        .from('therapy_sessions')
        .select('start_time')
        .eq('user_id', profile.id)
        .limit(20)

      const sessionsAtThisHour = historicalSessions?.filter(session => {
        const sessionHour = new Date(session.start_time).getHours()
        return Math.abs(sessionHour - currentHour) <= 1
      }) || []

      // If user often sessions around this time, send a gentle reminder
      if (sessionsAtThisHour.length >= 3) {
        // Check if they already had a session today
        const today = new Date().toDateString()
        const { data: todaySessions } = await supabase
          .from('therapy_sessions')
          .select('id')
          .eq('user_id', profile.id)
          .gte('start_time', new Date(today).toISOString())

        if (!todaySessions || todaySessions.length === 0) {
          await supabase
            .from('notifications')
            .insert({
              user_id: profile.id,
              type: 'session_reminder',
              title: 'Perfect Time for Self-Care 🌟',
              message: "This is usually when you take time for yourself. Ready for a quick therapy session?",
              priority: 'medium'
            })
        }
      }
    }
  }
}
