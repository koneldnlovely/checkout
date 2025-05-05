
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { AsaasSettingsFormValues } from '../AsaasSettingsSchema';

interface NetlifyToggleProps {
  form: UseFormReturn<AsaasSettingsFormValues>;
}

const NetlifyToggle: React.FC<NetlifyToggleProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integração Netlify</CardTitle>
        <CardDescription>
          Configure o uso das funções Netlify para processamento de pagamentos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="use_netlify_functions"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Usar Funções Netlify</FormLabel>
                <FormDescription>
                  Ative para usar funções Netlify no processamento de pagamentos PIX
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

export default NetlifyToggle;
