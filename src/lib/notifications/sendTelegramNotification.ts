
import { supabase } from '@/integrations/supabase/client';

export async function sendTelegramNotification(message: string) {
  try {
    console.log('[AUDIT] Sending Telegram notification:', message.substring(0, 50) + '...');
    
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
      console.error('[AUDIT] Telegram configuration not found', { tokenError, chatIdError });
      return;
    }

    if (!tokenData || !chatIdData || !tokenData.value || !chatIdData.value) {
      console.warn('[AUDIT] Telegram settings are incomplete or not configured');
      return;
    }

    const token = tokenData.value;
    const chat_id = chatIdData.value;

    console.log('[AUDIT] Telegram settings found:', { 
      hasToken: !!token, 
      hasChatId: !!chat_id,
      tokenLength: token ? token.length : 0,
      chatIdLength: chat_id ? chat_id.length : 0
    });

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
      console.error('[AUDIT] Failed to send Telegram notification', errorBody);
    } else {
      console.log('[AUDIT] Telegram notification sent successfully');
    }
  } catch (error) {
    console.error('[AUDIT] Error sending Telegram notification', error);
  }
}
