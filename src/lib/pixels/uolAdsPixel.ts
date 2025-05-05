
/**
 * UOL Ads Pixel implementation
 */

// Initialize UOL Ads Pixel
export const initUolAdsPixel = (uolAdsId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // Add UOL Ads Pixel base code
  const script = document.createElement('script');
  script.innerHTML = `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${uolAdsId}');
  `;
  
  document.head.appendChild(script);
  
  // Add noscript fallback
  const noscript = document.createElement('noscript');
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.googletagmanager.com/ns.html?id=${uolAdsId}`;
  iframe.height = "0";  // Fix: convert number to string
  iframe.width = "0";   // Fix: convert number to string
  iframe.style.display = 'none';
  iframe.style.visibility = 'hidden';
  
  noscript.appendChild(iframe);
  document.body.appendChild(noscript);
  
  console.log('UOL Ads Pixel initialized');
};

// Track purchase event
export const trackPurchase = (value: number, transactionId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (typeof window.dataLayer === 'undefined') return;
  
  window.dataLayer.push({
    'event': 'purchase',
    'ecommerce': {
      'purchase': {
        'actionField': {
          'id': transactionId,
          'revenue': value
        }
      }
    }
  });
};
