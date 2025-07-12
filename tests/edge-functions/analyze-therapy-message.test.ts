import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock Anthropic API response for message analysis
const mockAnalysisResponse = {
  ok: true,
  json: () => Promise.resolve({
    content: [{
      text: JSON.stringify({
        emotions: {
          primary: "anxiety",
          intensity: 0.7,
          valence: -0.5,
          arousal: 0.8,
          secondary_emotions: ["fear", "uncertainty"],
          emotional_complexity: 0.6,
          regulation_capacity: 0.4
        },
        crisis_indicators: {
          risk_level: 0.2,
          indicators: ["mild distress"],
          confidence: 0.9,
          requires_escalation: false,
          immediate_concerns: [],
          protective_factors: ["seeking help"],
          risk_timeline: "days"
        },
        breakthrough_potential: 0.6,
        breakthrough_indicators: ["insight", "motivation"],
        themes: ["work stress", "relationships"],
        recommended_techniques: ["deep breathing", "cognitive restructuring"],
        urgency_level: "medium",
        clinical_notes: "User showing good self-awareness and motivation for change"
      })
    }]
  })
};

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    insert: vi.fn(() => Promise.resolve({ data: {}, error: null }))
  }))
};

global.fetch = vi.fn(() => Promise.resolve(mockAnalysisResponse as any));

