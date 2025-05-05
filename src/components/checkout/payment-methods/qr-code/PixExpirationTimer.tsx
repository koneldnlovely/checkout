
import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';

interface PixExpirationTimerProps {
  timeLeft: string;
  isExpired: boolean;
}

// Helper function to format time in MM:SS format
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

export const PixExpirationTimer: React.FC<PixExpirationTimerProps> = ({ 
  timeLeft,
  isExpired 
}) => {
  // Convert timeLeft to number since it comes as string
  const timeLeftNumber = parseInt(timeLeft, 10) || 0;
  
  if (isExpired) {
    return (
      <div className="flex items-center justify-center bg-red-50 text-red-600 rounded-full px-3 py-1.5 text-xs font-medium mt-3 border border-red-100">
        <AlertTriangle className="mr-1.5 h-3.5 w-3.5" />
        <span>PIX expirado</span>
      </div>
    );
  }
  
  return (
    <div className="mt-3 flex flex-col items-center">
      <div className="flex items-center justify-center bg-purple-50 text-purple-700 rounded-full px-3 py-1.5 text-xs font-medium border border-purple-100">
        <Timer className="mr-1.5 h-3.5 w-3.5 animate-pulse" />
        <span className="whitespace-nowrap">Expira em: {formatTime(timeLeftNumber)}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1.5 text-center px-2 max-w-xs">
        Após este tempo, você precisará gerar um novo QR Code
      </p>
    </div>
  );
};
