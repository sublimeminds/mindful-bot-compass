import DOMPurify from 'dompurify';

/**
 * Input validation and sanitization utilities
 */
export class InputValidator {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email) && 
           email.length <= 254 && 
           !email.includes('..') &&
           !email.includes('@.') &&
           !email.startsWith('.');
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Sanitize HTML content
   */
  static sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'a'],
      ALLOWED_ATTR: ['href', 'target'],
      ALLOW_DATA_ATTR: false
    });
  }

  /**
   * Validate and sanitize text input
   */
  static sanitizeText(text: string, maxLength: number = 1000): string {
    if (typeof text !== 'string') {
      return '';
    }
    
    return text
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: URLs
      .replace(/data:/gi, ''); // Remove data: URLs
  }

  /**
   * Validate username format
   */
  static isValidUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate URL format
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check for SQL injection patterns
   */
  static containsSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
      /(-{2}|\/\*|\*\/)/,
      /(;|'|"|\||&)/,
      /(\bOR\b|\bAND\b).*=.*=/i
    ];
    
    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check for XSS patterns
   */
  static containsXSS(input: string): boolean {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<[^>]*\s(onerror|onload|onclick|onmouseover)\s*=/gi
    ];
    
    return xssPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Comprehensive input validation
   */
  static validateInput(input: string, type: 'text' | 'email' | 'username' | 'phone' | 'url' = 'text'): {
    isValid: boolean;
    sanitized: string;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitized = this.sanitizeText(input);
    
    // Check for malicious patterns
    if (this.containsSQLInjection(input)) {
      errors.push('Input contains potentially malicious SQL patterns');
    }
    
    if (this.containsXSS(input)) {
      errors.push('Input contains potentially malicious script patterns');
    }
    
    // Type-specific validation
    switch (type) {
      case 'email':
        if (!this.isValidEmail(sanitized)) {
          errors.push('Invalid email format');
        }
        break;
      case 'username':
        if (!this.isValidUsername(sanitized)) {
          errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
        }
        break;
      case 'phone':
        if (!this.isValidPhoneNumber(sanitized)) {
          errors.push('Invalid phone number format');
        }
        break;
      case 'url':
        if (sanitized && !this.isValidURL(sanitized)) {
          errors.push('Invalid URL format');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      sanitized,
      errors
    };
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private static attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  
  /**
   * Check if action is allowed based on rate limiting
   */
  static isAllowed(
    identifier: string, 
    maxAttempts: number = 5, 
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(identifier);
    
    if (!attempt) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Reset if window has passed
    if (now - attempt.lastAttempt > windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Check if limit exceeded
    if (attempt.count >= maxAttempts) {
      return false;
    }
    
    // Increment count
    attempt.count++;
    attempt.lastAttempt = now;
    
    return true;
  }
  
  /**
   * Clear rate limit for identifier
   */
  static clearLimit(identifier: string): void {
    this.attempts.delete(identifier);
  }
}