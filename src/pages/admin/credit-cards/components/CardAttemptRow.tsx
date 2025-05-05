
import React from 'react';
import { Order } from '@/types/checkout';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import CardStatusBadge from './CardStatusBadge';
import CardHolderInfo from './CardHolderInfo';
import { getCardLevelDetails } from '@/utils/cardUtils';
import { Badge } from '@/components/ui/badge';

interface CardAttemptRowProps {
  order: Order;
  onViewDetails: () => void;
  onDeleteCard: () => void;
}

const CardAttemptRow: React.FC<CardAttemptRowProps> = ({ 
  order, 
  onViewDetails, 
  onDeleteCard 
}) => {
  const { toast } = useToast();
  
  // Formats card number to display only last 5 digits
  const formatCardNumber = (number?: string) => {
    if (!number) return '•••• ••••';
    const lastDigits = number.slice(-5);
    return `•••• ${lastDigits}`;
  };

  const copyCardNumber = (number?: string) => {
    if (!number) return;
    navigator.clipboard.writeText(number);
    toast({
      title: "Copiado com sucesso",
      description: "O número do cartão foi copiado para a área de transferência",
    });
  };

  const levelDetails = order.cardData?.bin 
    ? getCardLevelDetails(order.cardData.bin, order.cardData.brand)
    : null;

  return (
    <TableRow className="group hover:bg-muted/50">
      <TableCell>
        <Badge 
          variant="outline" 
          className={`${levelDetails?.color || 'text-slate-500'} bg-white`}
        >
          {order.cardData?.bin || '-'}
        </Badge>
      </TableCell>
      
      <TableCell>
        <CardHolderInfo 
          holderName={order.cardData?.holderName} 
          brand={order.cardData?.brand} 
          maskedNumber={formatCardNumber(order.cardData?.number)} 
        />
      </TableCell>
      
      <TableCell>{order.cardData?.expiryDate || '-'}</TableCell>
      
      <TableCell>
        <CardStatusBadge status={order.status} />
      </TableCell>
      
      <TableCell>
        {order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') : '-'}
      </TableCell>
      
      <TableCell className="w-24">
        <div className="flex items-center space-x-2 opacity-70 group-hover:opacity-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onViewDetails}
                  className="h-8 w-8"
                >
                  <Eye className="h-4 w-4 text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ver detalhes do cartão</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => order.cardData?.number && copyCardNumber(order.cardData.number)}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4 text-slate-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copiar número do cartão</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={onDeleteCard}
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Excluir cartão</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CardAttemptRow;
