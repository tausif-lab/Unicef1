import { Camera, Brain, MapPin, Truck, Hammer, Store } from "lucide-react";
import workflowBg from "../assets/workflow-bg.jpg";

const steps = [
  { icon: Camera, title: "Capture", description: "Snap a photo of your plastic waste using our intuitive mobile app.", color: "from-orange-400 to-orange-600" },
  { icon: Brain, title: "Analyze", description: "AI instantly identifies the plastic type with industry-leading accuracy.", color: "from-purple-400 to-purple-600" },
  { icon: MapPin, title: "Guide", description: "Get directed to the correct color-coded collection bin in real-time.", color: "from-blue-400 to-blue-600" },
  { icon: Truck, title: "Collect", description: "Segregated waste is collected and transported to processing centers.", color: "from-teal-400 to-teal-600" },
  { icon: Hammer, title: "Transform", description: "Local communities craft valuable products from recycled materials.", color: "from-green-400 to-green-600" },
  { icon: Store, title: "Marketplace", description: "Products are listed and sold through our circular economy platform.", color: "from-amber-400 to-amber-600" },
];

export const WorkflowProcess = () => {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0"><div className="absolute inset-0 bg-foreground/[0.02]" /><img src={workflowBg} alt="Recycling workflow" className="w-full h-full object-cover opacity-[0.03]" /></div>
      <div className="container relative z-10 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">From Waste to Worth in <span className="bg-gradient-warm bg-clip-text text-transparent">Six Simple Steps</span></h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">Our streamlined process makes sustainable recycling accessible to everyone, everywhere.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="group relative bg-card rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-border/50 animate-slide-in-left" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-lg"><span className="text-white font-bold text-lg">{index + 1}</span></div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-md`}><step.icon className="w-7 h-7 text-white" /></div>
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{step.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">{step.description}</p>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-warm scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
