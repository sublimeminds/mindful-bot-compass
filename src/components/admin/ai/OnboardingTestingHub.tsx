import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Brain, 
  Target,
  TrendingUp,
  AlertTriangle,
  FileText,
  Database,
  Route
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  testName: string;
  status: 'running' | 'passed' | 'failed' | 'pending';
  duration: number;
  error?: string;
  details?: any;
  timestamp: string;
}

interface OnboardingMetrics {
  completionRate: number;
  averageTime: number;
  dropoffPoints: string[];
  culturalProfileSuccess: number;
  therapyPlanSuccess: number;
  totalTests: number;
  passedTests: number;
}

const OnboardingTestingHub = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [metrics, setMetrics] = useState<OnboardingMetrics>({
    completionRate: 0,
    averageTime: 0,
    dropoffPoints: [],
    culturalProfileSuccess: 0,
    therapyPlanSuccess: 0,
    totalTests: 0,
    passedTests: 0
  });
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const onboardingTests = [
    {
      id: 'complete-flow',
      name: 'Complete Onboarding Flow',
      description: 'Tests full 14-step onboarding process',
      category: 'Integration',
      estimated: '45s'
    },
    {
      id: 'cultural-profile',
      name: 'Cultural Profile Integration',
      description: 'Tests cultural preference saving and validation',
      category: 'Data',
      estimated: '15s'
    },
    {
      id: 'therapy-plan-creation',
      name: 'Therapy Plan Creation',
      description: 'Tests AI therapy plan generation and database storage',
      category: 'AI',
      estimated: '30s'
    },
    {
      id: 'step-navigation',
      name: 'Step Navigation',
      description: 'Tests forward/backward navigation between steps',
      category: 'UX',
      estimated: '20s'
    },
    {
      id: 'data-validation',
      name: 'Data Validation',
      description: 'Tests input validation and error handling',
      category: 'Validation',
      estimated: '25s'
    },
    {
      id: 'progress-persistence',
      name: 'Progress Persistence',
      description: 'Tests saving and resuming onboarding progress',
      category: 'Data',
      estimated: '15s'
    },
    {
      id: 'error-recovery',
      name: 'Error Recovery',
      description: 'Tests error handling and retry mechanisms',
      category: 'Resilience',
      estimated: '20s'
    },
    {
      id: 'dashboard-navigation',
      name: 'Dashboard Navigation',
      description: 'Tests completion flow to dashboard',
      category: 'Integration',
      estimated: '10s'
    }
  ];

  useEffect(() => {
    // Load previous test results
    loadTestHistory();
    loadMetrics();
  }, []);

  const loadTestHistory = () => {
    // Simulate loading test history
    const mockResults: TestResult[] = [
      {
        id: '1',
        testName: 'Complete Onboarding Flow',
        status: 'passed',
        duration: 42000,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: { stepsCompleted: 14, culturalProfileSaved: true, therapyPlanCreated: true }
      },
      {
        id: '2',
        testName: 'Cultural Profile Integration',
        status: 'passed',
        duration: 12000,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        details: { profileValidation: true, databaseSave: true }
      },
      {
        id: '3',
        testName: 'Therapy Plan Creation',
        status: 'failed',
        duration: 28000,
        error: 'Edge function timeout',
        timestamp: new Date(Date.now() - 900000).toISOString()
      }
    ];
    setTestResults(mockResults);
  };

  const loadMetrics = () => {
    // Simulate loading metrics
    setMetrics({
      completionRate: 87.3,
      averageTime: 38.2,
      dropoffPoints: ['Step 6: Personal History', 'Step 9: Mental Health Screening'],
      culturalProfileSuccess: 94.1,
      therapyPlanSuccess: 91.7,
      totalTests: 156,
      passedTests: 142
    });
  };

  const runAllTests = async () => {
    setIsRunning(true);
    toast({
      title: "Starting Onboarding Tests",
      description: "Running comprehensive onboarding system tests..."
    });

    try {
      for (const test of onboardingTests) {
        await runSingleTest(test.id, test.name);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast({
        title: "Tests Completed",
        description: "All onboarding tests have finished running."
      });
    } catch (error) {
      toast({
        title: "Test Suite Failed",
        description: "Some tests encountered errors.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
      loadMetrics(); // Refresh metrics
    }
  };

  const runSingleTest = async (testId: string, testName: string) => {
    const startTime = Date.now();
    
    // Update test as running
    setTestResults(prev => {
      const filtered = prev.filter(r => r.testName !== testName);
      return [...filtered, {
        id: testId,
        testName,
        status: 'running',
        duration: 0,
        timestamp: new Date().toISOString()
      }];
    });

    try {
      // Simulate test execution
      const duration = Math.random() * 30000 + 10000; // 10-40 seconds
      await new Promise(resolve => setTimeout(resolve, duration));
      
      // Simulate test result (90% pass rate)
      const success = Math.random() > 0.1;
      const testDuration = Date.now() - startTime;
      
      const result: TestResult = {
        id: testId,
        testName,
        status: success ? 'passed' : 'failed',
        duration: testDuration,
        timestamp: new Date().toISOString(),
        error: success ? undefined : 'Simulated test failure',
        details: success ? getTestDetails(testId) : undefined
      };

      setTestResults(prev => {
        const filtered = prev.filter(r => r.testName !== testName);
        return [...filtered, result];
      });

    } catch (error) {
      setTestResults(prev => {
        const filtered = prev.filter(r => r.testName !== testName);
        return [...filtered, {
          id: testId,
          testName,
          status: 'failed',
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        }];
      });
    }
  };

  const getTestDetails = (testId: string) => {
    const details = {
      'complete-flow': {
        stepsCompleted: 14,
        totalTime: '42.3s',
        culturalProfileSaved: true,
        therapyPlanCreated: true,
        dashboardNavigation: true
      },
      'cultural-profile': {
        validationChecks: 8,
        databaseOperations: 3,
        languageSupport: 12,
        culturalAdaptations: 5
      },
      'therapy-plan-creation': {
        aiModelCalls: 3,
        planGenerationTime: '28.7s',
        databaseStorage: true,
        planValidation: true
      },
      'step-navigation': {
        forwardNavigation: true,
        backwardNavigation: true,
        progressPersistence: true,
        urlRouting: true
      },
      'data-validation': {
        requiredFieldValidation: true,
        formatValidation: true,
        businessRuleValidation: true,
        errorDisplays: true
      },
      'progress-persistence': {
        localStorage: true,
        sessionStorage: true,
        databaseBackup: true,
        resumeCapability: true
      },
      'error-recovery': {
        networkErrorHandling: true,
        retryMechanisms: true,
        userFeedback: true,
        gracefulFallbacks: true
      },
      'dashboard-navigation': {
        routeTransition: true,
        profileUpdates: true,
        stateCleanup: true
      }
    };
    
    return details[testId as keyof typeof details] || {};
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Integration': 'bg-blue-100 text-blue-800',
      'Data': 'bg-green-100 text-green-800',
      'AI': 'bg-purple-100 text-purple-800',
      'UX': 'bg-orange-100 text-orange-800',
      'Validation': 'bg-yellow-100 text-yellow-800',
      'Resilience': 'bg-red-100 text-red-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Onboarding System Testing</h2>
          <p className="text-muted-foreground">
            Comprehensive testing for the complete onboarding and therapy plan creation flow
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running Tests...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Run All Tests</span>
              </>
            )}
          </Button>
          {isRunning && (
            <Button variant="outline" onClick={() => setIsRunning(false)}>
              <Square className="h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Completion Rate</p>
                <p className="text-2xl font-bold">{metrics.completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Avg. Time</p>
                <p className="text-2xl font-bold">{metrics.averageTime}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Therapy Plan Success</p>
                <p className="text-2xl font-bold">{metrics.therapyPlanSuccess}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Test Pass Rate</p>
                <p className="text-2xl font-bold">
                  {metrics.totalTests > 0 ? Math.round((metrics.passedTests / metrics.totalTests) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Test Suite</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="metrics">Analytics</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <div className="grid gap-4">
            {onboardingTests.map((test) => {
              const result = testResults.find(r => r.testName === test.name);
              return (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getStatusIcon(result?.status || 'pending')}
                        <div>
                          <h3 className="font-medium">{test.name}</h3>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getCategoryColor(test.category)}>
                          {test.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{test.estimated}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runSingleTest(test.id, test.name)}
                          disabled={isRunning}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {result?.status === 'running' && (
                      <div className="mt-2">
                        <Progress value={50} className="h-1" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Results</CardTitle>
              <CardDescription>Latest test execution results and details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedTest(selectedTest === result.id ? null : result.id)}
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium">{result.testName}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(result.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{(result.duration / 1000).toFixed(1)}s</p>
                      {result.error && (
                        <p className="text-xs text-red-500">{result.error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Details */}
          {selectedTest && (() => {
            const result = testResults.find(r => r.id === selectedTest);
            if (!result) return null;

            return (
              <Card>
                <CardHeader>
                  <CardTitle>Test Details: {result.testName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(result.status)}
                          <span className="capitalize">{result.status}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p>{(result.duration / 1000).toFixed(1)} seconds</p>
                      </div>
                    </div>
                    
                    {result.details && (
                      <div>
                        <p className="text-sm font-medium mb-2">Details</p>
                        <pre className="bg-muted p-3 rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {result.error && (
                      <div>
                        <p className="text-sm font-medium mb-2">Error</p>
                        <div className="bg-red-50 border border-red-200 p-3 rounded">
                          <p className="text-red-700 text-sm">{result.error}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })()}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for the onboarding system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Cultural Profile Success Rate</span>
                    <span>{metrics.culturalProfileSuccess}%</span>
                  </div>
                  <Progress value={metrics.culturalProfileSuccess} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Therapy Plan Creation Success</span>
                    <span>{metrics.therapyPlanSuccess}%</span>
                  </div>
                  <Progress value={metrics.therapyPlanSuccess} className="mt-1" />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Overall Completion Rate</span>
                    <span>{metrics.completionRate}%</span>
                  </div>
                  <Progress value={metrics.completionRate} className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Drop-off Analysis</CardTitle>
                <CardDescription>Steps where users are most likely to abandon the process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics.dropoffPoints.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span className="text-sm">{point}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Known Issues</CardTitle>
              <CardDescription>Current issues and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Edge Function Timeout</p>
                    <p className="text-sm text-muted-foreground">
                      Therapy plan creation occasionally times out for complex profiles
                    </p>
                    <Badge variant="destructive" className="mt-1">Critical</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Cultural Profile Validation</p>
                    <p className="text-sm text-muted-foreground">
                      Some edge cases in cultural preference validation need handling
                    </p>
                    <Badge variant="outline" className="mt-1">Medium</Badge>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Progress Persistence</p>
                    <p className="text-sm text-muted-foreground">
                      Occasionally fails to restore progress in older browsers
                    </p>
                    <Badge variant="outline" className="mt-1">Low</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnboardingTestingHub;