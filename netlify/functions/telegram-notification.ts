
import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

// Inicializar cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function sendTelegramNotification(message: string) {
  try {
    // Get Telegram bot token from Supabase settings
    const { data: tokenData, error: tokenError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_bot_token')
      .single();

    // Get Telegram chat ID from Supabase settings
    const { data: chatIdData, error: chatIdError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'telegram_chat_id')
      .single();

    if (tokenError || chatIdError) {
      console.error('Telegram configuration not found', { tokenError, chatIdError });
      return false;
    }

    if (!tokenData?.value || !chatIdData?.value) {
      console.warn('Telegram settings are incomplete');
      return false;
    }

    const token = tokenData.value;
    const chat_id = chatIdData.value;

    // Send the notification to Telegram
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id, 
        text: message,
        parse_mode: 'HTML' // Enable HTML formatting
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Failed to send Telegram notification', errorBody);
      return false;
    }
    
    console.log('Telegram notification sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending Telegram notification', error);
    return false;
  }
}

// Handler para permitir testes diretos através de chamadas à função
export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');
    
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required field: message' }),
      };
    }

    const success = await sendTelegramNotification(message);
    
    return {
      statusCode: success ? 200 : 500,
      body: JSON.stringify({
        success,
        message: success ? 'Notification sent successfully' : 'Failed to send notification',
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error', error: String(error) }),
    };
  }
};
