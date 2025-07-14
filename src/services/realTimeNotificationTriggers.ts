import { supabase } from '@/integrations/supabase/client';
import { EliteNotificationService } from './eliteNotificationService';

export class RealTimeNotificationTriggers {
  
  // Trigger notification when user completes a therapy session
  static async onSessionComplete(userId: string, sessionData: any): Promise<void> {
    try {
      // Check if this is a milestone session (every 5th session)
      const { data: sessionCount } = await supabase
        .from('therapy_sessions')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

      const totalSessions = sessionCount?.length || 0;

      if (totalSessions > 0 && totalSessions % 5 === 0) {
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'milestone_achieved',
          '🎉 Session Milestone Reached!',
          `Congratulations! You've completed ${totalSessions} therapy sessions. Your commitment to mental health is inspiring.`,
          {
            priority: 'high',
            data: { 
              sessionCount: totalSessions,
              sessionType: sessionData.type || 'therapy',
              achievement: 'session_milestone'
            }
          }
        );
      } else {
        // Regular session completion notification
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'session_followup',
          'Great session today!',
          'How are you feeling after your session? Consider logging your mood or reflecting on what you learned.',
          {
            priority: 'medium',
            data: { 
              sessionId: sessionData.id,
              sessionType: sessionData.type || 'therapy'
            }
          }
        );
      }

