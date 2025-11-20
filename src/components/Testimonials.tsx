import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Maria Santos", role: "Community Leader, Manila", content: "RecycleHub transformed our coastal cleanup efforts. The AI identification is incredibly accurate, and our community now earns income from recycled products. It's a game-changer.", rating: 5, avatar: "MS" },
  { name: "Rajesh Kumar", role: "Waste Management Coordinator", content: "The platform's simplicity makes it accessible to everyone. We've seen a 3x increase in proper plastic segregation within just three months. Truly revolutionary technology.", rating: 5, avatar: "RK" },
  { name: "Amara Okafor", role: "Local Artisan, Lagos", content: "I've created a sustainable business crafting products from recycled plastics. The marketplace feature connects me directly with eco-conscious buyers. My income has doubled!", rating: 5, avatar: "AO" },
  { name: "Chen Wei", role: "Environmental Educator", content: "RecycleHub makes teaching sustainability engaging and practical. Students love the technology, and we're seeing real behavioral change in our school community.", rating: 5, avatar: "CW" },
];

export const Testimonials = () => {
  return (
    <section className="py-24 lg:py-32 bg-gradient-hero">
      <div className="container px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center mb-20 animate-fade-up">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">Trusted by <span className="bg-gradient-warm bg-clip-text text-transparent">Communities Worldwide</span></h2>
          <p className="text-xl text-muted-foreground font-light leading-relaxed">Real stories from people making a difference with RecycleHub.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="group relative bg-card rounded-3xl p-10 shadow-md hover:shadow-xl transition-all duration-500 border border-border/50 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-lg"><Quote className="w-6 h-6 text-white" /></div>
              <div className="flex gap-1 mb-6">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />))}</div>
              <p className="text-foreground text-lg leading-relaxed mb-8 italic">"{testimonial.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-eco flex items-center justify-center shadow-md"><span className="text-white font-bold text-lg">{testimonial.avatar}</span></div>
                <div><div className="font-bold text-foreground text-lg">{testimonial.name}</div><div className="text-muted-foreground text-sm">{testimonial.role}</div></div>
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-warm opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
