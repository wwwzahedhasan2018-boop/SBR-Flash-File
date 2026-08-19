import React, { useState } from 'react';
import { Sparkles, X, Zap, ShieldCheck, HardDrive, Tag } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenCheckoutDemo?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div id="announcement-bar" className="bg-gradient-to-r from-rose-600 via-red-600 to-blue-700 text-white text-xs sm:text-sm font-medium py-2 px-3 sm:px-4 relative transition-all shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden mx-auto sm:mx-0 flex-wrap">
          <span className="bg-white/20 text-white text-[11px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 animate-pulse">
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            Special Price
          </span>
          <p className="truncate flex items-center gap-1.5 flex-wrap">
            <span className="font-extrabold text-amber-200">⚡ Flash File: ৳100 Taka</span>
            <span className="text-white/60">|</span>
            <span className="font-extrabold text-cyan-200">📦 F64 Box File: ৳200 Taka</span>
            <span className="text-white/60">|</span>
            <span className="text-white/95">Automatic Instant Download via</span>
            <span className="bg-pink-600 px-1.5 py-0.2 rounded font-bold text-white text-[11px]">bKash</span>
            <span className="bg-orange-600 px-1.5 py-0.2 rounded font-bold text-white text-[11px]">Nagad</span>
            <span className="bg-purple-700 px-1.5 py-0.2 rounded font-bold text-white text-[11px]">Rocket</span>
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-xs text-white/90 shrink-0">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            100% Tested Lab ROMs
          </span>
          <span className="text-white/40">|</span>
          <span className="flex items-center gap-1 text-amber-200 font-semibold">
            <Sparkles className="w-3 h-3" />
            3-Second Auto-Unlock
          </span>
        </div>

        <button
          id="btn-dismiss-announcement"
          onClick={() => setIsVisible(false)}
          className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition-colors shrink-0 ml-2 cursor-pointer"
          aria-label="Dismiss Announcement"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
