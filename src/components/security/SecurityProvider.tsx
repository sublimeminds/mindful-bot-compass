import React, { createContext, useContext, useEffect, useState } from 'react';
import { SecurityMiddleware } from '@/middleware/securityMiddleware';
import { SecureAuditService } from '@/services/secureAuditService';

interface SecurityContextType {
  isSecure: boolean;
  deviceFingerprint: string;
  checkRateLimit: (key: string, maxRequests?: number, windowMs?: number) => boolean;
  validateInput: (data: any, schema: any) => { isValid: boolean; errors: string[] };
  sanitizeInput: (input: string) => string;
}

const SecurityContext = createContext<SecurityContextType | null>(null);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSecure, setIsSecure] = useState(false);
  const [deviceFingerprint, setDeviceFingerprint] = useState('');

  useEffect(() => {
    // Initialize security
    const initSecurity = async () => {
      try {
        // Set enhanced CSP header with stricter security
        const csp = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests; block-all-mixed-content; report-uri /api/csp-report;";
        const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (!existingCSP) {
          const meta = document.createElement('meta');
          meta.httpEquiv = 'Content-Security-Policy';
          meta.content = csp;
          document.head.appendChild(meta);
        }

        // Generate device fingerprint with enhanced entropy
        const fingerprint = SecurityMiddleware.generateDeviceFingerprint();
        setDeviceFingerprint(fingerprint);

        // Set comprehensive security headers
        const securityHeaders = [
          { name: 'X-Content-Type-Options', content: 'nosniff' },
          { name: 'X-Frame-Options', content: 'DENY' },
          { name: 'X-XSS-Protection', content: '1; mode=block' },
          { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
          { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=()' },
          { name: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' }
        ];

        securityHeaders.forEach(({ name, content }) => {
          const existing = document.querySelector(`meta[name="${name}"]`);
          if (!existing) {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
          }
        });

        // Audit and migrate localStorage data
        SecureAuditService.auditStorageUsage();
        await SecureAuditService.migrateLocalStorageData();

        // Log security initialization
        await SecureAuditService.logAuditEvent({
          eventType: 'security_event',
          description: 'Security system initialized',
          metadata: { fingerprint, timestamp: Date.now() },
          severity: 'low'
        });

        setIsSecure(true);
      } catch (error) {
        console.error('Security initialization failed:', error);
        await SecureAuditService.logAuditEvent({
          eventType: 'security_event',
          description: 'Security initialization failed',
          metadata: { error: error?.toString() },
          severity: 'high'
        });
      }
    };

    initSecurity();
  }, []);

  const checkRateLimit = (key: string, maxRequests = 10, windowMs = 60000) => {
    return SecurityMiddleware.checkRateLimit(key, maxRequests, windowMs);
  };

  const validateInput = (data: any, schema: any) => {
    return SecurityMiddleware.validateInput(data, schema);
  };

  const sanitizeInput = (input: string) => {
    return SecurityMiddleware.sanitizeInput(input);
  };

  return (
    <SecurityContext.Provider value={{
      isSecure,
      deviceFingerprint,
      checkRateLimit,
      validateInput,
      sanitizeInput
    }}>
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};