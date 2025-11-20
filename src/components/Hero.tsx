import { Button } from "../components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "../assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Sophisticated Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-overlay z-10" />
        <img
          src={heroImage}
          alt="Sustainable plastic transformation"
          className="w-full h-full object-cover scale-105"
        />
      </div>

      {/* Content */}
      <div className="container relative z-20 px-6 lg:px-12 pt-32 pb-20">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-up">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-3 bg-card/95 backdrop-blur-md px-6 py-3 rounded-full shadow-md border border-border/50">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground tracking-wide">Circular Economy Innovation</span>
          </div>

          {/* Oversized Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] max-w-4xl">
            Transforming Waste into{" "}
            <span className="block mt-2 bg-gradient-warm bg-clip-text text-transparent">
              Sustainable Future
            </span>
          </h1>

          {/* Refined Subheadline */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white/90 font-light max-w-3xl leading-relaxed">
            Empower communities with AI-powered recycling. Scan, segregate, earn—and turn plastic waste into valuable products.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-6">
            <Button 
              size="lg" 
              className="bg-gradient-warm text-white text-lg px-10 py-7 rounded-full shadow-xl hover:shadow-2xl transition-all duration-500 group border-0 font-semibold"
            >
              Start Your Journey
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md text-white border-white/30 text-lg px-10 py-7 rounded-full hover:bg-white/20 transition-all duration-300 font-semibold"
            >
              Explore Solutions
            </Button>
          </div>

          {/* Elegant Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 max-w-4xl">
            {[
              { value: "50K+", label: "Kg Recycled Monthly" },
              { value: "2,000+", label: "Active Community Members" },
              { value: "95%", label: "Identification Accuracy" },
              { value: "30+", label: "Partner Communities" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-lg rounded-3xl p-6 shadow-md border border-border/30 hover:shadow-xl hover:scale-105 transition-all duration-500"
              >
                <div className="text-3xl sm:text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Minimal Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-70">
        <div className="w-7 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
