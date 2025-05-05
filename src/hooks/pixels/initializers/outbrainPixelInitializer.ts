
import * as OutbrainPixel from '@/lib/pixels/outbrainPixel';

export const initializeOutbrainPixel = (config: any) => {
  if (!config?.outbrainPixel?.enabled || !config.outbrainPixel?.outbrainPixelId) {
    return;
  }
  
  OutbrainPixel.initOutbrainPixel(config.outbrainPixel.outbrainPixelId);
  
  // Store in window for later use
  if (typeof window !== 'undefined') {
    window.outbrainPixelId = config.outbrainPixel.outbrainPixelId;
  }
};
