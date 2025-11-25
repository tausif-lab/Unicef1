

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
 

  // Add these helper functions at the top of the component, after state declarations
const preprocessImage = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  
  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    // Grayscale conversion
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    
    // Contrast enhancement (increase difference from 128)
    const contrasted = ((gray - 128) * 1.5) + 128;
    const clamped = Math.max(0, Math.min(255, contrasted));
    
    // Apply to all channels
    data[i] = clamped;
    data[i + 1] = clamped;
    data[i + 2] = clamped;
  }
  
  return imageData;
};

const sharpenImage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const side = Math.round(Math.sqrt(weights.length));
  const halfSide = Math.floor(side / 2);
  
  const src = data.slice();
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dstOff = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;
      
      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;
          
          if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
            const srcOff = (scy * width + scx) * 4;
            const wt = weights[cy * side + cx];
            r += src[srcOff] * wt;
            g += src[srcOff + 1] * wt;
            b += src[srcOff + 2] * wt;
          }
        }
      }
      
      data[dstOff] = Math.max(0, Math.min(255, r));
      data[dstOff + 1] = Math.max(0, Math.min(255, g));
      data[dstOff + 2] = Math.max(0, Math.min(255, b));
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
};

// REPLACE your entire handleFileUpload function with this improved version:
const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  setIsProcessing(true);
  setScanError(null);
  setDebugInfo('');

  try {
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

      img.onload = async () => {
        try {
          setDebugInfo(`Image loaded: ${img.width}x${img.height}`);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          if (!ctx) {
            setScanError('Canvas not supported by browser');
            setIsProcessing(false);
            return;
          }
          
          // Use higher resolution for better QR detection
          const targetWidth = Math.min(1280, img.width);
          const targetHeight = Math.min(720, img.height);
          const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
          
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          
          // Draw with smoothing disabled for sharper QR codes
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          setDebugInfo(`Processing ${canvas.width}x${canvas.height} image...`);
          
          // Apply sharpening
          sharpenImage(ctx, canvas.width, canvas.height);
          
          let code = null;
          const attempts = [
            { inversion: "dontInvert" as const, preprocess: false },
            { inversion: "attemptBoth" as const, preprocess: false },
            { inversion: "dontInvert" as const, preprocess: true },
            { inversion: "attemptBoth" as const, preprocess: true },
          ];
          
          for (let i = 0; i < attempts.length && !code; i++) {
            const attempt = attempts[i];
            setDebugInfo(`Attempt ${i + 1}/${attempts.length}...`);
            
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            if (attempt.preprocess) {
              imageData = preprocessImage(imageData);
            }
            
            code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: attempt.inversion,
            });
            
            if (code) {
              console.log('========== QR DEBUG ==========');
              console.log('Raw QR data:', code.data);
              console.log('QR length:', code.data.length);
              console.log('QR bytes:', Array.from(code.data).map(c => c.charCodeAt(0)));
              console.log('Success on attempt:', i + 1);
              console.log('========== END DEBUG ==========');
              break;
            }
          }
          
          if (code && code.data) {
            setDebugInfo(`✓ QR Code found: ${code.data}`);
            setScanError(null);
            onScan(code.data);
          } else {
            setScanError('No QR code detected. Please ensure:\n• QR code is clearly visible\n• Image is well-lit\n• Try from different angles\n• Ensure QR fills at least 30% of frame');
            setDebugInfo('No QR pattern detected after 4 attempts');
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
          //capture="environment"
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
        <p className="text-xs text-gray-500 mt-3 text-center">
          📷 Camera • 🖼️ Gallery • 📁 Files
        </p>
        {isProcessing && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-green-600 h-full rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-gray-600">{debugInfo}</p>
        </div>
      )}

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