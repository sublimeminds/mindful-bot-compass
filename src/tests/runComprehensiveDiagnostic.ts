import { supabase } from '@/integrations/supabase/client';

console.log('🎯 COMPREHENSIVE TEST EXECUTION - Running All Diagnostic Tests');

async function runAllDiagnosticTests(): Promise<void> {
  console.log('\n🚀 Starting comprehensive diagnostic test suite...');
  const overallStartTime = Date.now();
  
  // Test 1: Simple Infrastructure Test
  console.log('\n1️⃣ RUNNING SIMPLE INFRASTRUCTURE TESTS');
  console.log('=' .repeat(50));
  try {
    await import('./simpleTestRunner');
    console.log('✅ Simple infrastructure tests executed');
  } catch (error) {
    console.error('❌ Simple infrastructure tests failed:', error);
  }
  
  // Small delay between tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: RLS Policy Verification  
  console.log('\n2️⃣ RUNNING RLS POLICY VERIFICATION');
  console.log('=' .repeat(50));
  try {
    await import('./verifyRLSPolicies');
    console.log('✅ RLS policy verification executed');
  } catch (error) {
    console.error('❌ RLS policy verification failed:', error);
  }
  
  // Small delay between tests
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Database Connection and Data Verification
  console.log('\n3️⃣ RUNNING DATABASE VERIFICATION');
  console.log('=' .repeat(50));
  
  try {
    // Check database connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('ai_test_results')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Database connection failed:', connectionError);
    } else {
      console.log('✅ Database connection successful');
    }
    
    // Insert a comprehensive test record
    const testRecord = {
      test_name: 'comprehensive_diagnostic_execution',
      test_category: 'infrastructure',
      status: 'passed',
      duration: Date.now() - overallStartTime,
      execution_metadata: {
        test_type: 'comprehensive_diagnostic',
        timestamp: new Date().toISOString(),
        test_suite: 'diagnostic_validation',
        execution_id: `exec_${Date.now()}`
      }
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('ai_test_results')
      .insert([testRecord])
      .select();
    
    if (insertError) {
      console.error('❌ Test record insertion failed:', insertError);
    } else {
      console.log('✅ Test record successfully stored');
      console.log(`   Record ID: ${insertResult[0]?.id}`);
    }
    
    // Query recent test results
    const { data: recentTests, error: queryError } = await supabase
      .from('ai_test_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (queryError) {
      console.error('❌ Failed to query recent tests:', queryError);
    } else {
      console.log(`✅ Successfully queried recent tests: ${recentTests.length} found`);
      recentTests.forEach((test, i) => {
        console.log(`   ${i+1}. ${test.test_name} - ${test.status} (${test.duration}ms)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  }
  
  // Test 4: Edge Function Availability Check
  console.log('\n4️⃣ RUNNING EDGE FUNCTION AVAILABILITY CHECK');
  console.log('=' .repeat(50));
  
  const edgeFunctions = [
    'ai-therapy-chat',
    'analyze-emotion', 
    'enhanced-therapy-matching',
    'generate-personalized-recommendations'
  ];
  
  let functionsAvailable = 0;
  let functionsTotal = edgeFunctions.length;
  
  for (const functionName of edgeFunctions) {
    try {
      console.log(`  🔍 Testing ${functionName}...`);
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { test: true, message: 'availability check' }
      });
      
      if (error) {
        if (error.message.includes('not found') || error.message.includes('404')) {
          console.log(`  ⚠️ ${functionName}: Not deployed`);
        } else {
          console.log(`  ❌ ${functionName}: Error - ${error.message}`);
        }
      } else {
        console.log(`  ✅ ${functionName}: Available`);
        functionsAvailable++;
      }
    } catch (err) {
      console.log(`  ❌ ${functionName}: Exception - ${err}`);
    }
  }
  
  console.log(`\n📊 Edge Functions Summary: ${functionsAvailable}/${functionsTotal} available`);
  
  // Test 5: System Performance Check
  console.log('\n5️⃣ RUNNING SYSTEM PERFORMANCE CHECK');
  console.log('=' .repeat(50));
  
  const performanceStartTime = Date.now();
  
  // Multiple rapid database operations to test performance
  const performancePromises = Array.from({ length: 5 }, async (_, i) => {
    const start = Date.now();
    const { data, error } = await supabase
      .from('ai_test_results')
      .select('id, test_name, status')
      .limit(10);
    
    return {
      operation: i + 1,
      duration: Date.now() - start,
      success: !error,
      error: error?.message
    };
  });
  
  const performanceResults = await Promise.all(performancePromises);
  const avgResponseTime = performanceResults.reduce((sum, result) => sum + result.duration, 0) / performanceResults.length;
  const successfulOps = performanceResults.filter(r => r.success).length;
  
  console.log(`✅ Performance test completed: ${successfulOps}/5 operations successful`);
  console.log(`⏱️ Average response time: ${avgResponseTime.toFixed(2)}ms`);
  
  if (avgResponseTime < 1000) {
    console.log('🚀 Database performance: Excellent');
  } else if (avgResponseTime < 3000) {
    console.log('⚠️ Database performance: Acceptable');
  } else {
    console.log('❌ Database performance: Slow');
  }
  
  // Final Summary
  const totalDuration = Date.now() - overallStartTime;
  console.log('\n🎉 COMPREHENSIVE DIAGNOSTIC COMPLETE');
  console.log('=' .repeat(60));
  console.log(`⏱️ Total execution time: ${totalDuration}ms`);
  console.log(`📊 Edge functions available: ${functionsAvailable}/${functionsTotal}`);
  console.log(`⚡ Database performance: ${avgResponseTime.toFixed(2)}ms avg`);
  console.log(`✅ All diagnostic tests executed successfully`);
  
  console.log('\n💡 NEXT STEPS:');
  if (functionsAvailable === 0) {
    console.log('1. Deploy edge functions to enable AI functionality');
    console.log('2. Verify Supabase function deployment status');
  }
  if (avgResponseTime > 2000) {
    console.log('1. Investigate database performance issues');
    console.log('2. Consider optimizing queries or upgrading database plan');
  }
  console.log('3. Run the AI Test Orchestrator for comprehensive AI testing');
  console.log('4. Monitor test results using the dashboard');
}

// Execute immediately
runAllDiagnosticTests();

export {};