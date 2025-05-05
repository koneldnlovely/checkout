
import React, { useState, useEffect } from 'react';

interface TopMessageBannerProps {
  message: string;
  bannerImageUrl?: string | null;
  initialMinutes?: number;
  initialSeconds?: number;
  containerClassName?: string;
  bannerColor?: string;
}

export const TopMessageBanner: React.FC<TopMessageBannerProps> = ({
  message,
  bannerImageUrl,
  initialMinutes = 5,
  initialSeconds = 0,
  containerClassName = '',
  bannerColor
}) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  // Format timer display
  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Style with custom color if provided
  const bannerStyle = bannerColor ? { backgroundColor: bannerColor } : {};

  return (
    <div className={`${containerClassName} py-2`}>
      <div 
        className="w-full px-4 py-2 flex flex-col md:flex-row items-center justify-between rounded-md text-white text-center"
        style={bannerStyle || { backgroundColor: 'var(--banner-color, #000000)' }}
      >
        <div className="flex items-center">
          {bannerImageUrl && (
            <img 
              src={bannerImageUrl} 
              alt="Banner" 
              className="h-6 md:h-8 object-contain mr-3" 
            />
          )}
          <span className="text-sm md:text-base font-medium">{message}</span>
        </div>
        <div className="text-sm font-bold mt-1 md:mt-0">
          <span className="md:ml-2">
            {formatTime(minutes, seconds)}
          </span>
        </div>
      </div>
    </div>
  );
};
