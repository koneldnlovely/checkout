
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAdminToolsState } from './hooks/useAdminToolsState';
import AdminToolsHeader from './components/AdminToolsHeader';
import AdminToolsTabs from './components/AdminToolsTabs';

const AdminTools = () => {
  const {
    settings,
    handleChange,
    handleSwitchChange,
    handleColorChange,
    handleSave,
  } = useAdminToolsState();

  return (
    <div className="container py-6">
      <AdminToolsHeader title="Personalizar Checkout" onSave={handleSave} />
      
      <Card className="p-6">
        <div className="space-y-6">
          <AdminToolsTabs
            settings={settings}
            handleChange={handleChange}
            handleSwitchChange={handleSwitchChange}
            handleColorChange={handleColorChange}
          />
          
          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Salvar Configurações
            </Button>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-2">Visualizar Alterações</h3>
            <p className="text-sm text-gray-600 mb-4">
              Veja como suas alterações aparecerão no checkout em tempo real.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('/admin/checkout/preview', '_blank')}
            >
              Abrir Prévia do Checkout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminTools;
