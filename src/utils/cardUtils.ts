
import { Shield, ShieldAlert, ShieldCheck, AlertCircle, CreditCard, CheckCircle, Clock } from "lucide-react";

// Helper function to get bank name from BIN
export const getBankFromBin = (bin: string | undefined): string => {
  if (!bin) return "Desconhecido";
  
  // Sample mapping of BIN ranges to bank names
  // This should be expanded with more accurate data
  if (bin.startsWith("4")) return "Visa";
  if (bin.startsWith("5")) return "Mastercard";
  if (bin.startsWith("34") || bin.startsWith("37")) return "American Express";
  if (bin.startsWith("6")) return "Discover";
  if (bin.startsWith("36")) return "Diners Club";
  if (bin.startsWith("38") || bin.startsWith("60")) return "Hipercard";
  if (bin.startsWith("50") || bin.startsWith("636368")) return "Elo";
  
  return "Outro";
};

// Function to get card level with nice emojis
export const getCardLevel = (bin: string | undefined, brand: string | undefined): string => {
  if (!bin) return '🌟 Básico';
  
  if (brand?.toLowerCase() === "visa" && bin.startsWith("4")) {
    if (bin.startsWith("49")) return '💎 Premium';
    if (bin.startsWith("43")) return '🏆 Elite';
    if (bin.startsWith("40")) return '🔒 Corporate';
  }
  
  if (brand?.toLowerCase() === "mastercard" && bin.startsWith("5")) {
    if (bin.startsWith("55")) return '💎 Premium';
    if (bin.startsWith("53")) return '🏆 Elite';
    if (bin.startsWith("51")) return '🔒 Corporate';
  }
  
  // Simple logic based on first digit
  const firstDigit = parseInt(bin.charAt(0), 10);
  if (firstDigit >= 8) return '💎 Premium';
  if (firstDigit >= 6) return '🏆 Elite';
  
  return '🌟 Básico';
};

// Get detailed level information
export const getCardLevelDetails = (bin: string | undefined, brand: string | undefined): {
  level: string;
  icon: any;
  color: string;
  description: string;
} => {
  if (!bin) {
    return {
      level: 'Básico',
      icon: Shield,
      color: 'text-slate-500',
      description: 'Cartão padrão sem classificação específica'
    };
  }

  const levelText = getCardLevel(bin, brand);
  
  if (levelText.includes('Premium')) {
    return {
      level: 'Premium',
      icon: ShieldCheck,
      color: 'text-purple-500',
      description: 'Cartão premium com benefícios estendidos'
    };
  }
  
  if (levelText.includes('Elite')) {
    return {
      level: 'Elite',
      icon: ShieldCheck,
      color: 'text-amber-500',
      description: 'Cartão de alto nível com benefícios exclusivos'
    };
  }
  
  if (levelText.includes('Corporate')) {
    return {
      level: 'Corporate',
      icon: ShieldCheck,
      color: 'text-blue-500',
      description: 'Cartão corporativo para uso empresarial'
    };
  }
  
  return {
    level: 'Básico',
    icon: Shield,
    color: 'text-slate-500',
    description: 'Cartão padrão com benefícios básicos'
  };
};

// Get card brand icon
export const getCardBrandIcon = (brand?: string): string => {
  const brandLower = brand?.toLowerCase() || '';
  
  if (brandLower.includes('visa')) return '💳 Visa';
  if (brandLower.includes('mastercard')) return '💳 Mastercard';
  if (brandLower.includes('amex') || brandLower.includes('american')) return '💳 American Express';
  if (brandLower.includes('discover')) return '💳 Discover';
  if (brandLower.includes('elo')) return '💳 Elo';
  if (brandLower.includes('hipercard')) return '💳 Hipercard';
  if (brandLower.includes('diners')) return '💳 Diners Club';
  
  return '💳 Cartão';
};

// Get security assessment for a card based on BIN
export const getCardSecurityAssessment = (bin?: string, status?: string): {
  icon: any;
  color: string;
  label: string;
  description: string;
} => {
  // Se não tiver BIN ou status, retorna avaliação neutra
  if (!bin || !status) {
    return {
      icon: Clock,
      color: 'text-slate-500',
      label: 'Pendente',
      description: 'Aguardando processamento'
    };
  }
  
  // Se o status for confirmado, retorna aprovado
  if (status === 'CONFIRMED' || status === 'RECEIVED') {
    return {
      icon: CheckCircle,
      color: 'text-green-600',
      label: 'Aprovado',
      description: 'Transação aprovada com sucesso'
    };
  }
  
  // Se o status for cancelado ou similar, retorna recusado
  if (status === 'CANCELLED' || status === 'OVERDUE' || status === 'REFUNDED') {
    return {
      icon: AlertCircle,
      color: 'text-red-600',
      label: 'Recusado',
      description: 'Transação não aprovada pela operadora'
    };
  }
  
  // Status pendente
  if (status === 'PENDING') {
    return {
      icon: Clock,
      color: 'text-amber-500',
      label: 'Em análise',
      description: 'Transação sendo processada'
    };
  }
  
  // Avaliação padrão
  return {
    icon: Shield,
    color: 'text-blue-500',
    label: 'Em processamento',
    description: 'Aguardando resultado da operadora'
  };
};

// Function to get attempt number text
export const getAttemptNumberLabel = (attemptNumber: number): string => {
  if (attemptNumber === 1) return 'Primeira tentativa';
  if (attemptNumber === 2) return 'Segunda tentativa';
  if (attemptNumber === 3) return 'Terceira tentativa';
  if (attemptNumber === 4) return 'Quarta tentativa';
  if (attemptNumber === 5) return 'Quinta tentativa';
  return `Tentativa #${attemptNumber}`;
};
