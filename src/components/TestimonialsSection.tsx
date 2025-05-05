
import React from 'react';
import { Testimonial } from '@/types/checkout';
import { Card, CardContent } from '@/components/ui/card';

// Testimonials data for the landing page
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana S.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    comment: 'Usei o Checkout Seguro e recebi meu acesso em segundos! Processo super rápido e confiável.'
  },
  {
    id: '2',
    name: 'Carlos M.',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Rápido, direto e sem enrolação. 10/10! Recomendo para todos que querem um checkout eficiente.'
  },
  {
    id: '3',
    name: 'Fernanda R.',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    comment: 'Pagamento via PIX caiu na hora, muito bom. Interface intuitiva e segura, adorei a experiência.'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.id} className="border-gray-200 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.photo} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-medium text-[#1E3A8A]">{testimonial.name}</h4>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">{testimonial.comment}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
