
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import PaymentDetailsModal from "./PaymentDetailsModal";
import { Order } from "@/types/checkout";

const TestPaymentModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Sample credit card order data with enhanced BIN information
  const sampleOrder: Order = {
    id: "sample-123",
    customerId: "cus_123",
    customerName: "João Silva",
    customerEmail: "joao@example.com",
    customerCpfCnpj: "123.456.789-00",
    customerPhone: "(11) 99999-9999",
    productId: "prod_123",
    productName: "Curso Premium",
    productPrice: 299.90,
    status: "CONFIRMED",
    paymentMethod: "creditCard",
    asaasPaymentId: "pay_123456789",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cardData: {
      holderName: "JOAO S SILVA",
      number: "4111 1111 1111 1111",
      expiryDate: "12/25",
      cvv: "123",
      bin: "411111",
      brand: "visa"
    }
  };
  
  return (
    <div className="p-4 border rounded-md shadow-sm">
      <h3 className="mb-4 font-medium">Testar Modal de Cartão de Crédito</h3>
      <p className="text-sm text-gray-600 mb-4">
        Clique no botão abaixo para visualizar um exemplo de modal com dados completos de cartão de crédito:
      </p>
      
      <Button 
        onClick={() => setShowModal(true)}
        className="flex items-center"
      >
        <CreditCard className="mr-2 h-4 w-4" />
        Ver Dados do Cartão
      </Button>
      
      <PaymentDetailsModal
        order={sampleOrder}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default TestPaymentModal;
