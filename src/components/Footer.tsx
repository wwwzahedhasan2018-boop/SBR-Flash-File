import React from 'react';
import { Smartphone, ShieldCheck, Heart, Zap, FileText, Wrench, HelpCircle } from 'lucide-react';
import { BRANDS } from '../data/firmwareData';

interface FooterProps {
  onSelectBrand: (brandId: string) => void;
  onOpenToolsModal: () => void;
  onOpenRequestModal: () => void;
  onNavigateHome: () => void;
  onOpenAdminPanel?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectBrand,
  onOpenToolsModal,
  onOpenRequestModal,
  onNavigateHome,
  onOpenAdminPanel,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 text-xs pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                SBR
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                <span className="text-emerald-400">SBR</span>FlashFile
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Bangladesh’s most trusted mobile firmware & stock ROM directory. Providing 100% tested flash files, unbrick scatter/PAC packages, and high-speed VIP server downloads with automated bKash and Nagad verification.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                100% Lab Tested ROMs
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Zap className="w-4 h-4" />
                Instant bKash/Nagad
              </span>
            </div>
          </div>

          {/* Column 2: Popular Brands */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-3">
              Popular Brands
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {BRANDS.slice(0, 6).map((brand) => (
                <li key={brand.id}>
                  <button
                    onClick={() => onSelectBrand(brand.id)}
                    className="hover:text-emerald-400 transition-colors hover:underline text-left"
                  >
                    {brand.name} Flash Files
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Local BD Brands & More */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-3">
              BD & Global ROMs
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              {BRANDS.slice(6, 12).map((brand) => (
                <li key={brand.id}>
                  <button
                    onClick={() => onSelectBrand(brand.id)}
                    className="hover:text-emerald-400 transition-colors hover:underline text-left"
                  >
                    {brand.name} Stock ROM
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources & Help */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-white uppercase text-xs tracking-wider mb-3">
              Tools & Support
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={onOpenToolsModal}
                  className="hover:text-emerald-400 transition-colors hover:underline text-left flex items-center gap-1"
                >
                  <Wrench className="w-3 h-3 text-slate-400" />
                  Flash Tools & USB Drivers
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRequestModal}
                  className="hover:text-emerald-400 transition-colors hover:underline text-left flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3 text-slate-400" />
                  Request Unlisted ROM
                </button>
              </li>
              <li>
                <a
                  href="https://wa.me/8801610138733"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors hover:underline text-left"
                >
                  WhatsApp Live Helpline (+8801610138733)
                </a>
              </li>
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-emerald-400 transition-colors hover:underline text-left"
                >
                  Archive Directory Index
                </button>
              </li>
              {onOpenAdminPanel && (
                <li>
                  <button
                    onClick={onOpenAdminPanel}
                    className="hover:text-amber-400 transition-colors hover:underline text-left font-bold text-slate-300 flex items-center gap-1"
                  >
                    <span>⚙️ Merchant Admin Hub</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 space-y-3 text-[11px] text-slate-500">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Legal Disclaimer:</strong> SBRFlashFile provides official factory stock firmware and repair software for educational, restoration, and authorized device repair purposes only. We do not promote IMEI alteration or illegal modifications. Flashing firmware involves risks; always verify battery level and backup your device.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 text-slate-400">
            <p>© 2026 SBRFlashFile.com — The Clean & Tested Mobile Firmware Directory. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for mobile technicians in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
