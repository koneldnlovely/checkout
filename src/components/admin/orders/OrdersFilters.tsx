
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { PaymentStatus } from "@/types/checkout";

interface OrdersFiltersProps {
  statusFilter: PaymentStatus | "ALL";
  setStatusFilter: (status: PaymentStatus | "ALL") => void;
  dateRange: "7days" | "30days" | "custom";
  setDateRange: (range: "7days" | "30days" | "custom") => void;
  customDateRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  setCustomDateRange: (range: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  }) => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  customDateRange,
  setCustomDateRange,
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm mb-4 space-y-4">
      <h2 className="text-lg font-medium mb-3">Filtros</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status filter */}
        <div className="space-y-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Status do Pagamento
          </label>
          <Select
            value={statusFilter}
            onValueChange={(value) => 
              setStatusFilter(value as PaymentStatus | "ALL")
            }
          >
            <SelectTrigger id="status-filter" className="w-full">
              <SelectValue placeholder="Selecione um status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              <SelectItem value="PENDING">Em análise</SelectItem>
              <SelectItem value="CONFIRMED">Confirmado</SelectItem>
              <SelectItem value="RECEIVED">Recebido</SelectItem>
              <SelectItem value="OVERDUE">Vencido</SelectItem>
              <SelectItem value="REFUNDED">Reembolsado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date range filter */}
        <div className="space-y-2">
          <label htmlFor="date-filter" className="text-sm font-medium text-gray-700">
            Período
          </label>
          <Select
            value={dateRange}
            onValueChange={(value) => 
              setDateRange(value as "7days" | "30days" | "custom")
            }
          >
            <SelectTrigger id="date-filter" className="w-full">
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Custom date range selector */}
      {dateRange === "custom" && (
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Data inicial
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.startDate ? (
                    format(customDateRange.startDate, "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={customDateRange.startDate}
                  onSelect={(date) =>
                    setCustomDateRange({
                      ...customDateRange,
                      startDate: date || undefined,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Data final
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {customDateRange.endDate ? (
                    format(customDateRange.endDate, "dd/MM/yyyy", {
                      locale: ptBR,
                    })
                  ) : (
                    <span>Selecione a data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={customDateRange.endDate}
                  onSelect={(date) =>
                    setCustomDateRange({
                      ...customDateRange,
                      endDate: date || undefined,
                    })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersFilters;
