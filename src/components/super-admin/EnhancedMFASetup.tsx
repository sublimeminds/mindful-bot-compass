import React, { useState, useEffect } from 'react';
import { useSuperAdminMFA } from '@/hooks/useSuperAdminMFA';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Smartphone, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface EnhancedMFASetupProps {
  adminId: string;
}

const EnhancedMFASetup: React.FC<EnhancedMFASetupProps> = ({ adminId }) => {
  const {
    isLoading,
    trustedDevices,
    securityAlerts,
    setupEnhancedMFA,
    verifyBackupCode,
    createTrustedDevice,
    fetchTrustedDevices,
    revokeTrustedDevice,
    fetchSecurityAlerts,
    acknowledgeAlert
  } = useSuperAdminMFA();

  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  useEffect(() => {
    fetchTrustedDevices(adminId);
    fetchSecurityAlerts(adminId);
  }, [adminId, fetchTrustedDevices, fetchSecurityAlerts]);

  const handleSetupMFA = async () => {
    const result = await setupEnhancedMFA(adminId);
    if (result.success && result.backupCodes) {
      setBackupCodes(result.backupCodes.map((code: any) => code.code));
      setShowBackupCodes(true);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter a verification code');
      return;
    }

    const result = await verifyBackupCode(adminId, verificationCode);
    if (result.success) {
      setVerificationCode('');
    }
  };

  const handleAddTrustedDevice = async () => {
    if (!deviceName) {
      toast.error('Please enter a device name');
      return;
    }

    // Generate a simple device fingerprint
    const fingerprint = btoa(`${navigator.userAgent}-${Date.now()}`);
    
    const result = await createTrustedDevice(adminId, deviceName, fingerprint);
    if (result.success) {
      setDeviceName('');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const copyAllCodes = () => {
    const allCodes = backupCodes.join('\n');
    navigator.clipboard.writeText(allCodes);
    toast.success('All backup codes copied to clipboard');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Enhanced MFA Configuration</h2>
        <p className="text-muted-foreground">
          Configure enhanced multi-factor authentication for super admin accounts
        </p>
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="devices">Trusted Devices</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="verify">Verify</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Enhanced MFA Setup</span>
              </CardTitle>
              <CardDescription>
                Set up enhanced multi-factor authentication with backup codes and device trust
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSetupMFA} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Setting up...' : 'Generate New Backup Codes'}
              </Button>

              {showBackupCodes && backupCodes.length > 0 && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Backup Codes
                    </h4>
                    <Button size="sm" variant="outline" onClick={copyAllCodes}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy All
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {backupCodes.map((code, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 bg-background rounded border font-mono text-sm"
                      >
                        <span>{code}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => copyToClipboard(code)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Important:</p>
                        <p>Store these backup codes securely. Each code can only be used once.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5" />
                <span>Trusted Devices</span>
              </CardTitle>
              <CardDescription>
                Manage devices that can bypass MFA for a limited time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Label htmlFor="deviceName">Device Name</Label>
                  <Input
                    id="deviceName"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="e.g., Work Laptop, Home Desktop"
                  />
                </div>
                <Button onClick={handleAddTrustedDevice} disabled={isLoading} className="mt-6">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>

              <div className="space-y-3">
                {trustedDevices.map((device) => (
                  <div 
                    key={device.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{device.device_name}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Last used: {device.last_used_at ? format(new Date(device.last_used_at), 'MMM dd, HH:mm') : 'Never'}</p>
                        <p>Expires: {format(new Date(device.expires_at), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => revokeTrustedDevice(device.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {trustedDevices.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No trusted devices configured
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Security Alerts</span>
              </CardTitle>
              <CardDescription>
                Recent security alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-start justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {alert.alert_type}
                        </span>
                      </div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(alert.created_at), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id, adminId)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {alert.acknowledged && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
                {securityAlerts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No security alerts
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verify" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Verify Backup Code</span>
              </CardTitle>
              <CardDescription>
                Test your backup codes to ensure they work correctly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Backup Code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter a backup code to verify"
                />
              </div>
              <Button onClick={handleVerifyCode} disabled={isLoading || !verificationCode}>
                Verify Code
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedMFASetup;