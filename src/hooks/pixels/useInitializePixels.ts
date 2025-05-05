
import { useEffect, useState } from 'react';
import { fetchPixelConfig, PixelConfig } from '@/services/pixelConfigService';
import { initializeGoogleAdsPixels } from './initializers/googlePixelInitializer';
import { initializeFacebookPixels } from './initializers/facebookPixelInitializer';
import { initializeTiktokPixel } from './initializers/tiktokPixelInitializer';
import { initializeTaboolaPixel } from './initializers/taboolaPixelInitializer';
import { initializeOutbrainPixel } from './initializers/outbrainPixelInitializer';
import { initializeUolAdsPixel } from './initializers/uolAdsPixelInitializer';

export const useInitializePixels = (shouldInitialize: boolean = false) => {
  const [pixelInitialized, setPixelInitialized] = useState(false);
  const [pixelConfig, setPixelConfig] = useState<PixelConfig | null>(null);
  
  // Initialize pixels on component mount
  useEffect(() => {
    if (shouldInitialize && process.env.NODE_ENV === 'production' && !pixelInitialized) {
      initializeAllPixels();
    }
  }, [shouldInitialize, pixelInitialized]);
  
  // Fetch pixel configuration and initialize all pixels
  const initializeAllPixels = async () => {
    try {
      // Fetch configuration from database
      const config = await fetchPixelConfig();
      setPixelConfig(config);
      
      // Initialize each type of pixel
      initializeGoogleAdsPixels(config);
      initializeFacebookPixels(config);
      initializeTiktokPixel(config);
      initializeTaboolaPixel(config);
      initializeOutbrainPixel(config);
      initializeUolAdsPixel(config);
      
      setPixelInitialized(true);
    } catch (error) {
      console.error('Error initializing pixels:', error);
    }
  };

  return {
    pixelInitialized,
    pixelConfig
  };
};
