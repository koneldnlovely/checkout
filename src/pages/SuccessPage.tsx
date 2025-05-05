import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabaseClientService } from '@/services/supabaseClientService';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { WhatsAppButton } from './SuccessPage/WhatsAppButton';
import { EmailConfirmationSection } from './SuccessPage/EmailConfirmationSection';
import { DigitalProductSection, DigitalProductButton } from './SuccessPage/DigitalProductSection';
import { TestimonialsCarousel } from '@/components/TestimonialsCarousel';
import { PhysicalProductTestimonials } from '@/components/success-page/PhysicalProductTestimonials';

const SuccessPage = () => {
  const location = useLocation();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isDigitalProduct, setIsDigitalProduct] = useState(false);

  const fetchWhatsAppInfo = useCallback(async () => {
    if (!location.state?.order) return;

    const { order } = location.state;
    
    try {
      console.log('[SuccessPage] Iniciando fetchWhatsAppInfo com orderId:', order.id);
      
      if (order.productId) {
        const productInfo = await supabaseClientService.getProductWhatsAppInfo(order.productId);
      
        const finalWhatsappNumber = 
          location.state.whatsapp_number || 
          order.whatsapp_number || 
          productInfo.whatsappNumber || 
          '';

        console.log('[SuccessPage] Número WhatsApp final:', finalWhatsappNumber);

        setWhatsappNumber(finalWhatsappNumber);

        // Persistir para localStorage para possíveis recarregamentos da página
        if (finalWhatsappNumber) {
          localStorage.setItem('whatsapp_number', finalWhatsappNumber);
        }
        
        // Check if the product is digital
        if (order.productType === 'digital' || location.state.isDigitalProduct) {
          setIsDigitalProduct(true);
        }
      }
    } catch (error) {
      console.error('[SuccessPage] Erro ao buscar informações do WhatsApp:', error);
    }
  }, [location.state]);

  useEffect(() => {
    fetchWhatsAppInfo();
  }, [fetchWhatsAppInfo]);

  // Fallback para localStorage se o state for perdido
  useEffect(() => {
    const storedWhatsappNumber = localStorage.getItem('whatsapp_number');
    if (storedWhatsappNumber) {
      console.log('[SuccessPage] Recuperando número do WhatsApp do localStorage:', storedWhatsappNumber);
      setWhatsappNumber(storedWhatsappNumber);
    }
  }, []);

  // ✅ Finaliza pagamento via cartão (sem webhook)
  useEffect(() => {
    const order = location.state?.order;
    if (!order || !order.id) return;

    const finalizePayment = async () => {
      try {
        const res = await fetch('/.netlify/functions/finalize-card-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        });

        const json = await res.json();
        console.log('[SuccessPage] finalize-card-payment response:', json);
      } catch (err) {
        console.error('[SuccessPage] Erro ao finalizar pagamento com cartão:', err);
      }
    };

    finalizePayment();
  }, [location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="max-w-md w-full shadow-lg border border-gray-100 rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-white pb-8">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-green-100">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-800 mb-2">Pagamento Confirmado!</CardTitle>
          <CardDescription className="text-gray-600 text-lg">
            Seu pagamento foi processado com sucesso
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-5 px-6 py-6 bg-white">
          <p className="text-gray-700 text-lg">Obrigado pela sua compra. Seu pedido foi confirmado e está sendo processado.</p>
          
          <EmailConfirmationSection />
          <DigitalProductSection isDigital={isDigitalProduct} />
          
          {isDigitalProduct ? (
            <div className="mt-8 bg-gray-50 p-5 rounded-xl border border-gray-100">
              <h3 className="font-medium text-gray-800 mb-4 text-lg">O que nossos clientes estão dizendo:</h3>
              <TestimonialsCarousel />
            </div>
          ) : (
            <PhysicalProductTestimonials />
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col pb-6 gap-3 pt-4 bg-white">
          <DigitalProductButton isDigital={isDigitalProduct} />
          
          {whatsappNumber && (
            <div className="w-full">
              <p className="text-sm text-gray-500 mb-2 text-center">
                Precisa de ajuda? Estamos aqui para suportar você!
              </p>
              <WhatsAppButton 
                whatsappNumber={whatsappNumber} 
                message={`Olá! Acabei de fazer um pagamento para o pedido ${location.state?.order?.id || 'recente'} e gostaria de confirmar o recebimento.`}
                fullWidth={true}
              />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessPage;
