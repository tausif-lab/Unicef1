import React, { useState} from 'react';
import {
  Leaf,
  MapPin,
  
  Search,
  Trash2,
  Info,
  AlertTriangle,
  Locate
} from 'lucide-react';

// --- UTILITY ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- TYPES ---
interface Dustbin {
  id: number;
  name: string;
  location: string;
  lat: number;
  lng: number;
  fillLevel: number; // Percentage
  status: 'Active' | 'Full' | 'Maintenance';
  lastCollection: string;
}

// --- MOCK DATA: GOA DUSTBINS ---
// Lat/Lng are used here to calculate relative positions on our custom map
const GOA_DUSTBINS: Dustbin[] = [
  {
    id: 1,
    name: "Bin #101 - Panaji Market",
    location: "Main Market Square, Panaji",
    lat: 15.4909,
    lng: 73.8278,
    fillLevel: 45,
    status: 'Active',
    lastCollection: '2 hours ago'
  },
  {
    id: 2,
    name: "Bin #102 - Miramar Circle",
    location: "Miramar Beach Road (1km North)",
    lat: 15.4999,
    lng: 73.8278,
    fillLevel: 80,
    status: 'Active',
    lastCollection: '5 hours ago'
  },
  {
    id: 3,
    name: "Bin #103 - Campal Gardens",
    location: "Campal Parade Ground (1km South)",
    lat: 15.4819,
    lng: 73.8278,
    fillLevel: 10,
    status: 'Active',
    lastCollection: '30 mins ago'
  },
  {
    id: 4,
    name: "Bin #104 - Patto Plaza",
    location: "Patto Business District (1km East)",
    lat: 15.4909,
    lng: 73.8378,
    fillLevel: 95,
    status: 'Full',
    lastCollection: '1 day ago'
  },
  {
    id: 5,
    name: "Bin #105 - Altinho Hill",
    location: "High Court Road (1km West)",
    lat: 15.4909,
    lng: 73.8178,
    fillLevel: 30,
    status: 'Active',
    lastCollection: '4 hours ago'
  }
];

