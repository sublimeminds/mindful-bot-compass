import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const userId = url.searchParams.get('user_id')
    const timezone = url.searchParams.get('timezone') || 'UTC'

    if (!userId) {
      return new Response('User ID required', { 
        status: 400, 
        headers: corsHeaders 
      })
    }

    // Get user's therapy sessions
    const { data: sessions, error } = await supabaseClient
      .from('therapy_sessions')
      .select(`
        id,
        user_id,
        start_time,
        end_time,
        session_type,
        therapist_id,
        status,
        notes
      `)
      .eq('user_id', userId)
      .gte('start_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .lte('start_time', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()) // Next year
      .order('start_time', { ascending: true })

    if (error) throw error

    // Get user's goals with deadlines
    const { data: goals } = await supabaseClient
      .from('goals')
      .select('id, title, description, target_date, status')
      .eq('user_id', userId)
      .not('target_date', 'is', null)
      .gte('target_date', new Date().toISOString().split('T')[0])

    // Generate iCal content
    const icalContent = generateICalendar({
      sessions: sessions || [],
      goals: goals || [],
      timezone,
      userId
    })

    return new Response(icalContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="therapysync-calendar.ics"'
      }
    })

  } catch (error) {
    console.error('Error generating iCal:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

function generateICalendar({ sessions, goals, timezone, userId }: any) {
  const now = new Date()
  const timestamp = formatICalDate(now)
  
  let ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TherapySync//TherapySync Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:TherapySync - Therapy & Wellness',
    'X-WR-CALDESC:Your personalized therapy sessions and wellness goals',
    `X-WR-TIMEZONE:${timezone}`
  ]

  // Add therapy sessions
  sessions.forEach((session: any) => {
    const startTime = new Date(session.start_time)
    const endTime = session.end_time ? new Date(session.end_time) : new Date(startTime.getTime() + 60 * 60 * 1000) // Default 1 hour
    
    ical.push(
      'BEGIN:VEVENT',
      `UID:therapysync-session-${session.id}@therapysync.ai`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${formatICalDate(startTime)}`,
      `DTEND:${formatICalDate(endTime)}`,
      `SUMMARY:${escapeICalText(`Therapy Session - ${session.session_type || 'General'}`)}`,
      `DESCRIPTION:${escapeICalText(generateSessionDescription(session))}`,
      'CATEGORIES:Therapy,Mental Health,Wellness',
      'STATUS:CONFIRMED',
      `TRANSP:${session.status === 'completed' ? 'TRANSPARENT' : 'OPAQUE'}`,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Therapy session starting in 15 minutes',
      'TRIGGER:-PT15M',
      'END:VALARM',
      'END:VEVENT'
    )
  })

  // Add goal deadlines
  goals.forEach((goal: any) => {
    const targetDate = new Date(goal.target_date + 'T09:00:00Z') // Default to 9 AM UTC
    
    ical.push(
      'BEGIN:VEVENT',
      `UID:therapysync-goal-${goal.id}@therapysync.ai`,
      `DTSTAMP:${timestamp}`,
      `DTSTART;VALUE=DATE:${formatICalDateOnly(targetDate)}`,
      `SUMMARY:${escapeICalText(`Goal Deadline: ${goal.title}`)}`,
      `DESCRIPTION:${escapeICalText(goal.description || 'Reach your wellness goal')}`,
      'CATEGORIES:Goals,Wellness,Self-Improvement',
      'STATUS:TENTATIVE',
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Goal deadline approaching',
      'TRIGGER:-P1D', // 1 day before
      'END:VALARM',
      'END:VEVENT'
    )
  })

  // Add weekly wellness check-in reminder
  const nextMonday = getNextMonday()
  for (let i = 0; i < 52; i++) { // Add for next year
    const checkInDate = new Date(nextMonday.getTime() + i * 7 * 24 * 60 * 60 * 1000)
    
    ical.push(
      'BEGIN:VEVENT',
      `UID:therapysync-checkin-${checkInDate.getTime()}@therapysync.ai`,
      `DTSTAMP:${timestamp}`,
      `DTSTART:${formatICalDate(checkInDate)}`,
      `DTEND:${formatICalDate(new Date(checkInDate.getTime() + 30 * 60 * 1000))}`, // 30 minutes
      'SUMMARY:Weekly Wellness Check-in',
      'DESCRIPTION:Take a moment to reflect on your mental health and progress this week',
      'CATEGORIES:Wellness,Self-Care,Reflection',
      'STATUS:TENTATIVE',
      'RRULE:FREQ=WEEKLY;BYDAY=MO',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      'DESCRIPTION:Time for your weekly wellness check-in',
      'TRIGGER:PT0M',
      'END:VALARM',
      'END:VEVENT'
    )
    break // Only add the first one, RRULE will handle recurrence
  }

  ical.push('END:VCALENDAR')
  
  return ical.join('\r\n')
}

function formatICalDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function formatICalDateOnly(date: Date): string {
  return date.toISOString().split('T')[0].replace(/-/g, '')
}

function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

function generateSessionDescription(session: any): string {
  let description = `Therapy session scheduled with TherapySync.`
  
  if (session.session_type) {
    description += `\n\nSession Type: ${session.session_type}`
  }
  
  if (session.therapist_id) {
    description += `\n\nYour AI therapist will be ready to support you.`
  }
  
  if (session.notes) {
    description += `\n\nNotes: ${session.notes}`
  }
  
  description += `\n\nPrepare by:\n- Finding a quiet, private space\n- Having water nearby\n- Taking a few deep breaths\n- Setting an intention for the session`
  
  return description
}

function getNextMonday(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek // If Sunday, 1 day. Otherwise, 8 - current day
  
  const nextMonday = new Date(now)
  nextMonday.setDate(now.getDate() + daysUntilMonday)
  nextMonday.setHours(10, 0, 0, 0) // 10 AM
  
  return nextMonday
}