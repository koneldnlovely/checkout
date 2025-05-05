
/**
 * TikTok Pixel implementation
 */

// Initialize TikTok Pixel
export const initTiktokPixel = (tiktokPixelId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // Add TikTok Pixel base code
  const script = document.createElement('script');
  script.innerHTML = `
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;
      var ttq=w[t]=w[t]||[];
      ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
      ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
      for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
      ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
      ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
      ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};
      var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;
      var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      
      ttq.load('${tiktokPixelId}');
      ttq.page();
    }(window, document, 'ttq');
  `;
  
  document.head.appendChild(script);
  
  console.log('TikTok Pixel initialized');
};

// Track pageview event
export const trackPageView = (): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (typeof window.ttq === 'undefined') return;
  
  window.ttq.page();
};

// Track purchase event
export const trackPurchase = (value: number, currency: string = 'BRL'): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (typeof window.ttq === 'undefined') return;
  
  window.ttq.track('CompletePayment', {
    content_type: 'product',
    content_id: 'purchase',
    quantity: 1,
    price: value,
    value: value,
    currency: currency
  });
};

// Add the missing function for begin checkout
export const trackBeginCheckout = (value: number, currency: string = 'BRL'): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (typeof window.ttq === 'undefined') return;
  
  window.ttq.track('InitiateCheckout', {
    content_type: 'product',
    content_id: 'checkout',
    quantity: 1,
    price: value,
    value: value,
    currency: currency
  });
};
