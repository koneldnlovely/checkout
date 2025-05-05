
import React from 'react';
import { CreditCardData } from '@/types/checkout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/admin/orders/StatusBadge';

// Card brand icons mapping with index signature
const brandIcons: Record<string, string> = {
  'visa': '💳',
  'mastercard': '💳',
  'amex': '💳',
  'elo': '💳',
  'hipercard': '💳',
  'diners': '💳'
};

// Function to render icon for card brand
const renderCardBrandIcon = (brand?: string) => {
  if (!brand) return '💳';
  const lowerBrand = brand.toLowerCase();
  return brandIcons[lowerBrand] || '💳';
};

interface CardDetailsModalProps {
  card?: CreditCardData;
  isOpen: boolean;
  onClose: () => void;
  status?: string;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({ card, isOpen, onClose, status = 'PENDING' }) => {
  const { toast } = useToast();

  if (!card) return null;

  const copyCardNumber = () => {
    if (card.number) {
      navigator.clipboard.writeText(card.number);
      toast({
        title: "Copiado com sucesso",
        description: "O número do cartão foi copiado para a área de transferência",
      });
    }
  };

  // Determine card level based on BIN
  const getCardLevel = () => {
    if (!card?.bin) return 'Standard';
    
    // Simple logic to determine card level - same as in CreditCardsList
    const binNum = parseInt(card.bin.substring(0, 1), 10);
    
    if (binNum >= 8) return 'Platinum';
    if (binNum >= 5) return 'Gold';
    if (binNum >= 3) return 'Black';
    return 'Standard';
  };

  // Get appropriate color for card level badge
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Platinum': return 'bg-purple-500';
      case 'Gold': return 'bg-amber-500';
      case 'Black': return 'bg-black text-white';
      default: return 'bg-slate-500';
    }
  };

  const cardLevel = getCardLevel();
  const levelColor = getLevelColor(cardLevel);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Detalhes do Cartão
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Nome do Titular</div>
                <div className="mt-1 font-medium">{card.holderName}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Bandeira</div>
                <div className="mt-1 font-medium flex items-center">
                  {renderCardBrandIcon(card.brand)}
                  {card.brand || 'Desconhecida'}
                </div>
              </div>
              
              <div className="col-span-2">
                <div className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  Número do Cartão
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={copyCardNumber}
                    className="h-6 w-6"
                    title="Copiar número"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-1 font-medium tracking-wider">{card.number}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">Validade</div>
                <div className="mt-1 font-medium">{card.expiryDate}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">CVV</div>
                <div className="mt-1 font-medium">{card.cvv}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-500">BIN</div>
                <div className="mt-1 font-medium flex items-center">
                  {card.bin || '-'}
                  <Badge className={`ml-2 ${getLevelColor(cardLevel)}`}>
                    {cardLevel}
                  </Badge>
                </div>
              </div>

              <div className="col-span-2">
                <div className="text-sm font-medium text-gray-500">Status</div>
                <div className="mt-1">
                  <StatusBadge status={status as any} showEmoji />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardDetailsModal;
