/*import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { ProposedSolution } from "../components/ProposedSolution";
import { WorkflowProcess } from "../components/WorkflowProcess";
import { Benefits } from "../components/Benefits";
import { Testimonials } from "../components/Testimonials";
import { Footer } from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ProposedSolution />
      <WorkflowProcess />
      <Benefits />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;*/

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


// --- COMPONENTS ---

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

        <p className="mt-4 text-xl font-medium text-white-200 md:text-2xl"> {/* Subheadline color improved */}
          Scan. Sort. Earn. Strengthen local communities through circular recycling.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
          <button className="rounded-full bg-green-500 px-8 py-3 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:bg-green-600 hover:shadow-2xl">
            Get Started
          </button>
          <button className="rounded-full border border-white px-8 py-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-white hover:text-green-600">
            Learn More
          </button>
        </div>
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
      </main>

      <Footer />
      
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

    </>
  );
};

export default EnvironmentalLandingPage;