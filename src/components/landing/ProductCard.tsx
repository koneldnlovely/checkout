
import React from 'react';
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  checkoutUrl: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  description,
  price,
  imageUrl,
  checkoutUrl
}) => {
  // Format the price as Brazilian Real
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-500">
        <img 
          src={imageUrl} 
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          {title}
        </h3>
        <p className="text-gray-600 mb-4">
          {description}
        </p>
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-[#1E3A8A]">{formattedPrice}</span>
          <div className="flex items-center text-sm text-[#10B981]">
            <Lock size={14} className="mr-1" />
            Compra segura
          </div>
        </div>
        <Link to={checkoutUrl} className="block w-full">
          <Button size="lg" className="w-full bg-[#10B981] hover:bg-[#0D9668]">
            Comprar agora
          </Button>
        </Link>
      </div>
    </div>
  );
};
