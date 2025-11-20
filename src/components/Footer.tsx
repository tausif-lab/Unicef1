import { NavLink } from "../components/NavLink";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card-dark text-card-dark-foreground border-t border-border/20">
      <div className="container px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-warm flex items-center justify-center shadow-lg"><span className="text-white font-bold text-xl">R</span></div>
              <span className="text-2xl font-bold">RecycleHub</span>
            </div>
            <p className="text-card-dark-foreground/70 leading-relaxed text-[15px]">Transforming plastic waste into sustainable value through AI-powered technology and community empowerment.</p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-card-dark-foreground/10 hover:bg-gradient-warm flex items-center justify-center transition-all duration-300 group">
                  <Icon className="w-5 h-5 text-card-dark-foreground/70 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
          <div><h3 className="font-bold text-lg mb-6">Quick Links</h3><ul className="space-y-4">{['Home', 'About Us', 'Solutions', 'Impact'].map((item, i) => (<li key={i}><NavLink to={i === 0 ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-card-dark-foreground/70 hover:text-card-dark-foreground transition-colors text-[15px]">{item}</NavLink></li>))}</ul></div>
          <div><h3 className="font-bold text-lg mb-6">Resources</h3><ul className="space-y-4">{['Blog', 'FAQ', 'Support', 'Privacy Policy'].map((item, i) => (<li key={i}><NavLink to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-card-dark-foreground/70 hover:text-card-dark-foreground transition-colors text-[15px]">{item}</NavLink></li>))}</ul></div>
          <div><h3 className="font-bold text-lg mb-6">Get in Touch</h3><ul className="space-y-4"><li className="flex items-start gap-3"><Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" /><a href="mailto:hello@recyclehub.com" className="text-card-dark-foreground/70 hover:text-card-dark-foreground transition-colors text-[15px]">hello@recyclehub.com</a></li><li className="flex items-start gap-3"><Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" /><a href="tel:+1234567890" className="text-card-dark-foreground/70 hover:text-card-dark-foreground transition-colors text-[15px]">+1 (234) 567-890</a></li><li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" /><span className="text-card-dark-foreground/70 text-[15px]">123 Eco Street, Green City, EC 12345</span></li></ul></div>
        </div>
        <div className="border-t border-card-dark-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-card-dark-foreground/60 text-sm">© {new Date().getFullYear()} RecycleHub. All rights reserved.</p>
          <div className="flex gap-6">{['Terms of Service', 'Privacy Policy'].map((item, i) => (<NavLink key={i} to={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-card-dark-foreground/60 hover:text-card-dark-foreground transition-colors text-sm">{item}</NavLink>))}</div>
        </div>
      </div>
    </footer>
  );
};
