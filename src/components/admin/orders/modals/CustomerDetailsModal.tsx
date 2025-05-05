
import React from "react";
import { Order } from "@/types/checkout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CustomerDetailsModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  order,
  open,
  onClose,
}) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Dados do Cliente</DialogTitle>
          <DialogDescription>
            Informações detalhadas do cliente do pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Nome:</div>
            <div className="col-span-2">{order.customerName}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Email:</div>
            <div className="col-span-2">{order.customerEmail}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">CPF/CNPJ:</div>
            <div className="col-span-2">{order.customerCpfCnpj}</div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="font-medium text-gray-500">Telefone:</div>
            <div className="col-span-2">{order.customerPhone}</div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;
