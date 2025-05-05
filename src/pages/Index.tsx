import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Shield, Star } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-gray-800">PixFlow</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/admin/dashboard">
                <Button>
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gray-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Soluções de pagamento simplificadas
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Aceite pagamentos via PIX e cartões de crédito com facilidade e segurança.
            </p>
            <div className="mt-8 flex justify-center">
              <Link to="/checkout">
                <Button className="px-6 py-6 text-lg">
                  Ir para Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Nossa plataforma de pagamentos
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Tudo o que você precisa para vender seus produtos online.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCart className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Checkout Intuitivo</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Experiência de checkout simplificada para aumentar suas conversões.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Pagamentos Seguros</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Processamento de pagamentos seguro e confiável para sua tranquilidade.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Star className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Dashboard Completo</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Acompanhe todas as suas vendas e transações em um único lugar.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-indigo-200">Experimente nosso checkout hoje mesmo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/checkout">
                <Button className="px-6 py-6 text-lg">
                  Ir para Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PixFlow</h3>
              <p className="text-gray-300">
                Soluções de pagamento para todos os tipos de negócios.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
                <li><Link to="/checkout" className="text-gray-300 hover:text-white">Checkout</Link></li>
                <li><Link to="/admin/dashboard" className="text-gray-300 hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <p className="text-gray-300">
                contato@pixflow.com.br<br />
                +55 (11) 99999-9999
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-300">
            <p>© 2025 PixFlow. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
