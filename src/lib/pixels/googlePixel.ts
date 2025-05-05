
/**
 * Google Ads Pixel (gtag.js) implementation
 */

// Initialize Google Ads Pixel
export const initGooglePixel = (googleAdsId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // Add Google gtag script to document head
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`;
  
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${googleAdsId}');
  `;
  
  document.head.appendChild(script1);
  document.head.appendChild(script2);
  
  console.log('Google Ads Pixel initialized');
};

// Track pageview event
export const trackPageView = (path: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (!window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: path,
    send_to: window.googleAdsId
  });
};

// Track begin checkout event
export const trackBeginCheckout = (value?: number, currency: string = 'BRL'): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (!window.gtag) return;
  
  window.gtag('event', 'begin_checkout', {
    currency,
    value,
    send_to: window.googleAdsId
  });
};

// Track purchase event
export const trackPurchase = (
  transactionId: string, 
  value: number, 
  conversionLabel?: string,
  currency: string = 'BRL'
): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (!window.gtag) return;
  
  // Standard purchase event
  window.gtag('event', 'purchase', {
    transaction_id: transactionId,
    value,
    currency,
    send_to: window.googleAdsId
  });
  
  // If conversion label is provided, trigger a conversion event
  if (conversionLabel) {
    window.gtag('event', 'conversion', {
      send_to: `${window.googleAdsId}/${conversionLabel}`,
      value,
      currency,
      transaction_id: transactionId
    });
  }
};
