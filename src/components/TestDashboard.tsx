import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { aiTestOrchestrator } from '@/services/aiTestOrchestrator';
import { toast } from 'sonner';
import { Play, RefreshCw, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

interface TestResult {
  id: string;
  test_name: string;
  test_category: string;
  status: string;
  duration: number;
  created_at: string;
  error_message?: string;
  execution_metadata?: any;
}

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  warnings: number;
  successRate: number;
  averageTime: number;
}

const TestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<TestStats>({
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0,
    successRate: 0,
    averageTime: 0
  });
  const [lastRun, setLastRun] = useState<string>('Never');

  const fetchTestResults = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_test_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setTestResults(data || []);
      calculateStats(data || []);
      
      if (data && data.length > 0) {
        setLastRun(new Date(data[0].created_at).toLocaleString());
      }
    } catch (error) {
      console.error('Error fetching test results:', error);
      toast.error('Failed to fetch test results');
    }
  };

  const calculateStats = (results: TestResult[]) => {
    if (results.length === 0) {
      setStats({ total: 0, passed: 0, failed: 0, warnings: 0, successRate: 0, averageTime: 0 });
      return;
    }

    const recent = results.slice(0, 20); // Last 20 tests
    const passed = recent.filter(r => r.status === 'passed').length;
    const failed = recent.filter(r => r.status === 'failed').length;
    const warnings = recent.filter(r => r.status === 'warning').length;
    const avgTime = recent.reduce((sum, r) => sum + (r.duration || 0), 0) / recent.length;

    setStats({
      total: recent.length,
      passed,
      failed,
      warnings,
      successRate: (passed / recent.length) * 100,
      averageTime: Math.round(avgTime)
    });
  };

  const runTests = async (categories: string[] = ['infrastructure', 'edge-functions']) => {
    if (isRunning) return;
    
    setIsRunning(true);
    toast.info('Starting test execution...');

    try {
      const config = {
        categories,
        maxConcurrentTests: 3,
        timeoutMs: 15000,
        retryAttempts: 1,
        detailedLogging: true
      };

      const results = await aiTestOrchestrator.executeComprehensiveTests(config);
      
      toast.success(`Tests completed! ${results.stats.passedTests} passed, ${results.stats.failedTests} failed`);
      await fetchTestResults(); // Refresh results
      
    } catch (error) {
      console.error('Test execution failed:', error);
      toast.error('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    fetchTestResults();
    const interval = setInterval(fetchTestResults, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-success/20 text-success border-success/30';
      case 'failed': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'warning': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Test Dashboard</h1>
          <p className="text-muted-foreground">Monitor and execute AI system tests</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchTestResults}
            disabled={isRunning}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => runTests()}
            disabled={isRunning}
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Tests'}
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</div>
            <Progress value={stats.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Passed</CardTitle>
            <Badge variant="secondary">{stats.passed}/{stats.total}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.passed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Failed</CardTitle>
            <Badge variant="destructive">{stats.failed}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageTime}ms</div>
          </CardContent>
        </Card>
      </div>

      {/* Test Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          onClick={() => runTests(['infrastructure'])}
          disabled={isRunning}
          className="h-20 flex-col"
        >
          <CheckCircle className="h-6 w-6 mb-2" />
          Infrastructure Tests
        </Button>
        <Button 
          variant="outline" 
          onClick={() => runTests(['edge-functions'])}
          disabled={isRunning}
          className="h-20 flex-col"
        >
          <Zap className="h-6 w-6 mb-2" />
          Edge Function Tests
        </Button>
        <Button 
          variant="outline" 
          onClick={() => runTests(['infrastructure', 'edge-functions', 'crisis-scenarios'])}
          disabled={isRunning}
          className="h-20 flex-col"
        >
          <AlertCircle className="h-6 w-6 mb-2" />
          Comprehensive Tests
        </Button>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
          <CardDescription>Last run: {lastRun}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="edge-functions">Edge Functions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recent" className="space-y-4">
              {testResults.slice(0, 10).map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.test_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.test_category} • {new Date(result.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{result.duration}ms</div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="failed">
              {testResults.filter(r => r.status === 'failed').map((result) => (
                <div key={result.id} className="p-4 border rounded-lg border-destructive/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <div className="font-medium">{result.test_name}</div>
                  </div>
                  {result.error_message && (
                    <div className="text-sm text-muted-foreground bg-destructive/10 p-2 rounded">
                      {result.error_message}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="infrastructure">
              {testResults.filter(r => r.test_category === 'infrastructure').map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(result.status)}
                    <div className="font-medium">{result.test_name}</div>
                  </div>
                  <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="edge-functions">
              {testResults.filter(r => r.test_category === 'edge-functions').map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(result.status)}
                    <div className="font-medium">{result.test_name}</div>
                  </div>
                  <Badge className={getStatusColor(result.status)}>{result.status}</Badge>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestDashboard;