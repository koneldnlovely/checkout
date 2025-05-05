import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hourglass, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Order } from '@/types/checkout';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const PaymentPendingPage = () => {
  const { state } = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasWhatsappSupport, setHasWhatsappSupport] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    console.log('[PaymentPendingPage] Full location state:', JSON.stringify(state, null, 2));
    // Start with a brief loading state for smoother transition
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Get order from location state if available
      if (state?.order) {
        setOrder(state.order);
        
        // Extract WhatsApp support details
        if (state.has_whatsapp_support) {
          setHasWhatsappSupport(true);
          setWhatsappNumber(state.whatsapp_number || '');
          console.log('[PaymentPendingPage] WhatsApp support enabled with number:', state.whatsapp_number);
        }
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [state]);

  const formatWhatsAppUrl = () => {
    const cleanNumber = whatsappNumber?.replace(/\D/g, '') || '';
    return `https://wa.me/${cleanNumber}?text=Olá! Gostaria de informações sobre meu pedido ${order?.id || ''} que está em análise.`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-blue-50">
        <LoadingSpinner size="lg" message="Carregando dados do pedido..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-purple-50">
      <Card className="max-w-md w-full shadow-xl border border-purple-100 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 w-full" />
        <CardHeader className="text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-blue-100">
            <Hourglass className="h-10 w-10 text-blue-500 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Pagamento em análise</CardTitle>
          <CardDescription className="text-gray-600 text-lg mt-2">
            Seu pedido foi recebido e está sendo processado
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {order && (
            <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
              <h3 className="font-medium text-gray-700 mb-2">Detalhes do pedido:</h3>
              <p className="text-gray-800 font-medium">{order.productName}</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                R$ {Number(order.productPrice).toFixed(2).replace('.', ',')}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-blue-800">Recebemos seu pagamento e ele está sendo analisado pela operadora do cartão.</p>
              </div>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800">Assim que tivermos uma resposta, você será notificado por e-mail sobre o status do seu pagamento.</p>
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 shadow-sm">
              <div className="flex items-start">
                <RefreshCcw className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-purple-800 font-medium">Utilizar um cartão diferente aumenta suas chances de aprovação.</p>
              </div>
            </div>
          </div>
          
          {hasWhatsappSupport && whatsappNumber && (
            <div className="mt-8">
              <p className="text-center text-gray-600 mb-3">Dúvidas sobre seu pedido?</p>
              <Button 
                asChild 
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white shadow-md transition-all duration-300 py-4 h-auto text-base font-medium rounded-xl"
              >
                <a 
                  href={formatWhatsAppUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Falar no WhatsApp
                  <MessageCircle className="h-5 w-5" />
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPendingPage;
