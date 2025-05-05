
import { useState, useEffect } from 'react';

export const useShippingMessage = (cep: string, houseNumber: string) => {
  const [showShippingMessage, setShowShippingMessage] = useState(false);
  
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (cep && cep.length >= 8 && houseNumber && houseNumber.length > 0) {
      // Start a 2-second timer before showing the shipping message
      timer = setTimeout(() => {
        setShowShippingMessage(true);
      }, 2000);
    } else {
      setShowShippingMessage(false);
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [cep, houseNumber]);
  
  return showShippingMessage;
};
