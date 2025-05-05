
import React from 'react';
import { Sparkles } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

interface OutbrainPixelSectionProps {
  form: UseFormReturn<PixelConfigFormValues>;
}

export const OutbrainPixelSection: React.FC<OutbrainPixelSectionProps> = ({ form }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-medium">Outbrain Pixel</h3>
        </div>
        <FormField
          control={form.control}
          name="outbrainPixel.enabled"
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
          name="outbrainPixel.outbrainPixelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do Outbrain Pixel</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: OB12345" {...field} />
              </FormControl>
              <FormDescription>
                O ID do Outbrain Pixel para rastreamento de conversões.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
