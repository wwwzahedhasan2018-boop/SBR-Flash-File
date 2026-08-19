import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ArrowRight, 
  Layers, 
  Smartphone, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  HardDrive 
} from 'lucide-react';
import { Brand } from '../types';
import { BrandLogo } from './BrandLogo';

interface BrandGridProps {
  brands: Brand[];
  onSelectBrand: (brandId: string) => void;
}

export const BrandGrid: React.FC<BrandGridProps> = ({ brands, onSelectBrand }) => {
  const [brandSearch, setBrandSearch] = useState('');

  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brands;
    const query = brandSearch.toLowerCase();
    return brands.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.country.toLowerCase().includes(query) ||
        b.featuredModels.some((m) => m.toLowerCase().includes(query))
    );
  }, [brands, brandSearch]);

  return (
    <section id="mobile-brands-section" className="py-8 sm:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
              <Folder className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              <span>Official Mobile Firmware Folders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mobile Brands Directory
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
              Click any brand folder below to view all tested stock ROMs, scatter files, and unbrick repair firmware for that brand.
            </p>
          </div>

          {/* Quick Brand Search and Stats */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder="Filter brand (e.g. Samsung, Vivo)..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg shrink-0">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                {brands.length} Brands
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Tested
              </span>
            </div>
          </div>
        </div>

        {/* Folder-Based Grid: 3-Column / 4-Column Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              id={`brand-folder-${brand.id}`}
              onClick={() => onSelectBrand(brand.id)}
              className="group relative bg-white border border-slate-200 hover:border-emerald-500 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Folder Tab Header */}
              <div className="bg-slate-100/80 group-hover:bg-emerald-50 border-b border-slate-200 group-hover:border-emerald-200 px-4 py-2.5 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 group-hover:text-emerald-900 font-mono">
                    DIR / {brand.name.toUpperCase()}
                  </span>
                </div>

                {brand.badge ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-colors shadow-2xs">
                    {brand.badge}
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-400 font-medium">
                    {brand.country}
                  </span>
                )}
              </div>

              {/* Folder Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                {/* Official High-Resolution Brand Logo Container */}
                <div className="bg-slate-50/70 border border-slate-100 group-hover:border-emerald-200/80 group-hover:bg-white rounded-xl p-4 flex items-center justify-center min-h-[84px] transition-all shadow-2xs">
                  <BrandLogo brandId={brand.id} brandName={brand.name} size="lg" />
                </div>

                {/* Brand Name & Info */}
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors">
                      {brand.name}
                    </h3>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {brand.fileCount}+ Files
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {brand.description}
                  </p>

                  {/* Featured Models Sub-Chips */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
                      Top Models in Folder:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {brand.featuredModels.slice(0, 3).map((model, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium group-hover:bg-emerald-50 group-hover:text-emerald-800 transition-colors"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Folder Footer Action */}
              <div className="bg-slate-50 group-hover:bg-emerald-600 border-t border-slate-200 group-hover:border-emerald-600 px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-white transition-colors">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-600 group-hover:text-white transition-colors" />
                  <span>Open {brand.name} Folder</span>
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-sm font-medium">
              No brand folders found matching "{brandSearch}".
            </p>
            <button
              onClick={() => setBrandSearch('')}
              className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
            >
              Show all brands
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
