
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define the Pixel configuration type
export interface PixelConfig {
  id?: number;
  googleAdsPixels: GoogleAdsPixel[];
  facebookPixels: FacebookPixel[];
  taboolaPixel: TaboolaPixel;
  tiktokPixel: TiktokPixel;
  outbrainPixel: OutbrainPixel;
  uolAdsPixel: UolAdsPixel;
}

export interface GoogleAdsPixel {
  id: string;
  googleAdsId: string;
  conversionLabel?: string;
  enabled: boolean;
}

export interface FacebookPixel {
  id: string;
  facebookPixelId: string;
  facebookToken?: string;
  enabled: boolean;
}

export interface TaboolaPixel {
  taboolaAccountId: string;
  enabled: boolean;
}

export interface TiktokPixel {
  tiktokPixelId: string;
  enabled: boolean;
}

export interface OutbrainPixel {
  outbrainPixelId: string;
  enabled: boolean;
}

export interface UolAdsPixel {
  uolAdsId: string;
  enabled: boolean;
}

// Fetch the Pixel configuration from Supabase
export const fetchPixelConfig = async (): Promise<PixelConfig> => {
  try {
    const { data, error } = await supabase
      .from('pixel_config')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    // Handle legacy format and convert to new format
    if (data) {
      // Check if data is in legacy format
      const isLegacyFormat = data.google_ads_id !== undefined || data.facebook_pixel_id !== undefined;
      
      if (isLegacyFormat) {
        // Convert legacy format to new format
        return {
          id: data.id,
          googleAdsPixels: data.google_ads_id ? [{
            id: uuidv4(),
            googleAdsId: data.google_ads_id || '',
            conversionLabel: data.conversion_label || '',
            enabled: data.google_enabled || false
          }] : [],
          facebookPixels: data.facebook_pixel_id ? [{
            id: uuidv4(),
            facebookPixelId: data.facebook_pixel_id || '',
            facebookToken: data.facebook_token || '',
            enabled: data.facebook_enabled || false
          }] : [],
          taboolaPixel: {
            taboolaAccountId: '',
            enabled: false
          },
          tiktokPixel: {
            tiktokPixelId: '',
            enabled: false
          },
          outbrainPixel: {
            outbrainPixelId: '',
            enabled: false
          },
          uolAdsPixel: {
            uolAdsId: '',
            enabled: false
          }
        };
      } else {
        // New format, just parse it
        return {
          id: data.id,
          googleAdsPixels: data.google_ads_pixels || [],
          facebookPixels: data.facebook_pixels || [],
          taboolaPixel: data.taboola_pixel || { taboolaAccountId: '', enabled: false },
          tiktokPixel: data.tiktok_pixel || { tiktokPixelId: '', enabled: false },
          outbrainPixel: data.outbrain_pixel || { outbrainPixelId: '', enabled: false },
          uolAdsPixel: data.uol_ads_pixel || { uolAdsId: '', enabled: false }
        };
      }
    }
    
    // Return default empty configuration
    return {
      googleAdsPixels: [],
      facebookPixels: [],
      taboolaPixel: {
        taboolaAccountId: '',
        enabled: false
      },
      tiktokPixel: {
        tiktokPixelId: '',
        enabled: false
      },
      outbrainPixel: {
        outbrainPixelId: '',
        enabled: false
      },
      uolAdsPixel: {
        uolAdsId: '',
        enabled: false
      }
    };
  } catch (error) {
    console.error('Error fetching pixel config:', error);
    return {
      googleAdsPixels: [],
      facebookPixels: [],
      taboolaPixel: {
        taboolaAccountId: '',
        enabled: false
      },
      tiktokPixel: {
        tiktokPixelId: '',
        enabled: false
      },
      outbrainPixel: {
        outbrainPixelId: '',
        enabled: false
      },
      uolAdsPixel: {
        uolAdsId: '',
        enabled: false
      }
    };
  }
};

// Update the Pixel configuration in Supabase
export const updatePixelConfig = async (config: PixelConfig): Promise<PixelConfig> => {
  try {
    let response;
    
    const dbData = {
      google_ads_pixels: config.googleAdsPixels.map(pixel => ({
        ...pixel,
        id: pixel.id || uuidv4()
      })),
      facebook_pixels: config.facebookPixels.map(pixel => ({
        ...pixel,
        id: pixel.id || uuidv4()
      })),
      taboola_pixel: config.taboolaPixel,
      tiktok_pixel: config.tiktokPixel,
      outbrain_pixel: config.outbrainPixel,
      uol_ads_pixel: config.uolAdsPixel
    };
    
    // If there's no ID, it's a new record
    if (!config.id) {
      const { data, error } = await supabase
        .from('pixel_config')
        .insert([dbData])
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    } else {
      // Otherwise, update the existing record
      const { data, error } = await supabase
        .from('pixel_config')
        .update(dbData)
        .eq('id', config.id)
        .select()
        .single();
      
      if (error) throw error;
      response = data;
    }
    
    return {
      id: response.id,
      googleAdsPixels: response.google_ads_pixels || [],
      facebookPixels: response.facebook_pixels || [],
      taboolaPixel: response.taboola_pixel || { taboolaAccountId: '', enabled: false },
      tiktokPixel: response.tiktok_pixel || { tiktokPixelId: '', enabled: false },
      outbrainPixel: response.outbrain_pixel || { outbrainPixelId: '', enabled: false },
      uolAdsPixel: response.uol_ads_pixel || { uolAdsId: '', enabled: false }
    };
  } catch (error) {
    console.error('Error updating pixel config:', error);
    throw error;
  }
};
