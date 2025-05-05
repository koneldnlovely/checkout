
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';

const Login = () => {
  const { signIn, session } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Se o usuário já estiver autenticado, redireciona para o dashboard administrativo
  useEffect(() => {
    if (session) {
      navigate('/admin/dashboard');
    }
  }, [session, navigate]);

  const handleSignIn = async (data: { email: string; password: string }) => {
    setIsSubmitting(true);
    try {
      await signIn(data.email, data.password);
      // O useEffect tratará do redirecionamento quando a sessão for atualizada
    } catch (error) {
      // Erro é tratado na função signIn
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Painel Administrativo</CardTitle>
          <CardDescription className="text-center">
            Acesse o painel administrativo com seu e-mail e senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm 
            onSubmit={handleSignIn}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
