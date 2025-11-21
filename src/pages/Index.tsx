

import React, { useEffect, useRef, useState, useCallback } from 'react';
import workflow from '../assets/workflow-bg.jpg'
import { cn } from "../lib/utils";
import { TestimonialCard, type TestimonialAuthor } from "../components/ui/testimonial-card";


import {
  Leaf,
  Users,
  DollarSign,
  MapPin,
  Camera,
  Search,
  CheckCircle,
  Package,
  ShoppingCart,
  LogIn,
  Mail,
  Smartphone,
  AlertCircle,
  RotateCcw,
  
  
} from 'lucide-react';

// --- UTILITY: INTERSECTION OBSERVER HOOK ---
// This custom hook handles scroll-triggered animations using Intersection Observer.
const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Optionally, unobserve after it becomes visible once
        // observer.unobserve(entry.target);
      } else {
        // Optional: Reset visibility when scrolling away
        // setIsVisible(false);
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [options]);

  return { elementRef, isVisible };
};







interface Prediction {
  className: string;
  probability: number;
}

 

const WasteClassifier: React.FC = () => {
  const [model, setModel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<string | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wasteClassifierRef = useRef<HTMLDivElement>(null);
  

  // Load scripts and model - single combined effect
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setLoading(true);
        setError(null);

        // Step 1: Load TensorFlow.js
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

        // Step 2: Load MobileNet
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

        // Step 3: Access and load model
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
      }
    } catch (err) {
      console.error('Error opening camera:', err);
      setError('Could not open camera. Please check permissions.');
    }
  }, []);

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

      // Classify the image using MobileNet
      const predictions: Prediction[] = await model.classify(canvas);

      // Map predictions to waste categories
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
  Plastic_PET: [
    'water bottle', 'juice bottle', 'beverage bottle', 'bottle'
  ],

  Plastic_Flexible: [
    'wrapper', 'packet', 'bag', 'pouch', 'plastic bag'
  ],

  Plastic_Rigid: [
    'container', 'shampoo', 'lotion', 'dispenser', 'soap', 'detergent'
  ],

  Plastic_Cutlery: [
    'cup', 'spoon', 'fork', 'mug', 'utensil'
  ],

  Metal: [
    'can', 'tin', 'aluminum', 'metal', 'soda can', 'beer can'
  ],

  Paper: [
    'paper', 'notebook', 'cardboard', 'magazine', 'newspaper', 'envelope', 'carton'
  ],

  Glass: [
    'glass', 'jar', 'glass bottle', 'wine bottle'
  ],

  
};



    const sortedPredictions = predictions.sort((a, b) => b.probability - a.probability);

    for (const prediction of sortedPredictions) {
      const className = prediction.className.toLowerCase();
      const probability = Math.round(prediction.probability * 100);

      if (probability < 10) continue;

      for (const [category, keywords] of Object.entries(wasteCategories)) {
        if (keywords.some(keyword => className.includes(keyword))) {
          setResult(`**${category}** (Confidence: ${probability}%)`);
          return;
        }
      }
    }

    const topConfidence = Math.round(sortedPredictions[0]?.probability * 100) || 0;
    setResult(`**Other/Unknown** (Top: ${sortedPredictions[0]?.className || 'N/A'} - ${topConfidence}%)`);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setCameraOpen(false);
      setResult(null);
    }
  };

  /*return (
    <div 
    ref={wasteClassifierRef}
    id="WasteClassifier"
    className="waste-classifier-card bg-white shadow-xl rounded-xl p-6 w-full max-w-lg mx-auto border border-gray-100">
      <h3 className="text-2xl font-bold mb-4 text-gray-800 text-center">♻️ Waste Sorter AI</h3>

      <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4 flex items-center justify-center min-h-[300px]">
        {loading && <p className="text-blue-600 font-semibold">Loading AI Model...</p>}
        {error && !loading && (
          <div className="flex items-center gap-2 text-red-600 font-semibold p-4 text-center">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover ${cameraOpen && !loading ? 'block' : 'hidden'}`}
        />

        {!cameraOpen && !loading && !error && (
          <p className="text-gray-500 text-center">Click "Open Camera" .</p>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {!cameraOpen ? (
          <button
            onClick={openCamera}
            disabled={loading || !model}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-full transition duration-300 flex items-center gap-2"
          >
            <Camera size={20} /> Open Camera
          </button>
        ) : (
          <>
            <button
              onClick={classifyImage}
              disabled={loading || !model}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
            >
              {loading ? 'Scanning...' : '📸 Scan Item'}
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition duration-300"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <p className="text-lg font-medium text-gray-800">
              AI Prediction: <span className="font-bold text-green-700" dangerouslySetInnerHTML={{ __html: result }}></span>
            </p>
          </div>
          <p className="text-sm text-gray-600">
            (Real MobileNet classification - works best with clear, well-lit images)
          </p>
        </div>
      )}
    </div>
  );*/
