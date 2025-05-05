
import React, { createContext, useContext } from 'react';
import { useAuthProvider } from './auth/useAuthProvider';
import { AuthContextType } from './auth/authTypes';

// Criando o contexto com um valor inicial undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente Provider como função React explícita 
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
