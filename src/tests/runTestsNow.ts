#!/usr/bin/env node

import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

console.log('🚀 Starting Comprehensive AI Test Suite Execution...\n');

const runAllTests = async () => {
  try {
    console.log('🧪 Executing Comprehensive AI Test Suite...');
    
    const config = {
      categories: ['edge-functions', 'crisis-scenarios', 'cultural-adaptation', 'performance-load'],
      maxConcurrentTests: 5,
      timeoutMs: 30000,
      retryAttempts: 2,
      detailedLogging: true
    };
    
    const suiteResult = await aiTestOrchestrator.executeComprehensiveTests(config);
    
    console.log(`✅ Test Suite Completed: ${suiteResult.results.length} total tests`);
    
    console.log('\n🎉 Comprehensive Test Suite Completed!\n');
    console.log('📊 Final Results Summary:');
    console.log('='.repeat(50));
    console.log(`⏱️  Total Duration: ${suiteResult.totalDuration}ms`);
    console.log(`🧪 Total Tests: ${suiteResult.stats.totalTests}`);
    console.log(`✅ Passed: ${suiteResult.stats.passedTests}`);
    console.log(`❌ Failed: ${suiteResult.stats.failedTests}`);
    console.log(`⚠️  Warnings: ${suiteResult.stats.warningTests}`);
    console.log(`⏰ Timeouts: ${suiteResult.stats.timeoutTests}`);
    console.log(`🎯 Success Rate: ${Math.round(suiteResult.stats.overallSuccessRate)}%`);
    console.log(`⚡ Avg Response Time: ${Math.round(suiteResult.stats.averageResponseTime)}ms`);
    
    // Display detailed results by category
    const categoryGroups = suiteResult.results.reduce((acc: any, test) => {
      if (!acc[test.category]) acc[test.category] = [];
      acc[test.category].push(test);
      return acc;
    }, {});
    
    Object.entries(categoryGroups).forEach(([category, tests]: [string, any[]]) => {
      console.log(`\n🗂️  ${category.toUpperCase()}:`);
      tests.forEach(test => {
        const statusIcon = test.status === 'passed' ? '✅' : 
                         test.status === 'failed' ? '❌' : 
                         test.status === 'warning' ? '⚠️' : 
                         test.status === 'timeout' ? '⏰' : '⏳';
        console.log(`  ${statusIcon} ${test.testName} - ${test.duration || 0}ms`);
        if (test.error) {
          console.log(`    └─ Error: ${test.error}`);
        }
      });
    });
    
    console.log('\n📄 Test results have been stored in the database');
    console.log('🌐 View detailed results in the Admin AI Dashboard -> Comprehensive Tests tab');
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
  }
};

runAllTests();

export {};