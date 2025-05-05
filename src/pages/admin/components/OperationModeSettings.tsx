
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { AsaasSettingsFormValues } from '../AsaasSettingsSchema';

interface OperationModeSettingsProps {
  form: UseFormReturn<AsaasSettingsFormValues>;
}

const OperationModeSettings: React.FC<OperationModeSettingsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modo de Operação</CardTitle>
        <CardDescription>
          Configure o ambiente e ative/desative a integração
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="sandbox"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Modo Sandbox</FormLabel>
                <FormDescription>
                  Ative para usar o ambiente de testes do Asaas
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Integração Ativa</FormLabel>
                <FormDescription>
                  Ative para habilitar a integração com o Asaas
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default OperationModeSettings;
