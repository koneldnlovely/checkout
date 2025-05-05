
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  number?: string;
  message?: string;
  fullWidth?: boolean;
  hasWhatsappSupport?: boolean;
  whatsappNumber?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ 
  hasWhatsappSupport, 
  whatsappNumber,
  number,
  message = "Olá! Acabei de fazer um pagamento via Pix e gostaria de confirmar o recebimento.",
  fullWidth = false
}) => {
  // Priorizar o número explicitamente passado ou o número de WhatsApp
  const phoneNumber = number || whatsappNumber;
  
  // Se não houver número, não renderiza o botão
  if (!phoneNumber) {
    console.log('[WhatsAppButton] Botão não será renderizado - número de telefone não encontrado');
    return null;
  }

  const formatWhatsAppUrl = () => {
    const cleanNumber = phoneNumber?.replace(/\D/g, '') || '';
    console.log('[WhatsAppButton] Criando URL do WhatsApp com número:', cleanNumber);
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <Button 
      asChild 
      variant="outline"
      className={`border-green-500 bg-white hover:bg-green-50 text-green-600 transition-colors px-6 py-3 h-auto text-lg rounded-lg shadow-sm mt-2 ${fullWidth ? 'w-full' : ''}`}
    >
      <a 
        href={formatWhatsAppUrl()} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center"
      >
        Falar no WhatsApp
        <MessageCircle className="ml-2 h-5 w-5" />
      </a>
    </Button>
  );
};
