
import React from 'react';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  saving: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ saving }) => {
  return (
    <Button type="submit" className="w-full mt-8" disabled={saving}>
      {saving ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Salvando...
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </>
      )}
    </Button>
  );
};
