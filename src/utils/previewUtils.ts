
import { CheckoutCustomization, Product } from '@/types/checkout';

// Função para obter um produto de demonstração
export const getDemoProduct = (): Product => {
  return {
    id: 'demo-product',
    name: 'Produto de Demonstração',
    description: 'Este é um produto de demonstração para visualização do checkout.',
    price: 97.0,
    type: 'digital',
    isDigital: true,
    status: true,
    slug: 'demo-product',
    image_url: '/placeholder.svg',
    banner_image_url: '',
    use_global_colors: true,
    button_color: '#4CAF50',
    heading_color: '#333333',
    banner_color: '#f5f5f5',
    has_whatsapp_support: true,
    whatsapp_number: '5511999999999'
  };
};

// Função para obter customização padrão para a pré-visualização
export const getDefaultPreviewCustomization = (): CheckoutCustomization => {
  return {
    buttonColor: '#4CAF50',
    buttonText: 'Finalizar Compra',
    headingColor: '#333333',
    bannerColor: '#f5f5f5',
    bannerImageUrl: null,
    topMessage: 'Oferta por tempo limitado!',
    countdownEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isDigitalProduct: true
  };
};
