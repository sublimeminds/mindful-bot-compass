import { supabase } from '@/integrations/supabase/client';

console.log('📊 AI TEST DASHBOARD - Real-time Test Monitoring');

interface DashboardMetrics {
  totalTests: number;
  recentTests: number;
  successRate: number;
  categories: Record<string, number>;
  recentActivity: any[];
}

async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  // Get total test count
  const { data: totalData, error: totalError } = await supabase
    .from('ai_test_results')
    .select('count');
  
  if (totalError) throw new Error(`Failed to fetch total tests: ${totalError.message}`);
  
  // Get recent tests (last 24 hours)
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentData, error: recentError } = await supabase
    .from('ai_test_results')
    .select('*')
    .gte('created_at', twentyFourHoursAgo)
    .order('created_at', { ascending: false });
  
  if (recentError) throw new Error(`Failed to fetch recent tests: ${recentError.message}`);
  
  // Calculate metrics
  const totalTests = Array.isArray(totalData) ? totalData.length : 0;
  const recentTests = recentData?.length || 0;
  const passedTests = recentData?.filter(test => test.status === 'passed').length || 0;
  const successRate = recentTests > 0 ? (passedTests / recentTests) * 100 : 0;
  
  // Group by categories
  const categories: Record<string, number> = {};
  recentData?.forEach(test => {
    categories[test.test_category] = (categories[test.test_category] || 0) + 1;
  });
  
  return {
    totalTests,
    recentTests,
    successRate,
    categories,
    recentActivity: recentData?.slice(0, 10) || []
  };
}

async function displayDashboard(): Promise<void> {
  try {
    console.log('\n🔄 Fetching test metrics...');
    const metrics = await fetchDashboardMetrics();
    
    console.log('\n📈 TEST DASHBOARD OVERVIEW');
    console.log('=' .repeat(60));
    console.log(`📊 Total Tests: ${metrics.totalTests}`);
    console.log(`🕐 Recent Tests (24h): ${metrics.recentTests}`);
    console.log(`✅ Success Rate: ${metrics.successRate.toFixed(1)}%`);
    
    console.log('\n📂 TESTS BY CATEGORY:');
    Object.entries(metrics.categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} tests`);
    });
    
    console.log('\n📋 RECENT TEST ACTIVITY:');
    if (metrics.recentActivity.length === 0) {
      console.log('  No recent test activity found');
    } else {
      metrics.recentActivity.forEach((test, i) => {
        const icon = test.status === 'passed' ? '✅' : 
                     test.status === 'failed' ? '❌' : 
                     test.status === 'warning' ? '⚠️' : '⏳';
        const timeAgo = new Date(test.created_at).toLocaleString();
        console.log(`  ${i+1}. ${icon} ${test.test_name} (${test.duration}ms) - ${timeAgo}`);
      });
    }
    
    // Health check
    console.log('\n🔍 SYSTEM HEALTH CHECK:');
    if (metrics.recentTests === 0) {
      console.log('  ⚠️ No tests executed in the last 24 hours');
      console.log('  💡 Suggestion: Run test suite to verify system status');
    } else if (metrics.successRate < 70) {
      console.log('  ❌ Low success rate detected');
      console.log('  💡 Suggestion: Review failed tests and check system components');
    } else {
      console.log('  ✅ System appears healthy');
    }
    
  } catch (error) {
    console.error('❌ Dashboard failed to load:', error);
  }
}

// Auto-refresh dashboard every 30 seconds
let refreshCount = 0;
async function startDashboard(): Promise<void> {
  await displayDashboard();
  
  const interval = setInterval(async () => {
    refreshCount++;
    console.log(`\n🔄 Refreshing dashboard (${refreshCount})...`);
    await displayDashboard();
    
    // Stop after 10 refreshes to prevent infinite running
    if (refreshCount >= 10) {
      clearInterval(interval);
      console.log('\n📊 Dashboard monitoring stopped');
    }
  }, 30000);
}

// Start dashboard immediately
startDashboard();

export {};