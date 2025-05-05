
// Types for pixel tracking system
import { PixelConfig } from '@/services/pixelConfigService';

export interface PixelTrackingOptions {
  initialize?: boolean;
}

export interface PixelTrackingActions {
  trackPurchase: (orderId: string, value: number) => void;
  trackInitiateCheckout: (value: number) => void;
}

export interface PixelProviderState {
  pixelInitialized: boolean;
  config: PixelConfig | null;
}

// Window extension for pixel IDs
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
    ttq: any;
    obApi: any;
    _tfa: any[];
    googleAdsPixels: Array<{googleAdsId: string, conversionLabel: string}>;
    facebookPixels: Array<{facebookPixelId: string, facebookToken: string}>;
    tiktokPixelId: string;
    taboolaAccountId: string;
    outbrainPixelId: string;
    uolAdsId: string;
  }
}
