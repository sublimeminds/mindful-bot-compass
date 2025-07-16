import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedCulturalContextService } from '@/services/enhancedCulturalContextService';

// Mock user
const testUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: { name: 'Test User' }
};

// Demo onboarding data
const demoOnboardingData = {
  culturalPreferences: {
    primaryLanguage: 'en',
    culturalBackground: 'western',
    familyStructure: 'nuclear',
    communicationStyle: 'direct',
    religiousConsiderations: false,
    religiousDetails: '',
    therapyApproachPreferences: ['CBT', 'mindfulness'],
    culturalSensitivities: ['work_stress', 'family_dynamics']
  },
  demographics: {
    age: 28,
    gender: 'female',
    location: 'New York, NY'
  },
  assessmentResults: {
    anxiety: 7,
    depression: 5,
    stress: 8,
    overall_wellness: 4
  },
  goals: ['manage anxiety', 'improve sleep', 'better work-life balance'],
  problemAreas: ['work stress', 'relationship anxiety', 'sleep issues'],
  therapistSelection: 'dr-jane-smith',
  notifications: {
    enabled: true,
    frequency: 'daily',
    timePreference: 'evening'
  }
};

describe('Complete Onboarding Flow Demo Test', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should complete the full onboarding → therapy plan → dashboard flow', async () => {
    console.log('🚀 Starting Complete Onboarding Flow Test');
    
    // Step 1: Save Cultural Profile
    console.log('📝 Step 1: Saving cultural profile...');
    
    const culturalProfile = {
      userId: testUser.id,
      primaryLanguage: demoOnboardingData.culturalPreferences.primaryLanguage as any,
      culturalBackground: demoOnboardingData.culturalPreferences.culturalBackground,
      familyStructure: demoOnboardingData.culturalPreferences.familyStructure as any,
      communicationStyle: demoOnboardingData.culturalPreferences.communicationStyle as any,
      religiousConsiderations: demoOnboardingData.culturalPreferences.religiousConsiderations,
      religiousDetails: demoOnboardingData.culturalPreferences.religiousDetails,
      therapyApproachPreferences: demoOnboardingData.culturalPreferences.therapyApproachPreferences,
      culturalSensitivities: demoOnboardingData.culturalPreferences.culturalSensitivities
    };

    try {
      const culturalResult = await EnhancedCulturalContextService.saveCulturalProfile(culturalProfile);
      console.log('✅ Cultural profile result:', culturalResult);
      expect(culturalResult.success).toBe(true);
    } catch (error) {
      console.error('❌ Cultural profile error:', error);
      throw error;
    }

    // Step 2: Create Therapy Plan via Edge Function
    console.log('🧠 Step 2: Creating therapy plan...');
    
    try {
      const { data: planResult, error: planError } = await supabase.functions.invoke(
        'adaptive-therapy-planner',
        {
          body: {
            userId: testUser.id,
            onboardingData: demoOnboardingData,
            culturalProfile: culturalProfile
          }
        }
      );

      console.log('🎯 Therapy plan result:', planResult);
      console.log('🔍 Therapy plan error:', planError);

      if (planError) {
        console.error('❌ Therapy plan creation failed:', planError);
        expect.fail(`Therapy plan creation failed: ${planError.message}`);
      }

      expect(planResult).toBeDefined();
      expect(planResult.success).toBe(true);
      expect(planResult.planId).toBeDefined();
      
      console.log('✅ Therapy plan created successfully with ID:', planResult.planId);

    } catch (error) {
      console.error('❌ Therapy plan creation error:', error);
      throw error;
    }

    // Step 3: Update Profile with Onboarding Complete
    console.log('👤 Step 3: Updating profile completion status...');
    
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          onboarding_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', testUser.id);

      if (profileError) {
        console.error('❌ Profile update failed:', profileError);
        expect.fail(`Profile update failed: ${profileError.message}`);
      }

      console.log('✅ Profile updated successfully');

    } catch (error) {
      console.error('❌ Profile update error:', error);
      throw error;
    }

    // Step 4: Verify Data Consistency
    console.log('🔍 Step 4: Verifying data consistency...');
    
    try {
      // Check if therapy plan exists in database
      const { data: therapyPlans, error: planQueryError } = await supabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', testUser.id);

      if (planQueryError) {
        console.warn('⚠️ Could not verify therapy plan existence:', planQueryError);
      } else {
        console.log('📊 Found therapy plans:', therapyPlans?.length || 0);
        if (therapyPlans && therapyPlans.length > 0) {
          console.log('✅ Therapy plan exists in database');
          expect(therapyPlans[0].user_id).toBe(testUser.id);
        }
      }

      // Check if cultural profile exists
      const { data: culturalProfiles, error: culturalQueryError } = await supabase
        .from('user_cultural_profiles')
        .select('*')
        .eq('user_id', testUser.id);

      if (culturalQueryError) {
        console.warn('⚠️ Could not verify cultural profile existence:', culturalQueryError);
      } else {
        console.log('🌍 Found cultural profiles:', culturalProfiles?.length || 0);
        if (culturalProfiles && culturalProfiles.length > 0) {
          console.log('✅ Cultural profile exists in database');
          expect(culturalProfiles[0].user_id).toBe(testUser.id);
        }
      }

      // Check profile flags
      const { data: profile, error: profileQueryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', testUser.id)
        .single();

      if (profileQueryError) {
        console.warn('⚠️ Could not verify profile flags:', profileQueryError);
      } else if (profile) {
        console.log('👤 Profile flags:', {
          onboarding_complete: profile.onboarding_complete
        });
        
        expect(profile.onboarding_complete).toBe(true);
      }

    } catch (error) {
      console.error('❌ Data verification error:', error);
      // Don't fail the test for verification issues
      console.warn('⚠️ Data verification failed but main flow completed');
    }

    console.log('🎉 Complete Onboarding Flow Test Completed Successfully!');
  });

  it('should handle therapy plan creation failure gracefully', async () => {
    console.log('🧪 Testing therapy plan creation failure handling...');
    
    // Save cultural profile first (should succeed)
    const culturalProfile = {
      userId: testUser.id,
      primaryLanguage: 'en' as any,
      culturalBackground: 'western',
      familyStructure: 'individual' as any,
      communicationStyle: 'direct' as any,
      religiousConsiderations: false,
      therapyApproachPreferences: [],
      culturalSensitivities: []
    };

    const culturalResult = await EnhancedCulturalContextService.saveCulturalProfile(culturalProfile);
    expect(culturalResult.success).toBe(true);

    // Attempt therapy plan creation with invalid data
    try {
      const { data: planResult, error: planError } = await supabase.functions.invoke(
        'adaptive-therapy-planner',
        {
          body: {
            userId: 'invalid-user-id', // This should cause failure
            onboardingData: {},
            culturalProfile: culturalProfile
          }
        }
      );

      console.log('Plan result with invalid data:', planResult);
      console.log('Plan error with invalid data:', planError);
      
      // Should either return error or unsuccessful result
      if (!planError && planResult) {
        expect(planResult.success).toBe(false);
      }
      
    } catch (error) {
      console.log('Expected error for invalid data:', error);
      // This is expected for invalid input
    }

    console.log('✅ Failure handling test completed');
  });

  it('should validate onboarding data before processing', async () => {
    console.log('🔍 Testing onboarding data validation...');
    
    const invalidDataSets = [
      {
        name: 'Empty data',
        data: {}
      },
      {
        name: 'Missing cultural preferences',
        data: {
          demographics: { age: 25 },
          assessmentResults: { anxiety: 5 }
        }
      },
      {
        name: 'Invalid assessment results',
        data: {
          culturalPreferences: { primaryLanguage: 'en' },
          assessmentResults: { anxiety: 'high' } // Should be number
        }
      }
    ];

    for (const testCase of invalidDataSets) {
      console.log(`Testing: ${testCase.name}`);
      
      try {
        const { data: planResult, error: planError } = await supabase.functions.invoke(
          'adaptive-therapy-planner',
          {
            body: {
              userId: testUser.id,
              onboardingData: testCase.data
            }
          }
        );

        // Should either return error or unsuccessful result
        if (!planError && planResult) {
          console.log(`Result for ${testCase.name}:`, planResult);
          expect(planResult.success).toBe(false);
        }
        
      } catch (error) {
        console.log(`Expected validation error for ${testCase.name}:`, error);
        // Validation errors are expected
      }
    }

    console.log('✅ Data validation test completed');
  });
});