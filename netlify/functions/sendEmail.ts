import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const result = await resend.emails.send({
      from: 'noreply@resend.dev', // pode usar esse padrão no início
      to,
      subject,
      html,
    });

    console.log('[sendEmail] E-mail enviado:', result);
  } catch (error) {
    console.error('[sendEmail] Erro ao enviar e-mail:', error);
  }
}
