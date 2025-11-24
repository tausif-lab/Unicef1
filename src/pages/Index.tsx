

import React, { useEffect, useRef, useState, useCallback } from 'react';


import { useScanTimer } from '../hooks/useScanTimer';
import { QRScanner } from '../components/QRScanner';
import { parseBinCategory, getCategoryDisplayName } from '../utils/qrParser';
import { useNavigate } from 'react-router-dom';

import {
  Leaf,
  Users,
  DollarSign,
  
  Camera,
  Search,
  CheckCircle,
  Package,
  ShoppingCart,
  LogIn,
  
  AlertCircle,
  RotateCcw,
  
  X,
  
  TrendingUp,
  
  
  
} from 'lucide-react';

// --- UTILITY: INTERSECTION OBSERVER HOOK ---



const TestimonialCard = ({ author, text }: any) => (
  <div className="w-full max-w-sm bg-white p-8 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
    <div className="flex items-center gap-3 mb-4">
      <img 
        src={author.avatar} 
        alt={author.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <p className="font-bold text-[#111827]">{author.name}</p>
        <p className="text-sm text-[#6B7280]">{author.handle}</p>
      </div>
    </div>
    <p className="text-[#6B7280] leading-relaxed italic">"{text}"</p>
  </div>
);




interface Prediction {
  className: string;
  probability: number;
}

 


const WasteClassifier: React.FC = () => {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [detectedCategory, setDetectedCategory] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [scanMessage, setScanMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { timeLeft, isActive, startTimer, resetTimer } = useScanTimer(30);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('ecoPoints');
    if (savedPoints) {
      setPoints(JSON.parse(savedPoints));
    }
  }, []);

  // Save points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ecoPoints', JSON.stringify(points));
  }, [points]);

  // Load scripts and model - keep existing useEffect
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!(window as any).tf) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load TensorFlow'));
            document.head.appendChild(script);
          });
        }

        if (!(window as any).mobilenet) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.0';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load MobileNet'));
            document.head.appendChild(script);
          });
        }

        const tf = (window as any).tf;
        const mobilenet = (window as any).mobilenet;

        if (!tf || !mobilenet) {
          throw new Error('TensorFlow or MobileNet not available');
        }

        console.log('Loading MobileNet model...');
        const loadedModel = await mobilenet.load();
        setModel(loadedModel);
        console.log('MobileNet Model Loaded Successfully!');
        setLoading(false);
      } catch (err) {
        console.error('Error initializing model:', err);
        setError('Failed to load AI model. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeModel();
  }, []);

  const openCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera access is not supported by your browser.');
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = stream;

        try {
          if (video.readyState >= 1) {
            await video.play().catch(() => {});
          } else {
            await new Promise<void>((resolve) => {
              const onLoaded = () => {
                video.play().finally(() => resolve());
              };
              video.addEventListener('loadedmetadata', onLoaded, { once: true });
            });
          }
        } catch (err) {
          console.warn('Error starting video:', err);
        }

        setCameraOpen(true);
        setResult(null);
        setDetectedCategory(null);
        resetTimer();
        setScanMessage(null);
      }
    } catch (err) {
      console.error('Error opening camera:', err);
      setError('Could not open camera. Please check permissions.');
    }
  }, [resetTimer]);

  const classifyImage = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current || !cameraOpen) {
      setError('Camera or model not ready.');
      return;
    }

    setLoading(true);

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setError('Could not get canvas context.');
        setLoading(false);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

      const predictions: Prediction[] = await model.classify(canvas);
      mapPredictionsToWasteCategory(predictions);
    } catch (err) {
      console.error('Classification error:', err);
      setError('Error analyzing image.');
    } finally {
      setLoading(false);
    }
  }, [model, cameraOpen]);

  const mapPredictionsToWasteCategory = (predictions: Prediction[]) => {
    const wasteCategories = {
      PET_greenbin: ['water bottle', 'juice bottle', 'beverage bottle', 'bottle'],
      Plastic_Flexible: ['wrapper', 'packet', 'bag', 'pouch', 'plastic bag'],
      Plastic_Rigid: ['container', 'shampoo', 'lotion', 'dispenser', 'soap', 'detergent'],
      Plastic_Cutlery: ['cup', 'spoon', 'fork', 'mug', 'utensil'],
      Metal: ['can', 'tin', 'aluminum', 'metal', 'soda can', 'beer can'],
      Paper: ['paper', 'notebook', 'cardboard', 'magazine', 'newspaper', 'envelope', 'carton'],
      Glass: ['glass', 'jar', 'glass bottle', 'wine bottle'],
    };

    const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);

    for (const prediction of sortedPredictions) {
      const className = prediction.className.toLowerCase();
      const probability = Math.round(prediction.probability * 100);

      if (probability < 10) continue;

      for (const [category, keywords] of Object.entries(wasteCategories)) {
        if (keywords.some(keyword => className.includes(keyword))) {
          setResult(`**${category}** (Confidence: ${probability}%)`);
          setDetectedCategory(category);
          startTimer();
          setScanMessage(null);
          return;
        }
      }
    }

    const topConfidence = Math.round(sortedPredictions[0]?.probability * 100) || 0;
    setResult(`**Other/Unknown** (Top: ${sortedPredictions[0]?.className || 'N/A'} - ${topConfidence}%)`);
    setDetectedCategory(null);
  };
  
