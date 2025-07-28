import { supabase } from '@/integrations/supabase/client';

console.log('🔐 RLS POLICY VERIFICATION - Checking ai_test_results table permissions');

async function verifyTableAccess(): Promise<void> {
  try {
    console.log('\n1️⃣ Testing anonymous access (should work for inserts)...');
    
    // Test basic select
    const { data: selectData, error: selectError } = await supabase
      .from('ai_test_results')
      .select('id')
      .limit(1);
    
    if (selectError) {
      console.log('  ⚠️ Select access:', selectError.message);
    } else {
      console.log('  ✅ Select access: OK');
    }
    
    // Test insert
    const testRecord = {
      test_name: 'rls_policy_verification',
      test_category: 'infrastructure',
      status: 'passed',
      duration: 10,
      execution_metadata: { 
        test_type: 'rls_verification', 
        timestamp: new Date().toISOString() 
      }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('ai_test_results')
      .insert([testRecord])
      .select();
    
    if (insertError) {
      console.log('  ❌ Insert access:', insertError.message);
      console.log('  💡 This suggests RLS policies may be blocking test result storage');
    } else {
      console.log('  ✅ Insert access: OK');
      console.log(`  📝 Test record created with ID: ${insertData[0]?.id}`);
    }
    
    // Test update (should likely fail for security)
    if (insertData && insertData[0]) {
      const { error: updateError } = await supabase
        .from('ai_test_results')
        .update({ status: 'updated' })
        .eq('id', insertData[0].id);
      
      if (updateError) {
        console.log('  ⚠️ Update access (expected restriction):', updateError.message);
      } else {
        console.log('  ⚠️ Update access: Allowed (may need stricter RLS)');
      }
    }
    
    // Test delete (should likely fail for security)
    if (insertData && insertData[0]) {
      const { error: deleteError } = await supabase
        .from('ai_test_results')
        .delete()
        .eq('id', insertData[0].id);
      
      if (deleteError) {
        console.log('  ⚠️ Delete access (expected restriction):', deleteError.message);
      } else {
        console.log('  ⚠️ Delete access: Allowed (may need stricter RLS)');
      }
    }
    
  } catch (error) {
    console.error('❌ RLS verification failed:', error);
  }
}

async function checkTableSchema(): Promise<void> {
  try {
    console.log('\n2️⃣ Verifying table schema and structure...');
    
    // This won't work directly, but we can try to insert with missing fields to see what's required
    const { error } = await supabase
      .from('ai_test_results')
      .insert([{ 
        test_name: 'schema_check',
        test_category: 'infrastructure',
        status: 'passed'
      }])
      .select();
    
    if (error) {
      console.log('  📋 Schema requirements revealed by error:', error.message);
      if (error.message.includes('null value in column')) {
        console.log('  💡 Some required fields may be missing from test insertions');
      }
    } else {
      console.log('  ✅ Basic schema validation passed');
    }
    
  } catch (error) {
    console.error('❌ Schema check failed:', error);
  }
}

(async () => {
  console.log('🚀 Starting RLS and permissions verification...');
  
  await verifyTableAccess();
  await checkTableSchema();
  
  console.log('\n📝 RECOMMENDATIONS:');
  console.log('1. If inserts are failing, check if ai_test_results table has proper RLS policies');
  console.log('2. Ensure the table allows anonymous inserts for system testing');
  console.log('3. Verify all required columns have appropriate defaults or are nullable');
  console.log('4. Consider creating a specific service account for test execution');
  
  console.log('\n✅ RLS verification complete');
})();

export {};