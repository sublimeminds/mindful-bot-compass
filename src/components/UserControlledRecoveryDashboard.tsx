import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Activity, AlertTriangle, CheckCircle, Settings, Download, Play, RotateCcw } from "lucide-react";
import { appRecoveryManager } from '@/utils/appRecoveryManager';
import { enhancedRecoveryChain } from '@/utils/enhancedRecoveryChain';
import { smartDiagnosticsEngine } from '@/utils/smartDiagnosticsEngine';
import { autoRecoverySystem } from '@/utils/autoRecoverySystem';
import { serviceHealthManager } from '@/utils/serviceHealthManager';

interface RecoveryDashboardState {
  isRunning: boolean;
  currentOperation?: string;
  lastDiagnostics?: any;
  recoveryHistory: Array<{
    timestamp: number;
    operation: string;
    success: boolean;
    details: string;
  }>;
}

const UserControlledRecoveryDashboard: React.FC = () => {
  const [state, setState] = useState<RecoveryDashboardState>({
    isRunning: false,
    recoveryHistory: []
  });
  const [diagnosticsResults, setDiagnosticsResults] = useState<any>(null);
  const [serviceHealth, setServiceHealth] = useState<any>(null);
  const [autoRecoveryStats, setAutoRecoveryStats] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    loadDashboardData();
    
    // Load recovery history from localStorage
    const savedHistory = localStorage.getItem('recovery_history');
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setState(prev => ({ ...prev, recoveryHistory: history }));
      } catch (error) {
        console.warn('Failed to load recovery history:', error);
      }
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get service health
      const services = serviceHealthManager.getAllServices();
      const summary = serviceHealthManager.getHealthSummary();
      setServiceHealth({ services, summary });

      // Get auto-recovery stats
      const stats = autoRecoverySystem.getStats();
      setAutoRecoveryStats(stats);

      // Run quick diagnostics
      const diagnostics = await smartDiagnosticsEngine.runDiagnostics();
      setDiagnosticsResults(diagnostics);
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const addToHistory = (operation: string, success: boolean, details: string) => {
    const entry = {
      timestamp: Date.now(),
      operation,
      success,
      details
    };
    
    setState(prev => {
      const newHistory = [entry, ...prev.recoveryHistory].slice(0, 50); // Keep last 50 entries
      
      // Save to localStorage
      try {
        localStorage.setItem('recovery_history', JSON.stringify(newHistory));
      } catch (error) {
        console.warn('Failed to save recovery history:', error);
      }
      
      return { ...prev, recoveryHistory: newHistory };
    });
  };

  const executeOperation = async (operation: string, action: () => Promise<any>) => {
    setState(prev => ({ ...prev, isRunning: true, currentOperation: operation }));
    
    try {
      const result = await action();
      addToHistory(operation, true, result ? JSON.stringify(result) : 'Success');
      return result;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addToHistory(operation, false, errorMsg);
      throw error;
    } finally {
      setState(prev => ({ ...prev, isRunning: false, currentOperation: undefined }));
      // Refresh dashboard data
      await loadDashboardData();
    }
  };

  const handleFullDiagnostics = async () => {
    await executeOperation('Full Diagnostics', async () => {
      const results = await smartDiagnosticsEngine.runDiagnostics();
      setDiagnosticsResults(results);
      return `Health: ${results.overall}, Score: ${results.score}%`;
    });
  };

  const handleSmartRecovery = async () => {
    await executeOperation('Smart Recovery', async () => {
      const result = await appRecoveryManager.smartRetry();
      return `Loaded: ${result.level} level`;
    });
  };

  const handleForceRestart = async () => {
    await executeOperation('Force Restart', async () => {
      await appRecoveryManager.forceRestart();
      return 'Application restarted';
    });
  };

  const handleClearAllCaches = async () => {
    await executeOperation('Clear All Caches', async () => {
      // Clear browser caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      return 'All caches cleared';
    });
  };

  const handleResetRecoveryChain = async () => {
    await executeOperation('Reset Recovery Chain', async () => {
      enhancedRecoveryChain.reset();
      autoRecoverySystem.reset();
      return 'Recovery systems reset';
    });
  };

  const handleSelectiveReload = async (component: string) => {
    await executeOperation(`Reload ${component}`, async () => {
      // Dynamic component reloading
      const moduleMap: Record<string, string> = {
        'Router': '@/components/AppRouter',
        'Auth': '@/components/AppInitializer',
        'Services': '@/utils/serviceHealthManager'
      };
      
      const modulePath = moduleMap[component];
      if (!modulePath) throw new Error('Unknown component');
      
      // Force reload the module
      const timestamp = Date.now();
      await import(`${modulePath}?reload=${timestamp}`);
      
      return `${component} reloaded`;
    });
  };

  const downloadDiagnosticsReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      diagnostics: diagnosticsResults,
      serviceHealth,
      autoRecoveryStats,
      recoveryHistory: state.recoveryHistory,
      browser: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        viewport: { width: window.innerWidth, height: window.innerHeight }
      }
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recovery-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="h-6 w-6" />
                Recovery Control Center
              </div>
              <div className="flex gap-2">
                <Button onClick={loadDashboardData} variant="outline" size="sm" disabled={state.isRunning}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={downloadDiagnosticsReport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
            <TabsTrigger value="recovery">Recovery Tools</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(diagnosticsResults?.overall || 'unknown')}
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnosticsResults ? (
                    <>
                      <div className="text-2xl font-bold mb-2">
                        {diagnosticsResults.score}%
                      </div>
                      <Progress value={diagnosticsResults.score} className="mb-2" />
                      <div className="text-sm text-muted-foreground">
                        {diagnosticsResults.overall.charAt(0).toUpperCase() + diagnosticsResults.overall.slice(1)}
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2" />
                      Run diagnostics to see health status
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Service Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Services</CardTitle>
                </CardHeader>
                <CardContent>
                  {serviceHealth ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Loaded:</span>
                        <Badge variant="default">{serviceHealth.summary.loaded}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <Badge variant="destructive">{serviceHealth.summary.failed}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Health:</span>
                        <Badge variant="secondary">{Math.round(serviceHealth.summary.healthy * 100)}%</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">Loading...</div>
                  )}
                </CardContent>
              </Card>

              {/* Auto-Recovery Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Auto-Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                  {autoRecoveryStats ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <Badge variant="secondary">{autoRecoveryStats.totalRecoveries}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <Badge variant="default">{Math.round(autoRecoveryStats.successRate || 0)}%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Active:</span>
                        <Badge variant={autoRecoveryStats.isActive ? "default" : "secondary"}>
                          {autoRecoveryStats.isActive ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">Loading...</div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button onClick={handleFullDiagnostics} disabled={state.isRunning} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Run Diagnostics
                  </Button>
                  <Button onClick={handleSmartRecovery} disabled={state.isRunning} className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Smart Recovery
                  </Button>
                  <Button onClick={handleClearAllCaches} disabled={state.isRunning} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Clear Caches
                  </Button>
                  <Button onClick={handleForceRestart} disabled={state.isRunning} variant="destructive" className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Force Restart
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Operation */}
            {state.isRunning && (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Running: {state.currentOperation}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Diagnostics Tab */}
          <TabsContent value="diagnostics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Detailed Diagnostics
                  <Button onClick={handleFullDiagnostics} disabled={state.isRunning}>
                    <Play className="h-4 w-4 mr-2" />
                    Run Full Scan
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {diagnosticsResults ? (
                  <div className="space-y-4">
                    {/* Issues */}
                    {diagnosticsResults.issues.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Issues Found</h4>
                        <div className="space-y-2">
                          {diagnosticsResults.issues.map((issue: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getStatusIcon('critical')}
                                <div>
                                  <div className="font-medium">{issue.name}</div>
                                  {issue.error && <div className="text-sm text-muted-foreground">{issue.error}</div>}
                                </div>
                              </div>
                              <Badge variant="destructive">{issue.priority}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {diagnosticsResults.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Recommendations</h4>
                        <div className="space-y-2">
                          {diagnosticsResults.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-800">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4" />
                    <p>No diagnostics run yet. Click "Run Full Scan" to start.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recovery Tools Tab */}
          <TabsContent value="recovery" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Component Recovery */}
              <Card>
                <CardHeader>
                  <CardTitle>Component Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Router', 'Auth', 'Services'].map(component => (
                      <Button 
                        key={component}
                        onClick={() => handleSelectiveReload(component)}
                        disabled={state.isRunning}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reload {component}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Recovery */}
              <Card>
                <CardHeader>
                  <CardTitle>System Recovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      onClick={handleResetRecoveryChain}
                      disabled={state.isRunning}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset Recovery Chain
                    </Button>
                    <Button 
                      onClick={handleClearAllCaches}
                      disabled={state.isRunning}
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Clear All Caches
                    </Button>
                    <Button 
                      onClick={handleForceRestart}
                      disabled={state.isRunning}
                      variant="destructive"
                      className="w-full justify-start"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Force Application Restart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recovery History</CardTitle>
              </CardHeader>
              <CardContent>
                {state.recoveryHistory.length > 0 ? (
                  <div className="space-y-3">
                    {state.recoveryHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {entry.success ? 
                            <CheckCircle className="h-4 w-4 text-green-500" /> : 
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          }
                          <div>
                            <div className="font-medium">{entry.operation}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant={entry.success ? "default" : "destructive"}>
                          {entry.success ? "Success" : "Failed"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Activity className="h-12 w-12 mx-auto mb-4" />
                    <p>No recovery operations performed yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserControlledRecoveryDashboard;