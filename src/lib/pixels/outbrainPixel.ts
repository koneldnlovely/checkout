
/**
 * Outbrain Pixel implementation
 */

// Initialize Outbrain Pixel
export const initOutbrainPixel = (pixelId: string): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  
  // Add Outbrain Pixel base code
  const script = document.createElement('script');
  script.innerHTML = `
    !function(_window, _document) {
      var OB_ADV_ID = '${pixelId}';
      if (_window.obApi) {
        var toArray = function(object) {
          return Object.prototype.toString.call(object) === '[object Array]' ? object : [object];
        };
        _window.obApi.marketerId = toArray(_window.obApi.marketerId).concat(toArray(OB_ADV_ID));
        return;
      }
      var api = _window.obApi = function() {
        api.dispatch ? api.dispatch.apply(api, arguments) : api.queue.push(arguments);
      };
      api.version = '1.1';
      api.loaded = true;
      api.marketerId = OB_ADV_ID;
      api.queue = [];
      var tag = _document.createElement('script');
      tag.async = true;
      tag.src = '//amplify.outbrain.com/cp/obtp.js';
      tag.type = 'text/javascript';
      var script = _document.getElementsByTagName('script')[0];
      script.parentNode.insertBefore(tag, script);
    }(window, document);

    obApi('track', 'PAGE_VIEW');
  `;
  
  document.head.appendChild(script);
  
  console.log('Outbrain Pixel initialized');
};

// Track purchase event
export const trackPurchase = (value: number): void => {
  if (typeof window === 'undefined' || process.env.NODE_ENV !== 'production') return;
  if (typeof window.obApi === 'undefined') return;
  
  window.obApi('track', 'PURCHASE', {
    value: value,
    currency: 'BRL'
  });
};

