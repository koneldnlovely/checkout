
import React, { useRef } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { SectionTitle } from './SectionTitle';
import { CustomerData } from '@/types/checkout';
import { PersonalInfoFields } from './PersonalInfoFields';
import { useCustomerFormValidation } from '@/hooks/useCustomerFormValidation';

const customerSchema = z.object({
  name: z.string().min(3, { message: 'Nome completo é obrigatório (mínimo 3 caracteres)' }),
  email: z.string().email({ message: 'Email inválido' }),
  cpfCnpj: z.string().min(11, { message: 'CPF/CNPJ deve ter no mínimo 11 dígitos' }),
  phone: z.string().min(10, { message: 'Telefone deve ter no mínimo 10 dígitos' }),
});

interface PersonalInfoSectionProps {
  onSubmit: (data: CustomerData) => void;
  headingColor?: string;
  formRef?: React.RefObject<HTMLFormElement>;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  onSubmit, 
  headingColor = '#000000',
  formRef: externalFormRef
}) => {
  const internalFormRef = useRef<HTMLFormElement>(null);
  const formRef = externalFormRef || internalFormRef;
  
  const form = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      cpfCnpj: '',
      phone: '',
    },
    mode: 'onChange'
  });

  // Use custom hook for form validation and submission
  useCustomerFormValidation(form, onSubmit);

  return (
    <div id="personal-info-section" className="mb-6 bg-white rounded-lg p-4 md:p-6 border shadow-sm">
      <SectionTitle number={1} title="Identificação" />
      
      <Form {...form}>
        <form 
          ref={formRef} 
          onSubmit={(e) => e.preventDefault()} 
          className="space-y-4 mt-4"
        >
          <PersonalInfoFields control={form.control} />
        </form>
      </Form>
    </div>
  );
};
