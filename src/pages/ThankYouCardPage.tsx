
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { WhatsAppButton } from './SuccessPage/WhatsAppButton';
import { PhysicalProductTestimonials } from '@/components/success-page/PhysicalProductTestimonials';
import { CountdownBanner } from '@/components/CountdownBanner';

const ThankYouCardPage = () => {
  const { state } = useLocation();
  const order = state?.order;
  
  // Obter número de WhatsApp de várias fontes possíveis
  const whatsappNumber = state?.whatsapp_number || 
                          state?.product?.whatsapp_number || 
                          order?.whatsapp_number;
                          
  // Determine if product is physical
  const isDigitalProduct = state?.product?.type === 'digital' || 
                           state?.isDigitalProduct ||
                           order?.productType === 'digital';
                           
  // Get product-specific banner if available
  const bannerImageUrl = state?.product?.bannerImageUrl || 
                         state?.bannerImageUrl || 
                         '/lovable-uploads/75584e12-d113-40d9-99bd-c222d0b06f29.png';

  // Log para depuração
  useEffect(() => {
    console.log('[ThankYouCardPage] State recebido:', state);
    console.log('[ThankYouCardPage] Número WhatsApp:', whatsappNumber);
    console.log('[ThankYouCardPage] Order:', order);
    console.log('[ThankYouCardPage] É produto digital:', isDigitalProduct);
    console.log('[ThankYouCardPage] Banner Image URL:', bannerImageUrl);
    if (state?.product) {
      console.log('[ThankYouCardPage] Product data:', state.product);
    }
  }, [state, whatsappNumber, order, isDigitalProduct, bannerImageUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-blue-50">
      {bannerImageUrl && (
        <div className="fixed top-0 left-0 right-0 z-10">
          <CountdownBanner 
            message="Oferta por tempo limitado!"
            endTime={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            bannerImageUrl={bannerImageUrl}
          />
        </div>
      )}
      
      <Card className="max-w-md w-full shadow-xl border border-blue-100 rounded-xl overflow-hidden mt-28">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 w-full" />
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-100">
            <CheckCircle className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Pagamento Recebido!</h2>
          <p className="text-gray-600 text-lg mt-2">
            Seu pagamento com cartão está sendo processado.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center text-sm text-gray-500 space-y-3">
            <p>Assim que confirmarmos o pagamento, você receberá acesso ao seu produto.</p>
            <p>Fique atento ao seu e-mail!</p>
          </div>
          
          {/* Show testimonials for physical products */}
          {!isDigitalProduct && <PhysicalProductTestimonials />}
          
          {whatsappNumber && (
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2 text-center">
                Precisa de ajuda? Entre em contato conosco:
              </p>
              <WhatsAppButton 
                whatsappNumber={whatsappNumber} 
                message={`Olá! Acabei de fazer um pagamento para o pedido ${order?.id || 'recente'} e gostaria de confirmar o recebimento.`}
                fullWidth={true}
              />
            </div>
          )}
          
          {order && (
            <div className="w-full mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                Pedido #{order.id}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYouCardPage;
