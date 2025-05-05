
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, ExternalLink, Lock, Mail, Key, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AccessDataPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  // In a real app, this would come from the location state or be fetched from the backend
  const accessData = {
    username: "usuario_exemplo@email.com",
    password: "Senha123$",
    accessUrl: "https://exemplo.com/acesso"
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência.`,
      });
    }).catch(err => {
      console.error('Falha ao copiar:', err);
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar para a área de transferência.",
        variant: "destructive"
      });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-300/5 via-blue-200/10 to-blue-100/5 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-r from-blue-100/5 via-blue-200/10 to-blue-300/5 pointer-events-none"></div>
      
      {/* Floating circles for decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <Card className="max-w-md w-full shadow-xl border-0 rounded-xl overflow-hidden animate-scale-in relative bg-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
        
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-white pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,127,255,0.05),transparent_50%)]"></div>
          
          <div className="relative">
            <div className="absolute inset-0 -mt-2 bg-blue-400 rounded-full blur-lg opacity-20"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Lock className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold text-blue-700 mt-2">Dados de Acesso</CardTitle>
          <CardDescription className="text-blue-600 font-medium">
            Aqui estão suas credenciais para acessar o produto
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 px-6 py-8">
          <p className="text-gray-700 mb-6">Use as informações abaixo para acessar seu produto digital. Por segurança, recomendamos que você altere sua senha após o primeiro acesso.</p>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-blue-800 font-medium">Usuário</p>
                    <p className="font-mono text-blue-900">{accessData.username}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(accessData.username, "Usuário")}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Key className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-blue-800 font-medium">Senha</p>
                    <p className="font-mono text-blue-900">{accessData.password}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(accessData.password, "Senha")}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1 flex-shrink-0">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm text-blue-800 text-left">
                Estas informações também foram enviadas para o seu e-mail. Verifique sua caixa de entrada e a pasta de spam.
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col pb-8 relative z-10 space-y-3">
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-2 h-auto transition-all duration-300 shadow-md hover:shadow-lg text-white border-0"
          >
            <Link to="/access-product" className="flex items-center justify-center">
              Acessar produto agora
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline"
            className="w-full px-6 py-2 h-auto transition-all duration-300"
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

export default AccessDataPage;