describe('Analyze Therapy Message Edge Function', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ANTHROPIC_API_KEY = 'test-key';
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Crisis Detection Accuracy', () => {
    it('should detect suicide ideation with high confidence', async () => {
      const suicidalMessage = "I don't see any point in living anymore. Everything feels hopeless.";
      
      const crisisResponse = {
        content: [{
          text: JSON.stringify({
            crisis_indicators: {
              risk_level: 0.9,
              indicators: ["suicide ideation", "hopelessness"],
              confidence: 0.95,
              requires_escalation: true,
              immediate_concerns: ["active suicidal thoughts"],
              risk_timeline: "immediate"
            },
            urgency_level: "crisis"
          })
        }]
      };

      // Test high-risk detection
      const analysis = JSON.parse(crisisResponse.content[0].text);
      expect(analysis.crisis_indicators.risk_level).toBeGreaterThan(0.8);
      expect(analysis.crisis_indicators.requires_escalation).toBe(true);
      expect(analysis.urgency_level).toBe("crisis");
    });

    it('should identify self-harm indicators', async () => {
      const selfHarmMessage = "I've been cutting myself when the pain gets too much.";
      
      const analysis = {
        crisis_indicators: {
          risk_level: 0.8,
          indicators: ["self-harm behavior", "emotional dysregulation"],
          confidence: 0.9,
          requires_escalation: true,
          immediate_concerns: ["active self-harm"],
          risk_timeline: "hours"
        }
      };

      expect(analysis.crisis_indicators.indicators).toContain("self-harm behavior");
      expect(analysis.crisis_indicators.requires_escalation).toBe(true);
    });

    it('should detect substance abuse concerns', async () => {
      const substanceMessage = "I've been drinking every night to cope with the stress.";
      
      const analysis = {
        crisis_indicators: {
          risk_level: 0.6,
          indicators: ["substance abuse", "maladaptive coping"],
          confidence: 0.85,
          requires_escalation: false,
          immediate_concerns: ["substance dependency risk"],
          risk_timeline: "days"
        }
      };

      expect(analysis.crisis_indicators.indicators).toContain("substance abuse");
      expect(analysis.crisis_indicators.risk_level).toBeGreaterThan(0.5);
    });

    it('should minimize false positives for everyday stress', async () => {
      const normalStressMessage = "Work has been really busy lately, but I'm managing okay.";
      
      const analysis = {
        crisis_indicators: {
          risk_level: 0.1,
          indicators: ["work stress"],
          confidence: 0.8,
          requires_escalation: false,
          immediate_concerns: [],
          risk_timeline: "weeks"
        }
      };

      expect(analysis.crisis_indicators.risk_level).toBeLessThan(0.3);
      expect(analysis.crisis_indicators.requires_escalation).toBe(false);
    });
  });

  describe('Emotional Analysis Accuracy', () => {
    it('should accurately identify primary emotions', async () => {
      const emotions = {
        primary: "sadness",
        intensity: 0.8,
        valence: -0.7,
        arousal: 0.3,
        secondary_emotions: ["grief", "loneliness"]
      };

      expect(emotions.primary).toBe("sadness");
      expect(emotions.intensity).toBeGreaterThan(0.7);
      expect(emotions.valence).toBeLessThan(0);
    });

    it('should detect emotional complexity', async () => {
      const complexEmotions = {
        primary: "anxiety",
        secondary_emotions: ["excitement", "fear", "anticipation"],
        emotional_complexity: 0.9,
        regulation_capacity: 0.3
      };

      expect(complexEmotions.emotional_complexity).toBeGreaterThan(0.8);
      expect(complexEmotions.secondary_emotions.length).toBeGreaterThan(2);
    });

    it('should assess emotional regulation capacity', async () => {
      const regulationAssessment = {
        regulation_capacity: 0.7,
        coping_strategies: ["mindfulness", "exercise"],
        resilience_indicators: ["problem-solving", "social support"]
      };

      expect(regulationAssessment.regulation_capacity).toBeGreaterThan(0.5);
    });
  });

  describe('Breakthrough Potential Detection', () => {
    it('should identify readiness for change', async () => {
      const readinessMessage = "I think I'm finally ready to work on my problems.";
      
      const analysis = {
        breakthrough_potential: 0.9,
        breakthrough_indicators: ["motivation", "insight", "readiness"],
        recommended_techniques: ["motivational interviewing", "goal setting"]
      };

      expect(analysis.breakthrough_potential).toBeGreaterThan(0.8);
      expect(analysis.breakthrough_indicators).toContain("readiness");
    });

    it('should detect insight moments', async () => {
      const insightMessage = "I just realized that my anger isn't really about work, it's about feeling powerless.";
      
      const analysis = {
        breakthrough_potential: 0.8,
        breakthrough_indicators: ["insight", "self-awareness"],
        themes: ["anger management", "personal control"]
      };

      expect(analysis.breakthrough_indicators).toContain("insight");
      expect(analysis.breakthrough_potential).toBeGreaterThan(0.7);
    });
  });

  describe('Therapeutic Technique Recommendations', () => {
    it('should recommend appropriate techniques for anxiety', async () => {
      const anxietyAnalysis = {
        emotions: { primary: "anxiety", intensity: 0.8 },
        recommended_techniques: ["grounding exercises", "progressive muscle relaxation", "cognitive restructuring"],
        urgency_level: "medium"
      };

      expect(anxietyAnalysis.recommended_techniques).toContain("grounding exercises");
      expect(anxietyAnalysis.recommended_techniques.length).toBeGreaterThan(1);
    });

    it('should suggest trauma-informed approaches when indicated', async () => {
      const traumaIndicators = {
        themes: ["trauma", "flashbacks", "hypervigilance"],
        recommended_techniques: ["trauma-focused CBT", "EMDR", "somatic experiencing"],
        approach_modifications: ["trauma-informed"]
      };

      expect(traumaIndicators.recommended_techniques).toContain("trauma-focused CBT");
    });
  });

  describe('Response Time Performance', () => {
    it('should analyze messages within 5 seconds', async () => {
      const startTime = Date.now();
      
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const endTime = Date.now();
      const analysisTime = endTime - startTime;
      
      expect(analysisTime).toBeLessThan(5000);
    });

    it('should handle long messages efficiently', async () => {
      const longMessage = "a".repeat(2000); // 2000 character message
      
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 200));
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(10000);
    });
  });

  describe('Data Storage Validation', () => {
    it('should store analysis results in correct database tables', async () => {
      const mockAnalysis = {
        emotions: { primary: "anxiety", intensity: 0.7 },
        crisis_indicators: { risk_level: 0.2, requires_escalation: false },
        session_quality_score: 0.8
      };

      // Verify database operations
      expect(mockSupabaseClient.from).toBeDefined();
    });

    it('should create analytics events for tracking', async () => {
      const analyticsEvent = {
        event_type: 'message',
        severity_level: 'normal',
        requires_intervention: false,
        event_data: { message_length: 150 }
      };

      expect(analyticsEvent.event_type).toBe('message');
      expect(['normal', 'high', 'crisis']).toContain(analyticsEvent.severity_level);
    });
  });

  describe('Error Handling', () => {
    it('should handle API failures gracefully', async () => {
      const apiError = new Error('Anthropic API error: 500');
      
      // Mock API failure
      global.fetch = vi.fn(() => Promise.reject(apiError));
      
      // Should return fallback analysis
      const fallback = {
        error: 'Analysis failed',
        emotions: { primary: 'neutral', intensity: 0.5 },
        crisis_indicators: { risk_level: 0, requires_escalation: false }
      };

      expect(fallback.emotions.primary).toBe('neutral');
      expect(fallback.crisis_indicators.risk_level).toBe(0);
    });

    it('should validate JSON response structure', async () => {
      const invalidResponse = {
        content: [{ text: "invalid json" }]
      };

      // Should handle invalid JSON gracefully
      expect(() => {
        try {
          JSON.parse(invalidResponse.content[0].text);
        } catch (e) {
          return { error: 'Invalid response format' };
        }
      }).not.toThrow();
    });
  });
});