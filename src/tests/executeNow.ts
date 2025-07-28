import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

console.log('🚀 Executing AI Tests Now...');

// Run tests immediately when this file is imported
(async () => {
  try {
    const config = {
      categories: ['edge-functions'],
      maxConcurrentTests: 3,
      timeoutMs: 20000,
      retryAttempts: 2,
      detailedLogging: true
    };
    
    console.log('⚡ Starting test execution...');
    const results = await aiTestOrchestrator.executeComprehensiveTests(config);
    
    console.log('\n🎉 Tests Complete!');
    console.log(`✅ Success Rate: ${results.stats.overallSuccessRate}%`);
    console.log(`⏱️ Duration: ${results.totalDuration}ms`);
    console.log(`🧪 Total Tests: ${results.stats.totalTests}`);
    
    // Log each test result
    results.results.forEach(test => {
      const icon = test.status === 'passed' ? '✅' : test.status === 'failed' ? '❌' : '⚠️';
      console.log(`${icon} ${test.testName}: ${test.status} (${test.duration}ms)`);
      if (test.error) console.log(`   Error: ${test.error}`);
    });
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
})();

export {};