
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Bug,
  Lock,
  Eye,
  FileText,
  TrendingUp
} from 'lucide-react';
import { vulnerabilityScanner } from '@/services/vulnerabilityScanner';

interface VulnerabilityReport {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'dependency' | 'code' | 'configuration' | 'security_header';
  title: string;
  description: string;
  recommendation: string;
  affected_component: string;
  detected_at: Date;
  status: 'open' | 'acknowledged' | 'fixed' | 'false_positive';
}

interface SecurityAuditResult {
  overall_score: number;
  vulnerabilities: VulnerabilityReport[];
  compliance_status: {
    gdpr: boolean;
    hipaa: boolean;
    security_headers: boolean;
    data_encryption: boolean;
  };
  recommendations: string[];
}

const SecurityAuditDashboard = () => {
  const [auditResult, setAuditResult] = useState<SecurityAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<Date | null>(null);

  useEffect(() => {
    // Load cached audit results on component mount
    const cachedResults = localStorage.getItem('security_audit_results');
    const cachedScanTime = localStorage.getItem('last_security_scan');
    
    if (cachedResults && cachedScanTime) {
      setAuditResult(JSON.parse(cachedResults));
      setLastScanTime(new Date(cachedScanTime));
    }
  }, []);

  const runSecurityAudit = async () => {
    setLoading(true);
    try {
      console.log('Starting comprehensive security audit...');
      const result = await vulnerabilityScanner.performSecurityAudit();
      setAuditResult(result);
      setLastScanTime(new Date());
      
      // Cache results
      localStorage.setItem('security_audit_results', JSON.stringify(result));
      localStorage.setItem('last_security_scan', new Date().toISOString());
      
      console.log('Security audit completed:', result);
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const markAsFixed = async (vulnerabilityId: string) => {
    await vulnerabilityScanner.markVulnerabilityAsFixed(vulnerabilityId);
    // Refresh audit results
    if (auditResult) {
      const updatedVulns = auditResult.vulnerabilities.map(v => 
        v.id === vulnerabilityId ? { ...v, status: 'fixed' as const } : v
      );
      setAuditResult({ ...auditResult, vulnerabilities: updatedVulns });
    }
  };

  if (!auditResult && !loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-therapy-900 mb-4">Security Audit Dashboard</h2>
          <p className="text-therapy-600 mb-6">
            Run a comprehensive security audit to identify vulnerabilities and compliance issues.
          </p>
          <Button onClick={runSecurityAudit} className="bg-therapy-600 hover:bg-therapy-700">
            <Shield className="h-4 w-4 mr-2" />
            Start Security Audit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Security Audit Dashboard</h2>
          <p className="text-therapy-600 mt-1">
            Comprehensive security analysis and vulnerability management
          </p>
          {lastScanTime && (
            <p className="text-sm text-muted-foreground mt-1">
              Last scan: {lastScanTime.toLocaleString()}
            </p>
          )}
        </div>
        <Button onClick={runSecurityAudit} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Scanning...' : 'Run New Scan'}
        </Button>
      </div>

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-therapy-600"></div>
              <span>Running comprehensive security audit...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {auditResult && (
        <>
          {/* Security Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(auditResult.overall_score)}`}>
                  {auditResult.overall_score}/100
                </div>
                <Progress value={auditResult.overall_score} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Vulnerabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {auditResult.vulnerabilities.length}
                </div>
                <p className="text-xs text-muted-foreground">Issues found</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">
                  {auditResult.vulnerabilities.filter(v => v.severity === 'critical').length}
                </div>
                <p className="text-xs text-muted-foreground">Requires immediate action</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Fixed Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {auditResult.vulnerabilities.filter(v => v.status === 'fixed').length}
                </div>
                <p className="text-xs text-muted-foreground">Resolved vulnerabilities</p>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {auditResult.compliance_status.gdpr ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium">GDPR</p>
                  <p className="text-sm text-muted-foreground">
                    {auditResult.compliance_status.gdpr ? 'Compliant' : 'Issues Found'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {auditResult.compliance_status.hipaa ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium">HIPAA</p>
                  <p className="text-sm text-muted-foreground">
                    {auditResult.compliance_status.hipaa ? 'Compliant' : 'Issues Found'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {auditResult.compliance_status.security_headers ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium">Security Headers</p>
                  <p className="text-sm text-muted-foreground">
                    {auditResult.compliance_status.security_headers ? 'Configured' : 'Missing'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {auditResult.compliance_status.data_encryption ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <p className="font-medium">Data Encryption</p>
                  <p className="text-sm text-muted-foreground">
                    {auditResult.compliance_status.data_encryption ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {auditResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Security Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditResult.recommendations.map((recommendation, index) => (
                    <Alert key={index}>
                      <AlertDescription>{recommendation}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vulnerabilities List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bug className="h-5 w-5 mr-2" />
                Vulnerability Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {auditResult.vulnerabilities.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-green-800 mb-2">All Clear!</h3>
                  <p className="text-green-600">No security vulnerabilities detected.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {auditResult.vulnerabilities.map((vulnerability) => (
                    <div
                      key={vulnerability.id}
                      className="border rounded-lg p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getSeverityColor(vulnerability.severity)}>
                              {vulnerability.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {vulnerability.type.replace('_', ' ').toUpperCase()}
                            </Badge>
                            <Badge 
                              variant={vulnerability.status === 'fixed' ? 'default' : 'secondary'}
                              className={vulnerability.status === 'fixed' ? 'bg-green-100 text-green-800' : ''}
                            >
                              {vulnerability.status.toUpperCase()}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">
                            {vulnerability.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {vulnerability.description}
                          </p>
                          <div className="text-sm text-gray-500 mb-2">
                            <strong>Component:</strong> {vulnerability.affected_component}
                          </div>
                          <div className="bg-blue-50 p-3 rounded-md">
                            <h5 className="text-sm font-medium text-blue-800 mb-1">
                              Recommendation:
                            </h5>
                            <p className="text-sm text-blue-700">
                              {vulnerability.recommendation}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-xs text-gray-500 mb-2">
                            {new Date(vulnerability.detected_at).toLocaleDateString()}
                          </div>
                          {vulnerability.status !== 'fixed' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsFixed(vulnerability.id)}
                            >
                              Mark as Fixed
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SecurityAuditDashboard;
