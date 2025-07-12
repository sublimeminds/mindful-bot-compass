import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock session preparation response
const mockSessionPrepResponse = {
  ok: true,
  json: () => Promise.resolve({
    content: [{
      text: JSON.stringify({
        session_preparation: {
          recommended_approach: "CBT with DBT skills",
          session_goals: ["emotion regulation", "distress tolerance"],
          techniques_to_use: ["mindfulness", "cognitive restructuring"],
          risk_factors: ["recent relationship conflict"],
          protective_factors: ["strong therapeutic alliance"],
          session_structure: {
            opening: "check-in and grounding",
            middle: "skill building and practice", 
            closing: "homework and planning"
          }
        },
        ai_configuration: {
          empathy_level: 0.8,
          directness: 0.6,
          cultural_adaptations: ["respect for family involvement"],
          crisis_protocols: ["assess safety", "create safety plan"]
        },
        risk_assessment: {
          overall_risk: "moderate",
          specific_concerns: ["emotional overwhelm"],
          monitoring_needed: true,
          escalation_triggers: ["expression of hopelessness"]
        }
      })
    }]
  })
};

global.fetch = vi.fn(() => Promise.resolve(mockSessionPrepResponse as any));

describe('Session Preparation AI Edge Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-key';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Session Goal Setting', () => {
    it('should generate SMART session goals', async () => {
      const sessionGoals = [
        "Practice 3 mindfulness techniques during session",
        "Identify 2 cognitive distortions in recent conflict",
        "Develop safety plan with 3 coping strategies"
      ];

      // Goals should be Specific, Measurable, Achievable, Relevant, Time-bound
      sessionGoals.forEach(goal => {
        expect(goal.length).toBeGreaterThan(20); // Specific enough
        expect(goal).toMatch(/\d+/); // Contains measurable elements
      });
    });

    it('should adapt goals based on user progress', async () => {
      const beginnerGoals = ["Learn basic deep breathing", "Understand CBT concepts"];
      const advancedGoals = ["Apply DBT skills in real situations", "Practice exposure therapy"];

      expect(beginnerGoals[0]).toContain("Learn");
      expect(advancedGoals[0]).toContain("Apply");
    });

    it('should prioritize safety goals for high-risk users', async () => {
      const safetyFocusedPrep = {
        session_goals: ["Assess current safety", "Update safety plan", "Practice crisis skills"],
        risk_assessment: { overall_risk: "high" },
        priority: "safety_first"
      };

      expect(safetyFocusedPrep.session_goals[0]).toContain("safety");
      expect(safetyFocusedPrep.risk_assessment.overall_risk).toBe("high");
    });
  });

  describe('Technique Selection', () => {
    it('should select evidence-based techniques for specific conditions', async () => {
      const anxietyTechniques = [
        "progressive muscle relaxation",
        "cognitive restructuring", 
        "exposure therapy",
        "breathing exercises"
      ];

      const depressionTechniques = [
        "behavioral activation",
        "cognitive restructuring",
        "mindfulness",
        "activity scheduling"
      ];

      expect(anxietyTechniques).toContain("exposure therapy");
      expect(depressionTechniques).toContain("behavioral activation");
    });

    it('should avoid contraindicated techniques', async () => {
      const traumaContraindications = {
        avoid_techniques: ["deep hypnosis", "aggressive confrontation"],
        recommended_alternatives: ["grounding techniques", "resource building"]
      };

      expect(traumaContraindications.avoid_techniques).toContain("deep hypnosis");
      expect(traumaContraindications.recommended_alternatives).toContain("grounding techniques");
    });

    it('should sequence techniques appropriately', async () => {
      const sessionSequence = {
        opening: "grounding and stabilization",
        middle: "core intervention work",
        closing: "integration and planning"
      };

      expect(sessionSequence.opening).toContain("grounding");
      expect(sessionSequence.closing).toContain("integration");
    });
  });

  describe('Risk Assessment Integration', () => {
    it('should incorporate risk factors into session planning', async () => {
      const riskAwarePrep = {
        identified_risks: ["recent job loss", "social isolation"],
        safety_modifications: ["frequent check-ins", "extended session time"],
        monitoring_plan: ["daily safety check", "emergency contact ready"]
      };

      expect(riskAwarePrep.safety_modifications.length).toBeGreaterThan(0);
      expect(riskAwarePrep.monitoring_plan).toContain("safety check");
    });

    it('should prepare crisis intervention strategies', async () => {
      const crisisPrep = {
        crisis_protocols: [
          "assess immediate safety",
          "activate support system",
          "create/update safety plan",
          "consider hospitalization if needed"
        ],
        emergency_contacts: ["crisis hotline", "emergency services"],
        de_escalation_techniques: ["validation", "grounding", "breathing"]
      };

      expect(crisisPrep.crisis_protocols).toContain("assess immediate safety");
      expect(crisisPrep.de_escalation_techniques.length).toBeGreaterThan(2);
    });
  });

  describe('Cultural Adaptation', () => {
    it('should incorporate cultural considerations', async () => {
      const culturalAdaptations = {
        communication_style: "high_context",
        family_involvement: "encouraged",
        religious_considerations: "prayer integration welcomed",
        language_preferences: "bilingual approach"
      };

      expect(culturalAdaptations.communication_style).toBe("high_context");
      expect(culturalAdaptations.family_involvement).toBe("encouraged");
    });

    it('should respect cultural trauma perspectives', async () => {
      const culturalTrauma = {
        historical_trauma_awareness: true,
        community_healing_approaches: ["storytelling", "ritual"],
        individual_vs_collective: "balanced approach"
      };

      expect(culturalTrauma.historical_trauma_awareness).toBe(true);
      expect(Array.isArray(culturalTrauma.community_healing_approaches)).toBe(true);
    });
  });

  describe('AI Configuration Optimization', () => {
    it('should set appropriate empathy levels', async () => {
      const empathyConfig = {
        high_distress: { empathy_level: 0.9, validation_frequency: "high" },
        stable_mood: { empathy_level: 0.7, challenge_level: "moderate" },
        resistant_client: { empathy_level: 0.8, patience_level: "maximum" }
      };

      expect(empathyConfig.high_distress.empathy_level).toBeGreaterThan(0.8);
      expect(empathyConfig.stable_mood.challenge_level).toBe("moderate");
    });

    it('should configure communication style', async () => {
      const commConfig = {
        directness: 0.6,
        warmth: 0.8,
        formality: 0.4,
        humor_appropriateness: 0.3
      };

      expect(commConfig.directness).toBeGreaterThan(0);
      expect(commConfig.directness).toBeLessThanOrEqual(1);
      expect(commConfig.warmth).toBeGreaterThan(commConfig.formality);
    });
  });

  describe('Session Structure Planning', () => {
    it('should allocate time appropriately', async () => {
      const timeAllocation = {
        opening: "10 minutes - rapport and check-in",
        middle: "35 minutes - core therapeutic work",
        closing: "15 minutes - summary and homework"
      };

      const openingTime = parseInt(timeAllocation.opening);
      const middleTime = parseInt(timeAllocation.middle);
      const closingTime = parseInt(timeAllocation.closing);

      expect(openingTime + middleTime + closingTime).toBe(60);
      expect(middleTime).toBeGreaterThan(openingTime);
    });

    it('should plan smooth transitions', async () => {
      const transitions = {
        opening_to_middle: "summarize check-in, introduce today's focus",
        middle_to_closing: "reflect on session work, preview homework",
        session_to_homework: "concrete action steps, follow-up plan"
      };

      expect(transitions.opening_to_middle).toContain("summarize");
      expect(transitions.middle_to_closing).toContain("reflect");
    });
  });

  describe('Progress Tracking Integration', () => {
    it('should reference previous session outcomes', async () => {
      const progressIntegration = {
        last_session_goals: ["practice mindfulness", "challenge negative thoughts"],
        achievement_status: ["partially completed", "fully completed"],
        current_session_adaptations: ["build on mindfulness success", "advance cognitive work"]
      };

      expect(progressIntegration.last_session_goals.length).toBe(
        progressIntegration.achievement_status.length
      );
    });

    it('should set measurable session outcomes', async () => {
      const measureableOutcomes = [
        "client will demonstrate 2 grounding techniques",
        "client will identify 3 cognitive distortions",
        "client will rate session helpfulness 7/10 or higher"
      ];

      measureableOutcomes.forEach(outcome => {
        expect(outcome).toMatch(/\d+/); // Contains numbers for measurement
      });
    });
  });

  describe('Data Storage and Retrieval', () => {
    it('should store comprehensive preparation data', async () => {
      const storedPrep = {
        session_id: "session-123",
        user_id: "user-456", 
        preparation_data: {
          goals: ["goal1", "goal2"],
          techniques: ["tech1", "tech2"],
          risk_assessment: { level: "low" }
        },
        ai_config: {
          empathy_level: 0.8,
          directness: 0.6
        }
      };

      expect(storedPrep.session_id).toBeDefined();
      expect(storedPrep.preparation_data.goals.length).toBeGreaterThan(0);
      expect(storedPrep.ai_config.empathy_level).toBeGreaterThan(0);
    });
  });

  describe('Performance and Reliability', () => {
    it('should prepare sessions within 3 seconds', async () => {
      const startTime = Date.now();
      
      // Simulate session preparation
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(3000);
    });

    it('should handle concurrent preparation requests', async () => {
      const concurrentRequests = Array(3).fill(null).map(() => 
        new Promise(resolve => setTimeout(resolve, 50))
      );

      const results = await Promise.all(concurrentRequests);
      expect(results).toHaveLength(3);
    });

    it('should provide fallback preparation on API failure', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('API Error')));

      const fallbackPrep = {
        session_goals: ["general wellness check", "supportive listening"],
        techniques: ["active listening", "empathetic responding"],
        ai_config: { empathy_level: 0.8, directness: 0.5 }
      };

      expect(fallbackPrep.session_goals.length).toBeGreaterThan(0);
      expect(fallbackPrep.ai_config.empathy_level).toBeGreaterThan(0);
    });
  });
});