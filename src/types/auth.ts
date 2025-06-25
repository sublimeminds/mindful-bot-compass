
// TypeScript interfaces for Enhanced Auth Provider
export interface SecurityEventDetails {
  reason?: string;
  error?: string;
  type?: string;
  email?: string;
  user_id?: string;
  errors?: string[];
  device_fingerprint?: string;
  stored?: string;
  current?: string;
  timestamp?: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'auth_failure' | 'auth_success' | 'suspicious_activity' | 'mfa_required' | 'mfa_invalid' | 'registration_failure' | 'registration_success' | 'logout' | 'mfa_enabled' | 'mfa_disabled' | 'device_trusted';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: SecurityEventDetails;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface SecurityMetrics {
  totalEvents: number;
  failedLogins: number;
  successfulLogins: number;
  suspiciousActivity: number;
  lastActivity?: Date;
}
