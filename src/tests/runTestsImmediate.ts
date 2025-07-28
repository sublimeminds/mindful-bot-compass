import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

console.log('🚀 EXECUTING COMPREHENSIVE AI TESTS IMMEDIATELY');

(async () => {
  try {
    const config = {
      categories: ['infrastructure', 'edge-functions'],
      maxConcurrentTests: 3,
      timeoutMs: 20000,
      retryAttempts: 1,
      detailedLogging: true
    };
    
    console.log('⚡ Starting immediate test execution...');
    const startTime = Date.now();
    
    const results = await aiTestOrchestrator.executeComprehensiveTests(config);
    
    console.log('\n🎯 IMMEDIATE TEST EXECUTION COMPLETE!');
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
    console.log('🔍 Checking database results...');
    
    // Verify results in database
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: dbResults, error: dbError } = await supabase
      .from('ai_test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (dbError) {
      console.error('❌ Database verification error:', dbError);
    } else {
      console.log(`📋 Database contains ${dbResults.length} recent test results`);
      dbResults.forEach(result => {
        console.log(`  - ${result.test_name}: ${result.status} (${result.duration}ms)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  }
})();

export {};