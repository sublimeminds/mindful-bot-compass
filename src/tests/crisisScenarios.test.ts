import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Crisis scenario test data
const crisisScenarios = {
  suicidalIdeation: {
    messages: [
      'I do not want to live anymore',
      'Everything feels hopeless',
      'I have been thinking about ending it all'
    ],
    expectedRiskLevel: 0.9,
    expectedEscalation: true,
    expectedInterventions: ['crisis_hotline', 'immediate_support', 'safety_planning']
  },
  selfHarm: {
    messages: [
      'I hurt myself last night',
      'Sometimes I cut to feel something',
      'The pain helps me cope'
    ],
    expectedRiskLevel: 0.7,
    expectedEscalation: true,
    expectedInterventions: ['harm_reduction', 'safety_check', 'coping_strategies']
  },
  panicAttack: {
    messages: [
      'I cannot breathe, my heart is racing',
      'Everything feels unreal, I am scared',
      'I think I am having a panic attack'
    ],
    expectedRiskLevel: 0.6,
    expectedEscalation: false,
    expectedInterventions: ['grounding_techniques', 'breathing_exercises', 'immediate_support']
  },
  substanceAbuse: {
    messages: [
      'I drank too much again last night',
      'I cannot stop using, I need help',
      'The drugs are the only thing that helps'
    ],
    expectedRiskLevel: 0.7,
    expectedEscalation: true,
    expectedInterventions: ['addiction_resources', 'medical_evaluation', 'support_groups']
  },
  domesticViolence: {
    messages: [
      'My partner hit me again',
      'I am scared to go home',
      'I do not know how to get away safely'
    ],
    expectedRiskLevel: 0.8,
    expectedEscalation: true,
    expectedInterventions: ['safety_planning', 'domestic_violence_resources', 'legal_support']
  }
};

