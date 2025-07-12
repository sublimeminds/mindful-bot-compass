import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define comprehensive TherapySync knowledge base
    const knowledgeBase = [
      {
        title: 'TherapySync Pricing Plans',
        description: 'Free Plan: Basic mood tracking, limited AI chat sessions, community access. Premium Plan ($19.99/month): Unlimited therapy sessions, advanced analytics, personalized therapy plans, crisis support, goal tracking. Enterprise Plan ($49.99/month): All premium features plus family accounts, priority support, advanced reporting.',
        category: 'pricing',
        content_type: 'reference',
        tags: ['pricing', 'plans', 'billing', 'subscription', 'features'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Therapy Session Types',
        description: 'Quick Chat: Fast AI support for immediate questions and light encouragement. Therapy Sessions: Structured 50-minute sessions with evidence-based approaches like CBT, DBT, mindfulness therapy. Crisis Support: 24/7 immediate support with crisis resources and professional intervention.',
        category: 'therapy',
        content_type: 'guide',
        tags: ['therapy', 'sessions', 'types', 'chat', 'crisis'],
        target_audience: ['new_users', 'existing_users'],
        is_published: true
      },
      {
        title: 'Getting Started with TherapySync',
        description: 'New users start with a comprehensive assessment to personalize their experience. Set up mood tracking, explore therapy approaches (CBT, DBT, mindfulness), create wellness goals, and choose between Quick Chat for daily support or full Therapy Sessions for structured care.',
        category: 'onboarding',
        content_type: 'guide',
        tags: ['getting_started', 'onboarding', 'assessment', 'setup'],
        target_audience: ['new_users'],
        is_published: true
      },
      {
        title: 'Platform Features Overview',
        description: 'Dashboard: Track mood trends, session progress, goal achievements. Therapy Hub: Access structured sessions and AI therapists. Quick Chat: Instant support with Alex AI. Goal Tracker: Set and monitor wellness objectives. Analytics: Detailed insights into mental health patterns. Crisis Resources: 24/7 support and emergency contacts.',
        category: 'platform',
        content_type: 'reference',
        tags: ['features', 'dashboard', 'navigation', 'tools'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Mood Tracking & Analytics',
        description: 'Daily mood tracking with detailed insights. Track patterns over time, identify triggers, and see progress correlations with therapy sessions. Advanced analytics show mood trends, goal progress, and therapy effectiveness metrics.',
        category: 'wellness',
        content_type: 'guide',
        tags: ['mood', 'tracking', 'analytics', 'insights', 'progress'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Crisis Support Resources',
        description: 'Immediate crisis support available 24/7. Call 988 (Suicide & Crisis Lifeline), text HOME to 741741 (Crisis Text Line), or use in-app crisis button for immediate professional intervention. Emergency contacts automatically notified when configured.',
        category: 'crisis',
        content_type: 'reference',
        tags: ['crisis', 'emergency', 'support', '988', 'hotline'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'AI Therapy Approaches',
        description: 'Cognitive Behavioral Therapy (CBT): Focus on thought patterns and behaviors. Dialectical Behavior Therapy (DBT): Emotion regulation and distress tolerance. Mindfulness-Based Therapy: Present-moment awareness and acceptance. Humanistic Therapy: Self-exploration and personal growth.',
        category: 'therapy',
        content_type: 'educational',
        tags: ['therapy', 'approaches', 'CBT', 'DBT', 'mindfulness', 'humanistic'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Goal Setting & Progress Tracking',
        description: 'Set SMART wellness goals (Specific, Measurable, Achievable, Relevant, Time-bound). Track daily progress, celebrate milestones, and adjust goals based on therapy insights. Integration with mood data and session analytics for comprehensive progress monitoring.',
        category: 'goals',
        content_type: 'guide',
        tags: ['goals', 'progress', 'tracking', 'SMART', 'milestones'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Privacy & Security',
        description: 'HIPAA-compliant platform with end-to-end encryption. Data stored securely, never shared without consent. Users control their data with export and deletion options. Anonymous mode available for sensitive conversations.',
        category: 'privacy',
        content_type: 'reference',
        tags: ['privacy', 'security', 'HIPAA', 'encryption', 'data'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Family & Enterprise Features',
        description: 'Family Plans: Multiple accounts under one subscription, shared progress insights (with permission), family crisis alerts. Enterprise: Custom branding, advanced admin controls, bulk user management, detailed reporting and analytics.',
        category: 'enterprise',
        content_type: 'reference',
        tags: ['family', 'enterprise', 'admin', 'bulk', 'reporting'],
        target_audience: ['families', 'organizations'],
        is_published: true
      },
      {
        title: 'Mobile App Features',
        description: 'Full-featured mobile apps for iOS and Android. Offline mood tracking, push notifications for sessions and check-ins, biometric login, voice-to-text for sessions, emergency button for crisis situations.',
        category: 'mobile',
        content_type: 'reference',
        tags: ['mobile', 'app', 'iOS', 'android', 'offline', 'notifications'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Integration Capabilities',
        description: 'Integrates with wearable devices (Apple Watch, Fitbit) for comprehensive wellness tracking. API available for healthcare providers. Export data to share with therapists or medical professionals.',
        category: 'integrations',
        content_type: 'reference',
        tags: ['integrations', 'wearables', 'API', 'export', 'healthcare'],
        target_audience: ['power_users', 'professionals'],
        is_published: true
      },
      {
        title: 'Account Management',
        description: 'Easy account setup with email or social login. Subscription management, billing history, and plan changes available in account settings. Data export and account deletion options for full user control.',
        category: 'account',
        content_type: 'guide',
        tags: ['account', 'login', 'subscription', 'billing', 'settings'],
        target_audience: ['all_users'],
        is_published: true
      },
      {
        title: 'Support & Help Resources',
        description: 'Comprehensive help center with tutorials and FAQs. Live chat support during business hours. Video guides for platform features. Community forums for peer support and tips.',
        category: 'support',
        content_type: 'reference',
        tags: ['support', 'help', 'tutorials', 'FAQs', 'community'],
        target_audience: ['all_users'],
        is_published: true
      }
    ];

    // Insert knowledge base entries
    for (const entry of knowledgeBase) {
      await supabase.from('content_library').upsert(entry);
    }

    console.log(`Knowledge base initialized with ${knowledgeBase.length} entries`);

    return new Response(JSON.stringify({
      success: true,
      message: `TherapySync knowledge base initialized with ${knowledgeBase.length} comprehensive entries`,
      categories: [...new Set(knowledgeBase.map(entry => entry.category))],
      total_entries: knowledgeBase.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error initializing knowledge base:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Knowledge base initialization failed',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});