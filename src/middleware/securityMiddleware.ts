/**
 * Security Middleware - Input validation and security headers
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'email' | 'password' | 'url' | 'text' | 'number';
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export class SecurityMiddleware {
  /**
   * Validate input data against schema
   */
  static validateInput(data: any, schema: ValidationSchema): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const [field, rule] of Object.entries(schema)) {
      const value = data[field];
      
      // Required check
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value) {
        const strValue = value.toString();
        
        // Length checks
        if (rule.minLength && strValue.length < rule.minLength) {
          errors.push(`${field} must be at least ${rule.minLength} characters`);
        }
        
        if (rule.maxLength && strValue.length > rule.maxLength) {
          errors.push(`${field} must not exceed ${rule.maxLength} characters`);
        }
        
        // Pattern check
        if (rule.pattern && !rule.pattern.test(strValue)) {
          errors.push(`${field} format is invalid`);
        }
        
        // Type-specific validation
        if (rule.type) {
          switch (rule.type) {
            case 'email':
              const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailPattern.test(strValue)) {
                errors.push(`${field} must be a valid email address`);
              }
              break;
            case 'password':
              if (strValue.length < 8) {
                errors.push(`${field} must be at least 8 characters long`);
              }
              if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(strValue)) {
                errors.push(`${field} must contain uppercase, lowercase, and number`);
              }
              break;
            case 'url':
              try {
                new URL(strValue);
              } catch {
                errors.push(`${field} must be a valid URL`);
              }
              break;
          }
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize input to prevent XSS
   */
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>'"&]/g, (char) => {
        const entities: { [key: string]: string } = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
          '&': '&amp;'
        };
        return entities[char] || char;
      })
      .trim();
  }

  /**
   * Generate Content Security Policy header
   */
  static generateCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.openai.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');
  }

  /**
   * Generate device fingerprint for session tracking
   */
  static generateDeviceFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      (navigator as any).deviceMemory || 0
    ];
    
    return btoa(components.join('|')).substring(0, 32);
  }

  /**
   * Detect suspicious activity patterns
   */
  static detectSuspiciousActivity(sessionData: any): { suspicious: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    // Check for rapid requests
    if (sessionData.requestCount > 100 && sessionData.timeWindow < 60000) {
      reasons.push('High request rate detected');
    }
    
    // Check for location anomalies
    if (sessionData.ipCountries && sessionData.ipCountries.length > 2) {
      reasons.push('Multiple geographic locations detected');
    }
    
    // Check for unusual access patterns
    if (sessionData.failedLoginAttempts > 5) {
      reasons.push('Multiple failed login attempts');
    }
    
    return {
      suspicious: reasons.length > 0,
      reasons
    };
  }

  /**
   * Rate limiting check
   */
  static checkRateLimit(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const windowKey = `rateLimit_${key}_${Math.floor(now / windowMs)}`;
    const stored = sessionStorage.getItem(windowKey);
    const count = stored ? parseInt(stored) : 0;
    
    if (count >= maxRequests) {
      return false;
    }
    
    sessionStorage.setItem(windowKey, (count + 1).toString());
    
    // Cleanup old rate limit entries
    const allKeys = Object.keys(sessionStorage);
    allKeys.forEach(storageKey => {
      if (storageKey.startsWith('rateLimit_') && storageKey !== windowKey) {
        const timestamp = parseInt(storageKey.split('_').pop() || '0');
        if (now - timestamp * windowMs > windowMs * 2) {
          sessionStorage.removeItem(storageKey);
        }
      }
    });
    
    return true;
  }
}