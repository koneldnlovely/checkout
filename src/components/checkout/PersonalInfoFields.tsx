
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { handleCpfCnpjChange, handlePhoneChange } from '@/utils/formatters';
import { Control } from 'react-hook-form';
import { CustomerData } from '@/types/checkout';

interface PersonalInfoFieldsProps {
  control: Control<CustomerData>;
}

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ control }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Nome completo</FormLabel>
            <FormControl>
              <Input 
                placeholder="Seu nome completo" 
                {...field} 
                className="border-gray-300 focus:border-primary" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-gray-700">E-mail</FormLabel>
            <FormControl>
              <Input 
                placeholder="Seu e-mail" 
                type="email" 
                {...field} 
                className="border-gray-300 focus:border-primary" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="cpfCnpj"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel className="text-gray-700">CPF/CNPJ</FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite seu CPF" 
                value={value}
                {...rest} 
                onChange={(e) => handleCpfCnpjChange(e, onChange)}
                maxLength={18} 
                className="border-gray-300 focus:border-primary" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="phone"
        render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel className="text-gray-700">Celular</FormLabel>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                +55
              </span>
              <FormControl>
                <Input 
                  placeholder="(00) 00000-0000" 
                  value={value}
                  {...rest} 
                  onChange={(e) => handlePhoneChange(e, onChange)}
                  maxLength={15} 
                  className="border-gray-300 focus:border-primary rounded-l-none" 
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
