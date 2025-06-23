
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, channel, message, workspace_id, notification_type } = await req.json();

    console.log('Slack webhook called with:', { action, channel, notification_type });

    switch (action) {
      case 'send_test_message':
        return await sendTestMessage(channel, message);
      
      case 'send_notification':
        return await sendNotification(channel, message, notification_type);
      
      case 'verify_webhook':
        return await verifyWebhook(req);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
    }

  } catch (error) {
    console.error('Error in slack-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function sendTestMessage(channel: string, message: string) {
  try {
    // Simulate Slack API call
    console.log(`Sending test message to channel ${channel}: ${message}`);
    
    // In a real implementation, you would use the Slack Web API
    // const response = await fetch('https://slack.com/api/chat.postMessage', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     channel: channel,
    //     text: message,
    //     username: 'Therapy Bot',
    //     icon_emoji: ':brain:'
    //   })
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test message sent successfully',
        channel: channel
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error sending test message:', error);
    throw error;
  }
}

async function sendNotification(channel: string, message: string, notificationType: string) {
  try {
    console.log(`Sending ${notificationType} notification to channel ${channel}`);
    
    // Format message based on notification type
    let formattedMessage = message;
    let emoji = ':bell:';
    
    switch (notificationType) {
      case 'session_reminders':
        emoji = ':calendar:';
        formattedMessage = `📅 Session Reminder: ${message}`;
        break;
        
      case 'crisis_alerts':
        emoji = ':warning:';
        formattedMessage = `🚨 Crisis Alert: ${message}`;
        break;
        
      case 'progress_updates':
        emoji = ':chart_with_upwards_trend:';
        formattedMessage = `📈 Progress Update: ${message}`;
        break;
        
      case 'milestone_celebrations':
        emoji = ':tada:';
        formattedMessage = `🎉 Milestone Achieved: ${message}`;
        break;
    }

    // In a real implementation, you would call Slack API here
    // const response = await fetch('https://slack.com/api/chat.postMessage', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     channel: channel,
    //     text: formattedMessage,
    //     username: 'Therapy Bot',
    //     icon_emoji: emoji
    //   })
    // });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification sent successfully',
        type: notificationType,
        channel: channel
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}

async function verifyWebhook(req: Request) {
  try {
    // Handle Slack webhook verification challenge
    const body = await req.json();
    
    if (body.challenge) {
      return new Response(body.challenge, {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error verifying webhook:', error);
    throw error;
  }
}
