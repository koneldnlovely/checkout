
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';
import * as TaboolaPixel from '@/lib/pixels/taboolaPixel';

export const trackInitiateCheckout = (value: number, isInitialized: boolean) => {
  console.log(`[PIXEL AUDIT] Tracking initiate checkout: Value=${value}, Initialized=${isInitialized}`);
  
  if (process.env.NODE_ENV !== 'production' && !isInitialized) {
    console.log('[PIXEL AUDIT] Initiate checkout tracking skipped: development mode or pixels not initialized');
    return;
  }
  
  // Google Ads begin_checkout event
  if (typeof window !== 'undefined' && window.googleAdsPixels) {
    window.googleAdsPixels.forEach(pixel => {
      console.log(`[PIXEL AUDIT] Firing Google Ads begin_checkout for ID: ${pixel.googleAdsId}`);
      GooglePixel.trackBeginCheckout(value);
    });
  } else {
    console.log('[PIXEL AUDIT] No Google Ads pixels available in window object');
  }
  
  // Facebook InitiateCheckout event
  if (typeof window !== 'undefined' && window.facebookPixels) {
    window.facebookPixels.forEach(pixel => {
      console.log(`[PIXEL AUDIT] Firing Facebook InitiateCheckout for ID: ${pixel.facebookPixelId}`);
      FacebookPixel.trackInitiateCheckout(value);
    });
  } else {
    console.log('[PIXEL AUDIT] No Facebook pixels available in window object');
  }
  
  // TikTok InitiateCheckout event
  if (typeof window !== 'undefined' && window.tiktokPixelId) {
    console.log(`[PIXEL AUDIT] Firing TikTok InitiateCheckout for ID: ${window.tiktokPixelId}`);
    TiktokPixel.trackBeginCheckout(value);  // Changed from trackInitiateCheckout to trackBeginCheckout
  }
  
  // Taboola Pixel - they don't have a specific InitiateCheckout event
  if (typeof window !== 'undefined' && window.taboolaAccountId) {
    console.log(`[PIXEL AUDIT] Taboola doesn't have InitiateCheckout event, skipping for ID: ${window.taboolaAccountId}`);
  }
};
