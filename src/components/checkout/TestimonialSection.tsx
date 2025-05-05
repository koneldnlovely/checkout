
import React from 'react';
import { Testimonial } from '@/types/checkout';
import { SectionTitle } from './SectionTitle';
import { Check, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

// Updated testimonials data to match the image
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Reinaldo martins da silva',
    photo: 'https://randomuser.me/api/portraits/men/42.jpg',
    rating: 5,
    comment: 'Estou muito satisfeito com o serviço, realmente entregam o que promete',
    timeAgo: 'há 5 minutos'
  },
  {
    id: '2',
    name: 'juliana nascimento',
    photo: 'https://randomuser.me/api/portraits/women/56.jpg',
    rating: 5,
    comment: 'Estou impressionada com a qualidade e o atendimento!',
    timeAgo: 'há cerca de 2 horas'
  },
  {
    id: '3',
    name: 'Rafaela pires',
    photo: 'https://randomuser.me/api/portraits/women/24.jpg',
    rating: 5,
    comment: 'Simplesmente adorei!',
    timeAgo: 'há 1 dia'
  }
];

interface TestimonialSectionProps {
  headingColor: string;
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ headingColor }) => {
  return (
    <section id="testimonials-section" className="mb-4 bg-white rounded-lg border border-[#E0E0E0]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <SectionTitle number={2} title="Depoimentos" />
          <span className="text-sm text-gray-500">3 comentários</span>
        </div>
        
        <div className="border border-[#E0E0E0] rounded-lg p-4 bg-white">
          <div className="space-y-3 mb-6">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id}>
                <div className="flex items-start">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.name} 
                    className="w-10 h-10 rounded-full object-cover mr-3 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm">{testimonial.name}</h4>
                        <p className="text-xs text-gray-500">{testimonial.timeAgo}</p>
                      </div>
                      <div className="flex">
                        <span className="text-xs text-gray-500 mr-2">Foi útil?</span>
                        <button className="text-gray-500 hover:text-gray-700 mr-1">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex my-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className="w-4 h-4 text-[#FFD700]" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-black">{testimonial.comment}</p>
                  </div>
                </div>
                {index < testimonials.length - 1 && (
                  <Separator className="my-3 bg-gray-200" />
                )}
              </div>
            ))}
          </div>
          
          <div className="bg-[#E6F4EA] border border-[#28A745] rounded-md p-3 mt-4 flex items-center">
            <Check className="w-5 h-5 text-[#28A745] flex-shrink-0 mr-2" />
            <p className="text-sm">
              Entrega via Email: Você receberá os dados de acesso em seu email cadastrado imediatamente após a confirmação do pagamento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
