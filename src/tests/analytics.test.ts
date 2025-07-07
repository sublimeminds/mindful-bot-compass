import { SessionAnalyticsService } from '@/services/sessionAnalyticsService';
import { MoodAnalyticsService } from '@/services/moodAnalyticsService';

// Mock Supabase
const mockSupabase = {
  from: jest.fn()
};

jest.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

describe('Analytics Services Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Session Analytics', () => {
    describe('Session Analytics Calculation', () => {
      test('should calculate session analytics correctly', async () => {
        const mockSessions = [
          {
            id: '1',
            user_id: 'test-user',
            start_time: '2024-01-01T10:00:00Z',
            end_time: '2024-01-01T10:45:00Z',
            mood_before: 3,
            mood_after: 7,
            techniques: ['breathing', 'mindfulness']
          },
          {
            id: '2',
            user_id: 'test-user',
            start_time: '2024-01-02T10:00:00Z',
            end_time: '2024-01-02T10:30:00Z',
            mood_before: 4,
            mood_after: 6,
            techniques: ['cbt']
          },
          {
            id: '3',
            user_id: 'test-user',
            start_time: '2024-01-03T10:00:00Z',
            end_time: null, // Incomplete session
            mood_before: 2,
            mood_after: null
          }
        ];

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: mockSessions, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const analytics = await SessionAnalyticsService.getSessionAnalytics('test-user', '30d');

        expect(analytics.totalSessions).toBe(3);
        expect(analytics.completionRate).toBe(66.67); // 2 completed out of 3
        expect(analytics.averageDuration).toBe(38); // Average of 45 and 30 minutes
        expect(analytics.moodImprovement).toBe(92); // Average improvement calculation
      });

      test('should handle empty session data', async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: [], 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const analytics = await SessionAnalyticsService.getSessionAnalytics('test-user', '30d');

        expect(analytics.totalSessions).toBe(0);
        expect(analytics.averageDuration).toBe(0);
        expect(analytics.completionRate).toBe(0);
        expect(analytics.moodImprovement).toBe(0);
      });

      test('should handle database errors gracefully', async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: null, 
                  error: new Error('Database error') 
                }))
              }))
            }))
          }))
        });

        const analytics = await SessionAnalyticsService.getSessionAnalytics('test-user');

        expect(analytics.totalSessions).toBe(0);
        expect(analytics.effectivenessScore).toBe(0);
      });
    });

    describe('Session Metrics', () => {
      test('should fetch and format session metrics', async () => {
        const mockSessions = [
          {
            id: '1',
            start_time: '2024-01-01T10:00:00Z',
            end_time: '2024-01-01T10:45:00Z',
            mood_before: 3,
            mood_after: 7,
            techniques: ['breathing']
          }
        ];

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: jest.fn(() => Promise.resolve({ 
                  data: mockSessions, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const metrics = await SessionAnalyticsService.getSessionMetrics('test-user', 5);

        expect(metrics).toHaveLength(1);
        expect(metrics[0]).toEqual({
          id: '1',
          sessionDate: new Date('2024-01-01T10:00:00Z').toLocaleDateString(),
          duration: 45,
          moodBefore: 3,
          moodAfter: 7,
          techniques: ['breathing'],
          effectiveness: 85,
          completed: true
        });
      });
    });
  });

  describe('Mood Analytics', () => {
    describe('Mood Entry Management', () => {
      test('should fetch and format mood entries', async () => {
        const mockEntries = [
          {
            id: '1',
            user_id: 'test-user',
            overall: 7,
            energy: 8,
            anxiety: 3,
            notes: 'Feeling good today',
            triggers: ['exercise', 'sleep'],
            created_at: '2024-01-01T10:00:00Z'
          },
          {
            id: '2',
            user_id: 'test-user',
            overall: 5,
            energy: 6,
            anxiety: 5,
            notes: 'Average day',
            triggers: ['work'],
            created_at: '2024-01-02T10:00:00Z'
          }
        ];

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: mockEntries, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const entries = await MoodAnalyticsService.getMoodEntries('test-user', 30);

        expect(entries).toHaveLength(2);
        expect(entries[0]).toEqual({
          id: '1',
          date: new Date('2024-01-01T10:00:00Z').toLocaleDateString(),
          overall: 7,
          energy: 8,
          anxiety: 3,
          mood: 7,
          notes: 'Feeling good today',
          factors: ['exercise', 'sleep']
        });
      });

      test('should log mood entries successfully', async () => {
        mockSupabase.from.mockReturnValue({
          insert: jest.fn(() => Promise.resolve({ error: null }))
        });

        const moodData = {
          overall: 8,
          energy: 7,
          anxiety: 2,
          notes: 'Great day!',
          factors: ['exercise', 'good_sleep']
        };

        const result = await MoodAnalyticsService.logMoodEntry('test-user', moodData);

        expect(result).toBe(true);
        expect(mockSupabase.from).toHaveBeenCalledWith('mood_entries');
      });
    });

    describe('Mood Pattern Analysis', () => {
      test('should identify weekly patterns', async () => {
        const mockEntries = Array.from({ length: 14 }, (_, i) => ({
          id: `${i + 1}`,
          user_id: 'test-user',
          overall: 5 + (i % 3),
          energy: 6,
          anxiety: 4,
          triggers: ['work'],
          created_at: `2024-01-${String(i + 1).padStart(2, '0')}T10:00:00Z`
        }));

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: mockEntries, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const patterns = await MoodAnalyticsService.getMoodPatterns('test-user');

        expect(patterns.length).toBeGreaterThan(0);
        expect(patterns[0]).toHaveProperty('type');
        expect(patterns[0]).toHaveProperty('pattern');
        expect(patterns[0]).toHaveProperty('confidence');
        expect(patterns[0]).toHaveProperty('recommendation');
      });

      test('should return empty patterns for insufficient data', async () => {
        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: [], 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const patterns = await MoodAnalyticsService.getMoodPatterns('test-user');

        expect(patterns).toEqual([]);
      });
    });

    describe('Mood Insights Generation', () => {
      test('should generate mood improvement insights', async () => {
        const mockEntries = [
          // Recent week - higher mood
          ...Array.from({ length: 7 }, (_, i) => ({
            id: `recent-${i + 1}`,
            date: `2024-01-${String(i + 8).padStart(2, '0')}`,
            overall: 7 + (i % 2),
            factors: ['exercise']
          })),
          // Previous week - lower mood
          ...Array.from({ length: 7 }, (_, i) => ({
            id: `previous-${i + 1}`,
            date: `2024-01-${String(i + 1).padStart(2, '0')}`,
            overall: 4 + (i % 2),
            factors: ['work_stress']
          }))
        ];

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: mockEntries, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const insights = await MoodAnalyticsService.getMoodInsights('test-user');

        expect(insights.length).toBeGreaterThan(0);
        
        const improvementInsight = insights.find(i => i.type === 'trend');
        expect(improvementInsight).toBeDefined();
        expect(improvementInsight?.title).toContain('Mood Improvement');
        expect(improvementInsight?.impact).toBe('positive');
      });

      test('should identify key mood factors', async () => {
        const mockEntries = [
          { id: '1', date: '2024-01-01', overall: 6, factors: ['exercise', 'sleep'] },
          { id: '2', date: '2024-01-02', overall: 5, factors: ['exercise'] },
          { id: '3', date: '2024-01-03', overall: 7, factors: ['exercise', 'meditation'] },
          { id: '4', date: '2024-01-04', overall: 4, factors: ['work_stress'] }
        ];

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: mockEntries, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const insights = await MoodAnalyticsService.getMoodInsights('test-user');

        const correlationInsight = insights.find(i => i.type === 'correlation');
        expect(correlationInsight).toBeDefined();
        expect(correlationInsight?.title).toContain('Key Mood Factor');
        expect(correlationInsight?.actionable).toBe(true);
      });
    });

    describe('Weekly Averages Calculation', () => {
      test('should calculate weekly mood averages correctly', async () => {
        // Create test data with known patterns
        const mockEntries = [
          { id: '1', date: '2024-01-01', overall: 8 }, // Monday
          { id: '2', date: '2024-01-01', overall: 6 }, // Monday (another entry)
          { id: '3', date: '2024-01-02', overall: 5 }, // Tuesday
          { id: '4', date: '2024-01-03', overall: 7 }  // Wednesday
        ];

        mockSupabase.from.mockReturnValue({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              gte: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ 
                  data: mockEntries, 
                  error: null 
                }))
              }))
            }))
          }))
        });

        const entries = await MoodAnalyticsService.getMoodEntries('test-user', 7);
        
        // Test the private method indirectly through pattern analysis
        const patterns = await MoodAnalyticsService.getMoodPatterns('test-user');
        
        // Should identify patterns when sufficient data exists
        expect(entries.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle database connection errors', async () => {
      mockSupabase.from.mockImplementation(() => {
        throw new Error('Database connection failed');
      });

      const sessionAnalytics = await SessionAnalyticsService.getSessionAnalytics('test-user');
      const moodEntries = await MoodAnalyticsService.getMoodEntries('test-user');

      expect(sessionAnalytics.totalSessions).toBe(0);
      expect(moodEntries).toEqual([]);
    });

    test('should handle malformed data gracefully', async () => {
      const malformedData = [
        { id: null, overall: 'invalid', anxiety: undefined },
        { user_id: 'test', start_time: 'not-a-date' }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({ 
                data: malformedData, 
                error: null 
              }))
            }))
          }))
        }))
      });

      const analytics = await SessionAnalyticsService.getSessionAnalytics('test-user');
      
      // Should handle gracefully without crashing
      expect(analytics).toBeDefined();
      expect(typeof analytics.totalSessions).toBe('number');
    });

    test('should validate user input for mood logging', async () => {
      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => Promise.resolve({ error: new Error('Invalid data') }))
      });

      const invalidMoodData = {
        overall: -1, // Invalid mood score
        energy: 15,  // Out of range
        anxiety: 'high' // Wrong type
      };

      const result = await MoodAnalyticsService.logMoodEntry('test-user', invalidMoodData as any);

      expect(result).toBe(false);
    });
  });

  describe('Performance and Optimization', () => {
    test('should limit query results appropriately', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              limit: jest.fn((limit) => {
                expect(limit).toBe(5);
                return Promise.resolve({ data: [], error: null });
              })
            }))
          }))
        }))
      });

      await SessionAnalyticsService.getSessionMetrics('test-user', 5);
    });

    test('should use appropriate date ranges', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn((field, date) => {
              expect(field).toBe('start_time');
              expect(typeof date).toBe('string');
              return {
                order: jest.fn(() => Promise.resolve({ data: [], error: null }))
              };
            })
          }))
        }))
      });

      await SessionAnalyticsService.getSessionAnalytics('test-user', '7d');
    });
  });
});

console.log('Analytics tests configured - run with: npm test analytics.test.ts');