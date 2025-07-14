import { useEffect } from 'react';
import { AffiliateTrackingService } from '@/services/affiliateTrackingService';
import { TrackingService } from '@/services/trackingService';

export const useAffiliateTracking = () => {
  useEffect(() => {
    // Initialize affiliate tracking
    AffiliateTrackingService.init();

    // Set up conversion tracking integration
    const originalTrackConversion = TrackingService.trackConversion;
    TrackingService.trackConversion = async (conversionEvent) => {
      // Call original tracking
      await originalTrackConversion.call(TrackingService, conversionEvent);
      
      // Also track affiliate conversion
      await AffiliateTrackingService.trackConversion({
        orderId: conversionEvent.transaction_id,
        orderValue: conversionEvent.value || 0,
        productType: 'subscription', // Adjust based on your products
        productId: conversionEvent.event_name
      });
    };

    // Track page views for affiliate analytics
    AffiliateTrackingService.retryFailedTracking();
  }, []);

  const trackAffiliateConversion = async (orderValue: number, orderId?: string, productType: string = 'subscription') => {
    await AffiliateTrackingService.trackConversion({
      orderValue,
      orderId,
      productType
    });
  };

  const getAffiliateCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('ref') || urlParams.get('aff') || urlParams.get('affiliate');
  };

  return {
    trackAffiliateConversion,
    getAffiliateCode
  };
};