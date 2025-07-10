import { supabase } from '@/integrations/supabase/client';

export interface NotificationABTest {
  id: string;
  testName: string;
  notificationType: string;
  variantA: Record<string, any>;
  variantB: Record<string, any>;
  trafficSplit: number;
  successMetric: 'click_rate' | 'conversion_rate' | 'engagement_score';
  targetSampleSize: number;
  currentSampleSize: number;
  results: Record<string, any>;
  status: 'active' | 'paused' | 'completed' | 'archived';
  startedAt: Date;
  endedAt?: Date;
  createdBy: string;
  createdAt: Date;
}

export interface ABTestAssignment {
  id: string;
  testId: string;
  userId: string;
  variant: 'a' | 'b';
  assignedAt: Date;
  converted: boolean;
  conversionData: Record<string, any>;
}

export interface ABTestResults {
  variantA: {
    participants: number;
    conversions: number;
    conversionRate: number;
    engagementScore: number;
    clickRate: number;
  };
  variantB: {
    participants: number;
    conversions: number;
    conversionRate: number;
    engagementScore: number;
    clickRate: number;
  };
  statisticalSignificance: number;
  winningVariant?: 'a' | 'b';
  confidenceLevel: number;
}

export class NotificationABTestService {
  /**
   * Create a new A/B test
   */
  static async createABTest(test: Partial<NotificationABTest>): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('notification_ab_tests')
        .insert({
          test_name: test.testName,
          notification_type: test.notificationType,
          variant_a: test.variantA,
          variant_b: test.variantB,
          traffic_split: test.trafficSplit || 0.5,
          success_metric: test.successMetric,
          target_sample_size: test.targetSampleSize || 1000,
          current_sample_size: 0,
          results: {},
          status: 'active',
          created_by: test.createdBy
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating A/B test:', error);
      return null;
    }
  }

  /**
   * Get A/B test variant for a user
   */
  static async getVariantForUser(
    userId: string,
    notificationType: string
  ): Promise<{ variant: 'a' | 'b'; testId: string; config: Record<string, any> } | null> {
    try {
      // Check if user already has an assignment for this notification type
      const { data: existingAssignment } = await supabase
        .from('notification_ab_assignments')
        .select(`
          *,
          notification_ab_tests!inner(*)
        `)
        .eq('user_id', userId)
        .eq('notification_ab_tests.notification_type', notificationType)
        .eq('notification_ab_tests.status', 'active')
        .single();

      if (existingAssignment) {
        const test = existingAssignment.notification_ab_tests;
        return {
          variant: existingAssignment.variant as 'a' | 'b',
          testId: existingAssignment.test_id,
          config: existingAssignment.variant === 'a' ? 
            test.variant_a as Record<string, any> : 
            test.variant_b as Record<string, any>
        };
      }

      // Get active test for this notification type
      const { data: activeTest } = await supabase
        .from('notification_ab_tests')
        .select('*')
        .eq('notification_type', notificationType)
        .eq('status', 'active')
        .lt('current_sample_size', 'target_sample_size')
        .single();

      if (!activeTest) return null;

      // Assign user to variant based on traffic split
      const variant = Math.random() < activeTest.traffic_split ? 'a' : 'b';

      // Create assignment
      await supabase
        .from('notification_ab_assignments')
        .insert({
          test_id: activeTest.id,
          user_id: userId,
          variant
        });

      // Update sample size
      await supabase
        .from('notification_ab_tests')
        .update({
          current_sample_size: activeTest.current_sample_size + 1
        })
        .eq('id', activeTest.id);

      return {
        variant,
        testId: activeTest.id,
        config: variant === 'a' ? 
          activeTest.variant_a as Record<string, any> : 
          activeTest.variant_b as Record<string, any>
      };
    } catch (error) {
      console.error('Error getting variant for user:', error);
      return null;
    }
  }

  /**
   * Record conversion for A/B test
   */
  static async recordConversion(
    userId: string,
    testId: string,
    conversionData?: Record<string, any>
  ): Promise<void> {
    try {
      await supabase
        .from('notification_ab_assignments')
        .update({
          converted: true,
          conversion_data: conversionData || {}
        })
        .eq('user_id', userId)
        .eq('test_id', testId);

      // Update test results
      await this.updateTestResults(testId);
    } catch (error) {
      console.error('Error recording conversion:', error);
    }
  }

  /**
   * Update test results and check for completion
   */
  private static async updateTestResults(testId: string): Promise<void> {
    try {
      const results = await this.calculateTestResults(testId);
      
      const { data: test } = await supabase
        .from('notification_ab_tests')
        .select('target_sample_size, current_sample_size')
        .eq('id', testId)
        .single();

      if (!test) return;

      // Check if test should be completed
      const shouldComplete = test.current_sample_size >= test.target_sample_size ||
                           results.statisticalSignificance >= 0.95;

      await supabase
        .from('notification_ab_tests')
        .update({
          results: results as any,
          status: shouldComplete ? 'completed' : 'active',
          ended_at: shouldComplete ? new Date().toISOString() : undefined
        })
        .eq('id', testId);
    } catch (error) {
      console.error('Error updating test results:', error);
    }
  }

