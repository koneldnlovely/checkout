
import React from 'react';
import { Star, Package, Clock, ShieldCheck } from 'lucide-react';

export const PhysicalProductTestimonials: React.FC = () => {
  const testimonials = [
    {
      id: 'physical-1',
      name: 'Roberto S.',
      photo: 'https://randomuser.me/api/portraits/men/72.jpg',
      comment: 'Produto chegou no prazo combinado! Embalagem perfeita e produto de qualidade.',
      icon: <Clock className="h-4 w-4 text-green-500" />
    },
    {
      id: 'physical-2',
      name: 'Mariana L.',
      photo: 'https://randomuser.me/api/portraits/women/45.jpg',
      comment: 'Produto de qualidade TOP! Superou minhas expectativas, recomendo!',
      icon: <Star className="h-4 w-4 text-amber-500" />
    },
    {
      id: 'physical-3',
      name: 'Paulo V.',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      comment: 'Cumpre o que promete! Exatamente como descrito na página do produto.',
      icon: <ShieldCheck className="h-4 w-4 text-blue-500" />
    }
  ];

  return (
    <div className="mt-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
      <h3 className="font-medium text-gray-800 mb-4 text-lg flex items-center gap-2">
        <Package className="h-5 w-5 text-gray-600" />
        O que nossos clientes estão dizendo sobre este produto:
      </h3>
      
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center mb-2">
              <img 
                src={testimonial.photo} 
                alt={testimonial.name} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-medium text-gray-800">{testimonial.name}</h4>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              {testimonial.icon}
              <p className="text-gray-700 text-sm">{testimonial.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
