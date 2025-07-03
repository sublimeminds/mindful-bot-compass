import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertTriangle, RefreshCw, Play, Download } from "lucide-react";
import { appHealthValidator } from '@/utils/appHealthValidator';
import SafeErrorBoundary from './SafeErrorBoundary';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface ValidationReport {
  timestamp: number;
  overallHealth: 'healthy' | 'warning' | 'critical';
  tests: TestResult[];
  recommendations: string[];
}

const AppValidationDashboard: React.FC = () => {
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<number | null>(null);

  useEffect(() => {
    // Run initial validation on mount
    runValidation();
  }, []);

  const runValidation = async () => {
    setIsRunning(true);
    try {
      console.log('Running app validation...');
      const validationReport = await appHealthValidator.runFullValidation();
      setReport(validationReport);
      setLastRun(Date.now());
    } catch (error) {
      console.error('Validation failed:', error);
      // Create fallback report for errors
      const fallbackReport: ValidationReport = {
        timestamp: Date.now(),
        overallHealth: 'critical',
        tests: [{
          name: 'Validation Process',
          status: 'fail',
          message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }],
        recommendations: ['Fix validation process errors', 'Check browser console for details']
      };
      setReport(fallbackReport);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary'
    } as const;

    const colors = {
      pass: 'bg-green-500',
      fail: 'bg-red-500', 
      warning: 'bg-yellow-500'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthProgress = (health: string) => {
    switch (health) {
      case 'healthy': return 100;
      case 'warning': return 65;
      case 'critical': return 25;
      default: return 0;
    }
  };

  const downloadReport = () => {
    if (!report) return;

    const reportData = {
      ...report,
      timestamp: new Date(report.timestamp).toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-health-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!report && !isRunning) {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center' }}>
          <h3 className="css-safe-heading">App Validation</h3>
          <p className="css-safe-text" style={{ marginBottom: '16px' }}>
            Initialize comprehensive app health validation
          </p>
          <button className="css-safe-button" onClick={runValidation}>
            <Play className="h-4 w-4 mr-2" />
            Start Validation
          </button>
        </div>
      </div>
    );
  }

  if (isRunning) {
    return (
      <div className="css-safe-center">
        <div className="css-safe-card" style={{ textAlign: 'center' }}>
          <div className="css-safe-spinner" style={{ margin: '0 auto 16px' }}></div>
          <h3 className="css-safe-heading">Running Validation</h3>
          <p className="css-safe-text">
            Testing app health and functionality...
          </p>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const passCount = report.tests.filter(t => t.status === 'pass').length;
  const failCount = report.tests.filter(t => t.status === 'fail').length;
  const warningCount = report.tests.filter(t => t.status === 'warning').length;
  const totalCount = report.tests.length;

  return (
    <SafeErrorBoundary name="AppValidationDashboard">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  report.overallHealth === 'healthy' ? 'bg-green-500' : 
                  report.overallHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                App Validation Report
              </div>
              <div className="flex gap-2">
                <Button onClick={runValidation} disabled={isRunning} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-run
                </Button>
                <Button onClick={downloadReport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Overall Health */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-semibold ${getHealthColor(report.overallHealth)}`}>
                    Overall Health: {report.overallHealth.charAt(0).toUpperCase() + report.overallHealth.slice(1)}
                  </h3>
                  <div className="text-sm text-muted-foreground">
                    {lastRun && `Last run: ${new Date(lastRun).toLocaleTimeString()}`}
                  </div>
                </div>
                <Progress value={getHealthProgress(report.overallHealth)} className="mb-4" />
                
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{passCount}</div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{warningCount}</div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{failCount}</div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h4 className="font-semibold mb-4">Test Results ({totalCount} tests)</h4>
                <div className="grid gap-3">
                  {report.tests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.status)}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-muted-foreground">{test.message}</div>
                        </div>
                      </div>
                      {getStatusBadge(test.status)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {report.recommendations.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2">
                    {report.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Debug Information */}
              <div className="text-xs text-muted-foreground border-t pt-4">
                <div>Report generated: {new Date(report.timestamp).toLocaleString()}</div>
                <div>User Agent: {navigator.userAgent}</div>
                <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
                <div>URL: {window.location.href}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SafeErrorBoundary>
  );
};

export default AppValidationDashboard;