
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface RetryPaymentHeaderProps {
  title: string;
  description?: string;
}

const RetryPaymentHeader = ({ title, description }: RetryPaymentHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <Button asChild variant="outline">
          <Link to="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Dashboard
          </Link>
        </Button>
      </div>
      {description && <p className="text-muted-foreground">{description}</p>}
    </>
  );
};

export default RetryPaymentHeader;
