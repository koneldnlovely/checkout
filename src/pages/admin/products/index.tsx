
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types/checkout';
import ProductList from './ProductList';
import { fetchProducts, handleDeleteProduct } from '@/services/productAdminService';
import { LoadingState } from '@/components/shared/LoadingState';

const ProductsPage = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productTypeTab, setProductTypeTab] = useState<'all' | 'digital' | 'physical'>('all');

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    await handleDeleteProduct(productToDelete, () => {
      refetch();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    });
  };

  // Filtrar produtos com base na aba selecionada
  const filteredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    switch (productTypeTab) {
      case 'digital':
        return products.filter((product: Product) => product.type === 'digital');
      case 'physical':
        return products.filter((product: Product) => product.type === 'physical');
      default:
        return products;
    }
  }, [products, productTypeTab]);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 className="text-red-600 font-medium">Erro ao carregar produtos</h2>
          <p className="text-red-500">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="all" 
            className="w-full" 
            onValueChange={(value) => setProductTypeTab(value as 'all' | 'digital' | 'physical')}
          >
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="digital">Digitais</TabsTrigger>
              <TabsTrigger value="physical">Físicos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <ProductList 
                products={filteredProducts} 
                isLoading={isLoading} 
                onDeleteClick={handleDeleteClick} 
              />
            </TabsContent>
            
            <TabsContent value="digital">
              <ProductList 
                products={filteredProducts} 
                isLoading={isLoading} 
                onDeleteClick={handleDeleteClick} 
              />
            </TabsContent>
            
            <TabsContent value="physical">
              <ProductList 
                products={filteredProducts} 
                isLoading={isLoading} 
                onDeleteClick={handleDeleteClick} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o produto "{productToDelete?.name}"? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsPage;
