
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AttemptStats {
  attemptNumber: number;
  count: number;
  successCount: number;
  successRate: number;
}

interface AttemptDistributionChartProps {
  data: AttemptStats[];
}

const AttemptDistributionChart = ({ data }: AttemptDistributionChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição de Tentativas</CardTitle>
        <CardDescription>
          Número de pedidos por quantidade de tentativas e taxa de sucesso
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attemptNumber" label={{ value: 'Número de Tentativas', position: 'insideBottom', offset: -5 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" label={{ value: 'Quantidade', angle: -90, position: 'insideLeft' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" label={{ value: 'Taxa de Sucesso (%)', angle: -90, position: 'insideRight' }} />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" name="Quantidade de Pedidos" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="successRate" name="Taxa de Sucesso (%)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttemptDistributionChart;
