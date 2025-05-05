
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRedirectConfig = () => {
  const [redirectPage, setRedirectPage] = useState<string>('/payment-analysis');
  
  // Load the redirection configuration from Asaas
  useEffect(() => {
    const loadRedirectConfig = async () => {
      try {
        const { data, error } = await supabase
          .from('asaas_config')
          .select('manual_card_redirect_page')
          .single();
        
        if (error) {
          console.error('Erro ao carregar configuração de redirecionamento:', error);
          return; // Use the default value set in state
        }
        
        if (data && data.manual_card_redirect_page) {
          console.log('Configuração de redirecionamento carregada:', data.manual_card_redirect_page);
          setRedirectPage(data.manual_card_redirect_page);
        }
      } catch (err) {
        console.error('Falha ao carregar configuração de redirecionamento:', err);
      }
    };
    
    loadRedirectConfig();
  }, []);

  return { redirectPage };
};
