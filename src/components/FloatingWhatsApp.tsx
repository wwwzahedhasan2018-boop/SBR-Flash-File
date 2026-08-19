import React from 'react';
import { MessageCircle, ShieldCheck } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const phoneNumber = '+8801610138733';
  const cleanNumber = '8801610138733';
  const defaultText = encodeURIComponent(
    'Assalamu Alaikum SBRFlashFile Support, I need assistance with mobile firmware/file download.'
  );
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${defaultText}`;

  return (
    <div id="floating-whatsapp-widget" className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Direct One-Click WhatsApp Button */}
      <a
        id="btn-floating-whatsapp"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs sm:text-sm py-3 px-4 sm:px-5 rounded-full shadow-2xl hover:shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer no-underline border-2 border-white/20"
        aria-label="Direct WhatsApp Chat"
      >
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-200 rounded-full border-2 border-[#25D366] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#25D366]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-black tracking-tight text-white leading-tight">
            WhatsApp Support
          </span>
          <span className="text-[10px] text-emerald-100 font-medium hidden sm:inline leading-none mt-0.5">
            {phoneNumber} • Online
          </span>
        </div>
      </a>
    </div>
  );
};

