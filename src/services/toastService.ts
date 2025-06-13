
import { toast } from '@/hooks/use-toast';

export interface ToastConfig {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export class ToastService {
  // Authentication messages
  static loginSuccess(userName?: string) {
    toast({
      title: "Welcome back!",
      description: userName ? `Welcome back, ${userName}!` : "You've successfully signed in.",
      variant: "default",
    });
  }

  static loginError(message?: string) {
    toast({
      title: "Sign In Failed",
      description: message || "Invalid email or password. Please try again.",
      variant: "destructive",
    });
  }

  static signupSuccess() {
    toast({
      title: "Account Created!",
      description: "Please check your email to verify your account.",
      variant: "default",
    });
  }

  static signupError(message?: string) {
    toast({
      title: "Registration Failed",
      description: message || "Unable to create account. Please try again.",
      variant: "destructive",
    });
  }

  static logoutSuccess() {
    toast({
      title: "Signed Out",
      description: "You've been successfully signed out.",
      variant: "default",
    });
  }

  // Support ticket messages
  static ticketSubmitted(ticketNumber?: string) {
    toast({
      title: "Support Ticket Created",
      description: ticketNumber 
        ? `Your ticket #${ticketNumber} has been submitted. We'll get back to you soon!`
        : "Your support request has been submitted successfully.",
      variant: "default",
    });
  }

  static ticketError(message?: string) {
    toast({
      title: "Failed to Submit Ticket",
      description: message || "Unable to submit your support request. Please try again.",
      variant: "destructive",
    });
  }

  // Subscription messages
  static subscriptionSuccess(planName: string) {
    toast({
      title: "Subscription Updated!",
      description: `Successfully upgraded to ${planName} plan.`,
      variant: "default",
    });
  }

  static subscriptionError(message?: string) {
    toast({
      title: "Subscription Failed",
      description: message || "Unable to process subscription. Please try again.",
      variant: "destructive",
    });
  }

  static trialStarted(planName: string, days: number) {
    toast({
      title: "Free Trial Started!",
      description: `Your ${days}-day ${planName} trial has begun. Enjoy full access!`,
      variant: "default",
      duration: 5000,
    });
  }

  static trialExpiring(daysLeft: number) {
    toast({
      title: "Trial Expiring Soon",
      description: `Your free trial expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}. Upgrade to continue.`,
      variant: "default",
      duration: 8000,
    });
  }

  // Goal management messages
  static goalSaved() {
    toast({
      title: "Goal Saved",
      description: "Your goal has been saved successfully.",
      variant: "default",
    });
  }

  static goalError(message?: string) {
    toast({
      title: "Failed to Save Goal",
      description: message || "Unable to save your goal. Please try again.",
      variant: "destructive",
    });
  }

  // Mood tracking messages
  static moodSaved() {
    toast({
      title: "Mood Recorded",
      description: "Your mood entry has been saved.",
      variant: "default",
    });
  }

  static moodError(message?: string) {
    toast({
      title: "Failed to Save Mood",
      description: message || "Unable to record your mood. Please try again.",
      variant: "destructive",
    });
  }

  // Session messages
  static sessionCompleted() {
    toast({
      title: "Session Completed",
      description: "Great job! Your therapy session has been saved.",
      variant: "default",
    });
  }

  static sessionError(message?: string) {
    toast({
      title: "Session Save Failed",
      description: message || "Unable to save your session. Please try again.",
      variant: "destructive",
    });
  }

  // Profile messages
  static profileUpdated() {
    toast({
      title: "Profile Updated",
      description: "Your profile changes have been saved.",
      variant: "default",
    });
  }

  static profileError(message?: string) {
    toast({
      title: "Profile Update Failed",
      description: message || "Unable to update your profile. Please try again.",
      variant: "destructive",
    });
  }

  // Network and general error messages
  static networkError() {
    toast({
      title: "Connection Error",
      description: "Please check your internet connection and try again.",
      variant: "destructive",
    });
  }

  static genericError(message?: string) {
    toast({
      title: "Something went wrong",
      description: message || "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
  }

  static genericSuccess(title: string, description?: string) {
    toast({
      title,
      description,
      variant: "default",
    });
  }

  // Custom toast with full configuration
  static custom(config: ToastConfig) {
    toast({
      title: config.title,
      description: config.description,
      variant: config.variant || 'default',
      duration: config.duration,
    });
  }
}
