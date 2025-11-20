import { Waves, Target, DollarSign, Recycle, TrendingUp, Heart } from "lucide-react";

const benefits = [
  { icon: Waves, stat: "40%", title: "Cleaner Coastlines", description: "Significant reduction in plastic pollution across coastal communities and marine ecosystems." },
  { icon: Target, stat: "95%", title: "Sorting Accuracy", description: "Industry-leading precision in plastic identification ensures optimal recycling outcomes." },
  { icon: DollarSign, stat: "$2M+", title: "Community Income", description: "Generated sustainable revenue for local artisans through recycled product creation." },
  { icon: Recycle, stat: "80%", title: "Waste Diverted", description: "Prevented thousands of tons of plastic from ending up in landfills and oceans." },
  { icon: TrendingUp, stat: "3x", title: "Recycling Growth", description: "Accelerated adoption rates across communities compared to traditional methods." },
  { icon: Heart, stat: "2,000+", title: "Lives Impacted", description: "Empowered individuals with tools, knowledge, and economic opportunities." },
];

export const Benefits = () => {
  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="container px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">Measurable Impact, <span className="bg-gradient-eco bg-clip-text text-transparent">Lasting Change</span></h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">Our platform delivers tangible results for communities, environment, and economy.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="group bg-background rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-500 border border-border/50 hover:border-primary/30 animate-fade-up" style={{ animationDelay: `${index * 80}ms` }}>
              <div className="w-14 h-14 rounded-2xl bg-gradient-eco flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-md"><benefit.icon className="w-7 h-7 text-white" /></div>
              <div className="text-4xl font-bold bg-gradient-warm bg-clip-text text-transparent mb-3">{benefit.stat}</div>
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
