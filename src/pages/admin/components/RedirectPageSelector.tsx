
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { AsaasSettingsFormValues } from '../AsaasSettingsSchema';

interface RedirectPageSelectorProps {
  form: UseFormReturn<AsaasSettingsFormValues>;
}

// Lista de opções de redirecionamento centralizada
export const MANUAL_REDIRECT_OPTIONS = [
  { value: '/success', label: '✅ Pagamento Concluído' },
  { value: '/payment-pending', label: '⏳ Pagamento Pendente' },
  { value: '/failed', label: '❌ Pagamento Falhou' },
  { value: '/retry-payment', label: '🔄 Pagamento Falhou (Com Retry)' },
  { value: '/payment-analysis', label: '🔍 Pagamento em Análise' },
  { value: '/thank-you-card', label: '🙏 Agradecimento (Cartão)' },
] as const;

const RedirectPageSelector: React.FC<RedirectPageSelectorProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Redirecionamento Manual de Cartão</CardTitle>
        <CardDescription>
          Configure a página de redirecionamento após pagamentos com cartão
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="manual_card_redirect_page"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Página de Redirecionamento para Cartão</FormLabel>
              <Select 
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a página de redirecionamento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MANUAL_REDIRECT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Escolha para onde os clientes serão redirecionados após o pagamento com cartão
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default RedirectPageSelector;
