
import React from 'react';
import { ProductForm } from './ProductForm';
import { useProductCreate } from './hooks/useProductCreate';

const NewProductPage = () => {
  const { form, onSubmit, isSubmitting } = useProductCreate();

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      <ProductForm 
        form={form} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default NewProductPage;
