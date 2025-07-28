import { supabase } from '@/integrations/supabase/client';

interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedData?: any;
}

interface DataIntegrityCheck {
  table: string;
  checkType: 'completeness' | 'consistency' | 'accuracy' | 'timeliness';
  passed: boolean;
  details: string;
  affectedRecords?: number;
}

export class DataValidationService {
  
  /**
   * Validate user data with comprehensive rules
   */
  static validateUserData(data: any, rules: ValidationRule[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const sanitizedData: any = { ...data };

    for (const rule of rules) {
      const value = data[rule.field];
      const fieldErrors = this.validateField(value, rule);
      
      if (fieldErrors.length > 0) {
        errors.push(...fieldErrors.map(err => `${rule.field}: ${err}`));
      }

      // Sanitize data
      if (value !== undefined && value !== null) {
        sanitizedData[rule.field] = this.sanitizeValue(value, rule);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      sanitizedData
    };
  }

  /**
   * Validate onboarding data flow
   */
  static async validateOnboardingData(userId: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check if user profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!profile) {
        errors.push('User profile not found');
      }

      // Check therapy plan creation
      const { data: therapyPlan } = await supabase
        .from('adaptive_therapy_plans')
        .select('*')
        .eq('user_id', userId);

      if (!therapyPlan || therapyPlan.length === 0) {
        warnings.push('No therapy plan found - may indicate incomplete onboarding');
      }

      // Validate therapy plan structure
      if (therapyPlan && therapyPlan.length > 0) {
        const plan = therapyPlan[0];
        
        if (!plan.primary_approach) {
          errors.push('Therapy plan missing primary approach');
        }
        
        if (!plan.techniques || plan.techniques.length === 0) {
          warnings.push('Therapy plan has no techniques defined');
        }
        
        if (!plan.goals || plan.goals.length === 0) {
          warnings.push('Therapy plan has no goals defined');
        }
      }

      // Check onboarding completion logs
      const { data: logs } = await supabase
        .from('therapy_plan_creation_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (logs && logs.length > 0) {
        const latestLog = logs[0];
        if (latestLog.status === 'failed') {
          errors.push(`Onboarding failed: ${latestLog.error_message || 'Unknown error'}`);
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Validation error: ${error.message}`],
        warnings: []
      };
    }
  }

  /**
   * Validate therapy session data integrity
   */
  static async validateSessionData(sessionId: string, userId: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check session exists
      const { data: session } = await supabase
        .from('therapy_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (!session) {
        errors.push('Session not found');
        return { isValid: false, errors, warnings };
      }

      // Validate session timing
      if (session.start_time && session.end_time) {
        const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
        const durationMinutes = duration / 60000;
        
        if (durationMinutes < 1) {
          warnings.push('Session duration unusually short (< 1 minute)');
        } else if (durationMinutes > 120) {
          warnings.push('Session duration unusually long (> 2 hours)');
        }
      }

      // Check session messages
      const { data: messages } = await supabase
        .from('session_messages')
        .select('*')
        .eq('session_id', sessionId);

      if (!messages || messages.length === 0) {
        warnings.push('No messages found for session');
      } else {
        const userMessages = messages.filter(m => m.sender === 'user');
        const aiMessages = messages.filter(m => m.sender === 'assistant');
        
        if (userMessages.length === 0) {
          errors.push('No user messages in session');
        }
        
        if (aiMessages.length === 0) {
          errors.push('No AI responses in session');
        }
        
        if (Math.abs(userMessages.length - aiMessages.length) > 1) {
          warnings.push('Unbalanced conversation - missing responses detected');
        }
      }

      // Check for adaptation tracking
      const { data: adaptations } = await supabase
        .from('ai_routing_decisions')
        .select('*')
        .eq('session_id', sessionId);

      if (!adaptations || adaptations.length === 0) {
        warnings.push('No adaptation tracking found for session');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Session validation error: ${error.message}`],
        warnings: []
      };
    }
  }

