import React from 'react';
import { 
  Search, 
  ShieldCheck, 
  Zap, 
  DownloadCloud, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  HelpCircle,
  TrendingUp,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { FirmwareFile, Brand } from '../types';

interface HomeHeroProps {
  onSelectBrand: (brandId: string) => void;
  onSelectFile: (fileId: string) => void;
  onOpenRequestModal: () => void;
  onOpenToolsModal: () => void;
  hotFiles: FirmwareFile[];
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectBrand,
  onSelectFile,
  onOpenRequestModal,
  onOpenToolsModal,
  hotFiles,
}) => {
  const quickSearches = [
    { label: 'Galaxy A12 (U4)', id: 'sam-a125f-u4' },
    { label: 'Redmi Note 10 Pro', id: 'mi-note10pro-sweet' },
    { label: 'Infinix Hot 10 Play', id: 'infinix-hot10play-x688b' },
    { label: 'Symphony i74 PAC', id: 'symphony-i74' },
    { label: 'Vivo Y20 EDL', id: 'vivo-y20-pd2034f' },
    { label: 'iPhone 11 iOS 17.5', id: 'apple-iphone11-a2221' },
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Feature Highlights Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tested & Verified Firmware Directory for Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Official Mobile <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">Flash Files</span> & Stock ROMs
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Download 100% tested repair firmware for Samsung, Xiaomi, Vivo, Oppo, Infinix, Symphony, Walton, and 15+ brands with instant automated bKash & Nagad download unlock.
            </p>

            {/* Quick Popular Searches Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Popular:
              </span>
              {quickSearches.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectFile(item.id)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-semibold rounded-md border border-slate-200 shadow-2xs transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Action Badges Box */}
          <div className="grid grid-cols-2 gap-3 lg:w-80 shrink-0">
            <div
              onClick={onOpenToolsModal}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                <Wrench className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-emerald-700">
                Flash Tools
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Odin, SP Tool, QFIL & Drivers
              </p>
            </div>

            <div
              onClick={onOpenRequestModal}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-xs group-hover:text-emerald-700">
                Request File
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload within 2 hours
              </p>
            </div>

            <div className="col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-emerald-950 text-[11px]">
                  All ROMs Tested on Physical Devices
                </span>
              </div>
              <span className="font-extrabold text-emerald-800 text-[10px] uppercase bg-white px-2 py-0.5 rounded-sm border border-emerald-300">
                Zero Virus
              </span>
            </div>
          </div>
        </div>

        {/* Recently Tested Hot Flash Files Strip */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Featured 100% Tested Repair Files
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Updated Daily with Latest Security Patches
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {hotFiles.slice(0, 4).map((file) => (
              <div
                key={file.id}
                onClick={() => onSelectFile(file.id)}
                className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-3.5 cursor-pointer transition-all duration-150 hover:shadow-sm group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-xs">
                        {file.brandName}
                      </span>
                      {file.isBoxFile || file.fileCategory === 'box_file' || file.priceBDT === 200 ? (
                        <span className="text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 px-1 py-0.5 rounded-xs border border-indigo-200">
                          F64 Box
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded-xs border border-emerald-200">
                          Flash
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-xs flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Tested
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 line-clamp-1">
                    {file.modelName}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                    {file.chipset} • {file.binaryBitVersion}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className={`font-black ${file.isBoxFile || file.priceBDT === 200 ? 'text-indigo-600' : 'text-emerald-600'}`}>
                    ৳{file.priceBDT}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 group-hover:text-emerald-700 flex items-center gap-0.5">
                    View <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