      console.log('Session completion notification triggered for user:', userId);
    } catch (error) {
      console.error('Error triggering session completion notification:', error);
    }
  }

  // Trigger notification when user logs mood - check for concerning patterns
  static async onMoodLogged(userId: string, moodData: any): Promise<void> {
    try {
      const currentMood = moodData.overall;

      // Check recent mood trend (last 3 entries)
      const { data: recentMoods } = await supabase
        .from('mood_entries')
        .select('overall, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMoods && recentMoods.length >= 2) {
        const moodScores = recentMoods.map(m => m.overall);
        const isDecreasing = moodScores.every((score, index) => 
          index === 0 || score <= moodScores[index - 1]
        );

        // Trigger support notification for declining mood pattern
        if (isDecreasing && currentMood <= 3) {
          await EliteNotificationService.createIntelligentNotification(
            userId,
            'mood_check',
            'We\'re here to support you',
            'I noticed your mood has been challenging lately. Would you like to try a breathing exercise or talk to someone?',
            {
              priority: currentMood <= 2 ? 'high' : 'medium',
              data: {
                moodTrend: 'declining',
                currentMood,
                triggerReason: 'mood_pattern_detection'
              }
            }
          );
        }
        // Celebrate positive mood
        else if (currentMood >= 8) {
          await EliteNotificationService.createIntelligentNotification(
            userId,
            'streak_celebration',
            '✨ Feeling great today!',
            'It\'s wonderful to see you in a positive space. Keep up the great work on your mental health journey!',
            {
              priority: 'low',
              data: {
                moodScore: currentMood,
                triggerReason: 'positive_mood_celebration'
              }
            }
          );
        }
      }

      console.log('Mood-based notification processed for user:', userId);
    } catch (error) {
      console.error('Error processing mood notification:', error);
    }
  }

  // Trigger notifications for goal progress updates
  static async onGoalProgress(userId: string, goalData: any): Promise<void> {
    try {
      const progress = goalData.current_progress || 0;
      const goalId = goalData.id;

      // Goal completion celebration
      if (progress >= 100) {
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'milestone_achieved',
          '🎯 Goal Achieved!',
          `Congratulations! You've completed "${goalData.title}". This is a significant step in your wellness journey.`,
          {
            priority: 'high',
            data: {
              goalId,
              goalTitle: goalData.title,
              completionDate: new Date().toISOString(),
              achievement: 'goal_completion'
            }
          }
        );
      }
      // Progress milestone notifications (25%, 50%, 75%)
      else if (progress >= 25 && progress < 30) {
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'goal_progress',
          'Quarter way there! 💪',
          `You're making great progress on "${goalData.title}". Keep up the momentum!`,
          {
            priority: 'medium',
            data: { goalId, progress, milestone: '25%' }
          }
        );
      } else if (progress >= 50 && progress < 55) {
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'goal_progress',
          'Halfway milestone reached! 🌟',
          `Amazing! You're 50% complete with "${goalData.title}". You're doing fantastic!`,
          {
            priority: 'medium',
            data: { goalId, progress, milestone: '50%' }
          }
        );
      } else if (progress >= 75 && progress < 80) {
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'goal_progress',
          'Almost there! 🚀',
          `You're 75% done with "${goalData.title}". The finish line is in sight!`,
          {
            priority: 'medium',
            data: { goalId, progress, milestone: '75%' }
          }
        );
      }

      console.log('Goal progress notification triggered for user:', userId);
    } catch (error) {
      console.error('Error triggering goal progress notification:', error);
    }
  }

  // Detect inactivity and send gentle reminders
  static async checkUserInactivity(): Promise<void> {
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Find users who haven't had sessions in 3+ days
      const { data: inactiveUsers } = await supabase
        .from('profiles')
        .select(`
          id, 
          name
        `)
        .limit(50);

      if (!inactiveUsers) return;

      // Check each user's last session separately
      const inactiveUsersList = [];
      for (const profile of inactiveUsers) {
        const { data: lastSession } = await supabase
          .from('therapy_sessions')
          .select('created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!lastSession || new Date(lastSession.created_at) < threeDaysAgo) {
          inactiveUsersList.push({
            ...profile,
            lastSessionDate: lastSession?.created_at
          });
        }
      }

      for (const user of inactiveUsersList) {
        // Check if they've been inactive for a week (more urgent)
        const lastSession = user.lastSessionDate;
        const isLongInactive = lastSession && new Date(lastSession) < oneWeekAgo;

        await EliteNotificationService.createIntelligentNotification(
          user.id,
          'inactive_user',
          isLongInactive ? 'We miss you!' : 'Time for a check-in?',
          isLongInactive 
            ? 'It\'s been a while since your last session. Your mental health journey is important - let\'s get back on track together.'
            : 'How are you doing? A quick therapy session can help maintain your wellness routine.',
          {
            priority: isLongInactive ? 'medium' : 'low',
            data: {
              daysSinceLastSession: lastSession ? Math.floor((Date.now() - new Date(lastSession).getTime()) / (1000 * 60 * 60 * 24)) : 30,
              reminderType: 'inactivity'
            }
          }
        );
      }

      console.log('Inactivity check completed');
    } catch (error) {
      console.error('Error checking user inactivity:', error);
    }
  }

  // Trigger breathing exercise reminders during stressful patterns
  static async triggerBreathingReminder(userId: string, context?: any): Promise<void> {
    try {
      await EliteNotificationService.createIntelligentNotification(
        userId,
        'breathing_reminder',
        'Take a moment to breathe 🌸',
        'It looks like you might benefit from a quick breathing exercise. Just a few minutes can help center your mind.',
        {
          priority: 'medium',
          data: {
            triggerContext: context,
            exerciseType: 'basic_breathing',
            reminderSource: 'stress_detection'
          }
        }
      );

      console.log('Breathing reminder triggered for user:', userId);
    } catch (error) {
      console.error('Error triggering breathing reminder:', error);
    }
  }

  // Crisis detection and immediate intervention
  static async detectCrisisSignals(userId: string, messageContent?: string): Promise<void> {
    try {
      const crisisKeywords = [
        'suicide', 'kill myself', 'end it all', 'want to die', 'no point',
        'hopeless', 'worthless', 'hate myself', 'giving up', 'cant go on',
        'self harm', 'hurt myself', 'cutting', 'overdose', 'no way out'
      ];

      let riskScore = 0;
      let indicators: string[] = [];

      // Check message content for crisis keywords
      if (messageContent) {
        const content = messageContent.toLowerCase();
        crisisKeywords.forEach(keyword => {
          if (content.includes(keyword)) {
            riskScore += 10;
            indicators.push(`keyword: ${keyword}`);
          }
        });
      }

      // Check recent mood entries for severe patterns
      const { data: recentMoods } = await supabase
        .from('mood_entries')
        .select('overall')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (recentMoods) {
        const avgMood = recentMoods.reduce((sum, m) => sum + m.overall, 0) / recentMoods.length;
        if (avgMood <= 2) {
          riskScore += 5;
          indicators.push('severe mood decline');
        }
      }

      // Trigger crisis intervention if risk score is high
      if (riskScore >= 10) {
        await EliteNotificationService.createIntelligentNotification(
          userId,
          'crisis_detected',
          '🆘 Immediate Support Available',
          'We\'re concerned about you and want to help. Crisis support is available 24/7. You don\'t have to go through this alone.',
          {
            priority: 'high',
            data: {
              riskScore,
              indicators,
              crisisLevel: riskScore >= 20 ? 'severe' : 'moderate',
              emergencyContacts: true
            }
          }
        );

        // Log crisis intervention
        await supabase
          .from('crisis_assessments')
          .insert({
            user_id: userId,
            assessment_type: 'automated_detection',
            risk_level: riskScore >= 20 ? 'severe' : 'moderate',
            responses: { automated_triggers: indicators, risk_score: riskScore },
            status: 'detected',
            severity_indicators: indicators
          });

        console.log('CRISIS INTERVENTION triggered for user:', userId, 'Risk score:', riskScore);
      }
    } catch (error) {
      console.error('Error in crisis detection:', error);
    }
  }

  // Initialize notification triggers for new users
  static async initializeForNewUser(userId: string): Promise<void> {
    try {
      // Welcome notification
      await EliteNotificationService.createIntelligentNotification(
        userId,
        'new_content',
        'Welcome to your mental health journey! 🌱',
        'We\'re here to support you every step of the way. Start with a quick mood check-in or explore our therapy sessions.',
        {
          priority: 'medium',
          data: { 
            userType: 'new',
            onboardingStep: 'welcome'
          }
        }
      );

      // Schedule first session reminder for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0); // 10 AM next day

      await EliteNotificationService.createIntelligentNotification(
        userId,
        'session_reminder',
        'Ready for your first session?',
        'Taking the first step is often the hardest. Your first therapy session awaits whenever you\'re ready.',
        {
          priority: 'medium',
          scheduledFor: tomorrow,
          data: { 
            sessionType: 'first_session',
            onboarding: true
          }
        }
      );

      console.log('New user notifications initialized for:', userId);
    } catch (error) {
      console.error('Error initializing new user notifications:', error);
    }
  }
}