
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Banknote } from "lucide-react";

interface PaymentMethodCountCardProps {
  title: string;
  count: number;
  type: 'pix' | 'creditCard';
  description?: string;
}

const PaymentMethodCountCard = ({ title, count, type, description }: PaymentMethodCountCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <CardDescription>
          {description || 'Total no período selecionado'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          {type === 'pix' ? (
            <Banknote className="h-4 w-4 text-green-500 mr-2" />
          ) : (
            <CreditCard className="h-4 w-4 text-purple-500 mr-2" />
          )}
          <span className="text-2xl font-bold">{count}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodCountCard;
