
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { AsaasSettingsFormValues } from '../AsaasSettingsSchema';

interface ApiKeyFieldsProps {
  form: UseFormReturn<AsaasSettingsFormValues>;
}

const ApiKeyFields: React.FC<ApiKeyFieldsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chaves de API</CardTitle>
        <CardDescription>
          Configure as chaves de acesso à API do Asaas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="sandbox_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave Sandbox</FormLabel>
              <FormControl>
                <Input placeholder="$aas_SANDBOX_..." {...field} />
              </FormControl>
              <FormDescription>
                Chave de API para o ambiente de testes
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="production_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave de Produção</FormLabel>
              <FormControl>
                <Input placeholder="$aas_..." {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>
                Chave de API para o ambiente de produção
              </FormDescription>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ApiKeyFields;
