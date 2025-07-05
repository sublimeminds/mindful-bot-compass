import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Shield,
  Bug,
  Zap
} from 'lucide-react';
import { reactReadinessGate, useReactReadiness } from '@/utils/reactReadinessGate';
import { componentAuditor, ComponentAuditResult } from '@/utils/componentAuditor';

const ReactHealthDashboard: React.FC = () => {
  const [auditResults, setAuditResults] = useState<ComponentAuditResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const reactStats = useReactReadiness();

  useEffect(() => {
    const updateAuditResults = () => {
      setAuditResults(componentAuditor.getAuditResults());
    };

    updateAuditResults();
    const interval = setInterval(updateAuditResults, 5000);
    return () => clearInterval(interval);
  }, []);

  const highRiskCount = auditResults.filter(r => r.riskLevel === 'high').length;
  const mediumRiskCount = auditResults.filter(r => r.riskLevel === 'medium').length;
  const lowRiskCount = auditResults.filter(r => r.riskLevel === 'low').length;

  const getStatusColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'destructive';
      case 'medium': return 'outline';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const downloadReport = () => {
    const report = componentAuditor.generateReport();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `react-health-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="shadow-xl border-2 border-therapy-200 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-therapy-600" />
              React Health Monitor
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="h-6 w-6 p-0"
            >
              {showDetails ? '−' : '+'}
            </Button>
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* React Readiness Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">React Ready:</span>
            <Badge variant={reactStats.isReady ? 'secondary' : 'destructive'}>
              {reactStats.isReady ? (
                <><CheckCircle className="h-3 w-3 mr-1" /> Ready</>
              ) : (
                <><Clock className="h-3 w-3 mr-1" /> Loading</>
              )}
            </Badge>
          </div>

          {/* Component Risk Summary */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-red-600">{highRiskCount}</div>
              <div className="text-gray-500">High Risk</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-yellow-600">{mediumRiskCount}</div>
              <div className="text-gray-500">Medium Risk</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-green-600">{lowRiskCount}</div>
              <div className="text-gray-500">Low Risk</div>
            </div>
          </div>

          {showDetails && (
            <>
              {/* Queued Hook Calls */}
              {reactStats.queuedCalls > 0 && (
                <Alert>
                  <Bug className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {reactStats.queuedCalls} hook calls queued
                  </AlertDescription>
                </Alert>
              )}

              {/* High Risk Components */}
              {auditResults.filter(r => r.riskLevel === 'high').map((component, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <div className="font-semibold">{component.componentName}</div>
                    <div className="mt-1">
                      {component.issues.map((issue, i) => (
                        <div key={i}>• {issue.description}</div>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadReport}
                  className="flex-1 text-xs"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Export Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => componentAuditor.clearAuditResults()}
                  className="flex-1 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>

              {/* Performance Tips */}
              {highRiskCount > 0 && (
                <Alert>
                  <Activity className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <strong>Quick Fixes:</strong>
                    <ul className="mt-1 ml-2 list-disc text-xs">
                      <li>Wrap components in SafeErrorBoundary</li>
                      <li>Use safeUseState/safeUseEffect wrappers</li>
                      <li>Move hooks to component root level</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReactHealthDashboard;