
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../ProductSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface WhatsAppSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const WhatsAppSection: React.FC<WhatsAppSectionProps> = ({ form }) => {
  const hasWhatsappSupport = form.watch('has_whatsapp_support');
  
  return (
    <>
      <FormField
        control={form.control}
        name="has_whatsapp_support"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Suporte via WhatsApp
              </FormLabel>
              <FormDescription>
                Ative para disponibilizar botão de contato via WhatsApp na página de sucesso
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

      {hasWhatsappSupport && (
        <FormField
          control={form.control}
          name="whatsapp_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do WhatsApp</FormLabel>
              <FormControl>
                <Input
                  placeholder="5511999999999"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Digite o número completo com código do país e DDD (ex: 5511999999999)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default WhatsAppSection;
