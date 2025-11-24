import React, { useState, useEffect } from 'react';
import {
  Leaf,
  DollarSign,
  
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Star,
  
  Search,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

// --- UTILITY: Class Merger ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- MOCK DATA ---
interface Coupon {
  id: number;
  name: string;
  description: string;
  cost: number;
  savings: string;
  expiry: string;
  imageUrl: string;
  category: string;
}

const mockCoupons: Coupon[] = [
  {
    id: 1,
    name: "NES AIRBNB ",
    description: "Stream unlimited movies and shows",
    cost: 50,
    savings: "25%",
    expiry: "Valid for 30 days",
    imageUrl: "https://placehold.co/80x80/DC2626/ffffff?text=N",
    category: "Food"
  },
  {
    id: 2,
  name: "ANISA INTERNATIONALS",
    description: "Get your favorite coffee and treats",
    cost: 120,
    savings: "15%",
    expiry: "Valid until 12/31/2025",
    imageUrl: "https://placehold.co/80x80/3B82F6/ffffff?text=S",
    category: "Food"
  },
  {
    id: 3,
    name: "MAHI COFFEE HOUSE",
    description: "Enjoy premium coffee selections",
    cost: 80,
    savings: "25%",
    expiry: "No expiry date",
    imageUrl: "https://placehold.co/80x80/F97316/ffffff?text=M",
    category: "Shopping"
  },
  {
    id: 4,
    name: "SOURABHS BARS",
    description: "Fresh coffee delivered to your door",
    cost: 100,
    savings: "25%",
    expiry: "Valid for 90 days",
    imageUrl: "https://placehold.co/80x80/059669/ffffff?text=S",
    category: "Sports Ticket"
  },
  {
    id: 5,
    name: "DAKSH FURNITURES",
    description: "Premium coffee experience",
    cost: 200,
    savings: "25%",
    expiry: "Always valid",
    imageUrl: "https://placehold.co/80x80/1F2937/ffffff?text=N",
    category: "Food"
  },
  {
    id: 6,
    name: "SHENKY SHECKS",
    description: "Artisan coffee blends",
    cost: 60,
    savings: "25%",
    expiry: "Valid for 7 days",
    imageUrl: "https://placehold.co/80x80/DB2777/ffffff?text=S",
    category: "Food"
  },
];

// --- COMPONENTS ---

/**
 * Header Component - Refined to match Eco-Aesthetic Guide strictly.
 * Uses Emerald (#10B981) for primary elements and Warm Accent (#FDE68A) for points.
 */
const Header: React.FC<{ points: number }> = ({ points }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D1FAE5] shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#D1FAE5] p-2 rounded-xl text-[#10B981]">
            <Leaf size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold text-[#111827] tracking-tight">EcoRewards</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {['All Rewards', 'My Vouchers', 'How it Works', 'FAQ'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`} 
              className="text-sm font-bold text-[#6B7280] hover:text-[#10B981] transition-colors uppercase tracking-wide"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Actions Area */}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
             <input 
               type="text" 
               placeholder="Search..." 
               className="pl-9 pr-4 py-2 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none w-48 transition-all"
             />
          </div>

          {/* Points Widget - Strictly using #FDE68A (Amber-200) from Design Guide */}
          <div className="bg-[#FFFBEB] pl-3 pr-4 py-1.5 rounded-full flex items-center gap-2 border border-[#FDE68A] shadow-sm">
             <div className="bg-[#FDE68A] p-1 rounded-full">
                <DollarSign size={14} className="text-[#B45309]" strokeWidth={3} />
             </div>
             <div>
                <span className="block text-sm font-extrabold text-[#111827] leading-none">{points}</span>
                <span className="block text-[10px] font-bold text-[#B45309] uppercase leading-none">Pts</span>
             </div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-[#111827]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 absolute w-full shadow-lg">
          <nav className="flex flex-col gap-4">
             {['All Rewards', 'My Vouchers', 'How it Works', 'FAQ'].map((item) => (
              <a key={item} href="#" className="text-[#111827] font-bold py-2">{item}</a>
             ))}
          </nav>
        </div>
      )}
    </header>
  );
};

