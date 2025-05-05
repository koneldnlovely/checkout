
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AddressData } from '@/types/checkout';
import { useToast } from '@/hooks/use-toast';

export const useCepSearch = (form: UseFormReturn<AddressData>) => {
  const { toast } = useToast();
  const [isSearchingCep, setIsSearchingCep] = useState(false);
  
  const handleCepSearch = async (cep: string) => {
    if (cep.length < 8) return;
    
    // Remove non-numeric characters
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) return;
    
    try {
      setIsSearchingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      
      if (!response.ok) {
        throw new Error('CEP não encontrado');
      }
      
      const data = await response.json();
      
      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado",
          variant: "destructive",
        });
        return;
      }
      
      // Update form fields with the address data
      form.setValue('street', data.logradouro);
      form.setValue('neighborhood', data.bairro);
      form.setValue('city', data.localidade);
      form.setValue('state', data.uf);
      
      // Focus on the number field after filling the address
      setTimeout(() => {
        document.getElementById('number')?.focus();
      }, 100);
      
    } catch (error) {
      toast({
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço. Preencha manualmente.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingCep(false);
    }
  };
  
  return {
    isSearchingCep,
    handleCepSearch
  };
};
