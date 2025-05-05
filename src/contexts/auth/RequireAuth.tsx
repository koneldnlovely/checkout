
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RequireAuthProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        navigate('/admin/login', { 
          state: { from: location },
          replace: true 
        });
      } 
      // If admin access is required but user is not admin
      else if (requireAdmin && !isAdmin) {
        navigate('/admin/tools', { 
          replace: true 
        });
      }
    }
  }, [user, isLoading, isAdmin, navigate, location, requireAdmin]);

  // While checking auth status, show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  // If user is not authenticated or doesn't have required admin status, don't render children
  // (The useEffect will handle redirection)
  if (!user || (requireAdmin && !isAdmin)) {
    return null;
  }

  // If all checks pass, render the protected content
  return <>{children}</>;
};

export default RequireAuth;
