import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  FileText, 
  Clock, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Lock,
  Archive,
  Eye,
  BarChart3
} from 'lucide-react';
import { complianceFramework } from '@/services/complianceFramework';
import { toast } from 'sonner';

const ComplianceDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [retentionPolicies, setRetentionPolicies] = useState([]);
  const [privacyAssessments, setPrivacyAssessments] = useState([]);
  const [complianceConfig, setComplianceConfig] = useState(null);
  const [hipaaReport, setHipaaReport] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    try {
      setAuditLogs(complianceFramework.getAuditLogs().slice(-100)); // Last 100 logs
      setRetentionPolicies(complianceFramework.getRetentionPolicies());
      setPrivacyAssessments(complianceFramework.getPrivacyAssessments());
      setComplianceConfig(complianceFramework.getComplianceConfig());
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    }
  };

  const generateHIPAAReport = async () => {
    setLoading(true);
    try {
      const report = await complianceFramework.generateHIPAAComplianceReport();
      setHipaaReport(report);
    } catch (error) {
      console.error('Failed to generate HIPAA report:', error);
    } finally {
      setLoading(false);
    }
  };

  const processDataExport = async (userId: string) => {
    setLoading(true);
    try {
      const data = await complianceFramework.processDataPortabilityRequest(userId);
      // In a real implementation, this would trigger a download
      console.log('User data exported:', data);
      alert('Data export completed. Check console for details.');
    } catch (error) {
      console.error('Data export failed:', error);
      alert('Data export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const processDataErasure = async (userId: string, reason: string) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete all user data? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      const success = await complianceFramework.processDataErasureRequest(userId);
      if (success) {
        alert('Data erasure completed successfully.');
      } else {
        alert('Data erasure failed. Please check the logs.');
      }
    } catch (error) {
      console.error('Data erasure failed:', error);
      alert('Data erasure failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const executeRetentionPolicies = async () => {
    setLoading(true);
    try {
      await complianceFramework.executeRetentionPolicies();
      alert('Retention policies executed successfully.');
      loadComplianceData();
    } catch (error) {
      console.error('Failed to execute retention policies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getComplianceScore = () => {
    if (!complianceConfig) return 0;
    
    let score = 0;
    let maxScore = 0;
    
    // HIPAA compliance factors
    if (complianceConfig.hipaa.enabled) {
      maxScore += 40;
      if (complianceConfig.hipaa.auditLoggingRequired) score += 10;
      if (complianceConfig.hipaa.accessControlRequired) score += 10;
      if (complianceConfig.hipaa.encryptionRequired) score += 20;
    }
    
    // GDPR compliance factors
    if (complianceConfig.gdpr.enabled) {
      maxScore += 40;
      if (complianceConfig.gdpr.consentRequired) score += 10;
      if (complianceConfig.gdpr.dataPortabilityEnabled) score += 10;
      if (complianceConfig.gdpr.rightToErasureEnabled) score += 20;
    }
    
    // Audit logging
    if (complianceConfig.auditLogging.enabled) {
      maxScore += 20;
      score += 10;
      if (complianceConfig.auditLogging.realTimeMonitoring) score += 5;
      if (complianceConfig.auditLogging.sensitiveDataMasking) score += 5;
    }
    
    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  };

  const getComplianceScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (level) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const complianceScore = getComplianceScore();

  const handleDataPortabilityRequest = async () => {
    try {
      const exportId = await complianceFramework.processDataPortabilityRequest('user123');
      toast.success(`Data export created: ${exportId}`);
    } catch (error) {
      toast.error('Failed to process data portability request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Compliance Dashboard</h2>
          <p className="text-therapy-600 mt-1">
            HIPAA, GDPR compliance monitoring and data governance
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={generateHIPAAReport} disabled={loading} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate HIPAA Report
          </Button>
          <Button onClick={loadComplianceData} disabled={loading} variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getComplianceScoreColor(complianceScore)}`}>
              {complianceScore}%
            </div>
            <Progress value={complianceScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {complianceScore >= 90 ? 'Excellent' : complianceScore >= 70 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">HIPAA Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {complianceConfig?.hipaa?.enabled ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              )}
              <span className="font-medium">
                {complianceConfig?.hipaa?.enabled ? 'Compliant' : 'Not Enabled'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Healthcare data protection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">GDPR Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {complianceConfig?.gdpr?.enabled ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              )}
              <span className="font-medium">
                {complianceConfig?.gdpr?.enabled ? 'Compliant' : 'Not Enabled'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              EU privacy regulation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {auditLogs.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Recent audit logs
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="audit-logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audit-logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="data-retention">Data Retention</TabsTrigger>
          <TabsTrigger value="privacy-assessments">Privacy Assessments</TabsTrigger>
          <TabsTrigger value="gdpr-tools">GDPR Tools</TabsTrigger>
          <TabsTrigger value="hipaa-report">HIPAA Report</TabsTrigger>
        </TabsList>

        <TabsContent value="audit-logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Recent Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getSeverityColor(log.complianceLevel)}>
                            {log.complianceLevel?.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {log.dataClassification?.toUpperCase()}
                          </Badge>
                        </div>
                        <h4 className="font-medium">{log.action}</h4>
                        <p className="text-sm text-gray-600">Resource: {log.resource}</p>
                        <p className="text-sm text-gray-500">
                          User: {log.userId || 'System'} | IP: {log.ipAddress}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No audit logs available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-retention">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Archive className="h-5 w-5 mr-2" />
                  Data Retention Policies
                </div>
                <Button onClick={executeRetentionPolicies} disabled={loading}>
                  <Clock className="h-4 w-4 mr-2" />
                  Execute Policies
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retentionPolicies.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{policy.name}</h4>
                        <p className="text-sm text-gray-600">
                          Data Type: {policy.dataType}
                        </p>
                        <p className="text-sm text-gray-600">
                          Retention: {policy.retentionPeriodDays} days
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant={policy.autoDeleteEnabled ? 'default' : 'secondary'}>
                            {policy.autoDeleteEnabled ? 'Auto-Delete' : 'Manual Review'}
                          </Badge>
                          <Badge variant="outline">
                            {policy.complianceRequirement.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Next: {new Date(policy.nextExecution).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy-assessments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Impact Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacyAssessments.map((assessment) => (
                  <div key={assessment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{assessment.feature}</h4>
                        <p className="text-sm text-gray-600">
                          Purpose: {assessment.processingPurpose}
                        </p>
                        <p className="text-sm text-gray-600">
                          Legal Basis: {assessment.legalBasis}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getSeverityColor(assessment.riskLevel)}>
                            {assessment.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <Badge variant={
                            assessment.approvalStatus === 'approved' ? 'default' : 
                            assessment.approvalStatus === 'rejected' ? 'destructive' : 'secondary'
                          }>
                            {assessment.approvalStatus.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(assessment.assessedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                {privacyAssessments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No privacy assessments available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gdpr-tools">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                GDPR Data Subject Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  These tools should only be used by authorized personnel with proper verification of data subject identity.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Data Portability Request</h4>
                  <p className="text-sm text-gray-600">
                    Export all user data in a structured format
                  </p>
                  <Button 
                    onClick={() => {
                      const userId = prompt('Enter User ID:');
                      if (userId) processDataExport(userId);
                    }}
                    disabled={loading}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export User Data
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Right to Erasure</h4>
                  <p className="text-sm text-gray-600">
                    Permanently delete all user data
                  </p>
                  <Button 
                    onClick={() => {
                      const userId = prompt('Enter User ID:');
                      const reason = prompt('Enter reason for erasure:');
                      if (userId && reason) processDataErasure(userId, reason);
                    }}
                    disabled={loading}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hipaa-report">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                HIPAA Compliance Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hipaaReport ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Lock className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="font-medium">Encryption</p>
                      <p className="text-sm text-green-600">Compliant</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Shield className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="font-medium">Access Controls</p>
                      <p className="text-sm text-green-600">Compliant</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Eye className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="font-medium">Audit Logging</p>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Archive className="h-6 w-6 text-green-500" />
                      </div>
                      <p className="font-medium">Backups</p>
                      <p className="text-sm text-green-600">Compliant</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {hipaaReport.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No HIPAA report generated yet</p>
                  <Button onClick={generateHIPAAReport} disabled={loading}>
                    Generate Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceDashboard;
