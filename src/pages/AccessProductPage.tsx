
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle, ExternalLink, FileText, Video } from 'lucide-react';

const AccessProductPage = () => {
  // In a real app, this would be fetched from an API
  const productModules = [
    {
      id: 1,
      title: "Introdução ao Curso",
      description: "Visão geral e objetivos do treinamento",
      type: "video",
      duration: "15 minutos"
    },
    {
      id: 2,
      title: "Módulo 1: Fundamentos",
      description: "Conceitos básicos e terminologia",
      type: "video",
      duration: "45 minutos"
    },
    {
      id: 3,
      title: "Material de Apoio",
      description: "E-book com conteúdo complementar",
      type: "pdf",
      size: "2.5 MB"
    },
    {
      id: 4,
      title: "Módulo 2: Técnicas Avançadas",
      description: "Estratégias e métodos profissionais",
      type: "video",
      duration: "60 minutos"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white via-purple-50/20 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-300/5 via-purple-200/10 to-purple-100/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-purple-100/5 via-purple-200/10 to-purple-300/5 pointer-events-none"></div>
      
      {/* Floating circles for decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <Card className="max-w-2xl w-full shadow-xl border-0 rounded-xl overflow-hidden animate-scale-in relative bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600"></div>
        
        <CardHeader className="text-center bg-gradient-to-r from-purple-50 to-white pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(128,0,255,0.05),transparent_50%)]"></div>
          
          <div className="relative">
            <div className="absolute inset-0 -mt-2 bg-purple-400 rounded-full blur-lg opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-purple-700 mt-2">Seu Produto Digital</CardTitle>
          <CardDescription className="text-purple-600 font-medium">
            Acesse todo o conteúdo do seu produto
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 py-8">
          <p className="text-gray-700 mb-6 text-center">Tenha acesso a todos os módulos e materiais do seu produto digital. Clique em cada item para começar a acessar o conteúdo.</p>
          
          <div className="space-y-4">
            {productModules.map(module => (
              <div key={module.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className={`p-2 rounded-full mr-3 mt-1 flex-shrink-0 ${
                    module.type === 'video' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {module.type === 'video' ? (
                      <Video className="h-4 w-4 text-red-600" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {module.type === 'video' ? module.duration : module.size}
                      </div>
                    </div>
                    <Button 
                      className="mt-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                      size="sm"
                    >
                      Acessar
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-100 mt-6">
            <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm text-green-800 text-left">
                O acesso ao seu produto é vitalício. Você pode entrar e acessar o conteúdo a qualquer momento, de qualquer dispositivo.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-8 relative z-10">
          <Button 
            asChild 
            variant="outline"
            className="px-6 py-2 h-auto transition-all duration-300"
          >
            <Link to="/" className="flex items-center justify-center">
              Voltar ao início
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccessProductPage;