  /**
   * Calculate A/B test results
   */
  static async calculateTestResults(testId: string): Promise<ABTestResults> {
    try {
      const { data: assignments } = await supabase
        .from('notification_ab_assignments')
        .select('*')
        .eq('test_id', testId);

      if (!assignments || assignments.length === 0) {
        return {
          variantA: { participants: 0, conversions: 0, conversionRate: 0, engagementScore: 0, clickRate: 0 },
          variantB: { participants: 0, conversions: 0, conversionRate: 0, engagementScore: 0, clickRate: 0 },
          statisticalSignificance: 0,
          confidenceLevel: 0
        };
      }

      const variantAData = assignments.filter(a => a.variant === 'a');
      const variantBData = assignments.filter(a => a.variant === 'b');

      const variantAConversions = variantAData.filter(a => a.converted).length;
      const variantBConversions = variantBData.filter(a => a.converted).length;

      const variantARate = variantAData.length > 0 ? variantAConversions / variantAData.length : 0;
      const variantBRate = variantBData.length > 0 ? variantBConversions / variantBData.length : 0;

      // Calculate statistical significance using z-test
      const significance = this.calculateStatisticalSignificance(
        variantAData.length,
        variantAConversions,
        variantBData.length,
        variantBConversions
      );

      const winningVariant = variantBRate > variantARate ? 'b' : 'a';

      return {
        variantA: {
          participants: variantAData.length,
          conversions: variantAConversions,
          conversionRate: variantARate,
          engagementScore: this.calculateEngagementScore(variantAData),
          clickRate: variantARate // Simplified - in real implementation, track clicks separately
        },
        variantB: {
          participants: variantBData.length,
          conversions: variantBConversions,
          conversionRate: variantBRate,
          engagementScore: this.calculateEngagementScore(variantBData),
          clickRate: variantBRate
        },
        statisticalSignificance: significance,
        winningVariant: Math.abs(variantBRate - variantARate) > 0.01 ? winningVariant : undefined,
        confidenceLevel: significance
      };
    } catch (error) {
      console.error('Error calculating test results:', error);
      return {
        variantA: { participants: 0, conversions: 0, conversionRate: 0, engagementScore: 0, clickRate: 0 },
        variantB: { participants: 0, conversions: 0, conversionRate: 0, engagementScore: 0, clickRate: 0 },
        statisticalSignificance: 0,
        confidenceLevel: 0
      };
    }
  }

  /**
   * Calculate statistical significance using z-test
   */
  private static calculateStatisticalSignificance(
    nA: number,
    cA: number,
    nB: number,
    cB: number
  ): number {
    if (nA === 0 || nB === 0) return 0;

    const pA = cA / nA;
    const pB = cB / nB;
    const p = (cA + cB) / (nA + nB);
    
    const se = Math.sqrt(p * (1 - p) * (1/nA + 1/nB));
    const z = Math.abs(pA - pB) / se;
    
    // Convert z-score to confidence level (simplified)
    if (z > 2.58) return 0.99;
    if (z > 1.96) return 0.95;
    if (z > 1.64) return 0.90;
    return z / 2.58 * 0.90; // Linear approximation for lower values
  }

  /**
   * Calculate engagement score from assignment data
   */
  private static calculateEngagementScore(assignments: any[]): number {
    if (assignments.length === 0) return 0;
    
    return assignments.reduce((sum, assignment) => {
      const conversionData = assignment.conversion_data || {};
      const timeToConversion = conversionData.timeToConversion || 0;
      const interactionCount = conversionData.interactionCount || 0;
      
      // Simple engagement score calculation
      let score = assignment.converted ? 1 : 0;
      score += Math.min(interactionCount * 0.1, 0.5);
      score -= Math.min(timeToConversion / (24 * 60 * 60 * 1000) * 0.1, 0.3); // Penalize longer time to conversion
      
      return sum + Math.max(0, Math.min(1, score));
    }, 0) / assignments.length;
  }

  /**
   * Get all A/B tests
   */
  static async getAllTests(): Promise<NotificationABTest[]> {
    try {
      const { data, error } = await supabase
        .from('notification_ab_tests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(test => ({
        id: test.id,
        testName: test.test_name,
        notificationType: test.notification_type,
        variantA: test.variant_a as Record<string, any>,
        variantB: test.variant_b as Record<string, any>,
        trafficSplit: test.traffic_split,
        successMetric: test.success_metric as 'click_rate' | 'conversion_rate' | 'engagement_score',
        targetSampleSize: test.target_sample_size,
        currentSampleSize: test.current_sample_size,
        results: test.results as Record<string, any>,
        status: test.status as 'active' | 'paused' | 'completed' | 'archived',
        startedAt: new Date(test.started_at),
        endedAt: test.ended_at ? new Date(test.ended_at) : undefined,
        createdBy: test.created_by,
        createdAt: new Date(test.created_at)
      }));
    } catch (error) {
      console.error('Error fetching A/B tests:', error);
      return [];
    }
  }

  /**
   * Pause/resume A/B test
   */
  static async updateTestStatus(
    testId: string,
    status: 'active' | 'paused' | 'completed' | 'archived'
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notification_ab_tests')
        .update({
          status,
          ended_at: status === 'completed' ? new Date().toISOString() : undefined
        })
        .eq('id', testId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating test status:', error);
      return false;
    }
  }
}