/**
 * CouponCard Component - Ticket Style Design
 */
const CouponCard: React.FC<{ coupon: Coupon, onPurchase: (cost: number) => void, userPoints: number }> = ({ coupon, onPurchase, userPoints }) => {
  const isAffordable = userPoints >= coupon.cost;

  // Color mapping based on coupon ID
  const colorMap: Record<number, string> = {
    1: '#DC2626', // Red for Netflix
    2: '#3B82F6', // Blue for Starbucks
    3: '#F97316', // Orange
    4: '#059669', // Green
    5: '#1F2937', // Dark Gray/Black
    6: '#DB2777', // Pink
  };

  const bgColor = colorMap[coupon.id] || '#3B82F6';

  return (
    <div className="relative">
      {/* Ticket Shape with Left Notch */}
      <div 
        className="relative rounded-[20px] overflow-hidden shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
        style={{ backgroundColor: bgColor }}
      >
        {/* Left circular notch cutout effect */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F9FAFB] rounded-full -translate-x-3 z-10"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F9FAFB] rounded-full translate-x-3 z-10"></div>

        <div className="p-6 flex flex-col items-center text-center text-white relative">
          
          {/* Brand Name */}
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-90">
            {coupon.name}
          </h3>
          
          {/* Discount Display */}
          <div className="mb-6">
            <div className="text-5xl font-black mb-1">
              {coupon.savings}
            </div>
            <div className="text-lg font-bold opacity-90">
              OFF
            </div>
          </div>

          {/* Logo Container */}
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-md">
            <img 
              src={coupon.imageUrl} 
              alt={coupon.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>

          {/* Dotted Line Separator */}
          <div className="w-full border-t-2 border-dashed border-white/30 mb-6"></div>

          {/* Redeem Button */}
          <button
            onClick={() => onPurchase(coupon.cost)}
            disabled={!isAffordable}
            className={cn(
              "w-full py-3 rounded-full text-base font-bold transition-all shadow-md",
              isAffordable
                ? "bg-white text-gray-800 hover:bg-gray-100 active:scale-[0.98]"
                : "bg-white/50 text-gray-500 cursor-not-allowed"
            )}
          >
            {isAffordable ? 'Redeem' : 'Insufficient Points'}
          </button>

          {/* Points Cost (small text at bottom) */}
          <div className="mt-3 text-xs opacity-75">
            {coupon.cost} points • {coupon.expiry}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Footer Component - Refined to match Eco-Aesthetic Guide.
 * Uses clean neutrals and Emerald accents.
 */
const Footer: React.FC = () => (
  <footer className="bg-white border-t border-gray-100 mt-20 pt-16 pb-8">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Column 1: Brand */}
        <div className="space-y-4">
           <div className="flex items-center gap-2">
              <Leaf className="text-[#10B981]" size={24} />
              <span className="text-lg font-extrabold text-[#111827]">EcoRewards</span>
           </div>
           <p className="text-sm text-[#6B7280] leading-relaxed">
             Turning your sustainable actions into real-world rewards. Join the movement today.
           </p>
           <div className="flex gap-4 pt-2">
             <div className="p-2 bg-[#F9FAFB] rounded-full text-[#6B7280] hover:bg-[#D1FAE5] hover:text-[#10B981] transition-colors cursor-pointer"><Facebook size={18} /></div>
             <div className="p-2 bg-[#F9FAFB] rounded-full text-[#6B7280] hover:bg-[#D1FAE5] hover:text-[#10B981] transition-colors cursor-pointer"><Twitter size={18} /></div>
             <div className="p-2 bg-[#F9FAFB] rounded-full text-[#6B7280] hover:bg-[#D1FAE5] hover:text-[#10B981] transition-colors cursor-pointer"><Instagram size={18} /></div>
           </div>
        </div>

        {/* Column 2: Links */}
        <div>
          <h4 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider mb-6">Company</h4>
          <ul className="space-y-3 text-sm text-[#6B7280]">
            <li><a href="#" className="hover:text-[#10B981] transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Partners</a></li>
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Sustainability</a></li>
          </ul>
        </div>

        {/* Column 3: Support */}
        <div>
          <h4 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider mb-6">Support</h4>
          <ul className="space-y-3 text-sm text-[#6B7280]">
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-[#10B981] transition-colors">Contact</a></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
           <h4 className="text-sm font-extrabold text-[#111827] uppercase tracking-wider mb-6">Stay Updated</h4>
           <p className="text-sm text-[#6B7280] mb-4">Get the latest eco-tips and reward updates.</p>
           <div className="flex flex-col gap-3">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="w-full px-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none"
             />
             <button className="w-full py-2.5 bg-[#10B981] text-white font-bold rounded-xl hover:bg-[#059669] transition-colors shadow-lg shadow-[#10B981]/20">
               Subscribe
             </button>
           </div>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-[#9CA3AF]">&copy; 2024 EcoRewards Platform. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-[#6B7280] font-medium">
           <a href="#" className="hover:text-[#10B981]">Privacy</a>
           <a href="#" className="hover:text-[#10B981]">Cookies</a>
           <a href="#" className="hover:text-[#10B981]">Legal</a>
        </div>
      </div>
    </div>
  </footer>
);

// --- MAIN APPLICATION COMPONENT ---
const RewardsGallery: React.FC = () => {
  const [points, setPoints] = useState<number>(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Load/Save Points
  useEffect(() => {
    const savedPoints = localStorage.getItem('ecoPoints');
    if (savedPoints) {
      setPoints(JSON.parse(savedPoints));
    } else {
      setPoints(450); // Default for demo
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecoPoints', JSON.stringify(points));
  }, [points]);

  const handlePurchase = (cost: number) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setMessage({
        type: 'success',
        text: `Success! Redeemed coupon for ${cost} points. Find it in 'My Vouchers'.`
      });
    } else {
      setMessage({
        type: 'error',
        text: 'Not enough points! Recycle more to earn.'
      });
    }
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#111827]">
      
      <Header points={points} />

      <main className="container mx-auto px-6 py-12 lg:py-16">
        
        {/* Page Heading - Centered and Clean */}
        <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#059669] text-xs font-bold uppercase tracking-widest mb-4">
              <Star size={12} fill="currentColor" /> Exclusive Perks
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#111827] mb-4 tracking-tight">
              Redeem Your <span className="text-[#10B981]">EcoPoints</span>
            </h1>
            <p className="text-lg text-[#6B7280] leading-relaxed">
               You've done the hard work of recycling. Now enjoy rewards from our sustainable partners. From coffee to zero-waste gear, it's all here.
            </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mockCoupons.map(coupon => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onPurchase={handlePurchase}
              userPoints={points}
            />
          ))}
        </div>
        
        {/* Featured / Promo Banner */}
        <div className="rounded-[24px] bg-[#10B981] overflow-hidden relative shadow-2xl shadow-[#10B981]/30">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left text-white">
                    <h2 className="text-3xl font-extrabold mb-2">Want to partner with us?</h2>
                    <p className="text-[#D1FAE5] text-lg max-w-md">List your sustainable business here and reach thousands of eco-conscious customers.</p>
                </div>
                <button className="px-8 py-4 bg-white text-[#065F46] rounded-xl font-bold text-lg shadow-lg hover:bg-[#F0FDF4] transition-all flex items-center gap-2 active:scale-[0.98]">
                    Become a Partner <ArrowRight size={20} />
                </button>
            </div>
        </div>

      </main>
      
      {/* Toast Notification */}
      {message && (
         <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-in slide-in-from-bottom-5 duration-300 ${
           message.type === 'success'
             ? 'bg-[#064E3B] text-white border border-[#065F46]'
             : 'bg-[#991B1B] text-white border border-[#7F1D1D]'
         }`}>
           <div className={`p-1 rounded-full ${message.type === 'success' ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}>
             {message.type === 'success' ? <CheckCircle size={16} className="text-white" /> : <AlertCircle size={16} className="text-white" />}
           </div>
           {message.text}
         </div>
      )}

      <Footer />
    </div>
  );
};

export default RewardsGallery;