// Inside Index.tsx component

const handleQRScan = (qrText: string) => {
  console.log('========== HANDLE QR SCAN ==========');
  
  if (!isActive || timeLeft === 0) {
    setScanMessage({ type: 'error', text: 'Time expired! Please classify waste again.' });
    return;
  }

  if (!detectedCategory) {
    setScanMessage({ type: 'error', text: 'No waste detected. Please classify first.' });
    return;
  }

  // 1. Parse the scanned text
  const scannedCategory = parseBinCategory(qrText);
  
  console.log('Detected (AI):', detectedCategory);
  console.log('Scanned (QR):', scannedCategory);

  if (!scannedCategory) {
    setScanMessage({ 
      type: 'error', 
      text: 'Invalid QR. Please scan a valid recycling bin.' 
    });
    return;
  }

  // 2. Compare directly (Strings should match exactly from the parser map)
  if (scannedCategory === detectedCategory) {
    const pointsEarned = 10;
    setPoints(prev => prev + pointsEarned);
    setScanMessage({ 
      type: 'success', 
      text: `✓ Correct! You scanned the ${getCategoryDisplayName(scannedCategory)} bin. +${pointsEarned} points!` 
    });
    resetTimer();
  } else {
    setScanMessage({ 
      type: 'error', 
      text: `✗ Wrong Bin! AI detected ${getCategoryDisplayName(detectedCategory)}, but you scanned ${getCategoryDisplayName(scannedCategory)}.` 
    });
  }
  console.log('========== END HANDLE ==========');
};



  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraOpen(false);
      setResult(null);
      setDetectedCategory(null);
      resetTimer();
      setScanMessage(null);
    }
  };

  return (
    <div 
      id="WasteClassifier"
      className="waste-classifier-card bg-gradient-to-br from-white to-green-50 shadow-2xl rounded-2xl p-8 w-full max-w-2xl mx-auto border-2 border-green-100"
    >
      {/* Points Display */}
      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
        🏆 {points} Points
      </div>

      {/* Header - keep existing */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg">
          <span className="text-3xl">♻️</span>
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">AI Waste Classifier</h3>
        <p className="text-gray-600">Scan any waste item to identify its type and recycling category</p>
      </div>

      {/* Video/Camera Display - keep existing */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-6 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          {loading && !cameraOpen && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-green-600 font-semibold text-lg">Loading AI Model...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="flex flex-col items-center gap-3 text-red-600 p-6 text-center max-w-md">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle size={28} />
              </div>
              <p className="font-semibold text-lg">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${cameraOpen && !loading ? 'block' : 'hidden'}`}
          />

          {!cameraOpen && !loading && !error && (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <Camera size={40} className="text-green-600" />
              </div>
              <p className="text-gray-600 text-lg font-medium">Ready to scan waste items</p>
              <p className="text-gray-500 text-sm">Click "Open Camera" below to start</p>
            </div>
          )}
        </div>
        
        {cameraOpen && !loading && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            LIVE
          </div>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Action Buttons - keep existing */}
      <div className="flex justify-center gap-4 mb-6 flex-wrap">
        {!cameraOpen ? (
          <button
            onClick={openCamera}
            disabled={loading || !model}
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-full transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            <Camera size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="text-lg">Open Camera</span>
          </button>
        ) : (
          <>
            <button
              onClick={classifyImage}
              disabled={loading || !model}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">📸</span>
                  <span>Capture & Scan</span>
                </>
              )}
            </button>
            <button
              onClick={stopCamera}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              ✕ Close Camera
            </button>
          </>
        )}
      </div>

      {/* Timer Display */}
      {isActive && timeLeft > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center animate-pulse">
          <p className="text-2xl font-bold text-blue-700">
            ⏱️ {timeLeft}s remaining
          </p>
          <p className="text-sm text-blue-600 mt-1">Scan the correct bin QR to earn points!</p>
        </div>
      )}

      {/* Classification Result */}
      {result && (
        <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-800 mb-2">Classification Result</h4>
              <p className="text-xl font-semibold text-green-700 mb-3" dangerouslySetInnerHTML={{ __html: result }}></p>
              {detectedCategory && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    ✓ Required Bin: {getCategoryDisplayName(detectedCategory)}
                  </p>
                  {isActive && (
                    <p className="text-xs text-gray-600">
                      Scan the corresponding bin QR within {timeLeft}s to earn points
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {detectedCategory && (
        <div className="mt-6">
          <QRScanner onScan={handleQRScan} isActive={isActive} />
        </div>
      )}

      {/* Scan Message */}
      {scanMessage && (
        <div className={`mt-4 p-4 rounded-lg border-2 ${
          scanMessage.type === 'success' 
            ? 'bg-green-50 border-green-300 text-green-800' 
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
          <p className="font-semibold text-center">{scanMessage.text}</p>
        </div>
      )}

      {/* Info Section - keep existing */}
      {!result && !cameraOpen && !loading && !error && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">How it works:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Open camera and point at waste item</li>
                <li>• Capture image for AI analysis</li>
                <li>• Scan the correct bin QR within 30 seconds</li>
                <li>• Earn 10 points for correct bin selection!</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};




// --- REST OF THE PAGE (HERO, SECTIONS) WITH NEW DESIGN ---

// 1. Hero Section
const Hero = () => {
  
  const navigate = useNavigate();

  const scrollToClassifier = () => {
    document.getElementById('WasteClassifier')?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5]/50 to-[#A7F3D0]/30 pb-20 pt-32 lg:pt-48 lg:pb-32">
       {/* Decorative Blobs */}
       <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#34D399]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#10B981]/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

       <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-sm mb-8">
             <span className="flex h-2 w-2 rounded-full bg-[#10B981]"></span>
             <span className="text-[11px] font-bold tracking-widest text-[#064E3B] uppercase">Sustainable Future</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#111827] leading-[1.1] mb-6 tracking-tight max-w-5xl mx-auto">
            Transforming Waste into <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#34D399]">Valuable Resources</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto font-medium leading-relaxed">
            Scan. Sort. Earn. Join the community-driven movement to clean our planet and build a circular economy.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <button 
               onClick={scrollToClassifier}
               className="h-14 px-8 rounded-full bg-[#111827] text-white font-bold text-lg shadow-lg hover:bg-gray-800 hover:scale-105 transition-all flex items-center gap-2 group"
             >
               <Camera size={20} className="group-hover:rotate-12 transition-transform" />
               Start Scanning
             </button>
             <button 
              onClick={() => navigate('/shop')}
             className="h-14 px-8 rounded-full bg-white text-[#111827] font-bold text-lg border border-gray-200 shadow-md hover:bg-[#F9FAFB] hover:scale-105 transition-all">
               View Marketplace
             </button>
          </div>
       </div>
    </section>
  );
};

// 2. Solutions Section
const SolutionCard = ({ icon: Icon, title, description, badgeColor }: any) => (
  <div className="flex flex-col h-full bg-white p-8 rounded-[24px] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.04)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
    <div className={`w-14 h-14 rounded-2xl ${badgeColor} flex items-center justify-center mb-6`}>
      <Icon size={28} className="text-[#111827]" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-bold text-[#111827] mb-3">{title}</h3>
    <p className="text-[#6B7280] leading-relaxed text-[15px]">{description}</p>
  </div>
);

const Solutions = () => {
  const solutions = [
    { icon: Camera, title: 'AI Detection', description: 'Instantly identify polymer types with 98% accuracy using computer vision.', badgeColor: 'bg-[#D1FAE5]' }, // Light Green
    { icon: CheckCircle, title: 'Smart Sorting', description: 'Color-coded guidance ensures your waste ends up in the correct bin.', badgeColor: 'bg-[#ECFCCB]' }, // Light Lime
    { icon: Users, title: 'Community', description: 'Local groups process waste into bricks, tiles, and sustainable products.', badgeColor: 'bg-[#FEF3C7]' }, // Light Amber
    { icon: ShoppingCart, title: 'Marketplace', description: 'Trade recycled goods and materials directly on our secure platform.', badgeColor: 'bg-[#E0F2FE]' }, // Light Sky
  ];

  return (
    <section className="bg-[#F9FAFB] py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">Our Seamless Solution</h2>
          <p className="text-[#6B7280] text-lg">Technology meets ecology. We've simplified the entire recycling chain.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((s, i) => (
            <SolutionCard key={i} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WorkflowCard = ({ step, title, desc, icon: Icon }: any) => (
  <div className="flex items-start gap-4 p-6 bg-white rounded-[20px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-lg">
      {step}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-bold text-[#111827] flex items-center gap-2">
         <Icon size={20} strokeWidth={1.5} />
         {title}
      </h3>
      <p className="text-[#6B7280] text-sm mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const Workflow = () => {
  const steps = [
    { step: 1, title: 'Scan Item', desc: 'Take a photo via the app.', icon: Camera },
    { step: 2, title: 'AI Analysis', desc: 'Model detects plastic type.', icon: Search },
    { step: 3, title: 'Bin Guide', desc: 'App shows correct bin.', icon: CheckCircle },
    { step: 4, title: 'Collection', desc: 'Verified pickup by partners.', icon: Package },
    { step: 5, title: 'Upcycling', desc: 'Locals create products.', icon: Users },
    { step: 6, title: 'Sales', desc: 'Products sold online.', icon: ShoppingCart },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
           <div className="lg:w-1/2">
              <span className="text-[#059669] font-bold text-sm tracking-wider uppercase mb-2 block">The Process</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6 leading-tight">
                From simple scan to <br/> sustainable product.
              </h2>
              <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
                We've connected every step of the circular economy. Your small action of scanning creates jobs and reduces pollution.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {steps.map((s) => <WorkflowCard key={s.step} {...s} />)}
              </div>
           </div>
           <div className="lg:w-1/2 relative">
              <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-8 border-white bg-gray-100 aspect-[4/3]">
                 <img 
                   src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2070&auto=format&fit=crop" 
                   alt="Recycling Process" 
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg max-w-xs">
                    <div className="flex items-center gap-3">
                       <div className="bg-[#D1FAE5] p-2 rounded-full text-[#065F46]"><TrendingUp size={20}/></div>
                       <div>
                          <p className="text-xs text-[#6B7280] font-bold uppercase">Impact Metric</p>
                          <p className="text-sm font-bold text-[#111827]">92% Diverted from Ocean</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

// 4. Benefits Section
const BenefitItem = ({ icon: Icon, title, desc }: any) => (
  <div className="text-center p-6">
    <div className="w-16 h-16 mx-auto bg-white rounded-[20px] shadow-sm border border-emerald-100 flex items-center justify-center mb-4 text-[#111827]">
       <Icon size={32} strokeWidth={1.5} />
    </div>
    <h3 className="text-lg font-bold text-[#111827] mb-2">{title}</h3>
    <p className="text-[#6B7280] text-sm leading-relaxed">{desc}</p>
  </div>
);

const Benefits = () => {
  const benefits = [
    { icon: Leaf, title: 'Cleaner Coasts', desc: 'Drastically reduce plastic waste polluting our oceans.' },
    { icon: DollarSign, title: 'Local Income', desc: 'Direct revenue for communities through recycled goods.' },
    { icon: RotateCcw, title: 'Circular Economy', desc: 'Closed-loop system extending material lifespan.' },
  ];

  return (
    <section className="py-20 bg-[#F0FDF4]">
      <div className="container mx-auto px-6">
         <div className="bg-[#ECFDF5]/60 rounded-[32px] p-8 md:p-16 text-center border border-[#10B981]/20">
            <h2 className="text-3xl font-bold text-[#111827] mb-12">Why it Matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {benefits.map((b, i) => <BenefitItem key={i} {...b} />)}
            </div>
         </div>
      </div>
    </section>
  );
};

// 5. Reviews Section
const Reviews = () => {
  const testimonials = [
    {
      author: { name: 'Priya S.', handle: '@priyas', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
      text: 'The app made sorting plastic so easy! I love knowing exactly where my waste is going.',
    },
    {
      author: { name: 'Rajesh K.', handle: 'Comm. Leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh' },
      text: 'This platform has transformed our community. We went from dumping plastic to making a sustainable income.',
    },
    {
      author: { name: 'Dr. Reed', handle: 'Scientist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn' },
      text: 'A true circular economy solution. High accuracy and a direct marketplace.',
    },
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 text-center mb-12">
        <h2 className="text-3xl font-bold text-[#111827]">Community Stories</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-6 px-4">
        {testimonials.map((t, i) => <TestimonialCard key={i} {...t} />)}
      </div>
    </section>
  );
};

// 6. Login Modal (Kept logic, updated style)
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [step, setStep] = useState<'login' | 'otp' | 'continue'>('login');
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); setStep('otp'); };
  const handleVerify = (e: React.FormEvent) => { e.preventDefault(); setStep('continue'); };
  const handleContinue = () => { alert('Continuing!'); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 backdrop-blur-md p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-[24px] p-8 shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#111827]">Welcome Back</h3>
            <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-[#111827]"><X size={20}/></button>
         </div>

         {step === 'login' && (
           <>
             <div className="flex p-1 bg-[#F5F6F7] rounded-[12px] mb-6">
               {['mobile', 'email'].map((m) => (
                 <button
                   key={m}
                   onClick={() => setMethod(m as any)}
                   className={`flex-1 py-2 text-sm font-bold rounded-[8px] capitalize transition-all ${method === m ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280]'}`}
                 >
                   {m}
                 </button>
               ))}
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
               <input 
                 type={method === 'mobile' ? 'tel' : 'email'}
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder={method === 'mobile' ? '+1 234 567 8900' : 'name@example.com'}
                 className="w-full p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[14px] text-[#111827] focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                 required
               />
               <button type="submit" className="w-full py-4 bg-[#10B981] text-white font-bold rounded-[14px] hover:bg-[#059669] transition-colors">
                 Get OTP
               </button>
             </form>
           </>
         )}

         {step === 'otp' && (
            <form onSubmit={handleVerify} className="space-y-4">
              <p className="text-sm text-[#6B7280] mb-2">Enter code sent to {input}</p>
              <input type="number" placeholder="000000" className="w-full p-4 text-center text-2xl tracking-widest bg-[#F9FAFB] border border-[#E5E7EB] rounded-[14px] focus:ring-2 focus:ring-[#10B981] outline-none" required />
              <button type="submit" className="w-full py-4 bg-[#111827] text-white font-bold rounded-[14px] hover:bg-gray-800 transition-colors">Verify</button>
              <button type="button" onClick={() => setStep('login')} className="w-full text-sm text-[#6B7280] hover:text-[#111827]">Back</button>
            </form>
         )}

         {step === 'continue' && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#047857]"><CheckCircle size={32}/></div>
              <h4 className="text-xl font-bold text-[#111827] mb-2">Success!</h4>
              <button onClick={handleContinue} className="w-full py-4 bg-[#111827] text-white font-bold rounded-[14px] mt-4">Go to Dashboard</button>
            </div>
         )}
      </div>
    </div>
  );
};

// 7. Footer (Updated Style)
const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2 mb-6 md:mb-0">
         <div className="bg-[#34D399] p-1.5 rounded-lg text-white"><Leaf size={20}/></div>
         <span className="text-xl font-bold text-[#111827]">EcoCycle</span>
      </div>
      <div className="flex gap-8 text-[#6B7280] font-medium text-sm">
        <a href="#" className="hover:text-[#111827]">Privacy</a>
        <a href="#" className="hover:text-[#111827]">Terms</a>
        <a href="#" className="hover:text-[#111827]">Support</a>
      </div>
    </div>
  </footer>
);


// --- MAIN LANDING PAGE COMPONENT ---
const EnvironmentalLandingPage = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    document.title = 'EcoCycle Tech | Transforming Plastic Waste into Sustainable Value';

    const descriptionContent =
      'A modern, aesthetic landing page for an environmental tech platform converting plastic waste into valuable recycled products.';
    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute('content', descriptionContent);
  }, []);

  return (
    <>
      {/* Header/Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center">
            <Leaf className="h-7 w-7 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-800">EcoCycle Tech</span>
          </div>
          <nav className="hidden space-x-6 md:flex">
            <a href="#solutions" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Solution
            </a>
            <a href="#workflow" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Process
            </a>
            <a href="#impact" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Impact
            </a>
            <a href="#reviews" className="text-gray-600 hover:text-green-600 transition-colors font-medium">
              Reviews
            </a>
          </nav>
          <button
            className="flex items-center rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600"
            onClick={() => setIsLoginOpen(true)}
          >
            <LogIn className="mr-2 h-4 w-4" /> Login
          </button>
        </div>
      </header>

      <main>
        <Hero />

        <section id="solutions">
          <Solutions />
        </section>

        <section id="workflow">
          <Workflow />
        </section>

        <section id="impact">
          <Benefits />
        </section>

        <section id="reviews">
          <Reviews />
        </section>

        <section id="scanner" className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <WasteClassifier />
          </div>
        </section>
      </main>

      <Footer />
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </>
  );
};

export default EnvironmentalLandingPage;
