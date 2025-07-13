import { supabase } from '@/integrations/supabase/client';

// Demo API keys - replace with real IDs in production
const DEMO_CONFIG = {
  ga4MeasurementId: 'G-DEMO123456789',
  facebookPixelId: '123456789012345',
  googleAdsConversionId: 'AW-123456789',
  googleAdsConversionLabel: 'demo_conversion'
};

export interface TrackingEvent {
  event_type: string;
  event_category: string;
  event_data?: Record<string, any>;
  user_id?: string;
  session_id?: string;
}

export interface ConversionEvent {
  event_name: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  user_id?: string;
}

export class TrackingService {
  // Initialize Google Analytics 4
  static initializeGA4() {
    if (typeof window === 'undefined') return;
    
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${DEMO_CONFIG.ga4MeasurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', DEMO_CONFIG.ga4MeasurementId, {
      send_page_view: false // We'll send page views manually
    });
  }

  // Initialize Facebook Pixel
  static initializeFacebookPixel() {
    if (typeof window === 'undefined') return;
    
    window.fbq = window.fbq || function() {
      (window.fbq.q = window.fbq.q || []).push(arguments);
    };
    
    if (!window._fbq) window._fbq = window.fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq.queue = [];

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);

    window.fbq('init', DEMO_CONFIG.facebookPixelId);
    window.fbq('track', 'PageView');
  }

  // Track page view
  static trackPageView(page_title: string, page_location: string) {
    // GA4
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title,
        page_location
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }

    // Store in Supabase
    this.logEvent({
      event_type: 'page_view',
      event_category: 'navigation',
      event_data: { page_title, page_location }
    });
  }

  // Track custom event
  static trackEvent(eventName: string, category: string, parameters: Record<string, any> = {}) {
    // GA4
    if (window.gtag) {
      window.gtag('event', eventName, {
        event_category: category,
        ...parameters
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', eventName, parameters);
    }

    // Store in Supabase
    this.logEvent({
      event_type: eventName,
      event_category: category,
      event_data: parameters
    });
  }

  // Track conversion
  static trackConversion(conversionEvent: ConversionEvent) {
    const { event_name, value, currency = 'USD', transaction_id } = conversionEvent;

    // GA4
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `${DEMO_CONFIG.googleAdsConversionId}/${DEMO_CONFIG.googleAdsConversionLabel}`,
        value,
        currency,
        transaction_id
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value,
        currency
      });
    }

    // Store conversion in Supabase
    this.logConversion(conversionEvent);
  }

  // Track user sign up
  static trackSignUp(method: string = 'email') {
    this.trackEvent('sign_up', 'engagement', { method });
    
    if (window.fbq) {
      window.fbq('track', 'CompleteRegistration');
    }
  }

  // Track session start
  static trackSessionStart(sessionType: string) {
    this.trackEvent('session_start', 'therapy', { 
      session_type: sessionType,
      timestamp: new Date().toISOString()
    });
  }

  // Track goal completion
  static trackGoalCompletion(goalType: string, value?: number) {
    this.trackEvent('goal_completion', 'achievement', { 
      goal_type: goalType,
      value
    });

    if (window.fbq) {
      window.fbq('track', 'Achievement');
    }
  }

  // Log event to Supabase
  private static async logEvent(event: TrackingEvent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('analytics_events').insert({
        event_type: event.event_type,
        event_category: event.event_category,
        event_data: event.event_data,
        user_id: user?.id || event.user_id,
        session_id: event.session_id || null,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      });
    } catch (error) {
      console.error('Error logging event:', error);
    }
  }

  // Log conversion to Supabase
  private static async logConversion(conversion: ConversionEvent) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('analytics_events').insert({
        event_type: 'conversion',
        event_category: 'ecommerce',
        event_data: {
          event_name: conversion.event_name,
          value: conversion.value || 0,
          currency: conversion.currency || 'USD',
          transaction_id: conversion.transaction_id,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer
        },
        user_id: user?.id || conversion.user_id,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      });
    } catch (error) {
      console.error('Error logging conversion:', error);
    }
  }

  // Update user attribution by storing in analytics_events
  static async updateUserAttribution(source: string, medium: string, campaign?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('analytics_events').insert({
        event_type: 'attribution_update',
        event_category: 'marketing',
        event_data: {
          source,
          medium,
          campaign,
          timestamp: new Date().toISOString()
        },
        user_id: user.id,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null
      });
    } catch (error) {
      console.error('Error updating user attribution:', error);
    }
  }

  // Get demo configuration
  static getDemoConfig() {
    return DEMO_CONFIG;
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: any;
    _fbq: any;
  }
}