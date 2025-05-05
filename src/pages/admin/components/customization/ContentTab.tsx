
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckoutCustomizationSettings } from '@/types/customization';

interface ContentTabProps {
  settings: CheckoutCustomizationSettings;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContentTab: React.FC<ContentTabProps> = ({ settings, handleChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Textos e Mensagens</CardTitle>
      <CardDescription>
        Personalize os textos mostrados na página de checkout.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="buttonText">Texto do Botão de Pagamento</Label>
        <Input 
          id="buttonText"
          name="buttonText"
          value={settings.buttonText}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="topMessage">Mensagem de Topo</Label>
        <Input 
          id="topMessage"
          name="topMessage"
          value={settings.topMessage}
          onChange={handleChange}
        />
      </div>
    </CardContent>
  </Card>
);
