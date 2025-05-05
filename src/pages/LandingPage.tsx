
import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, CircleDollarSign, Lock, Smartphone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TestimonialsSection } from '@/components/TestimonialsSection';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-[#1E3A8A]">Checkout Seguro</div>
          <Link to="/checkout/produto-exemplo">
            <Button className="bg-[#10B981] hover:bg-[#0D9668]">
              Começar agora
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-6">
              Checkout 100% Seguro e Otimizado para Conversão
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Processamos pagamentos via Cartão de Crédito e PIX com máxima agilidade.
            </p>
            <div className="flex items-center justify-center text-[#10B981] font-medium gap-2 mb-10">
              <Lock size={20} />
              <span>Ambiente protegido com criptografia SSL</span>
            </div>
            <Link to="/checkout/produto-exemplo">
              <Button size="lg" className="bg-[#1E3A8A] hover:bg-[#15296D] text-lg">
                Comece a usar agora
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
            Benefícios do nosso checkout
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitCard 
              icon={<ArrowRight className="text-[#10B981]" />}
              title="Rápido e intuitivo"
              description="Processo de pagamento simplificado para conclusão rápida."
            />
            <BenefitCard 
              icon={<CreditCard className="text-[#10B981]" />}
              title="Múltiplos métodos de pagamento"
              description="Suporte a cartão de crédito e PIX para maior conveniência."
            />
            <BenefitCard 
              icon={<Smartphone className="text-[#10B981]" />}
              title="Otimizado para celular"
              description="Experiência perfeita em qualquer dispositivo móvel."
            />
            <BenefitCard 
              icon={<CircleDollarSign className="text-[#10B981]" />}
              title="Redirecionamento automático"
              description="Confirmação instantânea após o pagamento."
            />
          </div>
        </div>
      </section>

      {/* Simulated Checkout Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
            Exemplo de produto
          </h2>
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3" 
                alt="Curso de Marketing"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-2">
                Curso de Marketing Digital Completo
              </h3>
              <p className="text-gray-600 mb-4">
                Acesse as melhores estratégias de marketing para alavancar seu negócio.
              </p>
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-[#1E3A8A]">R$ 297,00</span>
                <div className="flex items-center text-sm text-[#10B981]">
                  <Lock size={14} className="mr-1" />
                  Compra segura
                </div>
              </div>
              <Link to="/checkout/curso-marketing" className="block w-full">
                <Button className="w-full bg-[#10B981] hover:bg-[#0D9668]">
                  Comprar agora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#1E3A8A] mb-12">
            O que nossos clientes dizem
          </h2>
          <TestimonialsSection />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-4">Checkout Seguro</h3>
            <div className="flex justify-center space-x-4 mb-6">
              <FooterLink href="#">Política de privacidade</FooterLink>
              <FooterLink href="#">Termos de uso</FooterLink>
              <FooterLink href="#">Suporte</FooterLink>
            </div>
          </div>
          <div className="text-center text-sm text-gray-300">
            © 2025 Checkout Seguro — Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => (
  <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="pt-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-[#E5F4EF] flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </CardContent>
  </Card>
);

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => (
  <a 
    href={href} 
    className="text-gray-300 hover:text-white transition-colors"
  >
    {children}
  </a>
);

export default LandingPage;
