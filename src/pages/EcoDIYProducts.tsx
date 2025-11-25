import React, { useState } from 'react';
import { ArrowLeft, Search, Heart, ShoppingBag, ChevronDown, SlidersHorizontal, Star, ShoppingCart, Share2, X } from 'lucide-react';

import placeholderImage1 from '../assets/IMG_1471.jpg';
import placeholderImage2 from '../assets/IMG_1472.jpg';
import placeholderImage3 from '../assets/IMG_1473.jpg';
import placeholderImage4 from '../assets/IMG_1474.jpg';
import placeholderImage5 from '../assets/IMG_1475.jpg';
import placeholderImage6 from '../assets/IMG_1476.jpg';
import placeholderImage7 from '../assets/614MPycteqL.jpg';
import placeholderImage8 from '../Screenshot2.jpg';

import placeholderImage10 from '../Screenshot1.jpg';
import placeholderImage11 from '../Screenshot4.jpg';
import placeholderImage12 from '../Screenshot5.jpg';






interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  image: string;
  brand: string;
  rating: number;
  reviews: number;
  category: string;
  description: string;
  features: string[];
  materials: string;
  sustainability: string;
}

const EcoDIYProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  const products: Product[] = [
    {
  id: 1,
  name: 'Recycled Plastic Glue Gun Sticks',
  price: 8,
  originalPrice: 10,
  discount: 20,
  image: placeholderImage7,
  brand: 'EcoGrow',
  rating: 4.6,
  reviews: 412,
  category: 'diy-craft',
  description: 'High-quality glue gun sticks made from 100% recycled plastic. Designed for strong bonding, smooth flow, and fast setting. Ideal for crafts, DIY repairs, and model making.',
  features: [
    'Strong bonding with plastic, wood, fabric, and paper',
    'Low-temperature melting for safer use',
    'Smooth, consistent flow',
    'Non-toxic and odorless',
    'Uniform size for all mini glue guns'
  ],
  materials: 'LPDE 80% and HDPE 20% ,pine resine, wax',
  sustainability: 'Each pack diverts approximately 20g of plastic from landfills by turning waste into useful DIY material'
},

    {
      id: 2,
      name: 'Upcycled Bottle Organizer',
      price: 599,
      originalPrice: null,
      discount: null,
      image: placeholderImage1,
      brand: 'GreenSpace',
      rating: 4.8,
      reviews: 456,
      category: 'storage',
      description: 'Multi-compartment desk organizer crafted from upcycled plastic bottles. Keeps your workspace tidy and organized.',
      features: ['5 compartments', 'Non-slip base', 'Easy to clean', 'Modern design'],
      materials: 'Upcycled PET bottles',
      sustainability: 'Made from 15 recycled plastic bottles'
    },
    {
      id: 3,
      name: 'Eco-Friendly Storage Box',
      price: 449,
      originalPrice: 899,
      discount: 50,
      image:placeholderImage2,
      brand: 'RecycleHub',
      rating: 4.3,
      reviews: 189,
      category: 'storage',
      description: 'Stackable storage box with lid, perfect for organizing toys, clothes, or accessories. Made from recycled HDPE plastic.',
      features: ['Stackable design', 'Secure lid', '10L capacity', 'Reinforced handles'],
      materials: 'Recycled HDPE Plastic',
      sustainability: 'Diverts 1kg of plastic waste from landfills'
    },
    {
      id: 4,
      name: 'Recycled Plastic Vase',
      price: 299,
      originalPrice: 499,
      discount: 40,
      image: placeholderImage3,
      brand: 'EcoArt',
      rating: 4.6,
      reviews: 312,
      category: 'home-decor',
      description: 'Elegant decorative vase with textured finish. Each piece is unique, handmade from recycled plastic with artistic patterns.',
      features: ['Waterproof', 'Handcrafted', 'Unique patterns', 'Scratch resistant'],
      materials: 'Mixed Recycled Plastics',
      sustainability: 'Each vase reuses 300g of plastic waste'
    },
    {
      id: 5,
      name: 'DIY Garden Tool Kit',
      price: 799,
      originalPrice: 1299,
      discount: 38,
      image: placeholderImage4,
      brand: 'GreenTools',
      rating: 4.7,
      reviews: 567,
      category: 'garden',
      description: 'Complete gardening toolkit with 5 essential tools. Ergonomic handles made from recycled plastic for comfortable grip.',
      features: ['5-piece set', 'Ergonomic grip', 'Rust-proof', 'Carrying pouch included'],
      materials: 'Recycled PP & Steel',
      sustainability: 'Handles made from 100% recycled plastic'
    },
    {
      id: 6,
      name: 'Plastic Bottle Bird Feeder',
      price: 249,
      originalPrice: null,
      discount: null,
      image: placeholderImage5,
      brand: 'EcoGrow',
      rating: 4.4,
      reviews: 278,
      category: 'garden',
      description: 'Charming bird feeder crafted from upcycled bottles. Easy to fill and clean, attracts various bird species to your garden.',
      features: ['Easy refill', 'Weather resistant', 'Hanging hook included', 'Easy to clean'],
      materials: 'Upcycled PET Bottles',
      sustainability: 'Gives new life to discarded bottles'
    },
    {
      id: 7,
      name: 'Recycled Cutlery Set',
      price: 399,
      originalPrice: 699,
      discount: 43,
      image: placeholderImage6,
      brand: 'EcoTable',
      rating: 4.6,
      reviews: 423,
      category: 'kitchen',
      description: 'Durable cutlery set for 4 people. Made from food-grade recycled plastic. Perfect for picnics, camping, or everyday use.',
      features: ['BPA-free', 'Dishwasher safe', 'Lightweight', '12-piece set'],
      materials: 'Food-grade Recycled Plastic',
      sustainability: 'Made from 200g of recycled plastic'
    },
    {
  id: 8,
  name: 'Kutch-Style Woven Bag',
  price: 299,
  originalPrice: null,
  discount: null,
  image: placeholderImage8,
  brand: 'EcoCraft India',
  rating: 4.7,
  reviews: 312,
  category: 'fashion',
  description: 'Traditional Gujarat Kutch-inspired recycled-plastic woven bag crafted by rural artisans. Features bold geometric motifs, vibrant colors, and a strong cultural identity from the state of Gujarat.',
  features: ['Handwoven plastic strips', 'Kutch embroidery patterns', 'Lightweight & durable', 'Water-resistant'],
  materials: 'Recycled plastic packaging strips',
  sustainability: 'Made using 12 discarded plastic wrappers'
},

{
  id: 10,
  name: 'Channapatna Style Toy Miniature',
  price: 349,
  originalPrice: null,
  discount: null,
  image: placeholderImage10,
  brand: 'EcoCraft India',
  rating: 4.8,
  reviews: 189,
  category: 'toys',
  description: 'Colorful toy miniature made from recycled plastic, inspired by the iconic Channapatna lacquer toy craft of Karnataka. Features smooth rounded shapes and vibrant glossy colors typical of Karnataka’s craft heritage.',
  features: ['Glossy finish', 'Kid-safe paint', 'Handcrafted look', 'Durable build'],
  materials: 'Molded recycled plastic',
  sustainability: 'Made using 9 recycled plastic bottles'
},

{
  id: 12,
  name: 'Pattachitra Art Decorative Plate',
  price: 399,
  originalPrice: null,
  discount: null,
  image: placeholderImage12,
  brand: 'EcoCraft India',
  rating: 4.9,
  reviews: 301,
  category: 'art',
  description: 'Decorative plate crafted from recycled plastic and painted in the intricate Pattachitra style of Odisha. Showcases fine linework and folk motifs inspired by Odisha’s traditional art form.',
  features: ['Intricate hand-painting', 'Wall-mount ready', 'Lightweight', 'Waterproof finish'],
  materials: 'Recycled plastic plate',
  sustainability: 'Made using 5 repurposed plastic plates'
},
{
  id: 13,
  name: 'Phulkari Style Wall Art',
  price: 249,
  originalPrice: null,
  discount: null,
  image: placeholderImage11,
  brand: 'EcoCraft India',
  rating: 4.7,
  reviews: 198,
  category: 'home-decor',
  description: 'Colorful recycled-plastic wall art inspired by Punjab’s Phulkari embroidery. Features bright stitch-like patterns and motifs reflecting the cultural artistry of the state of Punjab.',
  features: ['Vibrant colors', 'Ready to hang', 'Hand-painted patterns', 'Reusable material'],
  materials: 'Recycled plastic sheet',
  sustainability: 'Made using 8 waste plastic covers'
}

    
  ];

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden';
  };

  const closeProductDetail = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between mb-3 lg:hidden">
            <div className="text-xs text-gray-500">11:29</div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>63%</span>
            </div>
          </div>

          {/* Navigation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EC</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">DIY ESSENTIALS</h1>
                  <p className="text-xs text-gray-500">{products.length} Items</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-5 h-5 text-gray-700" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-around max-w-md mx-auto lg:max-w-full">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">40% off</p>
              <p className="text-xs text-gray-600">upto ₹400</p>
            </div>
            <div className="w-px h-10 bg-emerald-200"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">ECO</p>
              <p className="text-xs text-gray-600">Rewards</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid - Responsive */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => openProductDetail(product)}
              className="bg-white rounded-[14px] overflow-hidden shadow-[0_4px_12px_rgba(16,185,129,0.08)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.12)] transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-50 aspect-[3/4] flex items-center justify-center">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
                
                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform active:scale-95"
                >
                  <Heart 
                    className={`w-4 h-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                  />
                </button>

                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute bottom-3 left-3 bg-amber-200 px-2 py-1 rounded-md">
                    <p className="text-xs font-bold text-gray-900">{product.discount}% OFF!</p>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-emerald-600">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>

                {/* Brand */}
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-100 px-2 py-0.5 rounded-md">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                      {product.brand}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-end lg:items-center justify-center p-0 lg:p-4">
            <div className="bg-white w-full lg:max-w-4xl lg:rounded-[24px] shadow-2xl animate-slide-up lg:animate-none max-h-screen overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 z-10 p-4 flex items-center justify-between">
                <button
                  onClick={closeProductDetail}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-700" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleFavorite(selectedProduct.id, e)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Heart 
                      className={`w-6 h-6 ${favorites.includes(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                    />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Product Image */}
              <div className="bg-gradient-to-br from-gray-100 to-gray-50 aspect-square lg:aspect-[16/9] flex items-center justify-center relative">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="object-cover w-full h-full lg:max-h-[500px]" />
                {selectedProduct.discount && (
                  <div className="absolute top-4 left-4 bg-amber-200 px-3 py-2 rounded-lg">
                    <p className="text-sm font-bold text-gray-900">{selectedProduct.discount}% OFF</p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                {/* Brand */}
                <div className="mb-3">
                  <span className="bg-emerald-100 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wide">
                    {selectedProduct.brand}
                  </span>
                </div>

                {/* Product Name */}
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {selectedProduct.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-emerald-500 px-2 py-1 rounded-md">
                    <span className="text-sm font-bold text-white">{selectedProduct.rating}</span>
                    <Star className="w-3 h-3 fill-white text-white" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedProduct.reviews} Reviews
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-emerald-600">
                    ₹{selectedProduct.price}
                  </span>
                  {selectedProduct.originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{selectedProduct.originalPrice}
                      </span>
                      <span className="text-emerald-600 font-bold">
                        ({selectedProduct.discount}% OFF)
                      </span>
                    </>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Product Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {selectedProduct.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Materials */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Materials</h3>
                  <p className="text-gray-600">{selectedProduct.materials}</p>
                </div>

                {/* Sustainability */}
                <div className="bg-emerald-50 rounded-[14px] p-4 mb-6">
                  <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    ♻️ Sustainability Impact
                  </h3>
                  <p className="text-emerald-700">{selectedProduct.sustainability}</p>
                </div>

                {/* Add to Cart Button */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white font-bold py-4 rounded-[14px] flex items-center justify-center gap-2 hover:from-emerald-600 hover:to-green-600 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_24px_rgba(16,185,129,0.2)]">
                    <ShoppingCart className="w-5 h-5" />
                    ADD TO BAG
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Filter Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-gray-700 hover:text-emerald-600 transition-colors">
              <span className="text-sm font-medium">CATEGORY</span>
            </button>
            
            <div className="w-px h-8 bg-gray-200"></div>
            
            <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors">
              <ChevronDown className="w-4 h-4" />
              <span className="text-sm font-medium">SORT</span>
            </button>
            
            <div className="w-px h-8 bg-gray-200"></div>
            
            <button className="flex items-center gap-2 text-gray-700 hover:text-emerald-600 transition-colors relative">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm font-medium">FILTER</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EcoDIYProducts;