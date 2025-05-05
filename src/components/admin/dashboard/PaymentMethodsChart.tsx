
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PaymentMethodData {
  name: string;
  value: number;
  color: string;
}

interface PaymentMethodsChartProps {
  data: PaymentMethodData[];
}

const PaymentMethodsChart = ({ data }: PaymentMethodsChartProps) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
        <CardDescription>
          Distribuição de pedidos por método de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          pix: { color: "#10B981" },
          creditCard: { color: "#8B5CF6" }
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsChart;
