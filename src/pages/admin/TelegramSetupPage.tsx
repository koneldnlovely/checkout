
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, Save, Loader2 } from 'lucide-react';

const TelegramSetupPage: React.FC = () => {
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch existing settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Get Bot Token
        const { data: tokenData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'telegram_bot_token')
          .single();
        
        // Get Chat ID
        const { data: chatIdData } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'telegram_chat_id')
          .single();
        
        if (tokenData) {
          setBotToken(tokenData.value);
        }
        
        if (chatIdData) {
          setChatId(chatIdData.value);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const saveTelegramSettings = async () => {
    try {
      setLoading(true);

      // Validate inputs
      if (!botToken.trim()) {
        toast.error('Por favor, insira o Bot Token do Telegram');
        return;
      }
      
      if (!chatId.trim()) {
        toast.error('Por favor, insira o Chat ID do Telegram');
        return;
      }

      // Save Bot Token
      const { error: tokenError } = await supabase
        .from('settings')
        .upsert({ key: 'telegram_bot_token', value: botToken }, { onConflict: 'key' });

      if (tokenError) throw tokenError;

      // Save Chat ID  
      const { error: chatIdError } = await supabase
        .from('settings')
        .upsert({ key: 'telegram_chat_id', value: chatId }, { onConflict: 'key' });

      if (chatIdError) throw chatIdError;

      toast.success('Configurações do Telegram salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações do Telegram');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Send className="mr-2" /> Configuração do Telegram
      </h1>

      <Accordion type="single" collapsible defaultValue="telegram-setup">
        <AccordionItem value="telegram-setup">
          <AccordionTrigger>Como configurar o Bot do Telegram</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>1. Acesse <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">@BotFather</a> no Telegram</p>
              <p>2. Use o comando /newbot para criar um bot</p>
              <p>3. Escolha um nome e username para o bot</p>
              <p>4. Copie o Token de Acesso gerado</p>
              <p>5. Envie uma mensagem para seu bot no Telegram</p>
              <p>6. Acesse <code>https://api.telegram.org/bot&lt;SEU_TOKEN&gt;/getUpdates</code> no navegador</p>
              <p>7. Copie o número de chat_id da resposta</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Telegram</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="botToken">Bot Token</Label>
            <Input 
              id="botToken"
              placeholder="Digite o token do seu Bot Telegram"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="chatId">Chat ID</Label>
            <Input 
              id="chatId"
              placeholder="Digite o Chat ID"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
            />
          </div>
          <Button 
            onClick={saveTelegramSettings}
            disabled={loading || (!botToken && !chatId)}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TelegramSetupPage;
