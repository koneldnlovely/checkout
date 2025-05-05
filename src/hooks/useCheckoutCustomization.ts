
import { useState, useEffect } from 'react';
import { CheckoutCustomization, Product } from '@/types/checkout';
import { mapProductToCustomization } from '@/utils/propertyMappers';

// Default customization values
const defaultCustomization: CheckoutCustomization = {
  buttonColor: '#22c55e', // Verde mais forte
  buttonText: 'Finalizar Compra',
  headingColor: '#ffffff',
  bannerColor: '#000000', // Cor padrão do banner
  bannerImageUrl: null,
  topMessage: 'Oferta por tempo limitado!',
  countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
  isDigitalProduct: true,
  useGlobalColors: true
};

export const useCheckoutCustomization = (product?: Product) => {
  const [customization, setCustomization] = useState<CheckoutCustomization>(defaultCustomization);
  
  useEffect(() => {
    if (product) {
      // Use the mapper utility to convert properties
      const productCustomization = mapProductToCustomization(product);
      
      // Update customization based on product
      setCustomization({
        ...defaultCustomization,
        isDigitalProduct: product.type === 'digital' || product.isDigital || false,
        bannerImageUrl: product.banner_image_url || null,
        useGlobalColors: product.use_global_colors !== false, // Default to true if not defined
        buttonColor: !product.use_global_colors && product.button_color ? product.button_color : defaultCustomization.buttonColor,
        headingColor: !product.use_global_colors && product.heading_color ? product.heading_color : defaultCustomization.headingColor,
        bannerColor: !product.use_global_colors && product.banner_color ? product.banner_color : defaultCustomization.bannerColor
      });
      
      console.log('Customization set from product:', {
        hasCustomColors: product.use_global_colors === false,
        useGlobalColors: product.use_global_colors,
        buttonColor: product.button_color,
        headingColor: product.heading_color,
        bannerColor: product.banner_color,
        bannerImageUrl: product.banner_image_url,
        appliedColors: {
          buttonColor: !product.use_global_colors && product.button_color ? product.button_color : defaultCustomization.buttonColor,
          headingColor: !product.use_global_colors && product.heading_color ? product.heading_color : defaultCustomization.headingColor,
          bannerColor: !product.use_global_colors && product.banner_color ? product.banner_color : defaultCustomization.bannerColor
        }
      });
    }
  }, [product]);
  
  return customization;
};
