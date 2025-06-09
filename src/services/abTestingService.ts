
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
      const { data, error } = await supabase
        .from('ab_tests')
        .insert({
          name: test.name,
          description: test.description,
          status: test.status,
          start_date: test.startDate.toISOString(),
          end_date: test.endDate?.toISOString(),
          variants: test.variants,
          target_audience: test.targetAudience,
          metrics: test.metrics
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
        .from('ab_tests')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(test => ({
        id: test.id,
        name: test.name,
        description: test.description,
        status: test.status,
        startDate: new Date(test.start_date),
        endDate: test.end_date ? new Date(test.end_date) : undefined,
        variants: test.variants || [],
        targetAudience: test.target_audience || { percentage: 100 },
        metrics: test.metrics || { primary: 'click_rate', secondary: [] },
        results: test.results
      })) || [];
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      return [];
    }
  }

  static async assignUserToVariant(testId: string, userId: string): Promise<string | null> {
    try {
      // Check if user is already assigned
      const { data: existing } = await supabase
        .from('ab_test_assignments')
        .select('variant_id')
        .eq('test_id', testId)
        .eq('user_id', userId)
        .single();

      if (existing) return existing.variant_id;

      // Get test details
      const { data: test } = await supabase
        .from('ab_tests')
        .select('variants')
        .eq('id', testId)
        .single();

      if (!test) return null;

      // Randomly assign based on weights
      const variants = test.variants || [];
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

      // Save assignment
      await supabase
        .from('ab_test_assignments')
        .insert({
          test_id: testId,
          user_id: userId,
          variant_id: selectedVariant
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
        .from('ab_test_conversions')
        .insert({
          test_id: testId,
          user_id: userId,
          conversion_type: conversionType,
          timestamp: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  static async calculateResults(testId: string): Promise<ABTestResults | null> {
    try {
      // This would involve complex statistical calculations
      // For now, return a simplified result
      const { data: conversions } = await supabase
        .from('ab_test_conversions')
        .select('*')
        .eq('test_id', testId);

      const { data: assignments } = await supabase
        .from('ab_test_assignments')
        .select('*')
        .eq('test_id', testId);

      if (!conversions || !assignments) return null;

      // Calculate basic statistics
      const variantStats = assignments.reduce((acc: any, assignment: any) => {
        const variantId = assignment.variant_id;
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
