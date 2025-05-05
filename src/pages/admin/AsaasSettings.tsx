
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import AsaasSettingsForm from './AsaasSettingsForm';
import { useAsaasSettings } from '@/hooks/useAsaasSettings';
import AccessDeniedCard from './components/AccessDeniedCard';

const AsaasSettings = () => {
  const { isAdmin } = useAuth();
  const { formData, isLoading, isSaving, saveConfig } = useAsaasSettings();

  // Verificação de permissão de administrador
  if (!isAdmin) {
    return (
      <AccessDeniedCard 
        title="Configurações do Asaas" 
        description="Você não tem permissão para acessar esta página." 
      />
    );
  }

  // Estado de carregamento
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="md" message="Carregando configurações..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações do Asaas</h1>
        <p className="text-muted-foreground">
          Configure a integração com a API de pagamentos do Asaas.
        </p>
      </div>

      <AsaasSettingsForm 
        defaultValues={formData} 
        onSubmit={saveConfig} 
        isLoading={isSaving} 
      />
    </div>
  );
};

export default AsaasSettings;
