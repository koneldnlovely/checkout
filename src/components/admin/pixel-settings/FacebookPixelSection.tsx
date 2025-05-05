
import React from 'react';
import { Facebook, Plus, Trash2 } from 'lucide-react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { PixelConfigFormValues } from '@/pages/admin/PixelSettingsSchema';

interface FacebookPixelSectionProps {
  form: UseFormReturn<PixelConfigFormValues>;
  onAddPixel: () => void;
  onRemovePixel: (index: number) => void;
}

export const FacebookPixelSection: React.FC<FacebookPixelSectionProps> = ({ 
  form, 
  onAddPixel,
  onRemovePixel
}) => {
  const facebookPixels = form.watch('facebookPixels') || [];
  const hasMultiplePixels = facebookPixels.length > 1;

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Facebook className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-medium">Facebook Pixel</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddPixel}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Adicionar Pixel
        </Button>
      </div>
      <Separator className="my-4" />
      
      {facebookPixels.map((_, index) => (
        <div key={index} className="space-y-4 mb-6">
          {index > 0 && <Separator className="my-6" />}
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm text-gray-500">Pixel {index + 1}</h4>
            {hasMultiplePixels && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onRemovePixel(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Remover
              </Button>
            )}
          </div>
          
          <FormField
            control={form.control}
            name={`facebookPixels.${index}.enabled`}
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
          
          <FormField
            control={form.control}
            name={`facebookPixels.${index}.facebookPixelId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID do Facebook Pixel</FormLabel>
                <FormControl>
                  <Input placeholder="Exemplo: 123456789012345" {...field} />
                </FormControl>
                <FormDescription>
                  O ID do Facebook Pixel é um número de 15 dígitos.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name={`facebookPixels.${index}.facebookToken`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token de Acesso</FormLabel>
                <FormControl>
                  <Input placeholder="Exemplo: EAAxxxxxxxxxxxxx" {...field} />
                </FormControl>
                <FormDescription>
                  O token de acesso do Facebook é usado para autenticação avançada com o Facebook Pixel.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
};
