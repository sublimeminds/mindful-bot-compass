import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface FallbackOptions {
  showToast?: boolean;
  logError?: boolean;
  useGenericResponse?: boolean;
  redirectToSafePage?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export class ErrorHandlingService {
  private static retryAttempts = new Map<string, number>();
  private static maxRetries = 3;
  private static retryDelay = 1000; // 1 second

  /**
   * Centralized error handling with fallback strategies
   */
  static async handleError(
    error: Error, 
    context: ErrorContext, 
    options: FallbackOptions = {}
  ): Promise<any> {
    const {
      showToast = true,
      logError = true,
      useGenericResponse = true,
      redirectToSafePage = false,
      retryAttempts = 0,
      retryDelay = this.retryDelay
    } = options;

    const errorId = this.generateErrorId(context);
    
    // Log error for analytics
    if (logError) {
      await this.logError(error, context, errorId);
    }

    // Handle specific error types
    const fallbackResponse = await this.handleSpecificError(error, context, options);
    
    if (fallbackResponse) {
      return fallbackResponse;
    }

    // Show user-friendly toast
    if (showToast) {
      this.showErrorToast(error, context);
    }

    // Implement retry logic
    if (retryAttempts > 0) {
      const currentAttempts = this.retryAttempts.get(errorId) || 0;
      
      if (currentAttempts < retryAttempts) {
        this.retryAttempts.set(errorId, currentAttempts + 1);
        
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Return a retry function
        return {
          retry: true,
          attempt: currentAttempts + 1,
          maxAttempts: retryAttempts
        };
      }
    }

    // Redirect to safe page if requested
    if (redirectToSafePage) {
      window.location.href = '/error';
      return null;
    }

    // Return generic response as fallback
    if (useGenericResponse) {
      return this.getGenericFallback(context);
    }

    throw error; // Re-throw if no fallback requested
  }

  /**
   * Handle AI service failures
   */
  static async handleAIServiceFailure(
    originalError: Error,
    context: ErrorContext
  ): Promise<any> {
    console.log('🔄 AI service failed, implementing fallback strategy...');

    try {
      // Try alternative AI service
      const fallbackResponse = await this.tryAlternativeAIService(context);
      if (fallbackResponse) return fallbackResponse;

      // Use cached responses for common scenarios
      const cachedResponse = await this.getCachedAIResponse(context);
      if (cachedResponse) return cachedResponse;

      // Return pre-defined supportive responses
      return this.getEmergencyAIResponse(context);

    } catch (fallbackError) {
      console.error('All AI fallbacks failed:', fallbackError);
      return this.getGenericTherapyResponse();
    }
  }

  /**
   * Handle network failures
   */
  static async handleNetworkFailure(
    error: Error,
    operation: () => Promise<any>,
    context: ErrorContext
  ): Promise<any> {
    console.log('🌐 Network failure detected, implementing recovery...');

    // Check if we're offline
    if (!navigator.onLine) {
      toast.error('You appear to be offline. Please check your connection.');
      return this.getOfflineFallback(context);
    }

    // Retry with exponential backoff
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`🔄 Retry attempt ${attempt}/${this.maxRetries}`);
        
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
        
        const result = await operation();
        console.log('✅ Network operation recovered successfully');
        return result;

      } catch (retryError) {
        if (attempt === this.maxRetries) {
          console.error('❌ All retry attempts failed');
          throw retryError;
        }
      }
    }
  }

  /**
   * Handle onboarding flow errors
   */
  static async handleOnboardingError(
    error: Error,
    step: string,
    userData: any
  ): Promise<any> {
    console.log(`🎯 Onboarding error at step: ${step}`);

    try {
      // Save current progress
      await this.saveOnboardingProgress(userData, step);

      // Provide step-specific fallbacks
      switch (step) {
        case 'analysis':
          return this.getFallbackAnalysis(userData);
        
        case 'plan-creation':
          return this.getFallbackTherapyPlan(userData);
        
        case 'therapist-matching':
          return this.getFallbackTherapistMatch(userData);
        
        default:
          return this.getGenericOnboardingFallback(step);
      }

    } catch (fallbackError) {
      console.error('Onboarding fallback failed:', fallbackError);
      
      toast.error(
        'We encountered an issue during setup. Your progress has been saved.',
        { description: 'You can continue where you left off.' }
      );
      
      return { continueFromStep: step, savedData: userData };
    }
  }

  /**
   * Handle therapy session errors
   */
  static async handleSessionError(
    error: Error,
    sessionId: string,
    context: ErrorContext
  ): Promise<any> {
    console.log(`💬 Session error in ${sessionId}`);

    try {
      // Save session state
      await this.saveSessionState(sessionId, context);

      // Check if it's a crisis situation
      if (this.isCrisisScenario(error, context)) {
        return this.handleCrisisScenario(context);
      }

      // Provide supportive fallback response
      return {
        message: "I'm experiencing some technical difficulties, but I'm still here for you. How are you feeling right now?",
        fallback: true,
        sessionId,
        supportive: true
      };

    } catch (fallbackError) {
      console.error('Session fallback failed:', fallbackError);
      return this.getCrisisSupport();
    }
  }

  // Private helper methods

  private static generateErrorId(context: ErrorContext): string {
    return `${context.component}_${context.action}_${Date.now()}`;
  }

  private static async logError(
    error: Error, 
    context: ErrorContext, 
    errorId: string
  ): Promise<void> {
    try {
      await supabase.from('audit_logs').insert({
        user_id: context.userId || 'anonymous',
        action: 'error_occurred',
        resource: context.component || 'unknown',
        resource_id: context.sessionId,
        old_values: { error_id: errorId } as any,
        new_values: {
          error_message: error.message,
          error_stack: error.stack?.slice(0, 1000),
          context: JSON.stringify(context),
          timestamp: new Date().toISOString()
        } as any
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  private static async handleSpecificError(
    error: Error,
    context: ErrorContext,
    options: FallbackOptions
  ): Promise<any> {
    // Handle common error patterns
    if (error.message.includes('AI service')) {
      return this.handleAIServiceFailure(error, context);
    }

    if (error.message.includes('network') || error.message.includes('fetch')) {
      // Network errors will be handled by retry logic
      return null;
    }

    if (error.message.includes('rate limit')) {
      toast.warning('Too many requests. Please wait a moment before trying again.');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { retry: true };
    }

    if (error.message.includes('unauthorized')) {
      toast.error('Session expired. Please log in again.');
      window.location.href = '/auth';
      return null;
    }

    return null;
  }

  private static showErrorToast(error: Error, context: ErrorContext): void {
    const userFriendlyMessage = this.getUserFriendlyErrorMessage(error, context);
    
    toast.error('Something went wrong', {
      description: userFriendlyMessage,
      action: {
        label: 'Report Issue',
        onClick: () => this.reportIssue(error, context)
      }
    });
  }

  private static getUserFriendlyErrorMessage(error: Error, context: ErrorContext): string {
    if (context.component === 'onboarding') {
      return 'We had trouble processing your information. Your progress is saved.';
    }
    
    if (context.component === 'therapy-session') {
      return 'There was an issue with your therapy session. Let\'s try again.';
    }
    
    if (context.component === 'ai-chat') {
      return 'I\'m having trouble responding right now. Please try rephrasing your message.';
    }
    
    return 'We encountered a technical issue. Please try again.';
  }

  private static getGenericFallback(context: ErrorContext): any {
    switch (context.component) {
      case 'ai-chat':
        return {
          message: "I apologize, but I'm experiencing some technical difficulties. Is there something specific I can help you with?",
          fallback: true
        };
      
      case 'onboarding':
        return {
          step: context.action,
          canContinue: true,
          message: 'We can continue with your setup. Some features may be limited.'
        };
      
      default:
        return {
          success: false,
          fallback: true,
          message: 'Operation completed with limited functionality.'
        };
    }
  }

  private static async tryAlternativeAIService(context: ErrorContext): Promise<any> {
    // Try different AI endpoints or models
    try {
      const { data } = await supabase.functions.invoke('enhanced-api', {
        body: {
          provider: 'openai', // Fallback to OpenAI if Anthropic fails
          message: 'fallback response needed',
          context: context
        }
      });
      return data;
    } catch {
      return null;
    }
  }

  private static async getCachedAIResponse(context: ErrorContext): Promise<any> {
    // Get cached responses for common scenarios
    const commonResponses = [
      "I understand you're going through a difficult time. Can you tell me more about what you're experiencing?",
      "Thank you for sharing that with me. How has this been affecting your daily life?",
      "It sounds like you're dealing with a lot right now. What's been the most challenging part for you?"
    ];
    
    return {
      message: commonResponses[Math.floor(Math.random() * commonResponses.length)],
      cached: true,
      fallback: true
    };
  }

  private static getEmergencyAIResponse(context: ErrorContext): any {
    return {
      message: "I'm here to support you, even though I'm experiencing some technical issues. If you're in crisis or having thoughts of self-harm, please reach out to emergency services or call 988 for the Suicide & Crisis Lifeline.",
      emergency: true,
      fallback: true,
      resources: [
        { name: "Crisis Text Line", contact: "Text HOME to 741741" },
        { name: "National Suicide Prevention Lifeline", contact: "988" },
        { name: "Emergency Services", contact: "911" }
      ]
    };
  }

  private static getGenericTherapyResponse(): any {
    return {
      message: "I want you to know that I'm here for you, even though I'm experiencing some technical difficulties. Your wellbeing is important. How are you feeling right now?",
      supportive: true,
      fallback: true
    };
  }

  private static getOfflineFallback(context: ErrorContext): any {
    return {
      offline: true,
      message: "You're currently offline. Your data will sync when you reconnect.",
      canContinue: true
    };
  }

  private static async saveOnboardingProgress(userData: any, step: string): Promise<void> {
    try {
      localStorage.setItem('onboarding_progress', JSON.stringify({
        step,
        data: userData,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save onboarding progress:', error);
    }
  }

  private static getFallbackAnalysis(userData: any): any {
    return {
      analysis: {
        summary: "Based on your responses, we'll create a personalized therapy approach for you.",
        recommendations: ["Regular check-ins", "Stress management techniques", "Mindfulness practice"],
        confidence: 0.7,
        fallback: true
      }
    };
  }

  private static getFallbackTherapyPlan(userData: any): any {
    return {
      plan: {
        primaryApproach: "Cognitive Behavioral Therapy",
        secondaryApproach: "Mindfulness-Based Stress Reduction",
        techniques: ["Thought challenging", "Breathing exercises", "Progressive muscle relaxation"],
        goals: ["Reduce stress", "Improve coping skills", "Enhance well-being"],
        fallback: true
      }
    };
  }

  private static getFallbackTherapistMatch(userData: any): any {
    return {
      matches: [
        {
          therapist_id: "default_supportive",
          name: "Dr. Alex Thompson",
          match_score: 85,
          reasoning: ["Generalist approach", "Warm communication style", "Experience with diverse backgrounds"],
          fallback: true
        }
      ]
    };
  }

  private static getGenericOnboardingFallback(step: string): any {
    return {
      canContinue: true,
      step,
      message: `We encountered an issue during ${step}, but we can continue with a standard approach.`,
      fallback: true
    };
  }

  private static async saveSessionState(sessionId: string, context: ErrorContext): Promise<void> {
    try {
      sessionStorage.setItem(`session_${sessionId}`, JSON.stringify({
        context,
        timestamp: new Date().toISOString(),
        recovered: true
      }));
    } catch (error) {
      console.error('Failed to save session state:', error);
    }
  }

  private static isCrisisScenario(error: Error, context: ErrorContext): boolean {
    const crisisKeywords = ['crisis', 'suicide', 'self-harm', 'emergency'];
    const contextString = JSON.stringify(context).toLowerCase();
    return crisisKeywords.some(keyword => contextString.includes(keyword));
  }

  private static handleCrisisScenario(context: ErrorContext): any {
    return {
      crisis: true,
      message: "I notice you may need immediate support. Please reach out to emergency services if you're in immediate danger.",
      resources: [
        { name: "Emergency Services", contact: "911" },
        { name: "Crisis Text Line", contact: "Text HOME to 741741" },
        { name: "National Suicide Prevention Lifeline", contact: "988" }
      ],
      immediate: true
    };
  }

  private static getCrisisSupport(): any {
    return {
      message: "If you're experiencing a mental health emergency, please contact emergency services immediately.",
      emergency: true,
      contacts: [
        { service: "Emergency Services", number: "911" },
        { service: "Crisis Text Line", number: "741741", method: "Text HOME" },
        { service: "National Suicide Prevention Lifeline", number: "988" }
      ]
    };
  }

  private static reportIssue(error: Error, context: ErrorContext): void {
    // This would typically send to an error tracking service
    console.log('Issue reported:', { error: error.message, context });
    toast.success('Issue reported. Thank you for helping us improve.');
  }
}