

import React, { useState } from 'react';
import { QrCode, AlertCircle, Camera } from 'lucide-react';
import jsQR from 'jsqr';
interface QRScannerProps {
  onScan: (qrText: string) => void;
  isActive: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScan, isActive }) => {
  const [scanError, setScanError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setScanError(null);
    setDebugInfo('');

    try {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setScanError('Please upload a valid image file');
        setIsProcessing(false);
        return;
      }

      setDebugInfo('Loading image...');
      
      
      
      const img = new Image();
      const reader = new FileReader();
      
      reader.onerror = () => {
        setScanError('Failed to read image file');
        setIsProcessing(false);
      };
      
      reader.onload = (e) => {
        if (!e.target?.result) {
          setScanError('Failed to load image data');
          setIsProcessing(false);
          return;
        }

        img.onerror = () => {
          setScanError('Failed to decode image');
          setIsProcessing(false);
        };

        img.onload = () => {
          try {
            setDebugInfo(`Image loaded: ${img.width}x${img.height}`);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            if (!ctx) {
              setScanError('Canvas not supported by browser');
              setIsProcessing(false);
              return;
            }
            
            // Set canvas size to match image
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Draw image on canvas
            ctx.drawImage(img, 0, 0);
            
            setDebugInfo(`Processing ${canvas.width}x${canvas.height} image...`);
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // Try to detect QR code with multiple attempts and different options
            let code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "dontInvert",
            });

            // If not found, try with inversion
            if (!code) {
              setDebugInfo('Retrying with color inversion...');
              code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "attemptBoth",
              });
            }

            // If still not found, try preprocessing the image
            if (!code) {
              setDebugInfo('Applying image preprocessing...');
              
              // Increase contrast
              for (let i = 0; i < imageData.data.length; i += 4) {
                const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
                const value = avg > 128 ? 255 : 0;
                imageData.data[i] = value;
                imageData.data[i + 1] = value;
                imageData.data[i + 2] = value;
              }
              
              code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "attemptBoth",
              });
            }
            
            if (code && code.data) {
              setDebugInfo(`✓ QR Code found: ${code.data}`);
              setScanError(null);
              onScan(code.data);
            } else {
              setScanError('No QR code detected. Please ensure:\n• QR code is clearly visible\n• Image is well-lit\n• QR code takes up most of the image\n• Try taking photo from directly above');
              setDebugInfo('No QR pattern detected in image');
            }
            
            setIsProcessing(false);
          } catch (err) {
            console.error('QR processing error:', err);
            setScanError('Error processing image: ' + (err as Error).message);
            setIsProcessing(false);
          }
        };
        
        img.src = e.target.result as string;
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('QR scan error:', err);
      setScanError('Failed to scan QR code: ' + (err as Error).message);
      setIsProcessing(false);
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
          disabled={isProcessing}
          className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 mx-auto ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Camera size={20} />
              <span>Upload QR Image</span>
            </>
          )}
        </button>

        {/* Tips */}
        <div className="mt-6 text-left bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">📋 Tips for better scanning:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Hold phone directly above QR code</li>
            <li>• Ensure good lighting</li>
            <li>• QR code should fill most of the frame</li>
            <li>• Avoid shadows or glare</li>
            <li>• Keep image in focus</li>
          </ul>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700">
          <strong>Debug:</strong> {debugInfo}
        </div>
      )}

      {/* Error Display */}
      {scanError && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold mb-1">Scanning Failed</p>
            <p className="text-sm whitespace-pre-line">{scanError}</p>
          </div>
        </div>
      )}

      
    </div>
  );
};