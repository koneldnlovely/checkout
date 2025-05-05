
import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

// Testimonials data with recent timestamps
const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ana S.',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 5,
    comment: 'App incrível! Fácil de usar e muito eficiente. Estou adorando a experiência!',
    timeAgo: '3 minutos atrás'
  },
  {
    id: '2',
    name: 'Carlos M.',
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 5,
    comment: 'Rápido, direto e sem enrolação. Recomendo para todos que querem um checkout eficiente.',
    timeAgo: '10 minutos atrás'
  },
  {
    id: '3',
    name: 'Fernanda R.',
    photo: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
    comment: 'Estou muito satisfeita com a praticidade do app. Fiz minha compra em segundos!',
    timeAgo: '15 minutos atrás'
  },
  {
    id: '4',
    name: 'Pedro L.',
    photo: 'https://randomuser.me/api/portraits/men/36.jpg',
    rating: 5,
    comment: 'Nunca vi um aplicativo tão bem pensado. Intuitivo e seguro, nota 10!',
    timeAgo: '27 minutos atrás'
  },
  {
    id: '5',
    name: 'Mariana T.',
    photo: 'https://randomuser.me/api/portraits/women/22.jpg',
    rating: 5,
    comment: 'Comprei meu produto e recebi acesso na hora. Melhor experiência de compra online!',
    timeAgo: '41 minutos atrás'
  }
];

export const TestimonialsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Carousel 
      className="w-full" 
      opts={{
        align: "center",
        loop: true,
      }}
      setApi={(api) => {
        if (api) {
          api.on("select", () => {
            const selectedIndex = api.selectedScrollSnap();
            setActiveIndex(selectedIndex);
          });
          api.scrollTo(activeIndex);
        }
      }}
    >
      <CarouselContent>
        {testimonials.map((testimonial) => (
          <CarouselItem 
            key={testimonial.id} 
            className="transition-transform duration-300 ease-out"
          >
            <Card className="border-0 shadow-sm rounded-lg overflow-hidden bg-white">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <img 
                    src={testimonial.photo} 
                    alt={testimonial.name} 
                    className="w-14 h-14 rounded-full object-cover mr-3 border-2 border-blue-100"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800 text-lg">{testimonial.name}</h4>
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
                <p className="text-gray-700 mb-3 text-base italic">"{testimonial.comment}"</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{testimonial.timeAgo}</span>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center gap-1 mt-3">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === activeIndex ? 'bg-green-500' : 'bg-gray-300'
            }`}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      <CarouselPrevious className="left-0 -translate-x-1/2 bg-white/80 border border-gray-200 text-gray-700 hover:bg-white" />
      <CarouselNext className="right-0 translate-x-1/2 bg-white/80 border border-gray-200 text-gray-700 hover:bg-white" />
    </Carousel>
  );
};
