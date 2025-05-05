
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AddressData } from '@/types/checkout';
import { handleCepChange } from '@/utils/formatters';

interface CepSearchProps {
  form: UseFormReturn<AddressData>;
  isSearching: boolean;
  onSearch: (cep: string) => Promise<void>;
}

export const CepSearch: React.FC<CepSearchProps> = ({ form, isSearching, onSearch }) => {
  return (
    <FormField
      control={form.control}
      name="cep"
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem className="col-span-2 sm:col-span-1">
          <FormLabel>CEP</FormLabel>
          <FormControl>
            <Input 
              placeholder="00000-000" 
              value={value}
              {...rest}
              onChange={(e) => {
                handleCepChange(e, onChange);
                if (e.target.value.replace(/\D/g, '').length >= 8) {
                  onSearch(e.target.value);
                }
              }}
              disabled={isSearching}
              maxLength={9}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
