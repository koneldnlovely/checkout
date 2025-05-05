
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PixelTrackingOptions, PixelTrackingActions } from './pixels/types';
import { useInitializePixels } from './pixels/useInitializePixels';
import { useTrackPageViews } from './pixels/trackers/trackPageViews';
import { trackPurchase as trackPurchaseAction } from './pixels/trackers/trackPurchase';
import { trackInitiateCheckout as trackInitiateCheckoutAction } from './pixels/trackers/trackInitiateCheckout';

export const usePixelEvents = ({ initialize = false }: PixelTrackingOptions = {}): PixelTrackingActions => {
  const location = useLocation();
  const { pixelInitialized } = useInitializePixels(initialize);
  const { trackAllPageViews } = useTrackPageViews(pixelInitialized);
  
  // Track page views on route change
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && pixelInitialized) {
      trackAllPageViews();
    }
  }, [location.pathname, pixelInitialized, trackAllPageViews]);
  
  // Public tracking functions exposed by the hook
  const handleTrackPurchase = (orderId: string, value: number) => {
    trackPurchaseAction(orderId, value, pixelInitialized);
  };
  
  const handleTrackInitiateCheckout = (value: number) => {
    trackInitiateCheckoutAction(value, pixelInitialized);
  };
  
  return {
    trackPurchase: handleTrackPurchase,
    trackInitiateCheckout: handleTrackInitiateCheckout
  };
};
