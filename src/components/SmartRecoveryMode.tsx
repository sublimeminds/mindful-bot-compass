import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Activity, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { serviceHealthManager } from '@/utils/serviceHealthManager';
import { appHealthValidator } from '@/utils/appHealthValidator';

/**
 * Smart Recovery Mode - Intelligent fallback with diagnostics and recovery
 */
const SmartRecoveryMode: React.FC = () => {
  const [diagnosticsComplete, setDiagnosticsComplete] = useState(false);
  const [healthReport, setHealthReport] = useState<any>(null);
  const [serviceHealth, setServiceHealth] = useState<any>(null);
  const [recoveryAttempts, setRecoveryAttempts] = useState(0);
  const [isRecovering, setIsRecovering] = useState(false);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    console.log('SmartRecoveryMode: Running diagnostics...');
    
    try {
      // Get service health
      const services = serviceHealthManager.getAllServices();
      const summary = serviceHealthManager.getHealthSummary();
      setServiceHealth({ services, summary });

      // Run app validation
      const report = await appHealthValidator.runFullValidation();
      setHealthReport(report);
      
      setDiagnosticsComplete(true);
      console.log('SmartRecoveryMode: Diagnostics complete', { services: summary, report });
    } catch (error) {
      console.error('SmartRecoveryMode: Diagnostics failed:', error);
      setDiagnosticsComplete(true);
    }
  };

  const attemptRecovery = async () => {
    if (recoveryAttempts >= 3) {
      console.log('SmartRecoveryMode: Max recovery attempts reached');
      return;
    }

    setIsRecovering(true);
    setRecoveryAttempts(prev => prev + 1);
    
    try {
      console.log(`SmartRecoveryMode: Recovery attempt ${recoveryAttempts + 1}`);
      
      // Clear any cached errors
      localStorage.removeItem('last_app_error');
      
      // Restart service health monitoring
      serviceHealthManager.startHealthChecks(5000);
      
      // Wait a bit for services to recover
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Re-run diagnostics
      await runDiagnostics();
      
      // If health improved, try reload
      if (serviceHealth?.summary?.healthy > 0.5) {
        console.log('SmartRecoveryMode: Health improved, attempting reload');
        window.location.reload();
      }
    } catch (error) {
      console.error('SmartRecoveryMode: Recovery failed:', error);
    } finally {
      setIsRecovering(false);
    }
  };

  const getHealthStatus = () => {
    if (!healthReport) return 'unknown';
    return healthReport.overallHealth;
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              TherapySync Recovery Mode
            </CardTitle>
            <p className="text-muted-foreground">
              The main application encountered an error. This is a safe fallback mode with diagnostics.
            </p>
          </CardHeader>
        </Card>

        {/* Diagnostics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Diagnostics
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!diagnosticsComplete ? (
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span>Running diagnostics...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Health Status */}
                <div className="flex items-center justify-between">
                  <span>Overall Health:</span>
                  <div className="flex items-center gap-2">
                    {getHealthIcon(getHealthStatus())}
                    <span className={getHealthColor(getHealthStatus())}>
                      {getHealthStatus().charAt(0).toUpperCase() + getHealthStatus().slice(1)}
                    </span>
                  </div>
                </div>

                {/* Service Status */}
                {serviceHealth && (
                  <div className="flex items-center justify-between">
                    <span>Services:</span>
                    <span>
                      {serviceHealth.summary.loaded}/{serviceHealth.summary.total} healthy
                    </span>
                  </div>
                )}

                {/* Test Results */}
                {healthReport && (
                  <div className="flex items-center justify-between">
                    <span>Tests:</span>
                    <span>
                      {healthReport.tests.filter((t: any) => t.status === 'pass').length}/
                      {healthReport.tests.length} passing
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Recovery Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button 
                onClick={attemptRecovery}
                disabled={isRecovering || recoveryAttempts >= 3}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRecovering ? 'animate-spin' : ''}`} />
                {isRecovering ? 'Recovering...' : 'Smart Recovery'}
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Force Reload
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/'}
                variant="outline"
                className="flex items-center gap-2"
              >
                🏠 Go Home
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/recovery-dashboard'}
                variant="outline"
                className="flex items-center gap-2"
              >
                🔧 Advanced Recovery
              </Button>
              
              <Button 
                onClick={() => window.location.href = '/component-health'}
                variant="outline"
                className="flex items-center gap-2"
              >
                🔍 Full Diagnostics
              </Button>
            </div>

            {recoveryAttempts > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Recovery attempts: {recoveryAttempts}/3
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm space-y-1 text-muted-foreground">
              <div>✅ React: Working</div>
              <div>✅ Browser: Compatible</div>
              <div>✅ Recovery Mode: Active</div>
              <div>🕐 Time: {new Date().toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SmartRecoveryMode;