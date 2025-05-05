
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  color: string;
}

interface OrderStatusChartProps {
  data: StatusData[];
}

const OrderStatusChart = ({ data }: OrderStatusChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Pedidos</CardTitle>
        <CardDescription>
          Distribuição de pedidos por status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{
          pending: { color: "#F59E0B" },
          completed: { color: "#10B981" },
          cancelled: { color: "#EF4444" },
          refunded: { color: "#6B7280" },
          overdue: { color: "#EC4899" }
        }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data || []}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" name="Quantidade">
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OrderStatusChart;
