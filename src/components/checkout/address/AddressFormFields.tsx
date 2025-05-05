
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { AddressData } from '@/types/checkout';

interface AddressFormFieldsProps {
  form: UseFormReturn<AddressData>;
}

export const AddressFormFields: React.FC<AddressFormFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="street"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Rua</FormLabel>
            <FormControl>
              <Input placeholder="Nome da rua" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="number"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Número</FormLabel>
            <FormControl>
              <Input id="number" placeholder="Número" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="complement"
        render={({ field }) => (
          <FormItem className="col-span-1">
            <FormLabel>Complemento</FormLabel>
            <FormControl>
              <Input placeholder="Complemento" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Bairro</FormLabel>
            <FormControl>
              <Input placeholder="Bairro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Cidade</FormLabel>
            <FormControl>
              <Input placeholder="Cidade" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Estado</FormLabel>
            <FormControl>
              <Input placeholder="UF" maxLength={2} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
