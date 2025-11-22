import React, { useState } from 'react';
import { QrCode, AlertCircle } from 'lucide-react';

interface QRScannerProps {
  onScan: (qrText: string) => void;
  isActive: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, isActive }) => {
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setScanError(null);
      
      // Dynamically import jsQR
      const jsQR = (await import('jsqr')).default;
      
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            setScanError('Canvas not supported');
            return;
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code) {
            onScan(code.data);
          } else {
            setScanError('No QR code found in image');
          }
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('QR scan error:', err);
      setScanError('Failed to scan QR code');
    }
  };

  if (!isActive) {
    return (
      <div className="text-center p-6 bg-gray-100 rounded-lg">
        <QrCode size={48} className="mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">Complete waste classification first</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-green-500 rounded-lg p-8 text-center bg-green-50">
        <QrCode size={64} className="mx-auto text-green-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Scan Bin QR Code
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload an image of the bin's QR code
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Upload QR Image
        </button>
      </div>

      {scanError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} />
          <span>{scanError}</span>
        </div>
      )}
    </div>
  );
};