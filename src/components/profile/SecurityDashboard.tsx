import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Shield, Key, Smartphone, Clock, Eye, EyeOff, Check, X, Lock, QrCode } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const SecurityDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    loading, 
    setupTOTP, 
    confirmTOTP, 
    setupSMS, 
    confirmSMS, 
    disable2FA, 
    getTwoFactorStatus 
  } = useTwoFactorAuth();
  
  const [twoFactorStatus, setTwoFactorStatus] = useState({ totp: false, sms: false, phone_number: null });
  const [showPassword, setShowPassword] = useState(false);
  const [showTOTPSetup, setShowTOTPSetup] = useState(false);
  const [showSMSSetup, setShowSMSSetup] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [totpCode, setTotpCode] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    const loadTwoFactorStatus = async () => {
      const status = await getTwoFactorStatus();
      setTwoFactorStatus(status);
    };
    
    if (user) {
      loadTwoFactorStatus();
    }
  }, [user, getTwoFactorStatus]);

  const handleSetupTOTP = async () => {
    const setup = await setupTOTP();
    if (setup) {
      setTotpSecret(setup.secret);
      setQrCodeUrl(setup.qrCodeUrl);
      setBackupCodes(setup.backupCodes);
      setShowTOTPSetup(true);
    }
  };

  const handleConfirmTOTP = async () => {
    if (totpCode.length === 6) {
      const success = await confirmTOTP(totpSecret, totpCode, backupCodes);
      if (success) {
        setShowTOTPSetup(false);
        setTotpCode('');
        const status = await getTwoFactorStatus();
        setTwoFactorStatus(status);
      }
    }
  };

  const handleSetupSMS = async () => {
    if (phoneNumber) {
      const success = await setupSMS(phoneNumber);
      if (success) {
        setShowSMSSetup(true);
      }
    }
  };

  const handleConfirmSMS = async () => {
    if (smsCode.length === 6) {
      const success = await confirmSMS(phoneNumber, smsCode);
      if (success) {
        setShowSMSSetup(false);
        setSmsCode('');
        setPhoneNumber('');
        const status = await getTwoFactorStatus();
        setTwoFactorStatus(status);
      }
    }
  };

  const handleDisable2FA = async (method: 'totp' | 'sms') => {
    const success = await disable2FA(method);
    if (success) {
      const status = await getTwoFactorStatus();
      setTwoFactorStatus(status);
    }
  };

  const handleChangePassword = () => {
    // Mock change password
    toast({
      title: "Password Change Initiated",
      description: "A password reset link has been sent to your email address.",
    });
  };

  const handleViewLoginHistory = () => {
    // Mock view login history
    toast({
      title: "Login History",
      description: "Redirecting to your login history page.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Two-Factor Authentication</Label>
              <div className="flex gap-2">
                {twoFactorStatus.totp && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Key className="h-3 w-3" />
                    TOTP Enabled
                  </Badge>
                )}
                {twoFactorStatus.sms && (
                  <Badge variant="default" className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" />
                    SMS Enabled
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4" />
                      <span className="font-medium">Authenticator App</span>
                    </div>
                    {twoFactorStatus.totp ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisable2FA('totp')}
                        disabled={loading}
                      >
                        Disable
                      </Button>
                    ) : (
                      <Dialog open={showTOTPSetup} onOpenChange={setShowTOTPSetup}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSetupTOTP}
                            disabled={loading}
                          >
                            Setup
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Setup Authenticator App</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground mb-4">
                                Scan this QR code with your authenticator app
                              </p>
                              {qrCodeUrl && (
                                <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Enter verification code</Label>
                              <InputOTP
                                value={totpCode}
                                onChange={setTotpCode}
                                maxLength={6}
                              >
                                <InputOTPGroup>
                                  <InputOTPSlot index={0} />
                                  <InputOTPSlot index={1} />
                                  <InputOTPSlot index={2} />
                                  <InputOTPSlot index={3} />
                                  <InputOTPSlot index={4} />
                                  <InputOTPSlot index={5} />
                                </InputOTPGroup>
                              </InputOTP>
                            </div>
                            {backupCodes.length > 0 && (
                              <div className="space-y-2">
                                <Label>Backup Codes (Save these securely)</Label>
                                <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded">
                                  {backupCodes.map((code, index) => (
                                    <span key={index} className="text-xs font-mono">
                                      {code}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            <Button 
                              onClick={handleConfirmTOTP} 
                              disabled={totpCode.length !== 6 || loading}
                              className="w-full"
                            >
                              Confirm Setup
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use Google Authenticator or Microsoft Authenticator
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span className="font-medium">SMS Authentication</span>
                    </div>
                    {twoFactorStatus.sms ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisable2FA('sms')}
                        disabled={loading}
                      >
                        Disable
                      </Button>
                    ) : (
                      <Dialog open={showSMSSetup} onOpenChange={setShowSMSSetup}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loading}
                          >
                            Setup
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Setup SMS Authentication</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {!showSMSSetup ? (
                              <>
                                <div className="space-y-2">
                                  <Label>Phone Number</Label>
                                  <Input
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                  />
                                </div>
                                <Button 
                                  onClick={handleSetupSMS} 
                                  disabled={!phoneNumber || loading}
                                  className="w-full"
                                >
                                  Send Verification Code
                                </Button>
                              </>
                            ) : (
                              <>
                                <div className="space-y-2">
                                  <Label>Enter verification code sent to {phoneNumber}</Label>
                                  <InputOTP
                                    value={smsCode}
                                    onChange={setSmsCode}
                                    maxLength={6}
                                  >
                                    <InputOTPGroup>
                                      <InputOTPSlot index={0} />
                                      <InputOTPSlot index={1} />
                                      <InputOTPSlot index={2} />
                                      <InputOTPSlot index={3} />
                                      <InputOTPSlot index={4} />
                                      <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                  </InputOTP>
                                </div>
                                <Button 
                                  onClick={handleConfirmSMS} 
                                  disabled={smsCode.length !== 6 || loading}
                                  className="w-full"
                                >
                                  Confirm Setup
                                </Button>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {twoFactorStatus.phone_number || "Receive codes via text message"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                disabled
                className="bg-gray-50"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 rounded-full"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button variant="outline" onClick={handleChangePassword}>
              Change Password
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Login History</Label>
            <p className="text-sm text-muted-foreground">
              Review your recent login activity.
            </p>
            <Button variant="outline" onClick={handleViewLoginHistory}>
              View Login History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;
