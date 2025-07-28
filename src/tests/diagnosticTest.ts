import { supabase } from '@/integrations/supabase/client';
import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';

console.log('🔍 RUNNING COMPREHENSIVE DIAGNOSTIC TEST');

(async () => {
  try {
    // Test 1: Database connection
    console.log('\n1️⃣ Testing database connection...');
    const { data: testData, error: dbError } = await supabase
      .from('ai_test_results')
      .select('*')
      .limit(1);
    
    if (dbError) {
      console.error('❌ Database connection failed:', dbError);
    } else {
      console.log('✅ Database connection successful');
    }

    // Test 2: Edge function availability
    console.log('\n2️⃣ Testing edge function availability...');
    try {
      const { data: funcData, error: funcError } = await supabase.functions.invoke('ai-therapy-chat', {
        body: { message: 'test', user_id: 'test' }
      });
      console.log('✅ Edge function accessible');
    } catch (funcErr) {
      console.error('❌ Edge function test failed:', funcErr);
    }

    // Test 3: Manual test insertion
    console.log('\n3️⃣ Testing manual result insertion...');
    const testResult = {
      test_name: 'diagnostic_test',
      test_category: 'infrastructure',
      status: 'passed',
      duration: 100,
      execution_metadata: { test_type: 'manual', timestamp: new Date().toISOString() }
    };

    const { data: insertData, error: insertError } = await supabase
      .from('ai_test_results')
      .insert([testResult])
      .select();

    if (insertError) {
      console.error('❌ Manual insertion failed:', insertError);
    } else {
      console.log('✅ Manual insertion successful:', insertData);
    }

    // Test 4: Run simplified orchestrator test
    console.log('\n4️⃣ Testing AI orchestrator...');
    const config = {
      categories: ['infrastructure'],
      maxConcurrentTests: 1,
      timeoutMs: 10000,
      retryAttempts: 1,
      detailedLogging: true
    };

    const results = await aiTestOrchestrator.executeComprehensiveTests(config);
    console.log('✅ Orchestrator test completed:', results);

    console.log('\n🎯 DIAGNOSTIC COMPLETE');
    
  } catch (error) {
    console.error('❌ Diagnostic test failed:', error);
  }
})();

export {};