
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleteAll: boolean;
  paymentMethod?: "pix" | "creditCard";
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  open,
  onClose,
  onConfirm,
  isDeleteAll,
  paymentMethod,
}) => {
  const methodName = paymentMethod === "pix" ? "PIX" : "Cartão de Crédito";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeleteAll 
              ? `Excluir todos os pedidos de ${methodName}?` 
              : "Excluir pedido?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDeleteAll
              ? `Esta ação irá excluir permanentemente todos os pedidos de ${methodName}. Essa ação não pode ser desfeita.`
              : "Esta ação irá excluir permanentemente este pedido. Essa ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDeleteModal;