  /**
   * Comprehensive data integrity check
   */
  static async performDataIntegrityCheck(): Promise<DataIntegrityCheck[]> {
    const checks: DataIntegrityCheck[] = [];

    try {
      // Check 1: User profile completeness
      const profileCheck = await this.checkProfileCompleteness();
      checks.push(profileCheck);

      // Check 2: Therapy plan consistency
      const planCheck = await this.checkTherapyPlanConsistency();
      checks.push(planCheck);

      // Check 3: Session data accuracy
      const sessionCheck = await this.checkSessionDataAccuracy();
      checks.push(sessionCheck);

      // Check 4: Crisis alert timeliness
      const crisisCheck = await this.checkCrisisAlertTimeliness();
      checks.push(crisisCheck);

      // Check 5: Progress tracking consistency
      const progressCheck = await this.checkProgressConsistency();
      checks.push(progressCheck);

    } catch (error) {
      console.error('Data integrity check failed:', error);
      checks.push({
        table: 'system',
        checkType: 'completeness',
        passed: false,
        details: `Integrity check failed: ${error.message}`
      });
    }

    return checks;
  }

  /**
   * Validate user progress persistence
   */
  static async validateProgressPersistence(userId: string): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Check user stats
      const { data: stats } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId);

      if (!stats || stats.length === 0) {
        warnings.push('No user statistics found');
      } else {
        const userStats = stats[0];
        
        // Validate stats consistency
        if (userStats.current_streak > userStats.longest_streak) {
          errors.push('Current streak cannot be longer than longest streak');
        }
        
        if (userStats.total_sessions < 0) {
          errors.push('Total sessions cannot be negative');
        }
        
        if (userStats.average_mood && (userStats.average_mood < 1 || userStats.average_mood > 10)) {
          errors.push('Average mood must be between 1-10');
        }
      }

      // Check goals and achievements
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      const { data: achievements } = await supabase
        .from('goal_achievements')
        .select('*')
        .eq('user_id', userId);

      // Validate achievement consistency
      if (achievements && goals) {
        const completedGoals = goals.filter(g => g.is_completed);
        if (achievements.length > completedGoals.length) {
          warnings.push('More achievements than completed goals');
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [`Progress validation error: ${error.message}`],
        warnings: []
      };
    }
  }

  // Private helper methods

  private static validateField(value: any, rule: ValidationRule): string[] {
    const errors: string[] = [];

    // Required check
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push('is required');
      return errors;
    }

    // Skip other validations if value is not provided and not required
    if (value === undefined || value === null) {
      return errors;
    }

    // Type check
    if (rule.type && !this.checkType(value, rule.type)) {
      errors.push(`must be of type ${rule.type}`);
    }

    // Length checks for strings and arrays
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`must be at least ${rule.minLength} characters/items long`);
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`must not exceed ${rule.maxLength} characters/items`);
    }

    // Numeric range checks
    if (rule.min !== undefined && value < rule.min) {
      errors.push(`must be at least ${rule.min}`);
    }

    if (rule.max !== undefined && value > rule.max) {
      errors.push(`must not exceed ${rule.max}`);
    }

    // Pattern check
    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push('format is invalid');
    }

    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value);
      if (typeof customResult === 'string') {
        errors.push(customResult);
      } else if (!customResult) {
        errors.push('failed custom validation');
      }
    }

    return errors;
  }

  private static checkType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && !Array.isArray(value) && value !== null;
      default:
        return true;
    }
  }

  private static sanitizeValue(value: any, rule: ValidationRule): any {
    if (rule.type === 'string' && typeof value === 'string') {
      // Basic string sanitization
      return value.trim().replace(/[<>]/g, '');
    }
    
    if (rule.type === 'number' && typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? value : parsed;
    }
    
    return value;
  }

  private static async checkProfileCompleteness(): Promise<DataIntegrityCheck> {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, name, email')
        .not('name', 'is', null)
        .not('email', 'is', null);

      if (error) throw error;

      const { count: totalProfiles } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const completeness = profiles?.length || 0;
      const total = totalProfiles || 1;
      const completenessRate = completeness / total;

      return {
        table: 'profiles',
        checkType: 'completeness',
        passed: completenessRate > 0.95,
        details: `${Math.round(completenessRate * 100)}% of profiles are complete`,
        affectedRecords: total - completeness
      };

    } catch (error) {
      return {
        table: 'profiles',
        checkType: 'completeness',
        passed: false,
        details: `Check failed: ${error.message}`
      };
    }
  }

  private static async checkTherapyPlanConsistency(): Promise<DataIntegrityCheck> {
    try {
      const { data: plans, error } = await supabase
        .from('adaptive_therapy_plans')
        .select('*');

      if (error) throw error;

      let inconsistentPlans = 0;
      
      plans?.forEach(plan => {
        if (!plan.primary_approach || 
            !plan.techniques || 
            plan.techniques.length === 0 ||
            !plan.goals ||
            plan.goals.length === 0) {
          inconsistentPlans++;
        }
      });

      return {
        table: 'adaptive_therapy_plans',
        checkType: 'consistency',
        passed: inconsistentPlans === 0,
        details: `${inconsistentPlans} plans have missing required fields`,
        affectedRecords: inconsistentPlans
      };

    } catch (error) {
      return {
        table: 'adaptive_therapy_plans',
        checkType: 'consistency',
        passed: false,
        details: `Check failed: ${error.message}`
      };
    }
  }

  private static async checkSessionDataAccuracy(): Promise<DataIntegrityCheck> {
    try {
      const { data: sessions, error } = await supabase
        .from('therapy_sessions')
        .select('*')
        .not('end_time', 'is', null);

      if (error) throw error;

      let inaccurateSessions = 0;
      
      sessions?.forEach(session => {
        const duration = new Date(session.end_time).getTime() - new Date(session.start_time).getTime();
        
        if (duration <= 0 || duration > 4 * 60 * 60 * 1000) { // > 4 hours
          inaccurateSessions++;
        }
      });

      return {
        table: 'therapy_sessions',
        checkType: 'accuracy',
        passed: inaccurateSessions === 0,
        details: `${inaccurateSessions} sessions have invalid timing data`,
        affectedRecords: inaccurateSessions
      };

    } catch (error) {
      return {
        table: 'therapy_sessions',
        checkType: 'accuracy',
        passed: false,
        details: `Check failed: ${error.message}`
      };
    }
  }

  private static async checkCrisisAlertTimeliness(): Promise<DataIntegrityCheck> {
    try {
      // Mock crisis alerts check for now
      const staleAlerts = 0; // TODO: Implement proper crisis alert tracking
      const error = null;

      if (error) throw error;

      return {
        table: 'crisis_alerts',
        checkType: 'timeliness',
        passed: staleAlerts === 0,
        details: `${staleAlerts} crisis alerts are unresolved for over 1 hour`,
        affectedRecords: staleAlerts
      };

    } catch (error) {
      return {
        table: 'crisis_alerts',
        checkType: 'timeliness',
        passed: false,
        details: `Check failed: ${error.message}`
      };
    }
  }

  private static async checkProgressConsistency(): Promise<DataIntegrityCheck> {
    try {
      const { data: stats, error } = await supabase
        .from('user_stats')
        .select('*');

      if (error) throw error;

      let inconsistentStats = 0;
      
      stats?.forEach(stat => {
        if (stat.current_streak > stat.longest_streak ||
            stat.total_sessions < 0 ||
            stat.total_minutes < 0 ||
            (stat.average_mood && (stat.average_mood < 1 || stat.average_mood > 10))) {
          inconsistentStats++;
        }
      });

      return {
        table: 'user_stats',
        checkType: 'consistency',
        passed: inconsistentStats === 0,
        details: `${inconsistentStats} user stats records have inconsistent data`,
        affectedRecords: inconsistentStats
      };

    } catch (error) {
      return {
        table: 'user_stats',
        checkType: 'consistency',
        passed: false,
        details: `Check failed: ${error.message}`
      };
    }
  }
}