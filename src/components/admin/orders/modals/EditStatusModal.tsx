
import React from "react";
import { Order, PaymentStatus } from "@/types/checkout";
import StatusBadge from "../StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditStatusModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onChangeStatus: (status: PaymentStatus) => void;
}

const EditStatusModal: React.FC<EditStatusModalProps> = ({
  order,
  open,
  onClose,
  onChangeStatus,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Status do Pedido</DialogTitle>
          <DialogDescription>
            Selecione o novo status para este pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-sm text-gray-500 mb-4">
            Status atual: <StatusBadge status={order.status} />
          </div>
          <div className="grid grid-cols-1 gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("PENDING");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Em Análise</span>
                <span className="text-sm text-gray-500">Marca o pedido como pendente de análise.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("CONFIRMED");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Confirmado</span>
                <span className="text-sm text-gray-500">Marca o pedido como confirmado/aprovado.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("RECEIVED" as PaymentStatus);
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium">Recebido</span>
                <span className="text-sm text-gray-500">Marca o pagamento como recebido.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("FAILED");
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-red-600">Falhou</span>
                <span className="text-sm text-gray-500">Marca o pagamento como falho.</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => {
                onChangeStatus("CANCELLED" as PaymentStatus);
                onClose();
              }}
              className="justify-start h-auto py-3"
            >
              <div className="flex flex-col items-start">
                <span className="font-medium text-red-600">Cancelado</span>
                <span className="text-sm text-gray-500">Cancela o pedido.</span>
              </div>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatusModal;
