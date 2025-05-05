
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { fetchPixelConfig, updatePixelConfig, PixelConfig } from '@/services/pixelConfigService';
import { pixelConfigSchema, PixelConfigFormValues, GoogleAdsPixel, FacebookPixel } from '@/pages/admin/PixelSettingsSchema';
import { v4 as uuidv4 } from 'uuid';

export const usePixelConfigForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Initialize form with React Hook Form
  const form = useForm<PixelConfigFormValues>({
    resolver: zodResolver(pixelConfigSchema),
    defaultValues: {
      googleAdsPixels: [],
      facebookPixels: [],
      taboolaPixel: {
        taboolaAccountId: '',
        enabled: false
      },
      tiktokPixel: {
        tiktokPixelId: '',
        enabled: false
      },
      outbrainPixel: {
        outbrainPixelId: '',
        enabled: false
      },
      uolAdsPixel: {
        uolAdsId: '',
        enabled: false
      }
    },
  });
  
  // Load initial data from Supabase
  useEffect(() => {
    const loadPixelConfig = async () => {
      try {
        setLoading(true);
        const config = await fetchPixelConfig();
        
        // Ensure each pixel has an ID
        const googleAdsPixels = config.googleAdsPixels.map(pixel => ({
          ...pixel,
          id: pixel.id || uuidv4()
        }));
        
        const facebookPixels = config.facebookPixels.map(pixel => ({
          ...pixel,
          id: pixel.id || uuidv4()
        }));
        
        form.reset({
          id: config.id,
          googleAdsPixels: googleAdsPixels.length ? googleAdsPixels : [{ id: uuidv4(), googleAdsId: '', conversionLabel: '', enabled: false }],
          facebookPixels: facebookPixels.length ? facebookPixels : [{ id: uuidv4(), facebookPixelId: '', facebookToken: '', enabled: false }],
          taboolaPixel: config.taboolaPixel,
          tiktokPixel: config.tiktokPixel,
          outbrainPixel: config.outbrainPixel,
          uolAdsPixel: config.uolAdsPixel
        });
        
        console.log('Pixel Config loaded:', config);
      } catch (error) {
        console.error('Erro ao carregar configurações de Pixels:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as configurações de Pixels.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadPixelConfig();
  }, [form, toast]);
  
  // Add a new Google Ads pixel
  const addGoogleAdsPixel = () => {
    const currentPixels = form.getValues('googleAdsPixels') || [];
    form.setValue('googleAdsPixels', [
      ...currentPixels,
      { id: uuidv4(), googleAdsId: '', conversionLabel: '', enabled: false }
    ]);
  };
  
  // Remove a Google Ads pixel
  const removeGoogleAdsPixel = (index: number) => {
    const currentPixels = form.getValues('googleAdsPixels') || [];
    if (currentPixels.length <= 1) return; // Keep at least one pixel
    
    form.setValue('googleAdsPixels', currentPixels.filter((_, i) => i !== index));
  };
  
  // Add a new Facebook pixel
  const addFacebookPixel = () => {
    const currentPixels = form.getValues('facebookPixels') || [];
    form.setValue('facebookPixels', [
      ...currentPixels,
      { id: uuidv4(), facebookPixelId: '', facebookToken: '', enabled: false }
    ]);
  };
  
  // Remove a Facebook pixel
  const removeFacebookPixel = (index: number) => {
    const currentPixels = form.getValues('facebookPixels') || [];
    if (currentPixels.length <= 1) return; // Keep at least one pixel
    
    form.setValue('facebookPixels', currentPixels.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const onSubmit = async (values: PixelConfigFormValues) => {
    try {
      setSaving(true);
      const updatedConfig = await updatePixelConfig(values as PixelConfig);
      console.log('Pixel Config updated:', updatedConfig);
      toast({
        title: 'Sucesso',
        description: 'Configurações de Pixels atualizadas com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações de Pixels:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações de Pixels.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  return {
    form,
    loading,
    saving,
    onSubmit: form.handleSubmit(onSubmit),
    addGoogleAdsPixel,
    removeGoogleAdsPixel,
    addFacebookPixel,
    removeFacebookPixel
  };
};