return (
  <div 
    ref={wasteClassifierRef}
    id="WasteClassifier"
    className="waste-classifier-card bg-gradient-to-br from-white to-green-50 shadow-2xl rounded-2xl p-8 w-full max-w-2xl mx-auto border-2 border-green-100"
  >
    {/* Header */}
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full mb-4 shadow-lg">
        <span className="text-3xl">♻️</span>
      </div>
      <h3 className="text-3xl font-bold text-gray-800 mb-2">AI Waste Classifier</h3>
      <p className="text-gray-600">Scan any waste item to identify its type and recycling category</p>
    </div>

    {/* Video/Camera Display */}
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
      
      {/* Camera overlay indicator */}
      {cameraOpen && !loading && (
        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          LIVE
        </div>
      )}
    </div>

    <canvas ref={canvasRef} style={{ display: 'none' }} />

    {/* Action Buttons */}
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

    {/* Result Display */}
    {result && (
      <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg animate-fadeIn">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <CheckCircle size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-800 mb-2">Classification Result</h4>
            <p className="text-xl font-semibold text-green-700 mb-3" dangerouslySetInnerHTML={{ __html: result }}></p>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/60 rounded-lg px-3 py-2">
              <span className="text-lg">💡</span>
              <span>Real MobileNet AI - Works best with clear, well-lit images</span>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Info Section */}
    {!result && !cameraOpen && !loading && !error && (
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">How it works:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Open camera and point at waste item</li>
              <li>• Capture image for AI analysis</li>
              <li>• Get instant classification and recycling info</li>
            </ul>
          </div>
        </div>
      </div>
    )}
  </div>
);




};



// 1. Hero Section
const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const parallaxOffset = scrollY * 0.2;
  /*const scrollToClassifier = () => {
  if (wasteClassifierRef.current) {
    wasteClassifierRef.current.scrollIntoView({ behavior: "smooth" });
  }
};*/
const scrollToClassifier = () => {
    const classifierElement = document.getElementById('WasteClassifier');
    if (classifierElement) {
      classifierElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[80vh] overflow-hidden bg-gradient-to-br from-green-500/10 to-blue-500/10">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{
          backgroundImage: `url(${workflow})`,
          transform: `translateY(${parallaxOffset}px)`,
          filter: 'brightness(0.9)', // Decreased brightness for better text contrast
          backgroundSize: 'cover',
        }}
        role="img"
        aria-label="Background image showing plastic waste transforming into valuable recycled products."
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-6 text-center text-white backdrop-blur-sm">
        <h5 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.1] max-w-4xl"> {/* Smaller heading, white color */}
          Transforming Waste into{" "}
          <span className="block mt-2 bg-gradient-to-r from-blue-400 via-teal-300 to-green-300 bg-clip-text text-transparent"> {/* Slightly adjusted gradient for better visibility on dark */}
            Sustainable Future
          </span>
        </h5>
         <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              
             onClick ={scrollToClassifier}

              className="group relative inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
            >
              <Camera size={22} />
              Scan Waste
            </button>

            <button className="group relative inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
              🛍️ Shopping
            </button>
          </div>
        <p className="mt-4 text-xl font-medium text-white-200 md:text-2xl"> {/* Subheadline color improved */}
          Scan. Sort. Earn. Strengthen local communities through circular recycling.
        </p>

       {/*<div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <WasteClassifier />
          <button className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-green-600">
            Learn More
          </button>
        </div>*/}

      </div>
    </section>
  );
  
};
// Shared animation wrapper
const FadeInCard = ({
  children,
  delay = 0,
  className = '',
  threshold = 0.2,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
}) => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold });

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// 2. Proposed Solution Section
const SolutionCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex h-full flex-col rounded-xl border border-green-500/20 bg-white p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

