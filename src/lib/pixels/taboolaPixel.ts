
/**
 * Taboola Pixel implementation
 */

// Initialize Taboola Pixel
export const initTaboolaPixel = (accountId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // Add Taboola Pixel base code
  const script = document.createElement('script');
  script.innerHTML = `
    window._tfa = window._tfa || [];
    window._tfa.push({notify: 'event', name: 'page_view', id: '${accountId}'});
    
    (function (s, d, c, n) {
      if (s.getElementById(c)) return;
      var js, fjs = s.getElementsByTagName(n)[0];
      js = s.createElement(n); js.id = c;
      js.src = '//cdn.taboola.com/libtrc/unip/${accountId}/tfa.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, window, 'tb_tfa_script', 'script');
  `;
  
  document.head.appendChild(script);
  
  console.log('Taboola Pixel initialized');
};

// Track purchase event
export const trackPurchase = (value: number, orderId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (typeof window._tfa === 'undefined') return;
  
  window._tfa.push({
    notify: 'event',
    name: 'purchase',
    id: window.taboolaAccountId,
    revenue: value,
    orderId: orderId
  });
};

