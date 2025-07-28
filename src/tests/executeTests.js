// Execute comprehensive AI tests directly
async function runTests() {
  console.log('🚀 Starting Comprehensive AI Test Execution...\n');
  
  try {
    // Import the orchestrator
    const { aiTestOrchestrator } = await import('../services/aiTestOrchestrator.ts');
    
    const config = {
      categories: ['edge-functions', 'crisis-scenarios', 'cultural-adaptation', 'performance-load'],
      maxConcurrentTests: 5,
      timeoutMs: 30000,
      retryAttempts: 2,
      detailedLogging: true
    };
    
    console.log('🧪 Executing comprehensive test suite...');
    const results = await aiTestOrchestrator.executeComprehensiveTests(config);
    
    console.log('\n🎉 Test Execution Complete!');
    console.log('📊 Results Summary:');
    console.log(`⏱️ Duration: ${results.totalDuration}ms`);
    console.log(`✅ Passed: ${results.stats.passedTests}`);
    console.log(`❌ Failed: ${results.stats.failedTests}`);
    console.log(`⚠️ Warnings: ${results.stats.warningTests}`);
    console.log(`🎯 Success Rate: ${Math.round(results.stats.overallSuccessRate)}%`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
    throw error;
  }
}

// Run immediately
runTests();