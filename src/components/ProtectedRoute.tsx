
import { useEffect } from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = true }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  // While checking auth status, show loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-center">
          <h2 className="text-yellow-800 font-medium text-lg">Acesso restrito</h2>
          <p className="text-yellow-700 mt-2 mb-4">
            Seu usuário não possui permissões de administrador para acessar esta área.
          </p>
          <Button asChild variant="outline">
            <Link to="/admin/tools">
              Ir para ferramentas de administração
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
