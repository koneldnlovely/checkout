
import React from 'react';
import { Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PixQRCodeProps {
  qrCodeImage: string;
}

export const PixQRCode: React.FC<PixQRCodeProps> = ({ qrCodeImage }) => {
  const isMobile = useIsMobile();
  
  const handleDownloadQRCode = () => {
    if (!qrCodeImage) return;
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = qrCodeImage;
      link.download = 'pix-qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };

  const qrCodeSize = isMobile ? "w-40 h-40" : "w-52 h-52";

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-green-200 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-100 shadow-md transition-all duration-300 hover:shadow-lg">
          {qrCodeImage ? (
            <img 
              src={qrCodeImage} 
              alt="QR Code PIX" 
              className={`${qrCodeSize} object-contain rounded`}
            />
          ) : (
            <div className={`${qrCodeSize} flex items-center justify-center bg-gray-100 rounded-lg`}>
              <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      <Button 
        size="sm" 
        variant="outline" 
        className="mt-2 sm:mt-3 text-xs text-gray-600 hover:text-green-600 border-gray-200"
        onClick={handleDownloadQRCode}
        disabled={!qrCodeImage}
      >
        <Download className="h-3 w-3 mr-1" />
        Salvar QR Code
      </Button>
    </div>
  );
};
