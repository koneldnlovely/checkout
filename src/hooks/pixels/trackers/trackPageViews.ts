
import { useLocation } from 'react-router-dom';
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';

export const useTrackPageViews = (isInitialized: boolean) => {
  const location = useLocation();
  
  // Function to track pageviews across all pixels
  const trackAllPageViews = () => {
    if (process.env.NODE_ENV !== 'production' || !isInitialized) {
      return;
    }

    // Track Google Ads page view if initialized
    if (typeof window !== 'undefined' && window.googleAdsPixels) {
      GooglePixel.trackPageView(location.pathname);
    }
    
    // Track Facebook page view if initialized
    if (typeof window !== 'undefined' && window.facebookPixels) {
      FacebookPixel.trackPageView();
    }
    
    // Track TikTok page view if initialized
    if (typeof window !== 'undefined' && window.tiktokPixelId) {
      TiktokPixel.trackPageView();
    }
    
    // Check for specific pages to trigger events
    if (location.pathname.includes('/checkout/')) {
      // Begin checkout events for all pixels
      if (typeof window !== 'undefined') {
        if (window.googleAdsPixels) GooglePixel.trackBeginCheckout();
        if (window.facebookPixels) FacebookPixel.trackInitiateCheckout();
        if (window.tiktokPixelId) TiktokPixel.trackBeginCheckout(0);
      }
    }
  };
  
  return { trackAllPageViews };
};
