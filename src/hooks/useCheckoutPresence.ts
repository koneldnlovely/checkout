
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

interface CheckoutVisitor {
  id: string;
  productId?: string;
  productName?: string;
  timestamp: string;
  ipHash?: string;
}

export const useCheckoutPresence = (productId?: string, productName?: string) => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [visitors, setVisitors] = useState<CheckoutVisitor[]>([]);
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    const visitorId = sessionStorage.getItem('visitor_id') || uuidv4();
    sessionStorage.setItem('visitor_id', visitorId);
    
    // Create a channel for the checkout page with a specific product if provided
    // In admin dashboard, we'll listen to all channels with 'checkout_' prefix
    const channelName = productId ? `checkout_${productId}` : 'checkout_general';
    const isAdmin = window.location.pathname.includes('/admin');
    
    const checkoutChannel = supabase.channel(channelName);

    // Create visitor data
    const visitorData: CheckoutVisitor = {
      id: visitorId,
      productId,
      productName,
      timestamp: new Date().toISOString(),
    };

    // Handle presence events
    checkoutChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = checkoutChannel.presenceState();
        const currentVisitors: CheckoutVisitor[] = [];
        
        // Collect all visitors from presence state
        Object.values(presenceState).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.visitor) {
              currentVisitors.push(presence.visitor);
            }
          });
        });
        
        setVisitors(currentVisitors);
        setVisitorCount(currentVisitors.length);
        
        if (isAdmin) {
          console.log('Current checkout visitors:', currentVisitors);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (isAdmin) {
          console.log('User joined checkout:', key, newPresences);
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (isAdmin) {
          console.log('User left checkout:', key, leftPresences);
        }
      });

    // Subscribe to the channel and track the visitor (only for checkout, not admin)
    checkoutChannel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED' && !isAdmin) {
        await checkoutChannel.track({
          visitor: visitorData
        });
      }
    });

    setChannel(checkoutChannel);

    // Cleanup function
    return () => {
      if (checkoutChannel) {
        if (!isAdmin) {
          checkoutChannel.untrack();
        }
        supabase.removeChannel(checkoutChannel);
      }
    };
  }, [productId, productName]);

  return { visitorCount, visitors };
};
