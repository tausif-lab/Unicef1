import React, { useState, useRef } from 'react';
import {
  Leaf,

  FileText,
  Video,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  Building2,
  UserCheck,
  Factory,
  ArrowRight,
  Info,
  Loader2,
  
} from 'lucide-react';

// --- UTILITY ---
const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

// --- COMPONENTS ---

// 1. Header (Minimalist for Registration Focus)
const Header = () => (
  <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#D1FAE5]">
    <div className="container mx-auto px-6 h-20 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="bg-[#D1FAE5] p-2 rounded-xl text-[#10B981]">
          <Leaf size={24} strokeWidth={2.5} />
        </div>
        <span className="text-xl font-extrabold text-[#111827] tracking-tight">EcoPartner<span className="text-[#10B981]">Verify</span></span>
      </div>
      <div className="hidden md:flex items-center gap-2 text-sm font-semibold text-[#6B7280]">
        <ShieldCheck size={16} className="text-[#10B981]" />
        Secure SSL Registration
      </div>
    </div>
  </header>
);

// 2. File Upload Component (Eco-Styled)
const FileUpload = ({ 
  label, 
  subtext, 
  icon: Icon, 
  accept, 
  onChange 
}: { 
  label: string; 
  subtext: string; 
  icon: any; 
  accept: string;
  onChange: (file: File | null) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      onChange(selectedFile);
    }
  };

  return (
    <div className="group relative">
      <label className="block text-sm font-bold text-[#111827] mb-2">{label}</label>
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-[16px] p-6 cursor-pointer transition-all duration-300 flex flex-col items-center text-center",
          file 
            ? "border-[#10B981] bg-[#ECFDF5]" 
            : "border-gray-200 bg-[#F9FAFB] hover:border-[#34D399] hover:bg-[#F0FDF4]"
        )}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={accept} 
          onChange={handleFileChange}
        />
        
        {file ? (
          <>
            <div className="bg-[#10B981] p-3 rounded-full text-white mb-2 shadow-lg shadow-[#10B981]/20">
              <CheckCircle size={24} />
            </div>
            <p className="text-sm font-bold text-[#064E3B] truncate max-w-full px-4">{file.name}</p>
            <p className="text-xs text-[#059669] mt-1">Click to replace</p>
          </>
        ) : (
          <>
            <div className="bg-white p-3 rounded-full text-[#6B7280] shadow-sm mb-3 group-hover:text-[#10B981] group-hover:scale-110 transition-all">
              <Icon size={24} />
            </div>
            <p className="text-sm font-semibold text-[#111827]">Click to upload {subtext}</p>
            <p className="text-xs text-[#6B7280] mt-1">SVG, PNG, JPG, PDF or MP4 (max. 10MB)</p>
          </>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const CompanyRegistration: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State (Simplified for UI Demo)
  const [formData, setFormData] = useState({
    companyName: '',
    regNumber: '',
    ownerName: '',
    aadhaar: '',
    wasteDeclaration: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API Call / Validation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-sans flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white rounded-[32px] p-8 md:p-12 text-center shadow-[0_20px_40px_-12px_rgba(16,185,129,0.15)] border border-[#D1FAE5] animate-in zoom-in-95">
            <div className="w-24 h-24 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={48} className="text-[#10B981]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[#111827] mb-4">Application Submitted</h2>
            <p className="text-[#6B7280] text-lg mb-8 leading-relaxed">
              Thank you for registering. Our verification team will manually review your documents within <span className="font-bold text-[#10B981]">24-48 hours</span>. You will receive an email once your seller account is activated.
            </p>
            <div className="bg-[#FFFBEB] p-4 rounded-[16px] border border-[#FDE68A] text-left mb-8">
               <h4 className="flex items-center gap-2 font-bold text-[#B45309] mb-1">
                 <AlertTriangle size={18} /> Why the wait?
               </h4>
               <p className="text-sm text-[#92400E]">
                 To keep our marketplace authentic and spam-free, we strictly verify every single manufacturer manually.
               </p>
            </div>
            <button 
              onClick={() => window.location.href = '/'} 
              className="w-full py-4 bg-[#111827] text-white rounded-[16px] font-bold hover:bg-gray-800 transition-all"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-[#111827]">
      <Header />

      <main className="container mx-auto px-6 py-12">
        
        {/* Page Title */}
        <div className="max-w-3xl mx-auto text-center mb-10">
           <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Partner Registration</h1>
           <p className="text-[#6B7280] text-lg">
             Join our circular economy marketplace. Complete the verification below to start listing your recycled products.
           </p>
        </div>

        {/* Compliance Warning (Anti-Spam) - Warm Accent */}
        <div className="max-w-3xl mx-auto mb-8 bg-[#FFFBEB] border border-[#FDE68A] rounded-[20px] p-5 flex items-start gap-4 shadow-sm">
           <div className="p-2 bg-[#FDE68A] rounded-full text-[#B45309] shrink-0">
             <AlertTriangle size={20} />
           </div>
           <div>
             <h3 className="font-bold text-[#B45309] text-sm uppercase tracking-wide mb-1">Mandatory Verification</h3>
             <p className="text-sm text-[#92400E]">
               Incomplete applications will be rejected immediately. We require proof of manufacturing to prevent spam and ensure genuine recycling.
             </p>
           </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-3xl mx-auto bg-white rounded-[24px] shadow-[0_20px_40px_-12px_rgba(16,185,129,0.1)] border border-gray-100 overflow-hidden">
          
          {/* Progress Bar */}
          <div className="bg-gray-50 h-2 w-full">
            <div className="h-full bg-[#10B981] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10">
            
            {/* STEP 1: COMPANY IDENTITY */}
            {step === 1 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center font-bold">1</div>
                  <h2 className="text-xl font-bold">Company Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#374151]">Company Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. Green Earth Solutions Pvt Ltd"
                      className="w-full p-4 bg-[#F9FAFB] border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#374151]">Registration No. (UDYAM/GST)</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. UDYAM-XX-00-0000000"
                      className="w-full p-4 bg-[#F9FAFB] border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-[#10B981] focus:border-transparent outline-none transition-all"
                      value={formData.regNumber}
                      onChange={(e) => setFormData({...formData, regNumber: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <FileUpload 
                    label="Upload Registration Certificate" 
                    subtext="UDYAM / GST / MSME Certificate"
                    icon={Building2}
                    accept=".pdf,.jpg,.png"
                    onChange={(file) => console.log(file)}
                  />
                </div>

                <div className="flex justify-end">
                   <button 
                     type="button" 
                     onClick={() => setStep(2)}
                     className="px-8 py-3 bg-[#10B981] text-white rounded-[14px] font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-[#10B981]/20"
                   >
                     Next Step <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            )}

            {/* STEP 2: OWNER KYC & MANUFACTURING PROOF */}
            {step === 2 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center font-bold">2</div>
                  <h2 className="text-xl font-bold">Owner & Manufacturing Proof</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#374151]">Owner's Full Name</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="As per Aadhaar"
                      className="w-full p-4 bg-[#F9FAFB] border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-[#10B981] outline-none"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#374151]">Aadhaar Number</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="XXXX-XXXX-XXXX"
                      className="w-full p-4 bg-[#F9FAFB] border border-gray-200 rounded-[16px] focus:ring-2 focus:ring-[#10B981] outline-none"
                      value={formData.aadhaar}
                      onChange={(e) => setFormData({...formData, aadhaar: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <FileUpload 
                    label="Aadhaar e-KYC Upload" 
                    subtext="Front & Back Copy"
                    icon={UserCheck}
                    accept=".pdf,.jpg,.png"
                    onChange={() => {}}
                  />
                   <FileUpload 
                    label="Manufacturing Proof" 
                    subtext="Factory Photo / Invoice / Cert"
                    icon={Factory}
                    accept=".pdf,.jpg,.png"
                    onChange={() => {}}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-[16px] border border-blue-100 flex items-start gap-3 mb-8">
                   <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                   <p className="text-sm text-blue-800">
                     <strong>Tip:</strong> For manufacturing proof, a simple photo of your facility with your company board is often the fastest way to get verified.
                   </p>
                </div>

                <div className="flex justify-between">
                   <button 
                     type="button" 
                     onClick={() => setStep(1)}
                     className="px-6 py-3 text-[#6B7280] font-bold hover:text-[#111827] transition-colors"
                   >
                     Back
                   </button>
                   <button 
                     type="button" 
                     onClick={() => setStep(3)}
                     className="px-8 py-3 bg-[#10B981] text-white rounded-[14px] font-bold hover:bg-[#059669] transition-all flex items-center gap-2 shadow-lg shadow-[#10B981]/20"
                   >
                     Next Step <ArrowRight size={18} />
                   </button>
                </div>
              </div>
            )}

            {/* STEP 3: VIDEO & AUTHENTICITY */}
            {step === 3 && (
              <div className="animate-in slide-in-from-right-8 fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[#D1FAE5] text-[#10B981] flex items-center justify-center font-bold">3</div>
                  <h2 className="text-xl font-bold">Verification & Authenticity</h2>
                </div>

                {/* Video Upload Section */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-[#111827]">Verification Video (10-20s)</label>
                    <span className="text-xs bg-[#FDE68A] text-[#B45309] px-2 py-0.5 rounded-md font-bold">REQUIRED</span>
                  </div>
                  <p className="text-xs text-[#6B7280] mb-3">
                    Record a short video showing your product and mentioning "EcoCycle Verification". This proves you have the stock.
                  </p>
                  <FileUpload 
                    label="" 
                    subtext="Short Video Clip"
                    icon={Video}
                    accept="video/*"
                    onChange={() => {}}
                  />
                </div>

                {/* Material Authenticity Section */}
                <div className="border-t border-gray-100 pt-8 mb-8">
                  <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                    <Leaf size={20} className="text-[#10B981]" /> Material Authenticity
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                     {/* Option A */}
                     <div className="p-4 border border-gray-200 rounded-[16px] hover:border-[#34D399] transition-colors">
                        <div className="flex items-start gap-3 mb-3">
                          <input type="radio" name="authType" id="selfDec" className="mt-1 text-[#10B981] focus:ring-[#10B981]" defaultChecked />
                          <label htmlFor="selfDec" className="text-sm font-bold text-[#111827]">Self Declaration + Photos</label>
                        </div>
                        <p className="text-xs text-[#6B7280] ml-7">
                          I certify these products are made from recycled materials.
                        </p>
                     </div>
                     {/* Option B */}
                     <div className="p-4 border border-gray-200 rounded-[16px] hover:border-[#34D399] transition-colors">
                        <div className="flex items-start gap-3 mb-3">
                          <input type="radio" name="authType" id="batchCert" className="mt-1 text-[#10B981] focus:ring-[#10B981]" />
                          <label htmlFor="batchCert" className="text-sm font-bold text-[#111827]">Batch Certificate</label>
                        </div>
                        <p className="text-xs text-[#6B7280] ml-7">
                          I have a lab report or batch cert for my materials.
                        </p>
                     </div>
                  </div>

                  <FileUpload 
                    label="Upload Waste Source Proof / Process Photos" 
                    subtext="Raw Material Invoice or Recycling Photos"
                    icon={FileText}
                    accept=".pdf,.jpg,.png"
                    onChange={() => {}}
                  />
                </div>

                {/* Final Checkbox */}
                <div className="flex items-start gap-3 mb-8 bg-[#F9FAFB] p-4 rounded-[12px]">
                   <input 
                     required
                     type="checkbox" 
                     id="declaration" 
                     className="mt-1 rounded text-[#10B981] focus:ring-[#10B981] w-4 h-4"
                     checked={formData.wasteDeclaration}
                     onChange={(e) => setFormData({...formData, wasteDeclaration: e.target.checked})}
                   />
                   <label htmlFor="declaration" className="text-xs text-[#4B5563] leading-relaxed">
                     I declare that all information provided is true. I understand that submitting fake documents will result in a <strong>permanent ban</strong> from the EcoCycle platform.
                   </label>
                </div>

                <div className="flex justify-between items-center">
                   <button 
                     type="button" 
                     onClick={() => setStep(2)}
                     className="px-6 py-3 text-[#6B7280] font-bold hover:text-[#111827] transition-colors"
                   >
                     Back
                   </button>
                   <button 
                     type="submit" 
                     disabled={isSubmitting || !formData.wasteDeclaration}
                     className={cn(
                       "px-8 py-3 rounded-[14px] font-bold flex items-center gap-2 shadow-lg transition-all",
                       isSubmitting || !formData.wasteDeclaration
                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                         : "bg-[#10B981] text-white hover:bg-[#059669] shadow-[#10B981]/20 hover:scale-[1.02]"
                     )}
                   >
                     {isSubmitting ? (
                       <><Loader2 className="animate-spin" size={18} /> Verifying...</>
                     ) : (
                       <>Submit Application <CheckCircle size={18} /></>
                     )}
                   </button>
                </div>
              </div>
            )}
            
          </form>
        </div>
      </main>

      {/* Footer (Simplified) */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12 text-center text-sm text-[#6B7280]">
         <p>&copy; 2024 EcoCycle Verification. Built for Trust.</p>
      </footer>
    </div>
  );
};

export default CompanyRegistration;