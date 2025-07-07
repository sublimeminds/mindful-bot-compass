/**
 * Quick validation script to verify AI system components are working
 * This can be run directly without Jest to validate basic functionality
 */

import { MultiModelAIRouter } from '@/services/multiModelAiRouter';
import { TherapyContextManager } from '@/services/therapyContextManager';
import { SessionAnalyticsService } from '@/services/sessionAnalyticsService';
import { MoodAnalyticsService } from '@/services/moodAnalyticsService';

interface ValidationResult {
  component: string;
  test: string;
  passed: boolean;
  details?: string;
  error?: string;
}

class SystemValidator {
  private results: ValidationResult[] = [];

  async runValidation(): Promise<ValidationResult[]> {
    console.log('🔍 Starting AI System Validation...\n');

    await this.validateAIRouting();
    await this.validateContextManagement();
    await this.validateAnalytics();

    this.printResults();
    return this.results;
  }

  private async validateAIRouting(): Promise<void> {
    console.log('🤖 Validating AI Routing System...');

    try {
      // Test 1: Model selection for crisis
      const crisisModel = await MultiModelAIRouter.selectOptimalModel({
        taskType: 'crisis',
        urgency: 'critical',
        complexity: 'complex',
        userTier: 'premium'
      });

      this.addResult({
        component: 'AI Routing',
        test: 'Crisis Model Selection',
        passed: crisisModel.id === 'claude-opus-4-20250514',
        details: `Selected: ${crisisModel.name} (${crisisModel.id})`
      });

      // Test 2: Cost optimization for free users
      const freeUserModel = await MultiModelAIRouter.selectOptimalModel({
        taskType: 'chat',
        urgency: 'low',
        complexity: 'simple',
        userTier: 'free'
      });

      this.addResult({
        component: 'AI Routing',
        test: 'Free User Cost Optimization',
        passed: freeUserModel.costPerToken < 0.0001,
        details: `Cost per token: $${freeUserModel.costPerToken}`
      });

      // Test 3: Cultural context handling
      const culturalModel = await MultiModelAIRouter.selectOptimalModel({
        taskType: 'cultural',
        urgency: 'medium',
        complexity: 'moderate',
        culturalContext: 'Spanish',
        userTier: 'premium'
      });

      this.addResult({
        component: 'AI Routing',
        test: 'Cultural Context Support',
        passed: culturalModel.capabilities.includes('cultural'),
        details: `Capabilities: ${culturalModel.capabilities.join(', ')}`
      });

    } catch (error) {
      this.addResult({
        component: 'AI Routing',
        test: 'System Availability',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private async validateContextManagement(): Promise<void> {
    console.log('📝 Validating Context Management...');

    const contextManager = TherapyContextManager.getInstance();

    try {
      // Test 1: Singleton pattern
      const instance1 = TherapyContextManager.getInstance();
      const instance2 = TherapyContextManager.getInstance();

      this.addResult({
        component: 'Context Management',
        test: 'Singleton Pattern',
        passed: instance1 === instance2,
        details: 'Same instance returned'
      });

      // Test 2: Model selection logic
      const crisisModel = await contextManager.selectOptimalModel('crisis');
      
      this.addResult({
        component: 'Context Management',
        test: 'Crisis Model Selection',
        passed: crisisModel === 'claude-opus-4-20250514',
        details: `Selected: ${crisisModel}`
      });

      // Test 3: Free user optimization
      const freeModel = await contextManager.selectOptimalModel('daily-therapy', {}, 'free');
      
      this.addResult({
        component: 'Context Management',
        test: 'Free User Model Selection',
        passed: freeModel === 'claude-sonnet-4-20250514',
        details: `Selected: ${freeModel}`
      });

      // Test 4: Cultural context handling
      const culturalModel = await contextManager.selectOptimalModel(
        'general-conversation', 
        { language: 'es', region: 'MX' }
      );
      
      this.addResult({
        component: 'Context Management',
        test: 'Cultural Model Selection',
        passed: culturalModel === 'claude-opus-4-20250514',
        details: `Selected: ${culturalModel} for Spanish context`
      });

    } catch (error) {
      this.addResult({
        component: 'Context Management',
        test: 'System Availability',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private async validateAnalytics(): Promise<void> {
    console.log('📊 Validating Analytics Services...');

    try {
      // Test 1: Date range calculation (private method test via side effects)
      const mockAnalytics = await SessionAnalyticsService.getSessionAnalytics('test-user', '7d');
      
      this.addResult({
        component: 'Session Analytics',
        test: 'Service Availability',
        passed: typeof mockAnalytics === 'object' && mockAnalytics !== null,
        details: 'Service returns structured data'
      });

      // Test 2: Mood analytics structure
      const mockMoodEntries = await MoodAnalyticsService.getMoodEntries('test-user', 30);
      
      this.addResult({
        component: 'Mood Analytics',
        test: 'Service Availability',
        passed: Array.isArray(mockMoodEntries),
        details: 'Service returns array structure'
      });

      // Test 3: Pattern analysis capability
      const mockPatterns = await MoodAnalyticsService.getMoodPatterns('test-user');
      
      this.addResult({
        component: 'Mood Analytics',
        test: 'Pattern Analysis',
        passed: Array.isArray(mockPatterns),
        details: 'Pattern analysis service available'
      });

      // Test 4: Insights generation
      const mockInsights = await MoodAnalyticsService.getMoodInsights('test-user');
      
      this.addResult({
        component: 'Mood Analytics',
        test: 'Insights Generation',
        passed: Array.isArray(mockInsights),
        details: 'Insights generation service available'
      });

    } catch (error) {
      this.addResult({
        component: 'Analytics',
        test: 'System Availability',
        passed: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private addResult(result: ValidationResult): void {
    this.results.push(result);
    const status = result.passed ? '✅' : '❌';
    const details = result.details ? ` - ${result.details}` : '';
    const error = result.error ? ` - ERROR: ${result.error}` : '';
    console.log(`  ${status} ${result.test}${details}${error}`);
  }

  private printResults(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;

    console.log('\n' + '='.repeat(50));
    console.log('🎯 VALIDATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => {
          console.log(`  • ${r.component} - ${r.test}`);
          if (r.error) console.log(`    Error: ${r.error}`);
        });
    }

    console.log('\n' + '='.repeat(50));
    
    const status = failedTests === 0 ? '🎉 ALL SYSTEMS OPERATIONAL' : '⚠️  ISSUES DETECTED';
    console.log(status);
    console.log('='.repeat(50));
  }
}

// Export for use in other scripts
export { SystemValidator };
export type { ValidationResult };

// CLI execution
if (require.main === module) {
  const validator = new SystemValidator();
  validator.runValidation()
    .then(results => {
      const failedCount = results.filter(r => !r.passed).length;
      process.exit(failedCount > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Validation failed:', error);
      process.exit(1);
    });
}

console.log(`
🚀 Quick System Validation Available

Run validation:
- node src/tests/validation.ts    # Direct validation without Jest
- npm test                        # Full Jest test suite
- npm test:watch                  # Watch mode for development

This validates:
✅ AI Model Selection Logic
✅ Context Management Singleton
✅ Analytics Service Structure
✅ Error Handling Patterns
`);