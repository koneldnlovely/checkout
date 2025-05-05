
import React, { useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSmtpStatus } from '@/hooks/admin/useSmtpStatus';
import { AlertCircle, CheckCircle, Mail } from 'lucide-react';

export const SmtpStatusAlert: React.FC = () => {
  const { configured, message, loading, testEmail } = useSmtpStatus();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendTest = async () => {
    if (!email || !email.includes('@')) {
      return;
    }
    
    setIsSending(true);
    await testEmail(email);
    setIsSending(false);
  };

  if (loading) {
    return (
      <Alert className="bg-blue-50 border-blue-200 my-4">
        <AlertCircle className="text-blue-500" />
        <AlertTitle>Verificando configuração de notificações</AlertTitle>
        <AlertDescription>
          Aguarde enquanto verificamos a configuração de SMTP...
        </AlertDescription>
      </Alert>
    );
  }

  if (!configured) {
    return (
      <Alert className="bg-amber-50 border-amber-200 my-4">
        <AlertCircle className="text-amber-500" />
        <AlertTitle>Atenção: Configuração de Email Incompleta</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>{message}</p>
          <p className="text-sm text-gray-600">
            Para ativar notificações por email, configure as seguintes variáveis de ambiente no seu painel do Netlify:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>SMTP_HOST - Servidor SMTP (ex: smtp.gmail.com)</li>
            <li>SMTP_PORT - Porta do servidor (ex: 587)</li>
            <li>SMTP_SECURE - Use 'true' para SSL/TLS</li>
            <li>SMTP_USER - Email de login</li>
            <li>SMTP_PASS - Senha ou chave de app</li>
            <li>SMTP_FROM - Email de origem (opcional)</li>
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="bg-green-50 border-green-200 my-4">
      <CheckCircle className="text-green-500" />
      <AlertTitle>Notificações por Email Configuradas</AlertTitle>
      <AlertDescription className="space-y-3">
        <p>{message}</p>
        
        <div className="flex items-end gap-2 mt-2">
          <div className="flex-1">
            <p className="text-sm mb-1 text-gray-600">Enviar email de teste:</p>
            <Input
              type="email"
              placeholder="Digite um email para teste"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSendTest} 
            disabled={!email || !email.includes('@') || isSending}
            size="sm"
            variant="outline"
          >
            {isSending ? 'Enviando...' : 'Enviar teste'}
            <Mail className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
