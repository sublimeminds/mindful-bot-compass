import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Crisis keywords for detection
const crisisKeywords = [
  'suicide', 'kill myself', 'end it all', 'want to die', 'no point',
  'hopeless', 'worthless', 'hate myself', 'giving up', 'cant go on',
  'self harm', 'hurt myself', 'cutting', 'overdose'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Starting intelligent notification generation...');

    // Get active users (logged in within last 30 days)
    const { data: activeUsers } = await supabaseClient
      .from('profiles')
      .select('id, email, name')
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (!activeUsers || activeUsers.length === 0) {
      console.log('No active users found');
      return new Response(JSON.stringify({ message: 'No active users found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    let totalNotifications = 0;
    let crisisInterventions = 0;

    // Process each user
    for (const user of activeUsers) {
      try {
        const notifications = await processUserTriggers(supabaseClient, user.id);
        totalNotifications += notifications.count;
        crisisInterventions += notifications.crisisCount;

        // Small delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      }
    }

    console.log(`Completed processing ${activeUsers.length} users`);
    console.log(`Generated ${totalNotifications} notifications`);
    console.log(`Triggered ${crisisInterventions} crisis interventions`);

    return new Response(JSON.stringify({
      success: true,
      usersProcessed: activeUsers.length,
      notificationsGenerated: totalNotifications,
      crisisInterventions: crisisInterventions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in intelligent notifications:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function processUserTriggers(supabase: any, userId: string) {
  let notificationCount = 0;
  let crisisCount = 0;

  // 1. Check session gap (haven't had session in 3+ days)
  const sessionGapCheck = await checkSessionGap(supabase, userId);
  if (sessionGapCheck.shouldTrigger) {
    await createNotification(supabase, userId, {
      type: 'session_reminder',
      title: 'Time for a Check-in',
      message: 'It\'s been a few days since your last therapy session. How are you feeling today?',
      priority: 'medium'
    });
    notificationCount++;
  }

  // 2. Check mood decline pattern
  const moodCheck = await checkMoodDecline(supabase, userId);
  if (moodCheck.shouldTrigger) {
    const severity = moodCheck.severity || 'medium';
    await createNotification(supabase, userId, {
      type: 'mood_check',
      title: 'We\'re Here to Support You',
      message: 'I noticed your mood has been challenging lately. Would you like to talk or try a mindfulness exercise?',
      priority: severity === 'critical' ? 'high' : 'medium'
    });
    notificationCount++;

    if (severity === 'critical') {
      await triggerCrisisIntervention(supabase, userId, 'mood_decline');
      crisisCount++;
    }
  }

  // 3. Check goal stagnation
  const goalCheck = await checkGoalStagnation(supabase, userId);
  if (goalCheck.shouldTrigger) {
    await createNotification(supabase, userId, {
      type: 'goal_motivation',
      title: 'Let\'s Keep Moving Forward',
      message: 'Your wellness goals are waiting for you. Even small steps count toward big changes.',
      priority: 'medium'
    });
    notificationCount++;
  }

  // 4. Check for crisis indicators in recent messages
  const crisisCheck = await checkCrisisIndicators(supabase, userId);
  if (crisisCheck.shouldTrigger) {
    await createNotification(supabase, userId, {
      type: 'crisis_support',
      title: 'Support is Available',
      message: 'We noticed you might be going through a difficult time. You\'re not alone - immediate support is available.',
      priority: 'high'
    });
    await triggerCrisisIntervention(supabase, userId, 'keyword_detection');
    notificationCount++;
    crisisCount++;
  }

  return { count: notificationCount, crisisCount };
}

async function checkSessionGap(supabase: any, userId: string) {
  const { data: lastSession } = await supabase
    .from('therapy_sessions')
    .select('created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastSession) return { shouldTrigger: true }; // No sessions yet

  const daysSinceLastSession = Math.floor(
    (Date.now() - new Date(lastSession.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return { shouldTrigger: daysSinceLastSession >= 3 };
}

async function checkMoodDecline(supabase: any, userId: string) {
  const { data: recentMoods } = await supabase
    .from('mood_entries')
    .select('overall, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!recentMoods || recentMoods.length < 3) return { shouldTrigger: false };

  // Check for severe mood drop
  const latestMood = recentMoods[0].overall;
  const avgPreviousMoods = recentMoods.slice(1, 4).reduce((sum: number, m: any) => sum + m.overall, 0) / 3;

  if (latestMood <= 2 && avgPreviousMoods - latestMood >= 3) {
    return { 
      shouldTrigger: true,
      severity: latestMood === 1 ? 'critical' : 'high'
    };
  }

  // Check for consistent low mood
  const consistentlyLow = recentMoods.slice(0, 3).every((m: any) => m.overall <= 2);
  return { 
    shouldTrigger: consistentlyLow,
    severity: 'medium'
  };
}

async function checkGoalStagnation(supabase: any, userId: string) {
  const { data: goals } = await supabase
    .from('goals')
    .select('id, updated_at, current_progress')
    .eq('user_id', userId)
    .eq('is_completed', false);

  if (!goals || goals.length === 0) return { shouldTrigger: false };

  const stagnantGoals = goals.filter((goal: any) => {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(goal.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceUpdate >= 7 && goal.current_progress < 100;
  });

  return { shouldTrigger: stagnantGoals.length > 0 };
}

async function checkCrisisIndicators(supabase: any, userId: string) {
  // Check WhatsApp messages for crisis keywords
  const { data: messages } = await supabase
    .from('whatsapp_messages')
    .select('content, timestamp')
    .eq('user_id', userId)
    .eq('sender_type', 'user')
    .order('timestamp', { ascending: false })
    .limit(10);

  if (!messages) return { shouldTrigger: false };

  for (const message of messages) {
    const content = message.content.toLowerCase();
    const hasCrisis = crisisKeywords.some(keyword => content.includes(keyword));
    
    if (hasCrisis) {
      return { shouldTrigger: true };
    }
  }

  return { shouldTrigger: false };
}

async function createNotification(supabase: any, userId: string, notification: any) {
  // Check cooldown to prevent spam
  const cooldownHours = getCooldownHours(notification.type);
  const { data: recent } = await supabase
    .from('notifications')
    .select('created_at')
    .eq('user_id', userId)
    .eq('type', notification.type)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent) {
    const hoursSinceLastNotification = Math.floor(
      (Date.now() - new Date(recent.created_at).getTime()) / (1000 * 60 * 60)
    );
    
    if (hoursSinceLastNotification < cooldownHours) {
      console.log(`Skipping ${notification.type} notification for user ${userId} - still in cooldown`);
      return;
    }
  }

  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      priority: notification.priority,
      data: {
        automated: true,
        timestamp: new Date().toISOString()
      }
    });

  console.log(`Created ${notification.type} notification for user ${userId}`);
}

async function triggerCrisisIntervention(supabase: any, userId: string, reason: string) {
  await supabase
    .from('crisis_interventions')
    .insert({
      user_id: userId,
      intervention_type: 'automated_detection',
      status: 'pending',
      reason: reason,
      intervention_data: {
        triggered_by: 'intelligent_notifications',
        timestamp: new Date().toISOString(),
        automated: true
      }
    });

  console.log(`CRISIS INTERVENTION triggered for user ${userId} - reason: ${reason}`);
}

function getCooldownHours(notificationType: string): number {
  switch (notificationType) {
    case 'crisis_support': return 1;
    case 'mood_check': return 12;
    case 'session_reminder': return 24;
    case 'goal_motivation': return 48;
    default: return 24;
  }
}