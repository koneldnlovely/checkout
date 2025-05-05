
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Global window interface for pixel tracking
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  fbq: (...args: any[]) => void;
  googleAdsId: string;
  conversionLabel: string;
  facebookPixelId: string;
  facebookToken: string;
  _fbq: any;
}
