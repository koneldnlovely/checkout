
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SmtpStatusAlert } from '@/components/admin/SmtpStatusAlert';

const SummaryNotificationStatus: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status de Notificações</CardTitle>
        <CardDescription>
          Verifique a configuração do sistema de notificações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SmtpStatusAlert />
      </CardContent>
      <CardFooter className="text-sm text-gray-500">
        As notificações são utilizadas para alertar sobre novos pagamentos e outras atividades importantes.
      </CardFooter>
    </Card>
  );
};

export default SummaryNotificationStatus;