// --- CUSTOM MAP COMPONENT ---
// Since we cannot load external mapping libraries, we build a lightweight SVG map
const CustomMap = ({ 
  bins, 
  selectedBinId, 
  onSelect 
}: { 
  bins: Dustbin[], 
  selectedBinId: number | null, 
  onSelect: (id: number) => void 
}) => {
  // Calculate bounding box to normalize coordinates to % for CSS positioning
  const minLat = Math.min(...bins.map(b => b.lat)) - 0.005;
  const maxLat = Math.max(...bins.map(b => b.lat)) + 0.005;
  const minLng = Math.min(...bins.map(b => b.lng)) - 0.005;
  const maxLng = Math.max(...bins.map(b => b.lng)) + 0.005;

  const getPosition = (lat: number, lng: number) => {
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100; // Latitude maps to Y (inverted)
    const x = ((lng - minLng) / (maxLng - minLng)) * 100; // Longitude maps to X
    return { top: `${y}%`, left: `${x}%` };
  };

  return (
    <div className="w-full h-full bg-[#E5F7F2] relative overflow-hidden group">
      {/* Abstract Map Background Pattern to simulate streets/blocks */}
      <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(#10B981 1px, transparent 1px), radial-gradient(#10B981 1px, transparent 1px)', 
          backgroundSize: '20px 20px', 
          backgroundPosition: '0 0, 10px 10px' 
      }}></div>
      
      {/* Simulated River/Coastline for Goa feel */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#BFDBFE] opacity-50 transform skew-x-12 origin-top-right border-l-4 border-white/50"></div>
      
      {/* Map Content */}
      <div className="absolute inset-0 p-8">
        {bins.map(bin => {
          const pos = getPosition(bin.lat, bin.lng);
          const isSelected = selectedBinId === bin.id;
          const isCritical = bin.fillLevel > 90;

          return (
            <div 
              key={bin.id}
              onClick={(e) => { e.stopPropagation(); onSelect(bin.id); }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500"
              style={pos}
            >
              {/* Ripple Effect for Critical Bins */}
              {isCritical && (
                <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
              )}

              {/* Marker Body */}
              <div className={cn(
                "relative z-10 w-12 h-12 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-110",
                isSelected ? "scale-125 z-20" : "",
                isCritical ? "bg-red-500" : "bg-[#10B981]"
              )}>
                <Trash2 size={20} className="text-white" />
                
                {/* Tooltip on Hover/Select */}
                {(isSelected) && (
                  <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-white rounded-xl shadow-xl p-3 animate-in fade-in slide-in-from-bottom-2 z-30 pointer-events-none">
                     <h4 className="font-bold text-[#111827] text-sm text-center">{bin.name}</h4>
                     <p className="text-[10px] text-center text-gray-500 mt-1">{bin.location}</p>
                     <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className={cn("h-full rounded-full", isCritical ? "bg-red-500" : "bg-[#10B981]")} 
                          style={{width: `${bin.fillLevel}%`}}
                        />
                     </div>
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rotate-45"></div>
                  </div>
                )}
              </div>
              
              {/* Shadow Point */}
              <div className="w-4 h-1 bg-black/20 rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 blur-[1px]"></div>
            </div>
          );
        })}
        
        {/* Current User Location Pin (Mock) */}
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
           <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md animate-pulse"></div>
        </div>
      </div>
      
      {/* Map Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
         <button className="bg-white p-3 rounded-full shadow-lg text-[#111827] hover:bg-gray-50 active:scale-95 transition-all">
            <Locate size={20} />
         </button>
      </div>
    </div>
  );
};

// --- COMPONENTS ---

const Header = () => (
  <header className="sticky top-0 z-[100] bg-white/90 backdrop-blur-md border-b border-[#D1FAE5]">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="bg-[#D1FAE5] p-2 rounded-xl text-[#10B981]">
          <Leaf size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-extrabold text-[#111827] tracking-tight">EcoMap<span className="text-[#10B981]">Locator</span></span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center px-4 py-2 bg-[#F9FAFB] rounded-xl border border-gray-200">
           <MapPin size={16} className="text-[#6B7280] mr-2" />
           <span className="text-sm font-bold text-[#111827]">Panaji, Goa</span>
        </div>
        <button className="p-2 bg-[#FDE68A] text-[#B45309] rounded-full hover:bg-[#FCD34D] transition-colors">
          <Info size={20} />
        </button>
      </div>
    </div>
  </header>
);

const BinListItem = ({ bin, onClick, isSelected }: { bin: Dustbin; onClick: () => void; isSelected: boolean }) => (
  <div 
    onClick={onClick}
    className={cn(
      "p-4 rounded-[16px] border cursor-pointer transition-all hover:shadow-md mb-3 flex items-start gap-3",
      isSelected 
        ? "bg-[#ECFDF5] border-[#10B981] shadow-[#10B981]/10" 
        : "bg-white border-gray-100 hover:border-[#D1FAE5]"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
      bin.fillLevel > 90 ? "bg-red-100 text-red-600" : "bg-[#D1FAE5] text-[#10B981]"
    )}>
      <Trash2 size={20} />
    </div>
    <div className="flex-grow">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-[#111827] text-sm">{bin.name}</h4>
        {bin.fillLevel > 90 && <AlertTriangle size={14} className="text-red-500" />}
      </div>
      <p className="text-xs text-[#6B7280] mt-0.5 truncate">{bin.location}</p>
      
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
           <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
             <div 
                className={cn("h-full rounded-full", bin.fillLevel > 90 ? "bg-red-500" : "bg-[#10B981]")} 
                style={{ width: `${bin.fillLevel}%` }}
             />
           </div>
           <span className="text-[10px] font-bold text-[#6B7280]">{bin.fillLevel}% Full</span>
        </div>
        <span className="text-[10px] text-[#6B7280] bg-gray-50 px-2 py-0.5 rounded-md">
           {bin.lastCollection}
        </span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---
const DustbinLocator: React.FC = () => {
  const [selectedBinId, setSelectedBinId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col h-screen overflow-hidden">
      <Header />

      <main className="flex-grow flex flex-col md:flex-row relative">
        
        {/* SIDEBAR */}
        <aside className="w-full md:w-96 bg-white z-20 flex flex-col shadow-xl md:border-r border-gray-100 h-[40vh] md:h-auto">
           <div className="p-6 border-b border-gray-100 bg-white">
              <h2 className="text-xl font-extrabold text-[#111827] mb-2">Nearby Bins</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
                <input 
                  type="text" 
                  placeholder="Search location..."
                  className="w-full pl-9 pr-4 py-2.5 bg-[#F9FAFB] border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#10B981] outline-none transition-all"
                />
              </div>
           </div>

           <div className="flex-grow overflow-y-auto p-4 space-y-2">
              {GOA_DUSTBINS.map((bin) => (
                <BinListItem 
                  key={bin.id} 
                  bin={bin} 
                  isSelected={selectedBinId === bin.id}
                  onClick={() => setSelectedBinId(bin.id)}
                />
              ))}
           </div>
           
           <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Active</span>
                 <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Critical</span>
                 <span className="flex items-center gap-1"><div className="w-4 h-1 rounded-full bg-blue-500"></div> You</span>
              </div>
           </div>
        </aside>

        {/* MAP VISUALIZATION */}
        <div className="flex-grow relative h-[60vh] md:h-auto z-10 bg-gray-50">
           <CustomMap 
             bins={GOA_DUSTBINS} 
             selectedBinId={selectedBinId} 
             onSelect={setSelectedBinId} 
           />
           
           {/* Overlay Info (Mobile Only) */}
           <div className="absolute top-4 left-4 right-4 md:hidden pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg text-center text-xs font-bold text-[#111827] shadow-sm border border-gray-200">
                Tap on markers to view status
              </div>
           </div>
        </div>

      </main>
    </div>
  );
};

export default DustbinLocator;