
import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/checkout';

interface ProductActionsProps {
  product: Product;
  onDeleteClick: (product: Product) => void;
}

const ProductActions = ({ product, onDeleteClick }: ProductActionsProps) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        asChild
        className="h-8 w-8"
      >
        <Link to={`/admin/products/edit/${product.slug}`}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Link>
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => onDeleteClick(product)}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Excluir</span>
      </Button>
    </div>
  );
};

export default ProductActions;
