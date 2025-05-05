
import React from 'react';
import { ProductForm } from './ProductForm';
import { useProductEdit } from './hooks/useProductEdit';
import ProductLoadingState from './components/ProductLoadingState';
import ProductErrorState from './components/ProductErrorState';

const EditProductPage = () => {
  const { form, isLoading, error, onSubmit, isSubmitting } = useProductEdit();

  if (isLoading) {
    return <ProductLoadingState />;
  }

  if (error) {
    return <ProductErrorState error={error} />;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm 
        form={form} 
        onSubmit={onSubmit} 
        isSubmitting={isSubmitting}
        isEditing={true}
      />
    </div>
  );
};

export default EditProductPage;
