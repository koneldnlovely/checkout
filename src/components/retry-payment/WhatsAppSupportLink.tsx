
import React from 'react';
import { ExternalLink, MessageSquareText } from 'lucide-react';

interface WhatsAppSupportLinkProps {
  whatsappNumber: string;
}

const WhatsAppSupportLink: React.FC<WhatsAppSupportLinkProps> = ({ whatsappNumber }) => {
  // Se não houver número, não renderiza
  if (!whatsappNumber) {
    return null;
  }

  const formattedNumber = whatsappNumber.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedNumber}?text=Olá! Estou com dificuldades para finalizar meu pagamento. Pode me ajudar?`;

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-sm text-gray-600 mb-2">
        Está com dificuldades? Entre em contato com o suporte:
      </p>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
      >
        <MessageSquareText size={18} />
        <span className="font-medium">Suporte via WhatsApp</span>
        <ExternalLink size={14} />
      </a>
    </div>
  );
};

export default WhatsAppSupportLink;
