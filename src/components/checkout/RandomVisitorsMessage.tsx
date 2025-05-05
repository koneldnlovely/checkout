
import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';

interface RandomVisitorsMessageProps {
  min?: number;
  max?: number;
}

export const RandomVisitorsMessage: React.FC<RandomVisitorsMessageProps> = ({ 
  min = 1, 
  max = 20 
}) => {
  const [visitorCount, setVisitorCount] = useState<number>(
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  
  useEffect(() => {
    // Update the count every 3-7 minutes to simulate real visitors
    const interval = setInterval(() => {
      const newCount = Math.floor(Math.random() * (max - min + 1)) + min;
      setVisitorCount(newCount);
    }, Math.floor(Math.random() * (7 - 3 + 1) + 3) * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [min, max]);
  
  return (
    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded">
      <div className="flex items-center text-sm text-yellow-800">
        <Users className="h-5 w-5 mr-2 text-yellow-600" />
        <span>
          <strong>{visitorCount}</strong> visitantes estão finalizando a compra neste momento
        </span>
      </div>
    </div>
  );
};
