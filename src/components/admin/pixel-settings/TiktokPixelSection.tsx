
import React from 'react';
import { Music } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { UseFormReturn } from 'react-hook-form';
import { PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

interface TiktokPixelSectionProps {
  form: UseFormReturn<PixelConfigFormValues>;
}

export const TiktokPixelSection: React.FC<TiktokPixelSectionProps> = ({ form }) => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-black" />
          <h3 className="text-lg font-medium">TikTok Pixel</h3>
        </div>
        <FormField
          control={form.control}
          name="tiktokPixel.enabled"
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
          name="tiktokPixel.tiktokPixelId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID do TikTok Pixel</FormLabel>
              <FormControl>
                <Input placeholder="Exemplo: CXXXXXX" {...field} />
              </FormControl>
              <FormDescription>
                O ID do TikTok Pixel para rastreamento de conversões.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
