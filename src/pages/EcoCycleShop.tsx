import  { useState } from 'react';
import { Search, Bell, Heart, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const EcoShop = () => {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const stores = [
    {
      id: 'coupons',
      title: 'EcoCoupons',
      subtitle: "Redeem Your Points",
      description: "Exchange For Rewards",
      bgColor: 'from-emerald-100 via-emerald-50 to-green-50',
      image: '🎟️',
      textColor: 'text-emerald-900'
    },
    {
      id: 'diy',
      title: 'DIY Essentials',
      subtitle: "Recycled Plastic Crafts",
      description: "Under ₹999",
      bgColor: 'from-green-100 via-emerald-50 to-teal-50',
      image: '♻️',
      textColor: 'text-green-900'
    },
    {
      id: 'quick',
      title: 'EcoExpress',
      subtitle: "Quick Delivery",
      description: "From 30 Mins",
      bgColor: 'from-emerald-50 via-green-50 to-emerald-100',
      image: '🚴',
      textColor: 'text-emerald-900'
    },
    {
      id: 'premium',
      title: 'ECO LUXE',
      subtitle: "Premium Sustainable",
      description: "Products",
      bgColor: 'from-amber-50 via-emerald-50 to-green-50',
      image: '🌿',
      textColor: 'text-gray-900'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-[14px] px-4 py-3 border border-gray-200">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EC</span>
              </div>
              <input
                type="text"
                placeholder='Search "Eco Products"'
                className="flex-1 bg-transparent text-gray-600 text-sm outline-none placeholder-gray-400"
              />
              <Search className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center justify-end gap-5 mb-2">
            <Bell className="w-6 h-6 text-gray-700" />
            <Heart className="w-6 h-6 text-gray-700" />
            <User className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </div>
     
      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Store</h2>

        {/* Store Cards */}
        <div className="space-y-4">
          {stores.map((store) => (
             <div
              key={store.id}
              onClick={() => {
              if (store.id === 'diy') navigate('/diy-products');
              if (store.id === 'coupons') navigate('/coupons');
              }}
             className="relative overflow-hidden rounded-[24px] shadow-[0_20px_40px_-12px_rgba(16,185,129,0.1)] hover:shadow-[0_24px_48px_-12px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 cursor-pointer active:scale-[0.98]"
             >

              <div className={`bg-gradient-to-br ${store.bgColor} p-6 min-h-[180px] flex flex-col justify-between`}>
                {/* Store Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-3xl font-extrabold ${store.textColor} mb-2`}>
                      {store.title}
                    </h3>
                    <p className={`text-sm font-medium ${store.textColor} opacity-80 mb-1`}>
                      {store.subtitle}
                    </p>
                    <p className={`text-sm ${store.textColor} opacity-70`}>
                      {store.description}
                    </p>
                  </div>
                  
                  {/* Icon/Image */}
                  <div className="text-6xl opacity-20">
                    {store.image}
                  </div>
                </div>

                {/* Enter Store Button */}
                <button className="flex items-center gap-2 text-gray-900 font-bold text-[16px] hover:gap-3 transition-all duration-300">
                  Enter Store
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Spacing */}
        <div className="h-24"></div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'home' ? 'text-emerald-500' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl">🏠</span>
              </div>
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('recycle')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'recycle' ? 'text-emerald-500' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl">♻️</span>
              </div>
              <span className="text-xs font-medium">Recycle</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'rewards' ? 'text-emerald-500' : 'text-gray-500'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <span className="text-xs font-medium">Rewards</span>
            </button>

            <button
              onClick={() => setActiveTab('bag')}
              className={`flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'bag' ? 'text-emerald-500' : 'text-gray-500'
              }`}
            >
              <ShoppingBag className={`w-6 h-6 ${activeTab === 'bag' ? 'text-emerald-500' : 'text-gray-500'}`} />
              <span className="text-xs font-medium">Bag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoShop;