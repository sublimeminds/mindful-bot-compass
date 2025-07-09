#!/usr/bin/env tsx
// Comprehensive test runner for 3D Avatar System

import { execSync } from 'child_process';
import chalk from 'chalk';

interface TestSuite {
  name: string;
  file: string;
  description: string;
  critical: boolean;
}

const testSuites: TestSuite[] = [
  {
    name: 'Enhanced Emotion Analyzer',
    file: 'emotion-analyzer.test.ts',
    description: 'Core emotion detection and analysis functionality',
    critical: true
  },
  {
    name: 'WebGL Manager',
    file: 'webgl-manager.test.ts', 
    description: 'WebGL context management and error recovery',
    critical: true
  },
  {
    name: 'Bulletproof 3D Avatar',
    file: 'bulletproof-3d-avatar.test.tsx',
    description: '3D avatar rendering and performance monitoring',
    critical: true
  },
  {
    name: 'Voice Enhanced Avatar V2',
    file: 'voice-enhanced-avatar.test.tsx',
    description: 'Voice analysis and lip sync functionality',
    critical: true
  },
  {
    name: '3D Chat Integration',
    file: '3d-chat-integration.test.tsx',
    description: 'End-to-end chat interface with 3D avatar integration',
    critical: false
  }
];

interface TestResult {
  suite: TestSuite;
  success: boolean;
  duration: number;
  coverage?: number;
  errors?: string[];
}

class TestRunner {
  private results: TestResult[] = [];

  async runAllTests(): Promise<void> {
    console.log(chalk.blue.bold('\n🚀 Running Comprehensive 3D Avatar Test Suite\n'));
    console.log(chalk.gray('Building bulletproof foundation for 3D chat with emotion detection...\n'));

    for (const suite of testSuites) {
      await this.runTestSuite(suite);
    }

    this.generateReport();
  }

  private async runTestSuite(suite: TestSuite): Promise<void> {
    const startTime = Date.now();
    console.log(chalk.cyan(`\n📋 Running: ${suite.name}`));
    console.log(chalk.gray(`   ${suite.description}`));

    try {
      // Run the test file
      const command = `npx vitest run src/tests/${suite.file} --reporter=json --coverage`;
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: 30000, // 30 second timeout per test suite
        stdio: ['pipe', 'pipe', 'pipe']
      });

      const duration = Date.now() - startTime;
      
      // Parse test results (simplified - would parse actual vitest JSON output)
      const success = !output.includes('FAILED') && !output.includes('ERROR');
      
      // Extract coverage if available
      const coverageMatch = output.match(/Coverage:\s*(\d+(?:\.\d+)?)%/);
      const coverage = coverageMatch ? parseFloat(coverageMatch[1]) : undefined;

      this.results.push({
        suite,
        success,
        duration,
        coverage
      });

