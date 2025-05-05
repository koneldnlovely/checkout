import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { handleCpfCnpjChange, handlePhoneChange, handleCepChange } from '@/utils/formatters';

const businessSchema = z.object({
  name: z.string().min(2, 'Nome da empresa é obrigatório'),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado inválido'),
  zipCode: z.string().min(8, 'CEP inválido'),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

const BusinessRegistration = () => {
  const { toast } = useToast();
  
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const onSubmit = (data: BusinessFormValues) => {
    console.log(data);
    toast({
      title: "Cadastro realizado",
      description: "Seus dados foram enviados com sucesso!",
    });
  };

  return (
    <CheckoutContainer>
      <div className="max-w-3xl mx-auto py-8">
        <Card className="bg-white/10 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Cadastro Empresarial</CardTitle>
            <CardDescription className="text-gray-300">
              Preencha os dados da sua empresa para continuar
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Nome da Empresa</label>
                    <Input
                      {...form.register('name')}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Nome da sua empresa"
                    />
                    {form.formState.errors.name && (
                      <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">CNPJ</label>
                    <Input
                      {...form.register('cnpj', {
                        onChange: (e) => handleCpfCnpjChange(e, form.setValue.bind(null, 'cnpj'))
                      })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                    />
                    {form.formState.errors.cnpj && (
                      <p className="text-red-500 text-xs">{form.formState.errors.cnpj.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Email</label>
                    <Input
                      {...form.register('email')}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="email@empresa.com"
                      type="email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Telefone</label>
                    <Input
                      {...form.register('phone', {
                        onChange: (e) => handlePhoneChange(e, form.setValue.bind(null, 'phone'))
                      })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                    />
                    {form.formState.errors.phone && (
                      <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm text-gray-300">Endereço</label>
                    <Input
                      {...form.register('address')}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Rua, número, complemento"
                    />
                    {form.formState.errors.address && (
                      <p className="text-red-500 text-xs">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Cidade</label>
                    <Input
                      {...form.register('city')}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Sua cidade"
                    />
                    {form.formState.errors.city && (
                      <p className="text-red-500 text-xs">{form.formState.errors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">Estado</label>
                      <Input
                        {...form.register('state')}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="UF"
                        maxLength={2}
                      />
                      {form.formState.errors.state && (
                        <p className="text-red-500 text-xs">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm text-gray-300">CEP</label>
                      <Input
                        {...form.register('zipCode', {
                          onChange: (e) => handleCepChange(e, form.setValue.bind(null, 'zipCode'))
                        })}
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="00000-000"
                        maxLength={9}
                      />
                      {form.formState.errors.zipCode && (
                        <p className="text-red-500 text-xs">{form.formState.errors.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Cadastrar Empresa
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
            <p className="text-xs text-gray-400">
              Seus dados estão protegidos de acordo com nossa Política de Privacidade
            </p>
          </CardFooter>
        </Card>
      </div>
    </CheckoutContainer>
  );
};

export default BusinessRegistration;
