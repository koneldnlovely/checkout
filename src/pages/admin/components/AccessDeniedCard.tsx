
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface AccessDeniedCardProps {
  title: string;
  description: string;
}

const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({ title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default AccessDeniedCard;
