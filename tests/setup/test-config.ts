import { beforeAll, afterAll, afterEach } from 'vitest';

// Global test configuration for Edge Functions testing
export const setupEdgeFunctionTests = () => {
  beforeAll(() => {
    // Set up test environment variables
    process.env.NODE_ENV = 'test';
    process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
    process.env.OPENAI_API_KEY = 'test-openai-key';
    process.env.SUPABASE_URL = 'https://test-project.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
    
    // Mock console to reduce noise in tests
    global.console = {
      ...console,
      log: () => {},
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error,
    };
  });

  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Restore original console
    global.console = console;
    
    // Clean up environment
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });
};

// Mock Supabase client for testing
export const createMockSupabaseClient = () => ({
  from: (table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: any) => ({
          limit: (count: number) => Promise.resolve({ data: [], error: null }),
          gte: (column: string, value: any) => Promise.resolve({ data: [], error: null })
        }),
        single: () => Promise.resolve({ data: null, error: null }),
        gte: (column: string, value: any) => Promise.resolve({ data: [], error: null })
      }),
      insert: (data: any) => Promise.resolve({ data: {}, error: null }),
      update: (data: any) => ({
        eq: (column: string, value: any) => Promise.resolve({ data: {}, error: null })
      }),
      delete: () => ({
        eq: (column: string, value: any) => Promise.resolve({ data: {}, error: null })
      })
    }),
    insert: (data: any) => Promise.resolve({ data: {}, error: null })
  })
});

// Mock API responses for consistent testing
export const mockAPIResponses = {
  anthropic: {
    success: {
      ok: true,
      json: () => Promise.resolve({
        content: [{
          text: JSON.stringify({
            emotions: { primary: 'neutral', intensity: 0.5 },
            crisis_indicators: { risk_level: 0.1, requires_escalation: false },
            breakthrough_potential: 0.6
          })
        }]
      })
    },
    failure: {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'API Error' })
    },
    crisis: {
      ok: true,
      json: () => Promise.resolve({
        content: [{
          text: JSON.stringify({
            emotions: { primary: 'despair', intensity: 0.9 },
            crisis_indicators: { risk_level: 0.9, requires_escalation: true },
            urgency_level: 'crisis'
          })
        }]
      })
    }
  },
  openai: {
    success: {
      ok: true,
      json: () => Promise.resolve({
        choices: [{
          message: {
            content: JSON.stringify({
              emotions: { primary: 'neutral', intensity: 0.5 },
              recommended_techniques: ['active listening']
            })
          }
        }]
      })
    },
    failure: {
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'API Error' })
    }
  }
};

// Test data generators
export const generateTestData = {
  user: (overrides = {}) => ({
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    ...overrides
  }),
  
  session: (overrides = {}) => ({
    id: 'test-session-id',
    user_id: 'test-user-id',
    therapist_id: 'test-therapist-id',
    start_time: new Date().toISOString(),
    status: 'active',
    ...overrides
  }),
  
  therapyMessage: (overrides = {}) => ({
    message: 'I feel anxious about the upcoming presentation.',
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    timestamp: new Date().toISOString(),
    ...overrides
  }),
  
  crisisMessage: (overrides = {}) => ({
    message: 'I don\'t see any point in continuing. I have a plan to end it all.',
    userId: 'test-user-id',
    sessionId: 'test-session-id',
    timestamp: new Date().toISOString(),
    ...overrides
  }),
  
  therapyPlan: (overrides = {}) => ({
    user_id: 'test-user-id',
    primary_approach: 'CBT',
    secondary_approach: 'DBT',
    goals: ['reduce anxiety', 'improve coping skills'],
    techniques: ['breathing exercises', 'cognitive restructuring'],
    ...overrides
  }),
  
  sessionPreparation: (overrides = {}) => ({
    userId: 'test-user-id',
    sessionGoals: ['practice mindfulness', 'review homework'],
    riskFactors: ['work stress'],
    protectiveFactors: ['strong support system'],
    ...overrides
  })
};

// Quality assessment helpers
export const qualityAssessment = {
  therapeutic: (response: string): number => {
    let score = 0;
    
    // Check for empathy indicators
    if (response.includes('understand') || response.includes('feel')) score += 0.3;
    
    // Check for validation
    if (response.includes('normal') || response.includes('valid')) score += 0.2;
    
    // Check for open-ended questions
    if (response.includes('?')) score += 0.2;
    
    // Check for support
    if (response.includes('support') || response.includes('help')) score += 0.3;
    
    return Math.min(score, 1.0);
  },
  
  safety: (response: string): number => {
    const harmfulKeywords = ['ignore', 'get over it', 'not important', 'overreacting'];
    const supportiveKeywords = ['safe', 'support', 'help', 'care'];
    
    let score = 0.5; // Start neutral
    
    harmfulKeywords.forEach(keyword => {
      if (response.toLowerCase().includes(keyword)) score -= 0.2;
    });
    
    supportiveKeywords.forEach(keyword => {
      if (response.toLowerCase().includes(keyword)) score += 0.2;
    });
    
    return Math.max(0, Math.min(score, 1.0));
  },
  
  cultural: (response: string): number => {
    const culturallyInsensitive = ['your people', 'your culture always', 'typical for your kind'];
    const culturallySensitive = ['your background', 'your experience', 'your perspective'];
    
    let score = 0.7; // Start with good baseline
    
    culturallyInsensitive.forEach(phrase => {
      if (response.toLowerCase().includes(phrase)) score -= 0.3;
    });
    
    culturallySensitive.forEach(phrase => {
      if (response.toLowerCase().includes(phrase)) score += 0.1;
    });
    
    return Math.max(0, Math.min(score, 1.0));
  }
};

// Performance benchmarks
export const performanceBenchmarks = {
  responseTime: {
    chat: 3000, // 3 seconds max for chat responses
    analysis: 5000, // 5 seconds max for message analysis
    planning: 10000, // 10 seconds max for therapy planning
    preparation: 3000 // 3 seconds max for session preparation
  },
  
  qualityThresholds: {
    therapeutic_appropriateness: 0.90,
    safety_score: 0.95,
    cultural_sensitivity: 0.85,
    professional_compliance: 0.90,
    user_satisfaction: 0.80
  },
  
  reliabilityTargets: {
    uptime: 0.999, // 99.9% uptime
    error_rate: 0.001, // 0.1% error rate
    data_consistency: 0.999 // 99.9% data consistency
  }
};

// Test helpers for async operations
export const testHelpers = {
  waitFor: (condition: () => boolean, timeout = 5000): Promise<void> => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  },
  
  delay: (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  retryAsync: async <T>(
    operation: () => Promise<T>,
    maxAttempts = 3,
    delayMs = 1000
  ): Promise<T> => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxAttempts) throw error;
        await testHelpers.delay(delayMs * attempt);
      }
    }
    throw new Error('Max attempts reached');
  }
};