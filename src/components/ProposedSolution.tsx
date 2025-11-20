import { Scan, Navigation, Users, ShoppingBag } from "lucide-react";

const solutions = [
  { icon: Scan, title: "AI-Powered Identification", description: "Advanced machine learning instantly identifies plastic types with 95% accuracy, ensuring proper segregation." },
  { icon: Navigation, title: "Smart Bin Guidance", description: "Real-time guidance directs users to the correct color-coded bins, making recycling effortless and accurate." },
  { icon: Users, title: "Community Empowerment", description: "Local artisans transform segregated waste into valuable products—DIY crafts, eco-bricks, and sustainable tiles." },
  { icon: ShoppingBag, title: "Circular Marketplace", description: "A thriving e-commerce platform where recycled products find new homes, closing the sustainability loop." },
];

export const ProposedSolution = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-hero">
      <div className="container px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Reimagining the <span className="bg-gradient-eco bg-clip-text text-transparent">Recycling Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">Our intelligent platform combines cutting-edge technology with community collaboration to transform waste management.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {solutions.map((solution, index) => (
            <div key={index} className="group bg-card rounded-3xl p-10 shadow-md hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-primary/30 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="w-16 h-16 rounded-2xl bg-gradient-warm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-md">
                <solution.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">{solution.title}</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
