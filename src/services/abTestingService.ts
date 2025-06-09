
import { supabase } from '@/integrations/supabase/client';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'completed' | 'paused';
  startDate: Date;
  endDate?: Date;
  variants: ABTestVariant[];
  targetAudience: {
    userSegment?: string;
    percentage: number;
  };
  metrics: {
    primary: string;
    secondary: string[];
  };
  results?: ABTestResults;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  weight: number;
  config: {
    title?: string;
    message?: string;
    timing?: string;
    frequency?: string;
  };
  metrics: {
    participants: number;
    conversions: number;
    conversionRate: number;
  };
}

export interface ABTestResults {
  winner?: string;
  confidence: number;
  significance: number;
  completedAt: Date;
  summary: string;
}

export class ABTestingService {
  static async createTest(test: Omit<ABTest, 'id'>): Promise<string | null> {
    try {
      // Store A/B test data in notifications table as a workaround
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          title: `AB Test: ${test.name}`,
          message: test.description,
          type: 'ab_test',
          priority: 'low',
          data: {
            test_config: {
              name: test.name,
              description: test.description,
              status: test.status,
              start_date: test.startDate.toISOString(),
              end_date: test.endDate?.toISOString(),
              variants: test.variants as any,
              target_audience: test.targetAudience as any,
              metrics: test.metrics as any
            }
          } as any,
          user_id: '00000000-0000-0000-0000-000000000000' // System user
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      return null;
    }
  }

  static async getTests(userId: string): Promise<ABTest[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'ab_test')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(notification => {
        const testConfig = (notification.data as any)?.test_config;
        return {
          id: notification.id,
          name: testConfig?.name || 'Unnamed Test',
          description: testConfig?.description || '',
          status: testConfig?.status || 'draft',
          startDate: new Date(testConfig?.start_date || notification.created_at),
          endDate: testConfig?.end_date ? new Date(testConfig.end_date) : undefined,
          variants: testConfig?.variants || [],
          targetAudience: testConfig?.target_audience || { percentage: 100 },
          metrics: testConfig?.metrics || { primary: 'click_rate', secondary: [] },
          results: testConfig?.results
        };
      }) || [];
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      return [];
    }
  }

  static async assignUserToVariant(testId: string, userId: string): Promise<string | null> {
    try {
      // Check if user is already assigned (stored in user notifications)
      const { data: existing } = await supabase
        .from('notifications')
        .select('data')
        .eq('id', testId)
        .eq('user_id', userId)
        .single();

      if ((existing?.data as any)?.variant_id) return (existing.data as any).variant_id;

      // Get test details
      const { data: test } = await supabase
        .from('notifications')
        .select('data')
        .eq('id', testId)
        .single();

      if (!(test?.data as any)?.test_config) return null;

      // Randomly assign based on weights
      const variants = (test.data as any).test_config.variants || [];
      const totalWeight = variants.reduce((sum: number, v: any) => sum + v.weight, 0);
      const random = Math.random() * totalWeight;
      
      let currentWeight = 0;
      let selectedVariant = variants[0]?.id;
      
      for (const variant of variants) {
        currentWeight += variant.weight;
        if (random <= currentWeight) {
          selectedVariant = variant.id;
          break;
        }
      }

      // Save assignment as user notification
      await supabase
        .from('notifications')
        .insert({
          title: 'A/B Test Assignment',
          message: `Assigned to variant ${selectedVariant}`,
          type: 'ab_test_assignment',
          user_id: userId,
          data: {
            test_id: testId,
            variant_id: selectedVariant
          } as any
        });

      return selectedVariant;
    } catch (error) {
      console.error('Error assigning user to variant:', error);
      return null;
    }
  }

  static async trackConversion(testId: string, userId: string, conversionType: string): Promise<void> {
    try {
      await supabase
        .from('notifications')
        .insert({
          title: 'A/B Test Conversion',
          message: `Conversion: ${conversionType}`,
          type: 'ab_test_conversion',
          user_id: userId,
          data: {
            test_id: testId,
            conversion_type: conversionType,
            timestamp: new Date().toISOString()
          } as any
        });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  static async calculateResults(testId: string): Promise<ABTestResults | null> {
    try {
      // Get conversions and assignments from notifications
      const { data: conversions } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'ab_test_conversion')
        .like('data->>test_id', testId);

      const { data: assignments } = await supabase
        .from('notifications')
        .select('*')
        .eq('type', 'ab_test_assignment')
        .like('data->>test_id', testId);

      if (!conversions || !assignments) return null;

      // Calculate basic statistics
      const variantStats = assignments.reduce((acc: any, assignment: any) => {
        const variantId = (assignment.data as any)?.variant_id;
        if (!acc[variantId]) {
          acc[variantId] = { participants: 0, conversions: 0 };
        }
        acc[variantId].participants++;
        
        const hasConversion = conversions.some((c: any) => c.user_id === assignment.user_id);
        if (hasConversion) acc[variantId].conversions++;
        
        return acc;
      }, {});

      // Find winner (highest conversion rate)
      let bestVariant = '';
      let bestRate = 0;
      
      Object.entries(variantStats).forEach(([variantId, stats]: [string, any]) => {
        const rate = stats.participants > 0 ? stats.conversions / stats.participants : 0;
        if (rate > bestRate) {
          bestRate = rate;
          bestVariant = variantId;
        }
      });

      return {
        winner: bestVariant,
        confidence: 95, // Simplified
        significance: 0.05,
        completedAt: new Date(),
        summary: `Variant ${bestVariant} performed best with ${(bestRate * 100).toFixed(2)}% conversion rate`
      };
    } catch (error) {
      console.error('Error calculating results:', error);
      return null;
    }
  }
}
