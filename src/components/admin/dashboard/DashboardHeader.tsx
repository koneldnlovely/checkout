
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardHeaderProps {
  period: 'today' | '7days' | '30days' | 'all';
  setPeriod: (value: 'today' | '7days' | '30days' | 'all') => void;
}

const DashboardHeader = ({ period, setPeriod }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" className="mr-2">
          <Link to="/admin/analytics/payment-retry">
            <BarChart2 className="mr-2 h-4 w-4" />
            Análise de Retry Payment
          </Link>
        </Button>
        <Tabs
          defaultValue="7days"
          value={period}
          onValueChange={(value) => setPeriod(value as any)}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="today">Hoje</TabsTrigger>
            <TabsTrigger value="7days">7 dias</TabsTrigger>
            <TabsTrigger value="30days">30 dias</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardHeader;
