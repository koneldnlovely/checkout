
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../ProductSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface ImageSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const ImageSection: React.FC<ImageSectionProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Imagem do Produto</FormLabel>
            <FormControl>
              <Input
                placeholder="https://exemplo.com/imagem.jpg"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Forneça a URL de uma imagem para o produto
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="banner_image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Imagem do Banner</FormLabel>
            <FormControl>
              <Input
                placeholder="https://exemplo.com/banner.jpg"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Banner personalizado para este produto (opcional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ImageSection;
