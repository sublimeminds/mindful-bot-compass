import { supabase } from '@/integrations/supabase/client';

export interface AffiliateTrackingData {
  affiliateCode?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landingPage?: string;
}

export interface ConversionData {
  orderId?: string;
  subscriptionId?: string;
  orderValue: number;
  productType: string;
  productId?: string;
}

export class AffiliateTrackingService {
  private static readonly AFFILIATE_COOKIE = 'aff_ref';
  private static readonly TRACKING_COOKIE = 'aff_track';
  private static readonly FINGERPRINT_COOKIE = 'aff_fp';
  private static readonly COOKIE_DURATION = 30; // 30 days
  
  // Generate device fingerprint for tracking without cookies
  private static generateDeviceFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.platform,
      canvas.toDataURL(),
      (navigator as any).hardwareConcurrency || 0,
      (navigator as any).deviceMemory || 0
    ].join('|');
    
    return btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  // Set cookie with fallbacks for adblockers
  private static setCookie(name: string, value: string, days: number = this.COOKIE_DURATION): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    // Try setting cookie normally
    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    // Fallback to localStorage for adblockers
    try {
      localStorage.setItem(name, JSON.stringify({
        value,
        expires: expires.getTime()
      }));
    } catch (e) {
      // Fallback to sessionStorage
      try {
        sessionStorage.setItem(name, JSON.stringify({
          value,
          expires: expires.getTime()
        }));
      } catch (e) {
        console.warn('Unable to store affiliate tracking data');
      }
    }
  }

  // Get cookie with fallbacks
  private static getCookie(name: string): string | null {
    // Try cookie first
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const cookieValue = parts.pop()?.split(';').shift();
      if (cookieValue) return cookieValue;
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem(name);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.expires > Date.now()) {
          return data.value;
        } else {
          localStorage.removeItem(name);
        }
      }
    } catch (e) {
      // Fallback to sessionStorage
      try {
        const stored = sessionStorage.getItem(name);
        if (stored) {
          const data = JSON.parse(stored);
          return data.value;
        }
      } catch (e) {
        // Silent fail
      }
    }

    return null;
  }

  // Initialize tracking when page loads
  static initializeTracking(): void {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const affiliateCode = urlParams.get('ref') || urlParams.get('aff') || urlParams.get('affiliate');
    
    if (affiliateCode) {
      this.trackAffiliateClick({
        affiliateCode,
        utm_source: urlParams.get('utm_source') || undefined,
        utm_medium: urlParams.get('utm_medium') || undefined,
        utm_campaign: urlParams.get('utm_campaign') || undefined,
        utm_content: urlParams.get('utm_content') || undefined,
        utm_term: urlParams.get('utm_term') || undefined,
        referrer: document.referrer || undefined,
        landingPage: window.location.href
      });
    }

    // Generate and store device fingerprint
    const fingerprint = this.generateDeviceFingerprint();
    this.setCookie(this.FINGERPRINT_COOKIE, fingerprint);
  }

  // Track affiliate click
  static async trackAffiliateClick(data: AffiliateTrackingData): Promise<void> {
    if (!data.affiliateCode) return;

    // Store affiliate data in multiple ways for persistence
    this.setCookie(this.AFFILIATE_COOKIE, data.affiliateCode);
    
    const trackingData = {
      affiliateCode: data.affiliateCode,
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
      referrer: data.referrer,
      landingPage: data.landingPage,
      timestamp: Date.now()
    };
    
    this.setCookie(this.TRACKING_COOKIE, JSON.stringify(trackingData));

    // Send to server-side tracking (adblocker resistant)
    try {
      await supabase.functions.invoke('track-affiliate-click', {
        body: {
          ...trackingData,
          deviceFingerprint: this.generateDeviceFingerprint(),
          userAgent: navigator.userAgent,
          ipAddress: await this.getClientIP(),
          sessionId: this.getSessionId()
        }
      });
    } catch (error) {
      console.warn('Server-side tracking failed, using fallback:', error);
      // Fallback: store in IndexedDB for later retry
      this.storeForRetry('click', trackingData);
    }
  }

  // Track conversion
  static async trackConversion(conversionData: ConversionData): Promise<void> {
    const affiliateCode = this.getCookie(this.AFFILIATE_COOKIE);
    const trackingData = this.getCookie(this.TRACKING_COOKIE);
    
    if (!affiliateCode) return;

    const parsedTrackingData = trackingData ? JSON.parse(trackingData) : {};
    
    const data = {
      affiliateCode,
      ...parsedTrackingData,
      conversion: {
        ...conversionData,
        convertedAt: new Date().toISOString()
      },
      deviceFingerprint: this.getCookie(this.FINGERPRINT_COOKIE) || this.generateDeviceFingerprint()
    };

    // Multiple tracking methods for reliability
    try {
      // Primary: Edge function
      await supabase.functions.invoke('track-affiliate-conversion', { body: data });
    } catch (error) {
      console.warn('Primary conversion tracking failed:', error);
      
      try {
        // Fallback: Direct database insert
        await this.trackConversionDirect(data);
      } catch (error2) {
        console.warn('Fallback conversion tracking failed:', error2);
        // Store for retry
        this.storeForRetry('conversion', data);
      }
    }

    // Clear affiliate cookie after conversion
    this.setCookie(this.AFFILIATE_COOKIE, '', -1);
    this.setCookie(this.TRACKING_COOKIE, '', -1);
  }

  // Direct database tracking (fallback)
  private static async trackConversionDirect(data: any): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('analytics_events').insert({
      event_type: 'affiliate_conversion',
      event_category: 'affiliate',
      event_data: data,
      user_id: user?.id,
      user_agent: navigator.userAgent,
      referrer: document.referrer || null
    });
  }

  // Get client IP (for server-side use)
  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '';
    }
  }

  // Generate session ID
  private static getSessionId(): string {
    let sessionId = this.getCookie('session_id');
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      this.setCookie('session_id', sessionId, 1); // 1 day session
    }
    return sessionId;
  }

  // Store for retry when tracking fails
  private static storeForRetry(type: string, data: any): void {
    try {
      const retryQueue = JSON.parse(localStorage.getItem('affiliate_retry_queue') || '[]');
      retryQueue.push({
        type,
        data,
        timestamp: Date.now(),
        retries: 0
      });
      localStorage.setItem('affiliate_retry_queue', JSON.stringify(retryQueue));
    } catch (e) {
      console.warn('Failed to store retry data');
    }
  }

  // Retry failed tracking attempts
  static async retryFailedTracking(): Promise<void> {
    try {
      const retryQueue = JSON.parse(localStorage.getItem('affiliate_retry_queue') || '[]');
      const maxRetries = 3;
      const now = Date.now();
      const retryDelay = 5 * 60 * 1000; // 5 minutes

      for (let i = retryQueue.length - 1; i >= 0; i--) {
        const item = retryQueue[i];
        
        // Skip if too recent or too many retries
        if (now - item.timestamp < retryDelay || item.retries >= maxRetries) {
          continue;
        }

        try {
          if (item.type === 'click') {
            await supabase.functions.invoke('track-affiliate-click', { body: item.data });
          } else if (item.type === 'conversion') {
            await supabase.functions.invoke('track-affiliate-conversion', { body: item.data });
          }
          
          // Remove successful retry
          retryQueue.splice(i, 1);
        } catch (error) {
          // Increment retry count
          item.retries++;
          if (item.retries >= maxRetries) {
            retryQueue.splice(i, 1);
          }
        }
      }

      localStorage.setItem('affiliate_retry_queue', JSON.stringify(retryQueue));
    } catch (e) {
      console.warn('Failed to retry tracking');
    }
  }

  // Server-side tracking pixel (image-based)
  static createTrackingPixel(affiliateCode: string, event: string = 'pageview'): HTMLImageElement {
    const img = document.createElement('img');
    img.style.display = 'none';
    img.width = 1;
    img.height = 1;
    
    const params = new URLSearchParams({
      aff: affiliateCode,
      event,
      t: Date.now().toString(),
      fp: this.generateDeviceFingerprint()
    });
    
    img.src = `${window.location.origin}/api/track.gif?${params}`;
    document.body.appendChild(img);
    
    return img;
  }

  // Initialize on page load
  static init(): void {
    if (typeof window === 'undefined') return;

    // Initialize tracking
    this.initializeTracking();

    // Retry failed attempts periodically
    setInterval(() => {
      this.retryFailedTracking();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.retryFailedTracking();
      }
    });

    // Track before page unload
    window.addEventListener('beforeunload', () => {
      this.retryFailedTracking();
    });
  }
}