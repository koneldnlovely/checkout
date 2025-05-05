
import { Product, CheckoutCustomization } from '@/types/checkout';

/**
 * Maps snake_case product properties to camelCase for use in components
 */
export const mapProductToCustomization = (product: Product): Partial<CheckoutCustomization> => {
  return {
    buttonColor: product.button_color || '#22c55e',
    headingColor: product.heading_color || '#ffffff',
    bannerColor: product.banner_color || '#000000',
    bannerImageUrl: product.banner_image_url || undefined,
    useGlobalColors: product.use_global_colors !== false, // Default to true if not defined
    isDigitalProduct: product.type === 'digital' || product.isDigital || false
  };
};

/**
 * Maps camelCase customization properties back to snake_case for product storage
 */
export const mapCustomizationToProduct = (customization: Partial<CheckoutCustomization>): Partial<Product> => {
  return {
    button_color: customization.buttonColor,
    heading_color: customization.headingColor,
    banner_color: customization.bannerColor,
    banner_image_url: customization.bannerImageUrl || undefined,
    use_global_colors: customization.useGlobalColors
  };
};
