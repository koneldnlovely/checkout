
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Paintbrush, Text, Clock, Store } from 'lucide-react';
import { CheckoutCustomizationSettings } from '@/types/customization';
import { AppearanceTab } from './customization/AppearanceTab';
import { ContentTab } from './customization/ContentTab';
import { TimerTab } from './customization/TimerTab';
import { ProductTab } from './customization/ProductTab';

interface AdminToolsTabsProps {
  settings: CheckoutCustomizationSettings;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColorChange: (name: string, color: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export const AdminToolsTabs: React.FC<AdminToolsTabsProps> = ({
  settings,
  handleChange,
  handleColorChange,
  handleSwitchChange
}) => {
  return (
    <Tabs defaultValue="appearance" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="appearance">
          <Paintbrush className="h-4 w-4 mr-2" />
          Aparência
        </TabsTrigger>
        <TabsTrigger value="content">
          <Text className="h-4 w-4 mr-2" />
          Conteúdo
        </TabsTrigger>
        <TabsTrigger value="timer">
          <Clock className="h-4 w-4 mr-2" />
          Temporizador
        </TabsTrigger>
        <TabsTrigger value="product">
          <Store className="h-4 w-4 mr-2" />
          Produto
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="appearance" className="space-y-4 mt-4">
        <AppearanceTab
          settings={settings}
          handleChange={handleChange}
          handleColorChange={handleColorChange}
        />
      </TabsContent>
      
      <TabsContent value="content" className="space-y-4 mt-4">
        <ContentTab
          settings={settings}
          handleChange={handleChange}
        />
      </TabsContent>
      
      <TabsContent value="timer" className="space-y-4 mt-4">
        <TimerTab
          settings={settings}
          handleChange={handleChange}
        />
      </TabsContent>
      
      <TabsContent value="product" className="space-y-4 mt-4">
        <ProductTab
          settings={settings}
          handleSwitchChange={handleSwitchChange}
        />
      </TabsContent>
    </Tabs>
  );
};

// Adicionar também exportação default para compatibilidade
export default AdminToolsTabs;
