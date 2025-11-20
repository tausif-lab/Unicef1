import { Button } from "../components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "../components/NavLink";

export const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-foreground tracking-tight">RecycleHub</span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-10">
            <NavLink to="/" className="text-foreground/80 hover:text-foreground transition-colors font-medium text-[15px]">Home</NavLink>
            <NavLink to="/about" className="text-foreground/80 hover:text-foreground transition-colors font-medium text-[15px]">About</NavLink>
            <NavLink to="/solutions" className="text-foreground/80 hover:text-foreground transition-colors font-medium text-[15px]">Solutions</NavLink>
            <NavLink to="/impact" className="text-foreground/80 hover:text-foreground transition-colors font-medium text-[15px]">Impact</NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="lg" className="font-medium text-[15px]" asChild>
              <NavLink to="/contact">Contact</NavLink>
            </Button>
            <Button size="lg" className="bg-gradient-warm text-white rounded-full px-8 shadow-md hover:shadow-lg font-semibold text-[15px]" asChild>
              <NavLink to="/login">Get Started</NavLink>
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-6 animate-fade-in border-t border-border/40">
            <NavLink to="/" className="block text-foreground hover:text-primary transition-colors py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
            <NavLink to="/about" className="block text-foreground hover:text-primary transition-colors py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>About</NavLink>
            <NavLink to="/solutions" className="block text-foreground hover:text-primary transition-colors py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Solutions</NavLink>
            <NavLink to="/impact" className="block text-foreground hover:text-primary transition-colors py-2 text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Impact</NavLink>
            <div className="flex flex-col space-y-3 pt-4">
              <Button variant="outline" size="lg" className="rounded-full" asChild><NavLink to="/contact">Contact Us</NavLink></Button>
              <Button size="lg" className="bg-gradient-warm text-white rounded-full shadow-md" asChild><NavLink to="/login">Get Started</NavLink></Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
