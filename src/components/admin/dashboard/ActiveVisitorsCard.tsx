
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Banknote } from "lucide-react";
import { useCheckoutPresence } from '@/hooks/useCheckoutPresence';

const ActiveVisitorsCard = () => {
  const { visitorCount } = useCheckoutPresence();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Visitantes Ativos</CardTitle>
        <CardDescription>
          Visitantes no checkout agora
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Users className="h-4 w-4 text-muted-foreground mr-2" />
          <span className="text-2xl font-bold">{visitorCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveVisitorsCard;
