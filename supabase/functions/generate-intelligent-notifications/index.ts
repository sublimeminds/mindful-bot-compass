
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

    const body = await req.json().catch(() => ({}))
    const source = body.source || 'manual'

    console.log(`Running intelligent notification generation... Source: ${source}`)

    const results = {
      inactiveUsers: 0,
      weeklyReports: 0,
      sessionReminders: 0,
      streakReminders: 0,
      dailySummaries: 0
    }

    // Always check for inactive users (haven't had a session in 3+ days)
    results.inactiveUsers = await checkInactiveUsers(supabaseClient)

    // Generate daily summaries if requested or if it's morning
    const currentHour = new Date().getHours()
    if (source === 'daily_summary' || currentHour === 9) {
      results.dailySummaries = await generateDailySummaries(supabaseClient)
    }

    // Generate weekly progress reports (run on Sundays)
    const today = new Date()
    if (today.getDay() === 0) { // Sunday
      results.weeklyReports = await generateWeeklyReports(supabaseClient)
    }

    // Generate session reminders for users who typically session at this time
    results.sessionReminders = await generateSessionReminders(supabaseClient)

    // Check for streak maintenance reminders
    results.streakReminders = await generateStreakReminders(supabaseClient)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Intelligent notifications generated',
        source,
        results
      }),
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

async function checkInactiveUsers(supabase: any): Promise<number> {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name')

  if (error) {
    console.error('Error fetching profiles:', error)
    return 0
  }

  let count = 0
  for (const profile of profiles || []) {
    const { data: recentSessions } = await supabase
      .from('therapy_sessions')
      .select('start_time')
      .eq('user_id', profile.id)
      .gte('start_time', threeDaysAgo.toISOString())
      .limit(1)

    if (!recentSessions || recentSessions.length === 0) {
      // Check if we already sent a reminder recently to avoid spam
      const { data: recentReminders } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', profile.id)
        .eq('type', 'session_reminder')
        .gte('created_at', threeDaysAgo.toISOString())

      if (!recentReminders || recentReminders.length === 0) {
        await supabase
          .from('notifications')
          .insert({
            user_id: profile.id,
            type: 'session_reminder',
            title: 'We miss you! 💙',
            message: "It's been a few days since your last session. Even a few minutes of self-care can make a difference.",
            priority: 'medium'
          })
        count++
      }
    }
  }
  
  return count
}

async function generateDailySummaries(supabase: any): Promise<number> {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name')

  let count = 0
  for (const profile of profiles || []) {
    const { data: sessions } = await supabase
      .from('therapy_sessions')
      .select('mood_before, mood_after, techniques, start_time')
      .eq('user_id', profile.id)
      .gte('start_time', yesterday.toISOString())
      .lt('start_time', today.toISOString())

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
          title: 'Yesterday\'s Progress 📊',
          message: `You completed ${sessions.length} session${sessions.length > 1 ? 's' : ''} yesterday${avgImprovement > 0 ? ` with an average mood improvement of ${avgImprovement} points` : ''}. Great work!`,
          priority: 'low',
          data: { sessionsYesterday: sessions.length, avgMoodImprovement: avgImprovement, date: yesterday.toISOString() }
        })
      count++
    }
  }

  return count
}

async function generateWeeklyReports(supabase: any): Promise<number> {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name')

  if (error) return 0

  let count = 0
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
      count++
    }
  }

  return count
}

async function generateSessionReminders(supabase: any): Promise<number> {
  const now = new Date()
  const currentHour = now.getHours()

  // Send reminders during typical therapy hours (9 AM, 1 PM, 6 PM)
  if (![9, 13, 18].includes(currentHour)) {
    return 0
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name')

  let count = 0
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
        count++
      }
    }
  }

  return count
}

async function generateStreakReminders(supabase: any): Promise<number> {
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, name')

  let count = 0
  for (const profile of profiles || []) {
    // Get recent sessions to calculate streak
    const { data: sessions } = await supabase
      .from('therapy_sessions')
      .select('start_time')
      .eq('user_id', profile.id)
      .order('start_time', { ascending: false })
      .limit(14) // Last 2 weeks

    if (sessions && sessions.length > 0) {
      const streak = calculateStreak(sessions)
      
      // Send streak maintenance reminder for users with 3+ day streaks who haven't sessioned today
      if (streak >= 3) {
        const today = new Date().toDateString()
        const lastSession = new Date(sessions[0].start_time).toDateString()
        
        if (lastSession !== today) {
          await supabase
            .from('notifications')
            .insert({
              user_id: profile.id,
              type: 'session_reminder',
              title: `🔥 Don't Break Your ${streak}-Day Streak!`,
              message: `You've built an amazing ${streak}-day therapy streak. A quick session today will keep your momentum going!`,
              priority: 'medium',
              data: { currentStreak: streak }
            })
          count++
        }
      }
    }
  }

  return count
}

function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0

  let streak = 0
  let currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)

  for (const session of sessions) {
    const sessionDate = new Date(session.start_time)
    sessionDate.setHours(0, 0, 0, 0)

    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff === streak) {
      streak++
    } else if (daysDiff === streak + 1) {
      // Allow for one day gap
      streak++
    } else {
      break
    }
  }

  return streak
}
