
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '@/types/checkout';
import ProductItem from './ProductItem';

interface ProductListProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onDeleteClick: (product: Product) => void;
}

const ProductList = ({ products, isLoading, onDeleteClick }: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md">
        <p className="text-muted-foreground">Nenhum produto cadastrado</p>
        <Button asChild className="mt-4">
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[150px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductItem 
            key={product.id} 
            product={product} 
            onDeleteClick={onDeleteClick} 
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductList;
