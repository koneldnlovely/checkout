
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from '../../ProductSchema';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

interface StatusSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const StatusSection: React.FC<StatusSectionProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              Produto Ativo
            </FormLabel>
            <FormDescription>
              Ative para disponibilizar o produto para venda
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
  );
};

export default StatusSection;
