
import React, { useState, useEffect } from 'react';
import { QrCode, Sparkles, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface PixQRCodeDisplayProps {
  qrCodeImage: string;
}

export const PixQRCodeDisplay: React.FC<PixQRCodeDisplayProps> = ({ qrCodeImage }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fixedQRCodeImage, setFixedQRCodeImage] = useState<string>('');
  const isMobile = useIsMobile();
  
  // Debug logging for QR code issues
  useEffect(() => {
    console.log("PixQRCodeDisplay - Received QR code:", qrCodeImage ? 
      `${qrCodeImage.substring(0, 30)}... (${qrCodeImage.length} characters)` : 
      "QR code missing");
      
    // Reset error state when we receive a new QR code image
    if (qrCodeImage && qrCodeImage.trim() !== '') {
      setImageError(false);
      setIsLoading(true);
      
      // Check if the image is a valid data URL (starts with data:image)
      if (!qrCodeImage.startsWith('data:image')) {
        console.warn("QR code is not a valid data URL, attempting to fix");
        
        // Try to fix the QR code by adding the necessary prefix
        const fixedImage = `data:image/png;base64,${qrCodeImage}`;
        console.log("Fixed QR code to:", fixedImage.substring(0, 30) + "...");
        setFixedQRCodeImage(fixedImage);
      } else {
        setFixedQRCodeImage(qrCodeImage);
      }
    } else {
      console.warn("QR code is empty or undefined");
      setImageError(true);
      setIsLoading(false);
    }
  }, [qrCodeImage]);

  const handleDownloadQRCode = () => {
    if (!fixedQRCodeImage || fixedQRCodeImage.trim() === '' || imageError) {
      console.warn("Attempted to download QR code, but image is not available");
      return;
    }
    
    try {
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = fixedQRCodeImage;
      link.download = 'pix-qrcode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download QR code:", error);
    }
  };
  
  // Render error state if we have an error or no QR code
  if (imageError || (!qrCodeImage && !fixedQRCodeImage) || (qrCodeImage?.trim() === '' && fixedQRCodeImage?.trim() === '')) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 w-full max-w-[280px] h-[280px] mx-auto flex flex-col items-center justify-center text-gray-500">
            <AlertCircle className="w-16 h-16 mb-4 text-amber-400" />
            <p className="text-center text-sm">
              QR Code não disponível.<br />Use o código de cópia e cola abaixo.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Determine container size based on whether it's mobile or not
  const containerSize = isMobile ? "max-w-[280px] h-[280px]" : "w-64 h-64";
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative group">
        <div className={`relative p-4 bg-white rounded-xl ${containerSize} mx-auto flex items-center justify-center overflow-hidden`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img 
            src={fixedQRCodeImage || qrCodeImage} 
            alt="QR Code PIX" 
            className="max-w-full max-h-full object-contain"
            onLoad={() => {
              console.log("QR code loaded successfully");
              setIsLoading(false);
            }}
            onError={(e) => {
              console.error("Failed to load QR code image:", e);
              setImageError(true);
              setIsLoading(false);
            }}
            loading="eager" // Prioritize loading
          />
        </div>
        <Button 
          size="sm" 
          variant="ghost" 
          className="mt-2 text-xs text-gray-500 hover:text-green-600 mx-auto flex items-center"
          onClick={handleDownloadQRCode}
          disabled={imageError || isLoading}
        >
          <Download className="h-3 w-3 mr-1" />
          Salvar QR Code
        </Button>
      </div>
    </div>
  );
};
