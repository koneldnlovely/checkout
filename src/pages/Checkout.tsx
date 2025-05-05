import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCheckoutState } from '@/hooks/useCheckoutState';
import { CheckoutContent } from '@/components/checkout/CheckoutContent';
import { useCheckoutCustomization } from '@/hooks/useCheckoutCustomization';
import { LoadingState } from '@/components/shared/LoadingState';
import { ErrorState } from '@/components/shared/ErrorState';
import { useToast } from '@/hooks/use-toast';
import { getProductBySlug } from '@/services/productService';
import { Product } from '@/types/checkout';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const customization = useCheckoutCustomization(product || undefined);
  const {
    customerData,
    addressData,
    paymentMethod,
    isSubmitting,
    handleCustomerSubmit,
    handleAddressSubmit,
    setPaymentMethod,
    handlePaymentSubmit
  } = useCheckoutState(product || undefined);
  
  // Fetch product by slug
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) {
        console.error("Slug não informado");
        setError("Produto não encontrado. O código do produto (slug) não foi informado na URL.");
        setLoading(false);
        return;
      }
      
      try {
        console.log("Fetching product with slug:", productSlug);
        const data = await getProductBySlug(productSlug);
          
        if (!data) {
          throw new Error("Produto não encontrado");
        }
        
        // Format product data
        const productData: Product = {
          id: data.id,
          name: data.name,
          slug: data.slug,
          description: data.description || '',
          image_url: data.image_url || '',
          banner_image_url: data.banner_image_url || '',
          price: data.price || 0,
          type: data.type || 'digital',
          isDigital: data.type === 'digital',
          use_global_colors: data.use_global_colors,
          button_color: data.button_color,
          heading_color: data.heading_color,
          banner_color: data.banner_color,
          has_whatsapp_support: data.has_whatsapp_support,
          whatsapp_number: data.whatsapp_number,
          status: data.status
        };
        
        setProduct(productData);
        console.log('Product data loaded:', productData);
        
      } catch (error: any) {
        console.error("Erro ao carregar produto:", error);
        setError("Não foi possível carregar o produto. Por favor, tente novamente.");
        toast({
          title: "Erro",
          description: "Não foi possível carregar o produto. Por favor, tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productSlug, toast]);
  
  // If loading or no product found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message="Carregando informações do produto..." />
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState 
          title="Produto não encontrado" 
          message={error || "O produto que você está procurando não está disponível ou não existe."}
          actionLink="/"
          actionLabel="Voltar para a página inicial"
        />
      </div>
    );
  }
  
  return (
    <CheckoutContainer 
      productBannerUrl={product.banner_image_url} 
      customization={{
        ...customization,
        useGlobalColors: product.use_global_colors,
        buttonColor: !product.use_global_colors ? product.button_color || customization.buttonColor : customization.buttonColor,
        headingColor: !product.use_global_colors ? product.heading_color || customization.headingColor : customization.headingColor,
        bannerColor: !product.use_global_colors ? product.banner_color || customization.bannerColor : customization.bannerColor,
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Removido o título do produto que estava aqui */}
        
        <CheckoutContent 
          product={product}
          customerData={customerData}
          paymentMethod={paymentMethod}
          isSubmitting={isSubmitting}
          customization={{
            ...customization,
            useGlobalColors: product.use_global_colors,
            buttonColor: !product.use_global_colors ? product.button_color || customization.buttonColor : customization.buttonColor,
            headingColor: !product.use_global_colors ? product.heading_color || customization.headingColor : customization.headingColor,
            bannerColor: !product.use_global_colors ? product.banner_color || customization.bannerColor : customization.bannerColor,
          }}
          onCustomerSubmit={handleCustomerSubmit}
          onAddressSubmit={handleAddressSubmit}
          onPaymentMethodChange={setPaymentMethod}
          onPaymentSubmit={handlePaymentSubmit}
        />
      </div>
    </CheckoutContainer>
  );
};

export default Checkout;
