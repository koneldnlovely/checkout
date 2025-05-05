
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Order } from '@/types/checkout';
import ViewFullCardModal from './components/ViewFullCardModal';
import CardAttemptRow from './components/CardAttemptRow';

interface CreditCardsListProps {
  orders: Order[];
  onDeleteCard: (orderId: string) => void;
}

const CreditCardsList: React.FC<CreditCardsListProps> = ({ orders, onDeleteCard }) => {
  const [selectedCard, setSelectedCard] = useState<Order | null>(null);
  
  // Limit displayed records to 100 for performance
  const displayedOrders = orders.slice(0, 100);
  
  if (displayedOrders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum cartão encontrado.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>BIN</TableHead>
              <TableHead>Cartão / Titular</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data da Tentativa</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedOrders.map((order) => (
              <CardAttemptRow 
                key={order.id}
                order={order}
                onViewDetails={() => setSelectedCard(order)}
                onDeleteCard={() => onDeleteCard(order.id || '')}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      {orders.length > 100 && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          Exibindo os 100 registros mais recentes. {orders.length - 100} registros adicionais não exibidos.
        </div>
      )}
      
      {selectedCard && (
        <ViewFullCardModal 
          card={selectedCard.cardData} 
          isOpen={!!selectedCard} 
          onClose={() => setSelectedCard(null)}
          status={selectedCard.status}
        />
      )}
    </>
  );
};

export default CreditCardsList;
