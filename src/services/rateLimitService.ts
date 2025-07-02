interface RateLimitRule {
  id: string;
  pattern: string | RegExp;
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (identifier: string) => string;
  onLimitReached?: (identifier: string) => void;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

class RateLimitService {
  private limits = new Map<string, RateLimitEntry>();
  private rules: RateLimitRule[] = [
    {
      id: 'api-calls',
      pattern: /^api_/,
      windowMs: 60000, // 1 minute
      maxRequests: 100,
      onLimitReached: (id) => console.warn(`Rate limit reached for ${id}`)
    },
    {
      id: 'ai-requests',
      pattern: /^ai_/,
      windowMs: 300000, // 5 minutes
      maxRequests: 20,
      onLimitReached: (id) => console.warn(`AI rate limit reached for ${id}`)
    },
    {
      id: 'file-uploads',
      pattern: /^upload_/,
      windowMs: 3600000, // 1 hour
      maxRequests: 50,
      onLimitReached: (id) => console.warn(`Upload rate limit reached for ${id}`)
    },
    {
      id: 'authentication',
      pattern: /^auth_/,
      windowMs: 900000, // 15 minutes
      maxRequests: 5,
      onLimitReached: (id) => console.warn(`Auth rate limit reached for ${id}`)
    }
  ];

  // Check if request is allowed
  isAllowed(identifier: string, action?: string): boolean {
    const key = action ? `${action}_${identifier}` : identifier;
    const rule = this.findMatchingRule(key);
    
    if (!rule) return true; // No rule = allowed

    const now = Date.now();
    const limitKey = rule.keyGenerator ? rule.keyGenerator(key) : key;
    let entry = this.limits.get(limitKey);

    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + rule.windowMs,
        blocked: false
      };
      this.limits.set(limitKey, entry);
    }

    // Check if currently blocked
    if (entry.blocked) {
      return false;
    }

    // Check if limit would be exceeded
    if (entry.count >= rule.maxRequests) {
      entry.blocked = true;
      rule.onLimitReached?.(identifier);
      return false;
    }

    return true;
  }

  // Record a request attempt
  recordRequest(identifier: string, action?: string, success: boolean = true): void {
    const key = action ? `${action}_${identifier}` : identifier;
    const rule = this.findMatchingRule(key);
    
    if (!rule) return;

    // Skip counting based on rule configuration
    if ((rule.skipSuccessfulRequests && success) || 
        (rule.skipFailedRequests && !success)) {
      return;
    }

    const limitKey = rule.keyGenerator ? rule.keyGenerator(key) : key;
    const entry = this.limits.get(limitKey);
    
    if (entry && !entry.blocked) {
      entry.count++;
    }
  }

  // Get rate limit status for identifier
  getStatus(identifier: string, action?: string) {
    const key = action ? `${action}_${identifier}` : identifier;
    const rule = this.findMatchingRule(key);
    
    if (!rule) {
      return {
        allowed: true,
        remaining: Infinity,
        resetTime: null,
        blocked: false
      };
    }

    const limitKey = rule.keyGenerator ? rule.keyGenerator(key) : key;
    const entry = this.limits.get(limitKey);
    
    if (!entry) {
      return {
        allowed: true,
        remaining: rule.maxRequests,
        resetTime: null,
        blocked: false
      };
    }

    return {
      allowed: !entry.blocked && entry.count < rule.maxRequests,
      remaining: Math.max(0, rule.maxRequests - entry.count),
      resetTime: new Date(entry.resetTime),
      blocked: entry.blocked
    };
  }

  // Add custom rule
  addRule(rule: RateLimitRule): void {
    this.rules.push(rule);
  }

  // Remove rule by ID
  removeRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId);
  }

  // Find matching rule for key
  private findMatchingRule(key: string): RateLimitRule | null {
    for (const rule of this.rules) {
      if (typeof rule.pattern === 'string') {
        if (key.includes(rule.pattern)) return rule;
      } else if (rule.pattern instanceof RegExp) {
        if (rule.pattern.test(key)) return rule;
      }
    }
    return null;
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now >= entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  // Get current statistics
  getStats() {
    const now = Date.now();
    const activeEntries = Array.from(this.limits.entries())
      .filter(([, entry]) => now < entry.resetTime);

    return {
      totalEntries: this.limits.size,
      activeEntries: activeEntries.length,
      blockedEntries: activeEntries.filter(([, entry]) => entry.blocked).length,
      rules: this.rules.length
    };
  }

  // Helper for API rate limiting
  async withRateLimit<T>(
    identifier: string,
    action: string,
    operation: () => Promise<T>
  ): Promise<T> {
    if (!this.isAllowed(identifier, action)) {
      const status = this.getStatus(identifier, action);
      throw new Error(
        `Rate limit exceeded. Try again at ${status.resetTime?.toISOString()}`
      );
    }

    try {
      const result = await operation();
      this.recordRequest(identifier, action, true);
      return result;
    } catch (error) {
      this.recordRequest(identifier, action, false);
      throw error;
    }
  }

  // Start cleanup interval
  startCleanup(intervalMs: number = 300000): void { // 5 minutes
    setInterval(() => {
      this.cleanup();
    }, intervalMs);
  }
}

export const rateLimitService = new RateLimitService();

// Helper decorators/HOCs for rate limiting
export function withRateLimit(action: string, getUserId: () => string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const userId = getUserId();
      
      if (!rateLimitService.isAllowed(userId, action)) {
        const status = rateLimitService.getStatus(userId, action);
        throw new Error(
          `Rate limit exceeded for ${action}. Try again at ${status.resetTime?.toISOString()}`
        );
      }

      try {
        const result = await originalMethod.apply(this, args);
        rateLimitService.recordRequest(userId, action, true);
        return result;
      } catch (error) {
        rateLimitService.recordRequest(userId, action, false);
        throw error;
      }
    };

    return descriptor;
  };
}