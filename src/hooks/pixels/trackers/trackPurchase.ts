
import * as GooglePixel from '@/lib/pixels/googlePixel';
import * as FacebookPixel from '@/lib/pixels/facebookPixel';
import * as TiktokPixel from '@/lib/pixels/tiktokPixel';
import * as TaboolaPixel from '@/lib/pixels/taboolaPixel';
import * as OutbrainPixel from '@/lib/pixels/outbrainPixel';
import * as UolAdsPixel from '@/lib/pixels/uolAdsPixel';

export const trackPurchase = (orderId: string, value: number, isInitialized: boolean) => {
  console.log(`[PIXEL AUDIT] Tracking purchase: OrderID=${orderId}, Value=${value}, Initialized=${isInitialized}`);
  
  if (process.env.NODE_ENV !== 'production' && !isInitialized) {
    console.log('[PIXEL AUDIT] Purchase tracking skipped: development mode or pixels not initialized');
    return;
  }
  
  // Track Google purchase for all pixels
  if (typeof window !== 'undefined' && window.googleAdsPixels) {
    window.googleAdsPixels.forEach(pixel => {
      console.log(`[PIXEL AUDIT] Firing Google Ads conversion for ID: ${pixel.googleAdsId}, Label: ${pixel.conversionLabel}`);
      GooglePixel.trackPurchase(orderId, value, pixel.conversionLabel);
    });
  } else {
    console.log('[PIXEL AUDIT] No Google Ads pixels available in window object');
  }
  
  // Track Facebook purchase for all pixels
  if (typeof window !== 'undefined' && window.facebookPixels) {
    window.facebookPixels.forEach(pixel => {
      console.log(`[PIXEL AUDIT] Firing Facebook pixel conversion for ID: ${pixel.facebookPixelId}`);
      FacebookPixel.trackPurchase(value);
    });
  } else {
    console.log('[PIXEL AUDIT] No Facebook pixels available in window object');
  }
  
  // Track TikTok purchase
  if (typeof window !== 'undefined' && window.tiktokPixelId) {
    console.log(`[PIXEL AUDIT] Firing TikTok pixel conversion for ID: ${window.tiktokPixelId}`);
    TiktokPixel.trackPurchase(value);
  }
  
  // Track Taboola purchase
  if (typeof window !== 'undefined' && window.taboolaAccountId) {
    console.log(`[PIXEL AUDIT] Firing Taboola pixel conversion for ID: ${window.taboolaAccountId}`);
    TaboolaPixel.trackPurchase(value, orderId);
  }
  
  // Track Outbrain purchase
  if (typeof window !== 'undefined' && window.outbrainPixelId) {
    console.log(`[PIXEL AUDIT] Firing Outbrain pixel conversion for ID: ${window.outbrainPixelId}`);
    OutbrainPixel.trackPurchase(value);
  }
  
  // Track UOL Ads purchase
  if (typeof window !== 'undefined' && window.uolAdsId) {
    console.log(`[PIXEL AUDIT] Firing UOL Ads pixel conversion for ID: ${window.uolAdsId}`);
    UolAdsPixel.trackPurchase(value, orderId);
  }
};
