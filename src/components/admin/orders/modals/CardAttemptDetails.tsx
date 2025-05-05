
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CreditCardData } from "@/types/checkout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar, KeyRound, Building2, Tag, Star, Clock } from "lucide-react";
import { 
  getBankFromBin, 
  getCardLevel, 
  getCardBrandIcon, 
  getCardLevelDetails, 
  getCardSecurityAssessment,
  getAttemptNumberLabel 
} from "@/utils/cardUtils";

interface CardAttemptDetailsProps {
  cardData: CreditCardData;
  attemptNumber: number;
  status?: string;
}

// Get status badge variant
const getStatusBadgeVariant = (status?: string): "default" | "secondary" | "destructive" | "outline" => {
  if (!status) return "outline";
  
  switch (status.toUpperCase()) {
    case "CONFIRMED":
    case "RECEIVED":
      return "default";
    case "PENDING":
      return "secondary";
    case "CANCELLED":
    case "OVERDUE":
    case "REFUNDED":
      return "destructive";
    default:
      return "outline";
  }
};

const CardAttemptDetails: React.FC<CardAttemptDetailsProps> = ({ 
  cardData, 
  attemptNumber,
  status
}) => {
  // Get card level details for enhanced display
  const levelDetails = getCardLevelDetails(cardData.bin, cardData.brand);
  
  // Get security assessment based on status
  const securityAssessment = getCardSecurityAssessment(cardData.bin, status);
  
  // Get attempt label
  const attemptLabel = getAttemptNumberLabel(attemptNumber);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 border border-slate-100">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <span className="inline-flex items-center justify-center bg-purple-100 text-purple-800 rounded-full w-6 h-6 text-xs font-semibold">
              #{attemptNumber}
            </span>
            <span>{attemptLabel}</span>
          </CardTitle>
          {status && (
            <Badge variant={getStatusBadgeVariant(status)}>
              {status}
            </Badge>
          )}
        </div>
        {cardData.createdAt && (
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Clock className="h-3 w-3 mr-1" />
            {format(new Date(cardData.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-12 items-center gap-2">
            <CreditCard className="h-4 w-4 text-slate-500 col-span-1" />
            <div className="font-medium col-span-3">Número:</div>
            <div className="col-span-8 font-mono tracking-wider">{cardData.number}</div>
          </div>
          
          <div className="grid grid-cols-12 items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500 col-span-1" />
            <div className="font-medium col-span-3">Validade:</div>
            <div className="col-span-8">{cardData.expiryDate}</div>
          </div>
          
          <div className="grid grid-cols-12 items-center gap-2">
            <KeyRound className="h-4 w-4 text-slate-500 col-span-1" />
            <div className="font-medium col-span-3">CVV:</div>
            <div className="col-span-8">{cardData.cvv}</div>
          </div>
          
          {cardData.holderName && (
            <div className="grid grid-cols-12 items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-500 col-span-1" />
              <div className="font-medium col-span-3">Titular:</div>
              <div className="col-span-8">{cardData.holderName}</div>
            </div>
          )}
          
          {cardData.bin && (
            <div className="grid grid-cols-12 items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-500 col-span-1" />
              <div className="font-medium col-span-3">BIN/Banco:</div>
              <div className="col-span-8">
                {cardData.bin} - {getBankFromBin(cardData.bin)}
              </div>
            </div>
          )}
          
          {cardData.brand && (
            <div className="grid grid-cols-12 items-center gap-2">
              <Tag className="h-4 w-4 text-slate-500 col-span-1" />
              <div className="font-medium col-span-3">Bandeira:</div>
              <div className="col-span-8">{getCardBrandIcon(cardData.brand)}</div>
            </div>
          )}
          
          {cardData.bin && (
            <div className="grid grid-cols-12 items-center gap-2">
              <Star className="h-4 w-4 text-slate-500 col-span-1" />
              <div className="font-medium col-span-3">Nível:</div>
              <div className="col-span-8 flex items-center">
                {getCardLevel(cardData.bin, cardData.brand)}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({levelDetails.description})
                </span>
              </div>
            </div>
          )}
          
          {/* Status assessment information */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center">
              <div className={`mr-2 ${securityAssessment.color}`}>
                {React.createElement(securityAssessment.icon, { size: 16 })}
              </div>
              <div className="font-medium">{securityAssessment.label}</div>
              <div className="ml-2 text-xs text-muted-foreground">
                {securityAssessment.description}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardAttemptDetails;
