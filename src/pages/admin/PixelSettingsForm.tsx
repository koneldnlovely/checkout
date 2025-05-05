
import React from 'react';
import { Form } from '@/components/ui/form';
import { PixelFormCard } from '@/components/admin/pixel-settings/PixelFormCard';
import { GoogleAdsSection } from '@/components/admin/pixel-settings/GoogleAdsSection';
import { FacebookPixelSection } from '@/components/admin/pixel-settings/FacebookPixelSection';
import { TaboolaPixelSection } from '@/components/admin/pixel-settings/TaboolaPixelSection';
import { TiktokPixelSection } from '@/components/admin/pixel-settings/TiktokPixelSection';
import { OutbrainPixelSection } from '@/components/admin/pixel-settings/OutbrainPixelSection';
import { UolAdsPixelSection } from '@/components/admin/pixel-settings/UolAdsPixelSection';
import { SubmitButton } from '@/components/admin/pixel-settings/SubmitButton';
import { usePixelConfigForm } from '@/hooks/admin/usePixelConfigForm';

export const PixelSettingsForm = () => {
  const { 
    form, 
    loading, 
    saving, 
    onSubmit, 
    addGoogleAdsPixel, 
    removeGoogleAdsPixel,
    addFacebookPixel,
    removeFacebookPixel
  } = usePixelConfigForm();
  
  return (
    <PixelFormCard
      title="Configuração de Pixels de Rastreamento"
      description="Configure os pixels de rastreamento para as diversas plataformas de publicidade."
      loading={loading}
    >
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Google Ads Section */}
          <GoogleAdsSection 
            form={form} 
            onAddPixel={addGoogleAdsPixel} 
            onRemovePixel={removeGoogleAdsPixel}
          />
          
          {/* Facebook Pixel Section */}
          <FacebookPixelSection 
            form={form} 
            onAddPixel={addFacebookPixel} 
            onRemovePixel={removeFacebookPixel}
          />
          
          {/* Taboola Pixel Section */}
          <TaboolaPixelSection form={form} />
          
          {/* TikTok Pixel Section */}
          <TiktokPixelSection form={form} />
          
          {/* Outbrain Pixel Section */}
          <OutbrainPixelSection form={form} />
          
          {/* UOL Ads Pixel Section */}
          <UolAdsPixelSection form={form} />
          
          {/* Submit Button */}
          <SubmitButton saving={saving} />
        </form>
      </Form>
    </PixelFormCard>
  );
};

export default PixelSettingsForm;
