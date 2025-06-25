
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Archive, 
  Shield, 
  Clock, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Play,
  RotateCcw,
  Database,
  HardDrive,
  Zap,
  Globe
} from 'lucide-react';
import { backupRecoverySystem } from '@/services/backupRecoverySystem';

const BackupRecoveryDashboard = () => {
  const [backups, setBackups] = useState([]);
  const [recoveryPoints, setRecoveryPoints] = useState([]);
  const [drPlans, setDrPlans] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setBackups(backupRecoverySystem.getBackups());
      setRecoveryPoints(backupRecoverySystem.getRecoveryPoints());
      setDrPlans(backupRecoverySystem.getDisasterRecoveryPlans());
      setStatistics(backupRecoverySystem.getBackupStatistics());
    } catch (error) {
      console.error('Failed to load backup data:', error);
    }
  };

  const createManualBackup = async () => {
    setLoading(true);
    try {
      const backupId = await backupRecoverySystem.createBackup(
        'full',
        ['profiles', 'therapy_sessions', 'mood_entries', 'goals'],
        'Manual backup created from dashboard'
      );
      console.log('Manual backup created:', backupId);
      await loadData();
    } catch (error) {
      console.error('Manual backup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const restoreFromBackup = async (backupId) => {
    const confirmed = window.confirm(
      'Are you sure you want to restore from this backup? This will overwrite current data.'
    );
    
    if (!confirmed) return;

    setLoading(true);
    try {
      const success = await backupRecoverySystem.restoreFromBackup(backupId);
      if (success) {
        alert('Restore completed successfully!');
      } else {
        alert('Restore failed. Please check the logs.');
      }
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Restore failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const testDisasterRecovery = async (planId) => {
    setLoading(true);
    try {
      const result = await backupRecoverySystem.testDisasterRecovery(planId);
      const message = result.success 
        ? `Test PASSED! RTO: ${result.actualRTO} minutes`
        : `Test FAILED. Issues: ${result.issues.join(', ')}`;
      alert(message);
      await loadData();
    } catch (error) {
      console.error('DR test failed:', error);
      alert('Disaster recovery test failed. Please check the logs.');
    } finally {
      setLoading(false);
    }
  };

  const cleanupOldBackups = async () => {
    setLoading(true);
    try {
      await backupRecoverySystem.cleanupOldBackups();
      alert('Old backups cleaned up successfully!');
      await loadData();
    } catch (error) {
      console.error('Cleanup failed:', error);
      alert('Cleanup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'corrupted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getHealthScore = () => {
    if (!statistics) return 0;
    const verificationRate = statistics.totalBackups > 0 ? 
      (statistics.verifiedBackups / statistics.totalBackups) * 100 : 0;
    return Math.round(verificationRate);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-therapy-900">Backup & Recovery</h2>
          <p className="text-therapy-600 mt-1">
            Automated backup system and disaster recovery management
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={createManualBackup} disabled={loading}>
            <Archive className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
          <Button onClick={cleanupOldBackups} disabled={loading} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Cleanup Old
          </Button>
        </div>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{getHealthScore()}%</div>
              <Progress value={getHealthScore()} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {statistics.verifiedBackups}/{statistics.totalBackups} verified
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Backups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{statistics.totalBackups}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatBytes(statistics.totalSize)} total size
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                {statistics.lastBackup ? 
                  new Date(statistics.lastBackup).toLocaleString() : 
                  'No backups yet'
                }
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Automatic daily backups
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {statistics.encryptionEnabled && (
                  <Badge className="text-xs bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Encrypted
                  </Badge>
                )}
                {statistics.multiRegionEnabled && (
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    <Globe className="h-3 w-3 mr-1" />
                    Multi-Region
                  </Badge>
                )}
                <Badge className="text-xs bg-purple-100 text-purple-800">
                  <Zap className="h-3 w-3 mr-1" />
                  Automated
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="recovery-points">Recovery Points</TabsTrigger>
          <TabsTrigger value="disaster-recovery">Disaster Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="backups">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="h-5 w-5 mr-2" />
                Backup History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backups.map((backup) => (
                  <div key={backup.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={getStatusColor(backup.status)}>
                            {backup.status.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {backup.type.toUpperCase()}
                          </Badge>
                          {backup.encrypted && (
                            <Badge className="bg-green-100 text-green-800">
                              <Shield className="h-3 w-3 mr-1" />
                              Encrypted
                            </Badge>
                          )}
                          {backup.compressed && (
                            <Badge className="bg-blue-100 text-blue-800">
                              Compressed
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Created</p>
                            <p className="font-medium">
                              {new Date(backup.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Size</p>
                            <p className="font-medium">{formatBytes(backup.size)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tables</p>
                            <p className="font-medium">{backup.tables.length} tables</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Expires</p>
                            <p className="font-medium">
                              {new Date(backup.retentionExpiry).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          <p>Checksums: MD5: {backup.checksumMD5.substring(0, 8)}...</p>
                          <p>SHA-256: {backup.checksumSHA256.substring(0, 8)}...</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {backup.status === 'verified' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => restoreFromBackup(backup.id)}
                            disabled={loading}
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Restore
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {backups.length === 0 && (
                  <div className="text-center py-8">
                    <Archive className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Backups Yet</h3>
                    <p className="text-gray-500 mb-4">
                      Create your first backup to get started with data protection.
                    </p>
                    <Button onClick={createManualBackup} disabled={loading}>
                      <Archive className="h-4 w-4 mr-2" />
                      Create First Backup
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recovery-points">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recovery Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recoveryPoints.map((point) => (
                  <div key={point.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{point.description}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Timestamp</p>
                            <p className="font-medium">
                              {new Date(point.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Integrity Score</p>
                            <p className="font-medium">{point.dataIntegrityScore}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Recovery Time</p>
                            <p className="font-medium">{point.recoveryTimeEstimate} min</p>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">
                        Point-in-Time
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {recoveryPoints.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No recovery points available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disaster-recovery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Disaster Recovery Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drPlans.map((plan) => (
                  <div key={plan.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-lg mb-2">{plan.name}</h4>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">RTO Target</p>
                            <p className="font-medium">{plan.rto} minutes</p>
                          </div>
                          <div>
                            <p className="text-gray-500">RPO Target</p>
                            <p className="font-medium">{plan.rpo} minutes</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Steps</p>
                            <p className="font-medium">{plan.recoverySteps.length} steps</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Last Tested</p>
                            <p className="font-medium">
                              {new Date(plan.lastTested).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Trigger Conditions:</p>
                          <ul className="text-sm text-gray-600 list-disc list-inside">
                            {plan.triggerConditions.map((condition, index) => (
                              <li key={index}>{condition}</li>
                            ))}
                          </ul>
                        </div>

                        {plan.testResults.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Last Test Result:</p>
                            <div className="flex items-center space-x-2">
                              {plan.testResults[plan.testResults.length - 1].success ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm">
                                {plan.testResults[plan.testResults.length - 1].success ? 'PASSED' : 'FAILED'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => testDisasterRecovery(plan.id)}
                          disabled={loading}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Test Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackupRecoveryDashboard;