const Solutions = () => {
  const solutions = [
    {
      icon: Camera,
      title: 'ML-Based Plastic Identification',
      description: 'Accurately identify plastic type (PET, HDPE, etc.) using computer vision for perfect segregation.',
    },
    {
      icon: CheckCircle,
      title: 'Guided Bin Selection',
      description: 'The app instantly guides users to the correct color-coded bin, maximizing recycling accuracy.',
    },
    {
      icon: Users,
      title: 'Community-Led Recycling',
      description: 'Empowering locals to convert segregated waste into new products like eco-bricks and tiles.',
    },
    {
      icon: ShoppingCart,
      title: 'E-commerce Marketplace',
      description: 'A platform to sell the valuable recycled products, creating a direct revenue stream for communities.',
    },
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">Our Seamless Solution</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {solutions.map((solution, index) => (
            <FadeInCard key={index} delay={index * 150} className="h-full">
              <SolutionCard {...solution} />
            </FadeInCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// 3. Workflow & Process Section
const ProcessCard = ({ step, title, description, icon: Icon, delay }: { step: number; title: string; description: string; icon: React.ElementType; delay: number }) => {
  const { elementRef, isVisible } = useIntersectionObserver({ threshold: 0.5 });
  const directionClass = step % 2 !== 0 ? 'translate-x-[-50%]' : 'translate-x-[50%]';
  const slideInClass = isVisible ? 'opacity-100 translate-x-0' : `opacity-0 ${directionClass}`;

  return (
    <div
      ref={elementRef}
      className={`flex items-center space-x-6 rounded-xl border border-green-500/20 bg-white p-6 shadow-lg transition-all duration-700 hover:shadow-xl md:w-3/4 lg:w-2/3 ${
        step % 2 === 0 ? 'ml-auto' : 'mr-auto'
      } ${slideInClass}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 transition-colors duration-300 group-hover:bg-green-600 group-hover:text-white">
        <span className="absolute text-sm font-bold opacity-20">Step {step}</span>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const Workflow = () => {
  const steps = [
    { title: 'User Snaps a Photo', description: 'Take a quick photo of the plastic item via the app.', icon: Camera },
    { title: 'ML Detects Plastic Type', description: 'Our AI instantly identifies the polymer and its recycling code.', icon: Search },
    { title: 'App Guides Correct Color Bin', description: 'Receive clear, instant instructions on which local bin to use.', icon: CheckCircle },
    { title: 'Segregated Waste Collected', description: 'Verified local collectors pick up the perfectly sorted plastic.', icon: Package },
    { title: 'Locals Create Recycled Products', description: 'Communities use the sorted waste to create bricks and DIY items.', icon: Users },
    { title: 'Products Listed on Marketplace', description: 'Finished, valuable products are listed for sale online.', icon: ShoppingCart },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="mb-16 text-center text-4xl font-bold text-gray-800">Workflow & Process</h2>
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-green-200" />
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="group">
                <ProcessCard
                  step={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  delay={index * 200}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 4. Benefits & Impact Section
const BenefitCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex h-full flex-col items-center rounded-xl bg-white p-8 text-center shadow-lg transition-all duration-300 hover:shadow-2xl">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
  </div>
);

const Benefits = () => {

  


  const benefits = [
    { icon: Leaf, title: 'Cleaner Coasts', description: 'Drastically reduce the plastic waste polluting our oceans and beaches.' },
    { icon: CheckCircle, title: 'Increased Recycling Accuracy', description: 'AI-guided sorting ensures near-perfect material purity for higher-value recycling.' },
    { icon: DollarSign, title: 'Local Income Generation', description: 'Empower communities with direct revenue from manufacturing and selling recycled products.' },
    { icon: Package, title: 'Reduced Landfill Pressure', description: 'Divert tons of plastic away from landfills, extending their lifespan and reducing emissions.' },
    { icon: RotateCcw, title: 'Plastic Circular Economy', description: 'Create a fully closed-loop system, transforming waste into an economic asset.' },
    { icon: MapPin, title: 'Community Empowerment', description: 'Foster local entrepreneurship and environmental stewardship.' },
  ];

  return (
    <section className="bg-gradient-to-tr from-green-500/5 to-blue-500/5 py-20">
      
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-center text-4xl font-bold text-gray-800">Impact & Benefits</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <FadeInCard key={index} delay={index * 100} className="h-full">
              <BenefitCard {...benefit} />
            </FadeInCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. Customer Reviews Section
const Reviews = () => {
  const testimonials = [
    {
      author: {
        name: 'Priya S.',
        handle: '@priyas',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      } as TestimonialAuthor,
      text: 'The app made sorting plastic so easy! I love knowing exactly where my waste is going and seeing the products they create.',
    },
    {
      author: {
        name: 'Rajesh K.',
        handle: 'Community Leader',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      } as TestimonialAuthor,
      text: 'This platform has transformed our community. We went from dumping plastic to making a sustainable income.',
    },
    {
      author: {
        name: 'Dr. Evelyn Reed',
        handle: 'Environmental Scientist',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evelyn',
      } as TestimonialAuthor,
      text: 'A true circular economy solution. High accuracy and a direct marketplace—it\'s exactly what the recycling industry needed.',
    },
    {
      author: {
        name: 'David L.',
        handle: '@davidl',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      } as TestimonialAuthor,
      text: 'Earning rewards for proper segregation is a genius idea. It motivates everyone to participate.',
    },
  ];

  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 sm:py-24 md:py-32 px-0"
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-4 text-center sm:gap-16">
        <div className="flex flex-col items-center gap-4 px-4 sm:gap-8">
          <h2 className="max-w-[720px] text-3xl font-semibold leading-tight sm:text-5xl sm:leading-tight">
            What Our Community Says
          </h2>
          <p className="text-md max-w-[600px] font-medium text-muted-foreground sm:text-xl">
            Real stories from people making a difference with our recycling platform.
          </p>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:40s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row group-hover:[animation-play-state:paused]">
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  );
};

// 6. Login System Modal Component
const LoginModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [method, setMethod] = useState<'mobile' | 'email'>('mobile');
  const [step, setStep] = useState<'login' | 'otp' | 'continue'>('login');
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending OTP
    setStep('otp');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification success
    setStep('continue');
  };

  const handleContinue = () => {
    // Simulate "Continue where you left off" action
    alert('Continuing where you left off!');
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case 'login':
        return (
          <>
            <h3 className="mb-4 text-2xl font-bold text-gray-800">Login or Sign Up</h3>
            <div className="mb-6 flex space-x-2 rounded-lg bg-gray-100 p-1">
              <button
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  method === 'mobile' ? 'bg-white text-green-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMethod('mobile')}
              >
                <Smartphone className="inline-block h-4 w-4 mr-1" /> Mobile
              </button>
              <button
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  method === 'email' ? 'bg-white text-green-600 shadow-md' : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setMethod('email')}
              >
                <Mail className="inline-block h-4 w-4 mr-1" /> Email
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">{method === 'mobile' ? 'Mobile Number' : 'Email Address'}</span>
                <input
                  type={method === 'mobile' ? 'tel' : 'email'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={method === 'mobile' ? 'e.g., +91 98765 43210' : 'you@example.com'}
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white transition-colors duration-200 hover:bg-green-700"
              >
                Continue (Get OTP)
              </button>
            </form>
            <p className="mt-4 text-center text-xs text-gray-500">
              By continuing, you agree to the Terms of Use and Privacy Policy.
            </p>
          </>
        );

      case 'otp':
        return (
          <>
            <h3 className="mb-2 text-2xl font-bold text-gray-800">Verify with OTP</h3>
            <p className="mb-6 text-sm text-gray-600">
              We've sent a 6-digit OTP to **{input}**.
            </p>
            <form onSubmit={handleVerify} className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Enter OTP</span>
                <input
                  type="number"
                  placeholder="------"
                  required
                  maxLength={6}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-3 text-center text-2xl tracking-widest shadow-sm focus:border-green-500 focus:ring focus:ring-green-500/50"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-lg bg-green-600 p-3 font-semibold text-white transition-colors duration-200 hover:bg-green-700"
              >
                Verify & Log In
              </button>
            </form>
            <button className="mt-4 w-full text-sm text-green-600 hover:underline" onClick={() => setStep('login')}>
              Resend / Change {method === 'mobile' ? 'Mobile' : 'Email'}
            </button>
          </>
        );

      case 'continue':
        return (
          <div className="text-center p-6">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h3 className="mb-2 text-2xl font-bold text-gray-800">Welcome Back!</h3>
            <p className="mb-6 text-gray-600">It looks like you were working on a recycling goal.</p>
            <button
              onClick={handleContinue}
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Continue where you left off
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full rounded-lg border border-gray-300 bg-white p-3 font-semibold text-gray-700 transition-colors duration-200 hover:bg-gray-100"
            >
              Go to Dashboard
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl transition-all duration-300 transform scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <button
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          onClick={onClose}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

// 7. Footer
const Footer = () => (
  <footer className="bg-gray-800 py-10 text-white">
    <div className="container mx-auto flex flex-col items-center justify-between px-6 md:flex-row">
      <div className="mb-6 text-center md:mb-0 md:text-left">
        <div className="flex items-center justify-center md:justify-start">
          <Leaf className="h-6 w-6 text-green-500" />
          <span className="ml-2 text-xl font-bold">EcoCycle Tech</span>
        </div>
        <p className="mt-2 text-sm text-gray-400">Transforming Waste. Empowering Communities.</p>
      </div>

      <div className="flex space-x-6">
        <a href="#" className="text-gray-400 transition-colors hover:text-green-500">
          About Us
        </a>
        <a href="#" className="text-gray-400 transition-colors hover:text-green-500">
          Careers
        </a>
        <a href="#" className="text-gray-400 transition-colors hover:text-green-500">
          Marketplace
        </a>
        <a href="#" className="text-gray-400 transition-colors hover:text-green-500">
          Contact
        </a>
      </div>
    </div>
    <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
      &copy; {new Date().getFullYear()} EcoCycle Tech. All rights reserved.
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
