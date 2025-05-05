
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { AsaasSettingsFormValues } from '@/pages/admin/AsaasSettingsSchema';
import { getAsaasConfig, updateAsaasConfig } from '@/services/asaasConfigService';

export const useAsaasSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AsaasSettingsFormValues>({
    sandbox: true,
    sandbox_key: '',
    production_key: '',
    pix_enabled: false,
    card_enabled: false,
    active: false,
    use_netlify_functions: false,
    manual_card_redirect_page: '/payment-pending',
  });

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const config = await getAsaasConfig();
      if (config) {
        setFormData({
          sandbox: config.sandbox,
          sandbox_key: config.sandbox_key || '',
          production_key: config.production_key || '',
          pix_enabled: config.pix_enabled || false,
          card_enabled: config.card_enabled || false,
          active: config.active || false,
          use_netlify_functions: config.use_netlify_functions || false,
          manual_card_redirect_page: config.manual_card_redirect_page || '/payment-pending',
        });
      }
    } catch (error) {
      console.error('Error loading Asaas config:', error);
      toast({
        title: 'Erro ao carregar configurações',
        description: 'Não foi possível carregar as configurações do Asaas.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (data: AsaasSettingsFormValues): Promise<void> => {
    setIsSaving(true);
    try {
      await updateAsaasConfig({
        sandbox: data.sandbox,
        sandbox_key: data.sandbox_key,
        production_key: data.production_key || null,
        pix_enabled: data.pix_enabled,
        card_enabled: data.card_enabled,
        active: data.active,
        use_netlify_functions: data.use_netlify_functions,
        manual_card_redirect_page: data.manual_card_redirect_page,
      });
      
      toast({
        title: 'Configurações salvas',
        description: 'As configurações do Asaas foram atualizadas com sucesso.',
      });
    } catch (error) {
      console.error('Error saving Asaas config:', error);
      toast({
        title: 'Erro ao salvar configurações',
        description: 'Ocorreu um erro ao salvar as configurações do Asaas.',
        variant: 'destructive',
      });
      throw error; // Re-throw to allow caller to handle if needed
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    formData,
    isLoading,
    isSaving,
    loadConfig,
    saveConfig,
  };
};
