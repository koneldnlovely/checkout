
import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

// Configurar transporte de email usando variáveis de ambiente
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  if (!host || !user || !pass) {
    console.warn('Configuração de SMTP incompleta. Host, usuário ou senha ausentes.');
    return null;
  }
  
  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

interface NotificationRequest {
  to: string;
  subject: string;
  message: string;
}

export const handler: Handler = async (event) => {
  // Garantir que apenas solicitações POST sejam processadas
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Método não permitido' }),
    };
  }

  try {
    // Criar transporter apenas quando necessário
    const transporter = createTransporter();
    
    // Verificar se as credenciais de email estão configuradas
    if (!transporter) {
      console.warn('Transporter não criado. Notificação não enviada.');
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: 'Configuração de SMTP incompleta',
          smtp_configured: false
        }),
      };
    }

    // Parsear o corpo da requisição
    const { to, subject, message }: NotificationRequest = JSON.parse(event.body || '{}');
    
    if (!to || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Campos obrigatórios ausentes' }),
      };
    }

    // Enviar o email
    const mailOptions = {
      from: process.env.SMTP_FROM || 'notifications@example.com',
      to,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email enviado com sucesso para: ${to}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Notificação enviada com sucesso',
        success: true 
      }),
    };
  } catch (error) {
    console.error('Erro ao enviar notificação:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Erro ao enviar notificação',
        error: error instanceof Error ? error.message : 'Erro desconhecido',
        success: false
      }),
    };
  }
};
