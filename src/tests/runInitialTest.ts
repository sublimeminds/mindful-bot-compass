#!/usr/bin/env node

import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

console.log('🧪 Running Initial Test Infrastructure Verification...\n');

const runInitialTest = async () => {
  try {
    console.log('🔍 Testing basic functionality with minimal config...');
    
    const config = {
      categories: ['edge-functions'], // Just test edge functions first
      maxConcurrentTests: 2,
      timeoutMs: 15000,
      retryAttempts: 1,
      detailedLogging: true
    };
    
    console.log('⚡ Starting test execution...');
    const startTime = Date.now();
    
    const suiteResult = await aiTestOrchestrator.executeComprehensiveTests(config);
    
    const duration = Date.now() - startTime;
    
    console.log('\n🎉 Initial Test Completed!\n');
    console.log('📊 Results Summary:');
    console.log('='.repeat(50));
    console.log(`⏱️  Total Duration: ${duration}ms`);
    console.log(`🧪 Total Tests: ${suiteResult.stats.totalTests}`);
    console.log(`✅ Passed: ${suiteResult.stats.passedTests}`);
    console.log(`❌ Failed: ${suiteResult.stats.failedTests}`);
    console.log(`⚠️  Warnings: ${suiteResult.stats.warningTests}`);
    console.log(`⏰ Timeouts: ${suiteResult.stats.timeoutTests}`);
    console.log(`🎯 Success Rate: ${Math.round(suiteResult.stats.overallSuccessRate)}%`);
    console.log(`⚡ Avg Response Time: ${Math.round(suiteResult.stats.averageResponseTime)}ms`);
    
    // Display detailed results
    console.log('\n🗂️  DETAILED RESULTS:');
    suiteResult.results.forEach(test => {
      const statusIcon = test.status === 'passed' ? '✅' : 
                       test.status === 'failed' ? '❌' : 
                       test.status === 'warning' ? '⚠️' : 
                       test.status === 'timeout' ? '⏰' : '⏳';
      console.log(`  ${statusIcon} ${test.testName} - ${test.duration || 0}ms`);
      if (test.error) {
        console.log(`    └─ Error: ${test.error}`);
      }
      if (test.metrics.performance) {
        console.log(`    └─ Performance: ${Math.round(test.metrics.performance * 100)}%`);
      }
    });
    
    console.log('\n📄 Test results have been stored in the ai_test_results table');
    console.log('🌐 View detailed results in the Admin AI Dashboard -> Comprehensive Tests tab');
    
    if (suiteResult.stats.overallSuccessRate >= 50) {
      console.log('\n🚀 Test infrastructure is working! Ready for full test execution.');
    } else {
      console.log('\n⚠️  Test infrastructure needs attention. Check edge function deployments.');
    }
    
  } catch (error) {
    console.error('❌ Initial test failed:', error);
    console.log('\n🔧 Possible issues:');
    console.log('  - Edge functions not deployed');
    console.log('  - Database connection issues');
    console.log('  - Authentication problems');
    console.log('  - Network connectivity');
    process.exit(1);
  }
};

runInitialTest();

export {};