      if (success) {
        console.log(chalk.green(`   ✅ PASSED (${duration}ms)`));
        if (coverage) {
          console.log(chalk.green(`   📊 Coverage: ${coverage}%`));
        }
      } else {
        console.log(chalk.red(`   ❌ FAILED (${duration}ms)`));
        if (suite.critical) {
          console.log(chalk.red.bold(`   🚨 CRITICAL TEST FAILURE`));
        }
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.results.push({
        suite,
        success: false,
        duration,
        errors: [errorMessage]
      });

      console.log(chalk.red(`   ❌ ERROR (${duration}ms)`));
      console.log(chalk.red(`   ${errorMessage}`));
      
      if (suite.critical) {
        console.log(chalk.red.bold(`   🚨 CRITICAL TEST FAILURE - FOUNDATION COMPROMISED`));
      }
    }
  }

  private generateReport(): void {
    console.log(chalk.blue.bold('\n📊 Test Suite Results Summary\n'));

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const criticalFailures = this.results.filter(r => !r.success && r.suite.critical).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgCoverage = this.results
      .filter(r => r.coverage !== undefined)
      .reduce((sum, r, _, arr) => sum + (r.coverage! / arr.length), 0);

    // Overall status
    if (criticalFailures > 0) {
      console.log(chalk.red.bold('🚨 CRITICAL FAILURES DETECTED - Foundation NOT ready for production'));
    } else if (failedTests > 0) {
      console.log(chalk.yellow.bold('⚠️  Some tests failed - Foundation mostly stable'));
    } else {
      console.log(chalk.green.bold('✅ ALL TESTS PASSED - Foundation is bulletproof and ready!'));
    }

    // Statistics
    console.log(chalk.white('\nStatistics:'));
    console.log(`   Total Test Suites: ${totalTests}`);
    console.log(`   ${chalk.green('Passed:')} ${passedTests}`);
    console.log(`   ${chalk.red('Failed:')} ${failedTests}`);
    console.log(`   ${chalk.red.bold('Critical Failures:')} ${criticalFailures}`);
    console.log(`   Total Duration: ${totalDuration}ms`);
    if (avgCoverage > 0) {
      console.log(`   ${chalk.blue('Average Coverage:')} ${avgCoverage.toFixed(1)}%`);
    }

    // Detailed results
    console.log(chalk.white('\nDetailed Results:'));
    this.results.forEach(result => {
      const status = result.success ? chalk.green('✅ PASS') : chalk.red('❌ FAIL');
      const critical = result.suite.critical ? chalk.red.bold(' [CRITICAL]') : '';
      const coverage = result.coverage ? chalk.blue(` (${result.coverage}%)`) : '';
      
      console.log(`   ${status} ${result.suite.name}${critical} - ${result.duration}ms${coverage}`);
      
      if (result.errors) {
        result.errors.forEach(error => {
          console.log(chalk.red(`     Error: ${error}`));
        });
      }
    });

    // Recommendations
    console.log(chalk.blue.bold('\n💡 Recommendations:\n'));
    
    if (criticalFailures > 0) {
      console.log(chalk.red('• Fix critical test failures before proceeding with 3D chat development'));
      console.log(chalk.red('• Review WebGL compatibility and emotion detection accuracy'));
    }
    
    if (failedTests > 0) {
      console.log(chalk.yellow('• Address failing tests to improve system reliability'));
    }
    
    if (avgCoverage < 80) {
      console.log(chalk.yellow('• Increase test coverage to at least 80% for production readiness'));
    }
    
    if (passedTests === totalTests) {
      console.log(chalk.green('• Foundation is solid! Ready to implement advanced 3D chat features'));
      console.log(chalk.green('• Consider adding integration tests for complete user workflows'));
      console.log(chalk.green('• Performance optimization can be done as next step'));
    }

    // Next steps
    console.log(chalk.blue.bold('\n🎯 Next Development Steps:\n'));
    
    if (criticalFailures === 0) {
      console.log(chalk.green('✅ Phase 1: Core 3D Avatar System - COMPLETE'));
      console.log(chalk.cyan('🔄 Phase 2: Advanced Emotion Recognition'));
      console.log(chalk.cyan('🔄 Phase 3: Real-time Voice Synthesis'));
      console.log(chalk.cyan('🔄 Phase 4: Multi-therapist Support'));
      console.log(chalk.cyan('🔄 Phase 5: Performance Optimization'));
    } else {
      console.log(chalk.red('❌ Phase 1: Core 3D Avatar System - NEEDS FIXES'));
      console.log(chalk.gray('⏸️  Phase 2+: Blocked until Phase 1 is stable'));
    }

    console.log(chalk.blue.bold('\n🏁 Test Suite Complete\n'));
  }
}

// Run the tests
async function main() {
  const runner = new TestRunner();
  try {
    await runner.runAllTests();
    process.exit(0);
  } catch (error) {
    console.error(chalk.red.bold('\n💥 Test runner crashed:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { TestRunner, testSuites };