
import React from 'react';
import { CheckCircle, XCircle, ExternalLink, ShoppingCart } from 'lucide-react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Product } from '@/types/checkout';
import { formatCurrency } from '@/utils/formatters';
import ProductActions from './ProductActions';
import { Button } from '@/components/ui/button';

interface ProductItemProps {
  product: Product;
  onDeleteClick: (product: Product) => void;
}

const ProductItem = ({ product, onDeleteClick }: ProductItemProps) => {
  // Create checkout URL using the product slug
  const checkoutUrl = `/checkout/${product.slug}`;
  
  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>{formatCurrency(product.price)}</TableCell>
      <TableCell>
        {product.type === 'digital' || product.isDigital ? 'Digital' : 'Físico'}
      </TableCell>
      <TableCell>
        {product.status !== false ? (
          <span className="flex items-center text-green-600">
            <CheckCircle className="mr-1 h-4 w-4" />
            Ativo
          </span>
        ) : (
          <span className="flex items-center text-red-600">
            <XCircle className="mr-1 h-4 w-4" />
            Inativo
          </span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Ver checkout</span>
            </a>
          </Button>
          <ProductActions product={product} onDeleteClick={onDeleteClick} />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductItem;
