
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SmtpStatus {
  configured: boolean;
  message: string;
  loading: boolean;
  testEmail: (email: string) => Promise<boolean>;
}

export function useSmtpStatus(): SmtpStatus {
  const [configured, setConfigured] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('Verificando configuração SMTP...');
  const { toast } = useToast();

  useEffect(() => {
    checkSmtpStatus();
  }, []);

  const checkSmtpStatus = async () => {
    try {
      setLoading(true);
      
      // Enviar uma requisição para verificar o status do SMTP sem enviar email
      const response = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'test@example.com',
          subject: 'Teste de Configuração SMTP',
          message: '<p>Este é um teste da configuração SMTP.</p>',
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setConfigured(true);
        setMessage('Configuração SMTP está ativa.');
      } else if (data.smtp_configured === false) {
        setConfigured(false);
        setMessage('Configuração SMTP incompleta. Configure as variáveis de ambiente SMTP_HOST, SMTP_USER e SMTP_PASS no Netlify.');
      } else {
        setConfigured(false);
        setMessage(`Erro na configuração SMTP: ${data.message || 'Erro desconhecido'}`);
      }
    } catch (error) {
      setConfigured(false);
      setMessage('Erro ao verificar configuração SMTP. Verifique as variáveis de ambiente.');
      console.error('Erro ao verificar status SMTP:', error);
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const response = await fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          subject: 'Teste de Email - Configuração SMTP',
          message: `
            <h2>Teste de Email</h2>
            <p>Este é um email de teste para verificar se a configuração SMTP está funcionando corretamente.</p>
            <p>Se você está recebendo este email, a configuração está funcionando!</p>
            <p>Data e hora do teste: ${new Date().toLocaleString('pt-BR')}</p>
          `,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: "Email enviado com sucesso",
          description: `Um email de teste foi enviado para ${email}`,
        });
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Falha ao enviar email",
          description: data.message || "Erro desconhecido ao enviar email",
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao enviar email de teste:', error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar email",
        description: "Ocorreu um erro ao tentar enviar o email de teste",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    configured,
    message,
    loading,
    testEmail
  };
}
