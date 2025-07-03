import { supabase } from '@/integrations/supabase/client';

export interface OnboardingData {
  // Basic user info
  firstName?: string;
  lastName?: string;
  
  // Assessment data
  stressLevel?: number;
  anxietyLevel?: number;
  sleepQuality?: string;
  copingMechanisms?: string[];
  additionalNotes?: string;
  
  // Mental health screening
  phq9Score?: number;
  gad7Score?: number;
  riskLevel?: string;
  
  // Cultural preferences
  culturalPreferences?: {
    primaryLanguage: string;
    culturalBackground?: string;
    familyStructure: string;
    communicationStyle: string;
    religiousConsiderations: boolean;
    religiousDetails?: string;
    therapyApproachPreferences: string[];
    culturalSensitivities: string[];
  };
  
  // Therapist preferences
  selectedTherapistPersonality?: string;
  
  // Plan selection
  selectedPlan?: {
    id: string;
    name: string;
    price: number;
  };
  
  // Notification preferences
  notificationPreferences?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    dailyReminders: boolean;
    weeklyProgress: boolean;
    emergencyAlerts: boolean;
  };
}

class OnboardingService {
  async saveOnboardingData(userId: string, data: OnboardingData): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('OnboardingService: Saving onboarding data for user:', userId, data);

      // Get user's email for profile update
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user?.email;

      // Save to profiles table if we have basic info
      if (data.firstName || data.lastName) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
            onboarding_complete: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (profileError) {
          console.error('Profile save error:', profileError);
          return { success: false, error: profileError.message };
        }
      }

      // Save assessment data to user_onboarding table
      if (data.stressLevel || data.anxietyLevel || data.copingMechanisms) {
        const { error: onboardingError } = await supabase
          .from('user_onboarding')
          .upsert({
            user_id: userId,
            goals: [], // Will be populated later
            preferences: data.copingMechanisms || [],
            concerns: data.additionalNotes ? [data.additionalNotes] : []
          });

        if (onboardingError) {
          console.error('Onboarding save error:', onboardingError);
          return { success: false, error: onboardingError.message };
        }
      }

      // Save cultural preferences
      if (data.culturalPreferences) {
        const { error: culturalError } = await supabase
          .from('user_cultural_profiles')
          .upsert({
            user_id: userId,
            primary_language: data.culturalPreferences.primaryLanguage,
            cultural_background: data.culturalPreferences.culturalBackground,
            family_structure: data.culturalPreferences.familyStructure,
            communication_style: data.culturalPreferences.communicationStyle,
            religious_considerations: data.culturalPreferences.religiousConsiderations,
            religious_details: data.culturalPreferences.religiousDetails,
            therapy_approach_preferences: data.culturalPreferences.therapyApproachPreferences,
            cultural_sensitivities: data.culturalPreferences.culturalSensitivities,
            updated_at: new Date().toISOString()
          });

        if (culturalError) {
          console.error('Cultural profile save error:', culturalError);
          return { success: false, error: culturalError.message };
        }
      }

      // Save mental health screening results
      if (data.phq9Score !== undefined || data.gad7Score !== undefined) {
        const { error: assessmentError } = await supabase
          .from('clinical_assessments')
          .insert({
            user_id: userId,
            assessment_type: 'onboarding_screening',
            scores: {
              phq9: data.phq9Score,
              gad7: data.gad7Score,
              risk_level: data.riskLevel
            },
            administered_at: new Date().toISOString()
          });

        if (assessmentError) {
          console.error('Assessment save error:', assessmentError);
          return { success: false, error: assessmentError.message };
        }
      }

      // Save notification preferences
      if (data.notificationPreferences) {
        const { error: notificationError } = await supabase
          .from('notification_preferences')
          .upsert({
            user_id: userId,
            email_notifications: data.notificationPreferences.emailNotifications,
            push_notifications: data.notificationPreferences.pushNotifications,
            sms_notifications: data.notificationPreferences.smsNotifications,
            daily_reminders: data.notificationPreferences.dailyReminders,
            weekly_progress: data.notificationPreferences.weeklyProgress,
            emergency_alerts: data.notificationPreferences.emergencyAlerts,
            updated_at: new Date().toISOString()
          });

        if (notificationError) {
          console.error('Notification preferences save error:', notificationError);
          return { success: false, error: notificationError.message };
        }
      }

      // Save therapist preference
      if (data.selectedTherapistPersonality) {
        const { error: therapistError } = await supabase
          .from('therapeutic_relationship')
          .upsert({
            user_id: userId,
            therapist_id: data.selectedTherapistPersonality,
            communication_preferences: { personality_type: data.selectedTherapistPersonality },
            updated_at: new Date().toISOString()
          });

        if (therapistError) {
          console.error('Therapist preference save error:', therapistError);
          return { success: false, error: therapistError.message };
        }
      }

      console.log('OnboardingService: Successfully saved all onboarding data');
      return { success: true };

    } catch (error) {
      console.error('OnboardingService: Error saving data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async getOnboardingProgress(userId: string): Promise<{ completed: boolean; steps: string[] }> {
    try {
      const [profile, onboarding, cultural, assessments] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_onboarding').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('user_cultural_profiles').select('*').eq('user_id', userId).maybeSingle(),
        supabase.from('clinical_assessments').select('*').eq('user_id', userId).eq('assessment_type', 'onboarding_screening').maybeSingle()
      ]);

      const completedSteps: string[] = [];
      
      if (profile.data?.name) completedSteps.push('basic_info');
      if (onboarding.data) completedSteps.push('assessment');
      if (cultural.data) completedSteps.push('cultural');
      if (assessments.data) completedSteps.push('screening');

      return {
        completed: completedSteps.length >= 4,
        steps: completedSteps
      };
    } catch (error) {
      console.error('Error checking onboarding progress:', error);
      return { completed: false, steps: [] };
    }
  }
}

export const onboardingService = new OnboardingService();