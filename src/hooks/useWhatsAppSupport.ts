
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to fetch WhatsApp support information for a product
 */
export const useWhatsAppSupport = (productId?: string) => {
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWhatsAppInfo = async () => {
      if (!productId) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('products')
          .select('has_whatsapp_support, whatsapp_number')
          .eq('id', productId)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setHasWhatsappSupport(data.has_whatsapp_support || false);
          setWhatsappNumber(data.whatsapp_number || '');
        }
      } catch (err) {
        console.error('Error fetching WhatsApp support info:', err);
        setError('Falha ao carregar informações de suporte');
      } finally {
        setLoading(false);
      }
    };

    fetchWhatsAppInfo();
  }, [productId]);

  return {
    hasWhatsappSupport,
    whatsappNumber,
    loading,
    error
  };
};
