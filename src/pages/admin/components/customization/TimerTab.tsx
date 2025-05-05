
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckoutCustomizationSettings } from '@/types/customization';

interface TimerTabProps {
  settings: CheckoutCustomizationSettings;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TimerTab: React.FC<TimerTabProps> = ({ settings, handleChange }) => (
  <Card>
    <CardHeader>
      <CardTitle>Temporizador de Oferta</CardTitle>
      <CardDescription>
        Configure um temporizador de contagem regressiva para criar urgência.
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="countdownEndTime">Data e Hora de Término</Label>
        <Input 
          id="countdownEndTime"
          name="countdownEndTime"
          type="datetime-local"
          value={settings.countdownEndTime}
          onChange={handleChange}
        />
      </div>
    </CardContent>
  </Card>
);
