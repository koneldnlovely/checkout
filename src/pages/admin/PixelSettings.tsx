
import React from 'react';
import { Settings } from 'lucide-react';
import PixelSettingsForm from './PixelSettingsForm';

const PixelSettings = () => {
  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="h-6 w-6" />
        Configurações de Pixels de Rastreamento
      </h1>
      
      <PixelSettingsForm />
    </div>
  );
};

export default PixelSettings;
