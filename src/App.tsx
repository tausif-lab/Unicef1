import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import EcoCycleShop from "./pages/EcoCycleShop";
import EcoDIYProducts from "./pages/EcoDIYProducts";
import Coupon from "./pages/Coupon";
import CompanyRegistration from "./pages/companyRegister";
import Registeredlocation from "./pages/map";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
         <Route path="/shop" element={<EcoCycleShop />} />
          <Route path="/diy-products" element={<EcoDIYProducts />} />
          <Route path="/coupons" element={<Coupon />} />
          
          <Route path="/company-register" element={<CompanyRegistration />} />
           <Route path="/location" element={<Registeredlocation />} />
          
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
