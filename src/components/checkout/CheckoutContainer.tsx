
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TopMessageBanner } from './TopMessageBanner';
import { CountdownBanner } from '@/components/CountdownBanner';
import { CheckoutFooter } from './CheckoutFooter';
import { CheckoutCustomization } from '@/types/checkout';

interface CheckoutContainerProps {
  children: React.ReactNode;
  productBannerUrl?: string;
  customization?: CheckoutCustomization;
}

interface CheckoutCustomizationDB {
  button_color?: string;
  button_text_color?: string;
  button_text?: string;
  header_message?: string;
  banner_image_url?: string;
  show_banner?: boolean;
  heading_color?: string;
  banner_color?: string;
}

// Define custom CSS Properties type to support CSS variables
interface CustomCSSProperties extends React.CSSProperties {
  '--button-color': string;
  '--button-text-color': string;
  '--button-text': string;
  '--heading-color': string;
  '--banner-color': string;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ 
  children,
  productBannerUrl,
  customization
}) => {
  const { toast } = useToast();
  const [dbCustomization, setDbCustomization] = useState<CheckoutCustomizationDB>({
    button_color: '#28A745',
    button_text_color: '#ffffff',
    button_text: 'Finalizar Pagamento',
    header_message: 'Oferta por tempo limitado!',
    banner_image_url: '/lovable-uploads/0316cf52-2668-4bd5-8293-a0b8e5f3b8fb.png',
    show_banner: true,
    heading_color: '#000000',
    banner_color: '#000000'
  });
  const [isCustomizationLoaded, setIsCustomizationLoaded] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        console.log('Fetching checkout customization...');
        const { data, error } = await supabase
          .from('checkout_customization')
          .select('button_color, button_text_color, button_text, header_message, banner_image_url, show_banner, heading_color, banner_color')
          .order('id', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching checkout customization:', error);
          toast({
            title: "Erro ao carregar",
            description: "Erro ao carregar as configurações do checkout. Verifique o console para mais detalhes.",
            variant: "destructive",
          });
          return;
        }

        if (data) {
          console.log('Checkout customization loaded:', data);
          setDbCustomization(data as CheckoutCustomizationDB);
        }
      } catch (err) {
        console.error('Failed to fetch checkout customization', err);
        toast({
          title: "Erro ao carregar",
          description: "Erro ao carregar as configurações do checkout. Verifique o console para mais detalhes.",
          variant: "destructive",
        });
      } finally {
        setIsCustomizationLoaded(true);
      }
    };

    fetchCustomization();
  }, [toast]);

  // Use product-specific colors if provided and use_global_colors is false
  const useProductCustomColors = customization && customization.useGlobalColors === false;
  
  // Use properly typed CSS variables with our custom interface
  const customStyles: CustomCSSProperties = {
    '--button-color': useProductCustomColors && customization?.buttonColor 
      ? customization.buttonColor 
      : dbCustomization.button_color || '#28A745',
    '--button-text-color': dbCustomization.button_text_color || '#ffffff',
    '--button-text': `'${dbCustomization.button_text || 'Finalizar Pagamento'}'`,
    '--heading-color': useProductCustomColors && customization?.headingColor 
      ? customization.headingColor 
      : dbCustomization.heading_color || '#000000',
    '--banner-color': useProductCustomColors && customization?.bannerColor 
      ? customization.bannerColor 
      : dbCustomization.banner_color || '#000000',
  };

  // Use product-specific banner URL if available, otherwise fall back to global setting
  const bannerImageUrl = productBannerUrl || dbCustomization.banner_image_url;
  
  console.log('Banner image being used:', { 
    productBanner: productBannerUrl, 
    globalBanner: dbCustomization.banner_image_url,
    finalBanner: bannerImageUrl,
    showBanner: dbCustomization.show_banner
  });

  // Show a simple loading state while customization is loading
  if (!isCustomizationLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-black">Carregando...</div>
      </div>
    );
  }

  // Create countdown end time - 24 hours from now for example
  const countdownEndTime = customization?.countdownEndTime 
    ? new Date(customization.countdownEndTime) 
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  return (
    <div className="flex flex-col bg-white text-black max-w-full overflow-x-hidden" style={customStyles as React.CSSProperties}>
      <div className="w-full flex justify-center">
        <div className="w-full mx-auto bg-white">
          <div>
            {dbCustomization.show_banner && (
              <CountdownBanner 
                message={dbCustomization.header_message || 'Oferta por tempo limitado!'} 
                endTime={countdownEndTime}
                bannerImageUrl={bannerImageUrl}
                containerClassName="w-full"
              />
            )}
            
            {/* Ajustado para eliminar o espaço em branco no mobile */}
            <div className="w-full md:w-3/4 max-w-4xl mx-auto px-4 md:px-6 py-2 md:py-4">
              <main>
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
      <CheckoutFooter />
    </div>
  );
};

export default CheckoutContainer;