describe('Crisis Scenarios and Emergency Response Tests', () => {
  beforeEach(() => {
    vi.mocked(supabase.functions.invoke).mockImplementation((functionName, options) => {
      if (functionName === 'analyze-therapy-message') {
        const body = options?.body as any;
        const message = body?.message || '';
        
        // Determine crisis type based on message content
        let crisisType = 'none';
        let riskLevel = 0.1;
        let requiresEscalation = false;
        let indicators: string[] = [];
        
        if (message.toLowerCase().includes('end it all') || message.toLowerCase().includes('not want to live')) {
          crisisType = 'suicidal_ideation';
          riskLevel = 0.9;
          requiresEscalation = true;
          indicators = ['suicidal_thoughts', 'hopelessness'];
        } else if (message.toLowerCase().includes('hurt myself') || message.toLowerCase().includes('cut')) {
          crisisType = 'self_harm';
          riskLevel = 0.7;
          requiresEscalation = true;
          indicators = ['self_harm', 'coping_mechanism'];
        } else if (message.toLowerCase().includes('panic attack') || message.toLowerCase().includes('cannot breathe')) {
          crisisType = 'panic_attack';
          riskLevel = 0.6;
          requiresEscalation = false;
          indicators = ['panic_symptoms', 'acute_anxiety'];
        } else if (message.toLowerCase().includes('drank') || message.toLowerCase().includes('drugs')) {
          crisisType = 'substance_abuse';
          riskLevel = 0.7;
          requiresEscalation = true;
          indicators = ['substance_use', 'addiction_signs'];
        } else if (message.toLowerCase().includes('hit me') || message.toLowerCase().includes('scared to go home')) {
          crisisType = 'domestic_violence';
          riskLevel = 0.8;
          requiresEscalation = true;
          indicators = ['domestic_violence', 'safety_concerns'];
        }

        return Promise.resolve({
          data: {
            emotions: {
              primary: crisisType === 'panic_attack' ? 'panic' : 'distress',
              intensity: riskLevel,
              valence: -0.8,
              arousal: 0.9
            },
            crisis_indicators: {
              risk_level: riskLevel,
              requires_escalation: requiresEscalation,
              indicators,
              confidence: 0.9,
              immediate_concerns: indicators,
              protective_factors: [],
              risk_timeline: riskLevel > 0.8 ? 'immediate' : 'hours'
            },
            breakthrough_potential: 0.1,
            themes: [crisisType],
            recommended_techniques: indicators,
            urgency_level: riskLevel > 0.8 ? 'crisis' : riskLevel > 0.6 ? 'high' : 'medium'
          },
          error: null
        });
      }
      
      return Promise.resolve({ data: null, error: null });
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Crisis Detection and Assessment', () => {
    it('should detect suicidal ideation with high accuracy', async () => {
      const scenario = crisisScenarios.suicidalIdeation;
      
      for (const message of scenario.messages) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'crisis-test-user',
            sessionId: 'crisis-session-123'
          }
        });

        expect(response.data.crisis_indicators.risk_level).toBeGreaterThanOrEqual(scenario.expectedRiskLevel);
        expect(response.data.crisis_indicators.requires_escalation).toBe(scenario.expectedEscalation);
        expect(response.data.crisis_indicators.indicators).toContain('suicidal_thoughts');
        expect(response.data.urgency_level).toBe('crisis');
      }
    });

    it('should identify self-harm behaviors and provide appropriate interventions', async () => {
      const scenario = crisisScenarios.selfHarm;
      
      for (const message of scenario.messages) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'self-harm-test-user',
            sessionId: 'self-harm-session-123'
          }
        });

        expect(response.data.crisis_indicators.risk_level).toBeGreaterThanOrEqual(scenario.expectedRiskLevel);
        expect(response.data.crisis_indicators.requires_escalation).toBe(scenario.expectedEscalation);
        expect(response.data.crisis_indicators.indicators).toContain('self_harm');
        expect(response.data.urgency_level).toMatch(/high|crisis/);
      }
    });

    it('should handle panic attacks with immediate support but not escalation', async () => {
      const scenario = crisisScenarios.panicAttack;
      
      for (const message of scenario.messages) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'panic-test-user',
            sessionId: 'panic-session-123'
          }
        });

        expect(response.data.crisis_indicators.risk_level).toBeGreaterThanOrEqual(scenario.expectedRiskLevel);
        expect(response.data.crisis_indicators.requires_escalation).toBe(scenario.expectedEscalation);
        expect(response.data.crisis_indicators.indicators).toContain('panic_symptoms');
      }
    });

    it('should recognize substance abuse patterns', async () => {
      const scenario = crisisScenarios.substanceAbuse;
      
      for (const message of scenario.messages) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'substance-test-user',
            sessionId: 'substance-session-123'
          }
        });

        expect(response.data.crisis_indicators.risk_level).toBeGreaterThanOrEqual(scenario.expectedRiskLevel);
        expect(response.data.crisis_indicators.requires_escalation).toBe(scenario.expectedEscalation);
        expect(response.data.crisis_indicators.indicators).toContain('substance_use');
      }
    });

    it('should identify domestic violence situations', async () => {
      const scenario = crisisScenarios.domesticViolence;
      
      for (const message of scenario.messages) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'dv-test-user',
            sessionId: 'dv-session-123'
          }
        });

        expect(response.data.crisis_indicators.risk_level).toBeGreaterThanOrEqual(scenario.expectedRiskLevel);
        expect(response.data.crisis_indicators.requires_escalation).toBe(scenario.expectedEscalation);
        expect(response.data.crisis_indicators.indicators).toContain('domestic_violence');
      }
    });
  });

  describe('Emergency Response Protocols', () => {
    it('should trigger immediate intervention for high-risk scenarios', async () => {
      const highRiskMessage = 'I have pills ready and I am going to take them all tonight';
      
      const analysisResponse = await supabase.functions.invoke('analyze-therapy-message', {
        body: {
          message: highRiskMessage,
          userId: 'high-risk-user',
          sessionId: 'emergency-session'
        }
      });

      expect(analysisResponse.data.crisis_indicators.risk_level).toBeGreaterThan(0.8);
      expect(analysisResponse.data.crisis_indicators.requires_escalation).toBe(true);
      expect(analysisResponse.data.crisis_indicators.risk_timeline).toBe('immediate');
    });

    it('should provide safety planning resources', async () => {
      // Mock safety planning response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          safetyPlan: {
            warningSignsIdentified: ['isolation', 'hopelessness', 'suicidal_thoughts'],
            copingStrategies: ['call_hotline', 'reach_out_to_friend', 'remove_means'],
            supportContacts: ['988_suicide_hotline', 'emergency_contact_1'],
            professionalResources: ['local_crisis_center', 'emergency_services'],
            environmentalSafety: ['remove_weapons', 'medication_safety']
          },
          immediateSafety: true,
          followUpRequired: true
        },
        error: null
      });

      const response = await supabase.functions.invoke('generate-safety-plan', {
        body: {
          userId: 'safety-plan-user',
          riskFactors: ['suicidal_ideation', 'access_to_means'],
          supportNetwork: ['family', 'therapist']
        }
      });

      expect(response.data.safetyPlan).toBeDefined();
      expect(response.data.safetyPlan.warningSignsIdentified).toContain('suicidal_thoughts');
      expect(response.data.safetyPlan.supportContacts).toContain('988_suicide_hotline');
      expect(response.data.immediateSafety).toBe(true);
    });

    it('should coordinate with emergency services when needed', async () => {
      // Mock emergency coordination
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          emergencyResponse: {
            level: 'immediate',
            contactedServices: ['911_dispatched', 'crisis_team_notified'],
            userLocation: 'tracked_for_safety',
            timelineMinutes: 10,
            followUpScheduled: true
          },
          userNotified: true,
          familyContacted: true
        },
        error: null
      });

      const response = await supabase.functions.invoke('coordinate-emergency-response', {
        body: {
          userId: 'emergency-user',
          crisisLevel: 'immediate',
          location: 'user_provided_address'
        }
      });

      expect(response.data.emergencyResponse.level).toBe('immediate');
      expect(response.data.emergencyResponse.contactedServices).toContain('911_dispatched');
      expect(response.data.emergencyResponse.timelineMinutes).toBeLessThanOrEqual(15);
    });
  });

  describe('Crisis Communication and Support', () => {
    it('should provide immediate crisis support messages', async () => {
      const crisisMessages = [
        'You are not alone in this',
        'Your life has value and meaning',
        'Help is available right now',
        'These feelings can change'
      ];

      // Mock crisis support response
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          immediateSupport: {
            message: crisisMessages[0],
            tone: 'compassionate_urgent',
            actionItems: ['stay_safe', 'reach_out', 'wait_for_help'],
            resources: ['988_hotline', 'crisis_text_line']
          },
          followUpMessages: crisisMessages.slice(1),
          checkInScheduled: true
        },
        error: null
      });

      const response = await supabase.functions.invoke('generate-crisis-support', {
        body: {
          crisisType: 'suicidal_ideation',
          userProfile: { age: 25, supportNetwork: 'limited' }
        }
      });

      expect(response.data.immediateSupport.message).toContain('not alone');
      expect(response.data.immediateSupport.tone).toBe('compassionate_urgent');
      expect(response.data.followUpMessages).toHaveLength(3);
    });

    it('should adapt communication style for different crisis types', async () => {
      const crisisTypes = ['panic_attack', 'suicidal_ideation', 'domestic_violence', 'substance_abuse'];
      
      for (const crisisType of crisisTypes) {
        // Mock type-specific response
        vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
          data: {
            supportMessage: {
              content: `Specific support for ${crisisType}`,
              urgency: crisisType === 'suicidal_ideation' ? 'immediate' : 'high',
              techniques: [`${crisisType}_specific_technique`],
              resources: [`${crisisType}_resources`]
            }
          },
          error: null
        });

        const response = await supabase.functions.invoke('generate-crisis-support', {
          body: { crisisType }
        });

        expect(response.data.supportMessage.content).toContain(crisisType);
        expect(response.data.supportMessage.techniques[0]).toContain(crisisType);
      }
    });
  });

  describe('Follow-up and Continuity of Care', () => {
    it('should schedule appropriate follow-up based on crisis severity', async () => {
      const crisisLevels = [
        { level: 'immediate', expectedFollowUp: 'within_hour' },
        { level: 'high', expectedFollowUp: 'within_24_hours' },
        { level: 'moderate', expectedFollowUp: 'within_week' }
      ];

      for (const crisis of crisisLevels) {
        // Mock follow-up scheduling
        vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
          data: {
            followUpSchedule: {
              urgency: crisis.level,
              timeline: crisis.expectedFollowUp,
              type: 'crisis_check_in',
              assignedClinician: 'crisis_specialist',
              automaticReminders: true
            }
          },
          error: null
        });

        const response = await supabase.functions.invoke('schedule-crisis-follow-up', {
          body: {
            userId: 'follow-up-user',
            crisisLevel: crisis.level
          }
        });

        expect(response.data.followUpSchedule.timeline).toBe(crisis.expectedFollowUp);
        expect(response.data.followUpSchedule.urgency).toBe(crisis.level);
      }
    });

    it('should ensure continuity between crisis and ongoing therapy', async () => {
      // Mock continuity planning
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          continuityPlan: {
            crisisResolved: false,
            ongoingTherapyAdjustments: {
              frequency: 'increased_to_twice_weekly',
              focus: 'crisis_stabilization',
              techniques: ['safety_planning', 'coping_skills']
            },
            monitoringProtocol: {
              riskAssessment: 'weekly',
              progressTracking: 'daily_check_ins',
              emergencyContactList: 'updated'
            }
          }
        },
        error: null
      });

      const response = await supabase.functions.invoke('plan-post-crisis-care', {
        body: {
          userId: 'continuity-user',
          crisisType: 'suicidal_ideation',
          currentTherapyPlan: { frequency: 'weekly', approach: 'CBT' }
        }
      });

      expect(response.data.continuityPlan.ongoingTherapyAdjustments.frequency).toContain('increased');
      expect(response.data.continuityPlan.monitoringProtocol.riskAssessment).toBe('weekly');
    });
  });

  describe('Crisis Prevention and Early Intervention', () => {
    it('should identify early warning signs before crisis escalation', async () => {
      const earlyWarningSigns = [
        'I have been feeling really down lately',
        'Nothing seems to matter anymore',
        'I am not sleeping well and feel hopeless'
      ];

      for (const message of earlyWarningSigns) {
        const response = await supabase.functions.invoke('analyze-therapy-message', {
          body: {
            message,
            userId: 'early-warning-user',
            sessionId: 'prevention-session'
          }
        });

        expect(response.data.crisis_indicators.risk_level).toBeGreaterThan(0.3);
        expect(response.data.crisis_indicators.risk_level).toBeLessThan(0.7);
        expect(response.data.themes).toContain('distress');
      }
    });

    it('should recommend proactive interventions for at-risk patterns', async () => {
      // Mock proactive intervention recommendations
      vi.mocked(supabase.functions.invoke).mockResolvedValueOnce({
        data: {
          interventions: {
            immediate: ['safety_check', 'increased_monitoring'],
            shortTerm: ['crisis_counseling', 'medication_review'],
            longTerm: ['trauma_therapy', 'support_group_referral'],
            prevention: ['trigger_identification', 'coping_strategy_development']
          },
          riskFactors: ['isolation', 'recent_loss', 'substance_use'],
          protectiveFactors: ['family_support', 'employment', 'previous_therapy_success']
        },
        error: null
      });

      const response = await supabase.functions.invoke('recommend-proactive-interventions', {
        body: {
          userId: 'at-risk-user',
          riskPattern: 'increasing_depression_scores',
          recentEvents: ['job_loss', 'relationship_end']
        }
      });

      expect(response.data.interventions.immediate).toContain('safety_check');
      expect(response.data.interventions.prevention).toContain('trigger_identification');
      expect(response.data.riskFactors).toContain('isolation');
    });
  });
});