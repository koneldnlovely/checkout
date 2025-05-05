
/**
 * Facebook Pixel implementation
 */

// Initialize Facebook Pixel
export const initFacebookPixel = (pixelId: string, accessToken?: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // Add Facebook Pixel base code
  const script = document.createElement('script');
  script.innerHTML = `
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', '${pixelId}'${accessToken ? `, {access_token: '${accessToken}'}` : ''});
    fbq('track', 'PageView');
  `;
  
  document.head.appendChild(script);
  
  // Add noscript fallback
  const noscript = document.createElement('noscript');
  const img = document.createElement('img');
  img.height = 1;
  img.width = 1;
  img.style.display = 'none';
  img.src = `https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`;
  
  noscript.appendChild(img);
  document.head.appendChild(noscript);
  
  console.log('Facebook Pixel initialized');
};

// Track pageview event
export const trackPageView = (): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (!window.fbq) return;
  
  window.fbq('track', 'PageView');
};

// Track initiate checkout event
export const trackInitiateCheckout = (value?: number, currency: string = 'BRL'): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (!window.fbq) return;
  
  const eventParams: any = {
    currency,
    value
  };
  
  window.fbq('track', 'InitiateCheckout', eventParams);
};

// Track purchase event
export const trackPurchase = (value: number, currency: string = 'BRL'): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (!window.fbq) return;
  
  window.fbq('track', 'Purchase', {
    value,
    currency
  });
};
