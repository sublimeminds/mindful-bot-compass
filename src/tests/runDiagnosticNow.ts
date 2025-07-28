import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

console.log('🔥 RUNNING DIAGNOSTIC AI TESTS');

(async () => {
  try {
    const config = {
      categories: ['infrastructure', 'edge-functions'],
      maxConcurrentTests: 2,
      timeoutMs: 15000,
      retryAttempts: 1,
      detailedLogging: true
    };
    
    console.log('⚡ Starting diagnostic test execution...');
    const results = await aiTestOrchestrator.executeComprehensiveTests(config);
    
    console.log('\n🎯 DIAGNOSTIC TEST COMPLETE!');
    console.log('=' .repeat(60));
    console.log(`✅ Success Rate: ${results.stats.overallSuccessRate}%`);
    console.log(`⏱️ Total Duration: ${results.totalDuration}ms`);
    console.log(`🧪 Tests Executed: ${results.stats.totalTests}`);
    console.log(`✅ Passed: ${results.stats.passedTests}`);
    console.log(`❌ Failed: ${results.stats.failedTests}`);
    console.log(`⚠️ Warnings: ${results.stats.warningTests}`);
    console.log(`⏰ Timeouts: ${results.stats.timeoutTests}`);
    
    console.log('\n📊 DETAILED RESULTS:');
    results.results.forEach((test, i) => {
      const icon = test.status === 'passed' ? '✅' : 
                   test.status === 'failed' ? '❌' : 
                   test.status === 'warning' ? '⚠️' : 
                   test.status === 'timeout' ? '⏰' : '⏳';
      console.log(`${i+1}. ${icon} ${test.testName}`);
      console.log(`   Status: ${test.status} | Duration: ${test.duration || 0}ms`);
      if (test.error) console.log(`   Error: ${test.error.substring(0, 100)}...`);
    });
    
    console.log('\n💾 Results stored in ai_test_results table');
    console.log('🌐 View results in database');
    
  } catch (error) {
    console.error('❌ Diagnostic test execution failed:', error);
  }
})();

export {};