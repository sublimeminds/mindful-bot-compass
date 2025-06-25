
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Smartphone, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/components/SimpleAuthProvider';
import { securityMiddleware } from '@/services/securityMiddleware';
import { toast } from 'sonner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireMFA?: boolean;
  allowedRoles?: string[];
}

interface MFASetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

const EnhancedAuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireMFA = false, 
  allowedRoles = [] 
}) => {
  const { user, loading } = useAuth();
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaVerified, setMfaVerified] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [mfaSetup, setMfaSetup] = useState<MFASetup | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('');
  const [sessionValid, setSessionValid] = useState(true);
  const [securityChecks, setSecurityChecks] = useState({
    rateLimit: true,
    deviceTrust: true,
    sessionHealth: true,
    anomalyDetection: true
  });

  useEffect(() => {
    if (user) {
      initializeSecurityChecks();
      checkDeviceFingerprint();
      validateUserSession();
    }
  }, [user]);

  const initializeSecurityChecks = async () => {
    if (!user) return;

    // Check rate limiting
    const rateLimitOk = securityMiddleware.checkRateLimit(user.id, 'auth_guard');
    
    // Check for anomalies
    const anomalyDetected = securityMiddleware.detectAnomalies(user.id, {
      action: 'auth_guard_check',
      timestamp: new Date()
    });

    // Check MFA status (mock - in real app, this would come from user profile)
    const mfaStatus = localStorage.getItem(`mfa_enabled_${user.id}`) === 'true';
    setMfaEnabled(mfaStatus);

    setSecurityChecks({
      rateLimit: rateLimitOk,
      deviceTrust: !anomalyDetected,
      sessionHealth: true, // Will be updated by session validation
      anomalyDetection: !anomalyDetected
    });

    if (!rateLimitOk) {
      toast.error('Too many authentication attempts. Please wait.');
    }

    if (anomalyDetected) {
      toast.warning('Unusual activity detected. Additional verification may be required.');
    }
  };

  const checkDeviceFingerprint = () => {
    const fingerprint = securityMiddleware.generateDeviceFingerprint();
    setDeviceFingerprint(fingerprint);

    const storedFingerprint = localStorage.getItem(`device_fingerprint_${user?.id}`);
    if (storedFingerprint && storedFingerprint !== fingerprint) {
      securityMiddleware.logSecurityEvent({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type: 'suspicious_activity',
        userId: user?.id,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { 
          reason: 'Device fingerprint mismatch',
          stored: storedFingerprint,
          current: fingerprint
        },
        severity: 'medium'
      });
      
      toast.warning('New device detected. Please verify your identity.');
    } else if (!storedFingerprint) {
      localStorage.setItem(`device_fingerprint_${user?.id}`, fingerprint);
    }
  };

  const validateUserSession = () => {
    if (!user) return;

    const sessionId = sessionStorage.getItem('currentSessionId') || crypto.randomUUID();
    const isValid = securityMiddleware.validateSession(sessionId, user.id);
    
    setSessionValid(isValid);
    setSecurityChecks(prev => ({ ...prev, sessionHealth: isValid }));

    if (!isValid) {
      toast.error('Session validation failed. Please log in again.');
    }
  };

  const setupMFA = async () => {
    // Mock MFA setup - in real app, this would call your backend
    const secret = crypto.randomUUID().replace(/-/g, '').slice(0, 32);
    const qrCode = `otpauth://totp/TherapySync:${user?.email}?secret=${secret}&issuer=TherapySync`;
    const backupCodes = Array.from({ length: 8 }, () => 
      Math.random().toString(36).substring(2, 8).toUpperCase()
    );

    setMfaSetup({ secret, qrCode, backupCodes });
    setShowMFASetup(true);
  };

  const verifyMFACode = async () => {
    if (!mfaCode || mfaCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    // Mock MFA verification - in real app, this would verify against TOTP
    const isValid = mfaCode === '123456' || mfaCode.match(/^\d{6}$/);
    
    if (isValid) {
      setMfaVerified(true);
      localStorage.setItem(`mfa_verified_${user?.id}`, 'true');
      toast.success('MFA verification successful');
    } else {
      toast.error('Invalid MFA code');
      securityMiddleware.logSecurityEvent({
        id: crypto.randomUUID(),
        timestamp: new Date(),
        type: 'auth_failure',
        userId: user?.id,
        ipAddress: 'unknown',
        userAgent: navigator.userAgent,
        details: { reason: 'Invalid MFA code' },
        severity: 'medium'
      });
    }
  };

  const completeMFASetup = () => {
    if (!user) return;
    
    localStorage.setItem(`mfa_enabled_${user.id}`, 'true');
    setMfaEnabled(true);
    setShowMFASetup(false);
    setMfaVerified(true);
    toast.success('MFA has been enabled for your account');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-therapy-600 mx-auto mb-4"></div>
          <p className="text-therapy-600">Validating security...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Authentication required to access this resource.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Security checks failed
  if (!securityChecks.rateLimit || !securityChecks.sessionHealth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Security Check Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Security verification failed. Please try again later or contact support.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Rate Limiting</span>
                <Badge variant={securityChecks.rateLimit ? "default" : "destructive"}>
                  {securityChecks.rateLimit ? "OK" : "Failed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Health</span>
                <Badge variant={securityChecks.sessionHealth ? "default" : "destructive"}>
                  {securityChecks.sessionHealth ? "OK" : "Failed"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // MFA Setup Required
  if (showMFASetup && mfaSetup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Smartphone className="h-5 w-5 mr-2" />
              Set Up Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg border mb-4">
                <p className="text-sm font-mono bg-gray-100 p-2 rounded">
                  {mfaSetup.secret}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code with your authenticator app or enter the secret manually.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Backup Codes</h4>
              <div className="grid grid-cols-2 gap-2">
                {mfaSetup.backupCodes.map((code, index) => (
                  <div key={index} className="text-xs font-mono bg-gray-50 p-2 rounded text-center">
                    {code}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Save these backup codes in a secure location.
              </p>
            </div>

            <Button onClick={completeMFASetup} className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // MFA Verification Required
  if (requireMFA && mfaEnabled && !mfaVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-therapy-50 to-calm-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Two-Factor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Enter the 6-digit code from your authenticator app to continue.
            </p>
            
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button onClick={verifyMFACode} className="w-full" disabled={mfaCode.length !== 6}>
              Verify Code
            </Button>

            {!mfaEnabled && (
              <Button onClick={setupMFA} variant="outline" className="w-full">
                Set Up MFA
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // All security checks passed
  return (
    <div>
      {/* Security Status Bar */}
      <div className="bg-green-50 border-b border-green-200 p-2">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-800">Secure Session</span>
          </div>
          {mfaEnabled && (
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">MFA Enabled</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-gray-600" />
            <span className="text-gray-800">Session Valid</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default EnhancedAuthGuard;
