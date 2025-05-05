
import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

interface TaboolaPixelSectionProps {
  form: UseFormReturn<PixelConfigFormValues>;
}

export const TaboolaPixelSection: React.FC<TaboolaPixelSectionProps> = ({ form }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-medium">Taboola Pixel</h3>
        </div>
        <FormField
          control={form.control}
          name="taboolaPixel.enabled"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormLabel>Ativo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <Separator className="my-4" />
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="taboolaPixel.taboolaAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID da Conta Taboola</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: tb_12345" {...field} />
              </FormControl>
              <FormDescription>
                O ID da conta do Taboola para rastreamento de conversões.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
