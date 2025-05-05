
import React from "react";
import { PaymentStatus } from "@/types/checkout";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: PaymentStatus;
  showEmoji?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, showEmoji = false }) => {
  // Define styles and text for each status
  const statusConfig: Record<
    PaymentStatus,
    { bg: string; text: string; label: string; emoji: string }
  > = {
    PENDING: {
      bg: "bg-yellow-100 text-yellow-800 border-yellow-200",
      text: "text-yellow-800",
      label: "Em Análise",
      emoji: "⏳"
    },
    CONFIRMED: {
      bg: "bg-green-100 text-green-800 border-green-200",
      text: "text-green-800",
      label: "Confirmado",
      emoji: "✅"
    },
    RECEIVED: {
      bg: "bg-green-100 text-green-800 border-green-200",
      text: "text-green-800",
      label: "Recebido",
      emoji: "💰"
    },
    OVERDUE: {
      bg: "bg-orange-100 text-orange-800 border-orange-200",
      text: "text-orange-800",
      label: "Vencido",
      emoji: "⚠️"
    },
    REFUNDED: {
      bg: "bg-blue-100 text-blue-800 border-blue-200",
      text: "text-blue-800",
      label: "Reembolsado",
      emoji: "↩️"
    },
    CANCELLED: {
      bg: "bg-red-100 text-red-800 border-red-200",
      text: "text-red-800",
      label: "Cancelado",
      emoji: "❌"
    },
    FAILED: {
      bg: "bg-red-100 text-red-800 border-red-200",
      text: "text-red-800",
      label: "Falhou",
      emoji: "❌"
    },
    DECLINED: {
      bg: "bg-red-100 text-red-800 border-red-200",
      text: "text-red-800",
      label: "Recusado",
      emoji: "❌"
    },
    PARTIALLY_REFUNDED: {
      bg: "bg-blue-100 text-blue-800 border-blue-200",
      text: "text-blue-800",
      label: "Reembolso Parcial",
      emoji: "↩️"
    },
    AWAITING_RISK_ANALYSIS: {
      bg: "bg-purple-100 text-purple-800 border-purple-200",
      text: "text-purple-800",
      label: "Análise de Risco",
      emoji: "🔍"
    },
    AUTHORIZED: {
      bg: "bg-green-100 text-green-800 border-green-200",
      text: "text-green-800",
      label: "Autorizado",
      emoji: "✅"
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-xs font-medium border",
        config.bg
      )}
    >
      {showEmoji && <span className="mr-1">{config.emoji}</span>}
      {config.label}
    </span>
  );
};

export default StatusBadge;
