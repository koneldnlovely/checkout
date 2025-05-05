
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '../../components/ColorPicker';
import { CheckoutCustomizationSettings } from '@/types/customization';

interface AppearanceTabProps {
  settings: CheckoutCustomizationSettings;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColorChange: (name: string, color: string) => void;
}

export const AppearanceTab: React.FC<AppearanceTabProps> = ({ 
  settings, 
  handleChange, 
  handleColorChange 
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Cores e Estilo</CardTitle>
      <CardDescription>
        Personalize as cores e aparência do seu checkout.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="buttonColor">Cor do Botão</Label>
          <div className="flex gap-2">
            <ColorPicker 
              color={settings.buttonColor} 
              onChange={(color) => handleColorChange('buttonColor', color)} 
            />
            <Input 
              id="buttonColor"
              name="buttonColor"
              value={settings.buttonColor}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="headingColor">Cor dos Títulos</Label>
          <div className="flex gap-2">
            <ColorPicker 
              color={settings.headingColor} 
              onChange={(color) => handleColorChange('headingColor', color)} 
            />
            <Input 
              id="headingColor"
              name="headingColor"
              value={settings.headingColor}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bannerColor">Cor do Banner</Label>
        <div className="flex gap-2">
          <ColorPicker 
            color={settings.bannerColor} 
            onChange={(color) => handleColorChange('bannerColor', color)} 
          />
          <Input 
            id="bannerColor"
            name="bannerColor"
            value={settings.bannerColor}
            onChange={handleChange}
          />
        </div>
        <p className="text-sm text-muted-foreground">Cor de fundo do banner de contagem regressiva no topo da página.</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bannerImageUrl">URL da Imagem de Banner</Label>
        <Input 
          id="bannerImageUrl"
          name="bannerImageUrl"
          value={settings.bannerImageUrl || ''}
          onChange={handleChange}
          placeholder="https://exemplo.com/imagem.jpg"
        />
      </div>
    </CardContent>
  </Card>
);
