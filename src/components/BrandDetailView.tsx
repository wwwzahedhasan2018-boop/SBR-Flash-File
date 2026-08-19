import React, { useState, useMemo } from 'react';
import { 
  Folder, 
  FolderOpen,
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  ArrowRight,
  Download,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  SlidersHorizontal,
  FileCode2,
  Lock,
  Box,
  Zap,
  Tag
} from 'lucide-react';
import { Brand, FirmwareFile, ChipsetType, FileCategoryType } from '../types';
import { BrandLogo } from './BrandLogo';

interface BrandDetailViewProps {
  brand: Brand;
  files: FirmwareFile[];
  onBackToBrands: () => void;
  onSelectFile: (fileId: string) => void;
  onInstantBuy: (file: FirmwareFile) => void;
}

export const BrandDetailView: React.FC<BrandDetailViewProps> = ({
  brand,
  files,
  onBackToBrands,
  onSelectFile,
  onInstantBuy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChipset, setSelectedChipset] = useState<ChipsetType>('All');
  const [selectedCategory, setSelectedCategory] = useState<FileCategoryType>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'size'>('popular');

  const chipsetOptions: ChipsetType[] = ['All', 'MTK', 'Qualcomm', 'SPD', 'Exynos', 'Unisoc', 'Apple'];

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch =
        file.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.buildNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.chipsetModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.androidVersion.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChipset =
        selectedChipset === 'All' || file.chipset === selectedChipset;

      const isBox = file.isBoxFile || file.fileCategory === 'box_file' || file.priceBDT === 200;
      const matchesCategory =
        selectedCategory === 'all' ||
        (selectedCategory === 'box_file' && isBox) ||
        (selectedCategory === 'flash_file' && !isBox);

      return matchesSearch && matchesChipset && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      }
      if (sortBy === 'size') {
        return parseFloat(b.fileSize) - parseFloat(a.fileSize);
      }
      return b.downloadsCount - a.downloadsCount;
    });
  }, [files, searchQuery, selectedChipset, selectedCategory, sortBy]);

  const flashFilesCount = useMemo(() => files.filter(f => !f.isBoxFile && f.fileCategory !== 'box_file').length, [files]);
  const boxFilesCount = useMemo(() => files.filter(f => f.isBoxFile || f.fileCategory === 'box_file').length, [files]);

  return (
    <div id="brand-folder-view" className="py-6 sm:py-10 bg-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation & Back to Brands Button */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
            <button
              onClick={onBackToBrands}
              className="hover:text-emerald-700 transition-colors hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Folder className="w-3.5 h-3.5 text-emerald-600" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              onClick={onBackToBrands}
              className="hover:text-emerald-700 transition-colors hover:underline cursor-pointer"
            >
              Mobile Brands
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
              {brand.name} Folder
            </span>
          </nav>

          <button
            id="btn-back-to-brands"
            onClick={onBackToBrands}
            className="flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 rounded-xl transition-all border border-slate-200 shadow-2xs cursor-pointer active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Back to All Brands</span>
          </button>
        </div>

        {/* Brand Folder Directory Header Banner */}
        <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Official Brand Logo Box */}
              <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-3 flex items-center justify-center shadow-xs shrink-0">
                <BrandLogo brandId={brand.id} brandName={brand.name} size="lg" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-0.5 rounded-md">
                    <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>DIR / {brand.name.toUpperCase()}</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    100% Tested Lab Certified
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {brand.name} Official Firmware & F64 Box Files
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-normal">
                  {brand.description}
                </p>

                {/* Price Notice in Header */}
                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-500 font-medium">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    Flash File: ৳100 Taka
                  </span>
                  <span className="inline-flex items-center gap-1 font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    <Box className="w-3.5 h-3.5 text-indigo-600" />
                    F64 Box File: ৳200 Taka
                  </span>
                  <span>•</span>
                  <span className="text-slate-600 font-semibold">{files.length} Total Tested ROMs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Category Filter Tabs (Flash File 100 Taka vs F64 Box File 200 Taka) */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
          >
            <span>All Files</span>
            <span className="bg-white/20 text-current text-[11px] px-1.5 py-0.2 rounded-md font-mono">
              {files.length}
            </span>
          </button>

          <button
            id="tab-flash-files-100"
            onClick={() => setSelectedCategory('flash_file')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'flash_file'
                ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-400'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>⚡ Flash Files (৳100)</span>
            <span className="bg-emerald-700/20 text-current text-[11px] px-1.5 py-0.2 rounded-md font-mono">
              {flashFilesCount}
            </span>
          </button>

          <button
            id="tab-box-files-200"
            onClick={() => setSelectedCategory('box_file')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'box_file'
                ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-indigo-500" />
            <span>📦 F64 Box Files & Dumps (৳200)</span>
            <span className="bg-indigo-700/20 text-current text-[11px] px-1.5 py-0.2 rounded-md font-mono">
              {boxFilesCount}
            </span>
          </button>
        </div>

        {/* Search & Chipset Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search within brand */}
            <div className="relative flex-1">
              <input
                id="brand-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${brand.name} models, flash files, or F64 box dumps...`}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Latest Tested</option>
                <option value="size">File Size</option>
              </select>
            </div>
          </div>

          {/* Chipset Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="font-bold text-slate-600 flex items-center gap-1 shrink-0 mr-1">
              <Cpu className="w-3.5 h-3.5 text-slate-400" />
              CPU / Chipset:
            </span>
            {chipsetOptions.map((chipset) => (
              <button
                key={chipset}
                onClick={() => setSelectedChipset(chipset)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer ${
                  selectedChipset === chipset
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {chipset}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
          <span>
            Showing <strong className="text-slate-900">{filteredFiles.length}</strong> files under{' '}
            <strong className="text-emerald-700">{brand.name} Folder</strong>
          </span>
          <div className="flex items-center gap-2">
            {selectedCategory !== 'all' && (
              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-sm border border-slate-200 font-bold">
                Category: {selectedCategory === 'box_file' ? 'F64 Box File (৳200)' : 'Flash File (৳100)'}
              </span>
            )}
            {selectedChipset !== 'All' && (
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-sm border border-emerald-200 font-bold">
                Chipset: {selectedChipset}
              </span>
            )}
          </div>
        </div>

        {/* Firmware Files List View */}
        {filteredFiles.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center my-6">
            <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center mx-auto text-slate-500 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              No files found matching your filters
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
              Need a specific {brand.name} ROM or F64 box dump? Request a file and our engineers will test and upload it.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedChipset('All');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-xs font-bold hover:bg-slate-300 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFiles.map((file) => {
              const isBox = file.isBoxFile || file.fileCategory === 'box_file' || file.priceBDT === 200;
              return (
                <div
                  key={file.id}
                  id={`file-item-${file.id}`}
                  className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all duration-150 hover:shadow-md group flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isBox
                      ? 'border-indigo-200 hover:border-indigo-500 bg-indigo-50/20'
                      : 'border-slate-200 hover:border-emerald-500'
                  }`}
                >
                  {/* Left File Information */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => onSelectFile(file.id)}
                        className="font-black text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors text-left cursor-pointer"
                      >
                        {file.modelName}
                      </button>

                      {isBox ? (
                        <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black px-2 py-0.5 rounded-sm border border-indigo-300 flex items-center gap-1">
                          <Box className="w-3 h-3 text-indigo-600" />
                          F64 Box File
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-sm border border-emerald-200 flex items-center gap-1">
                          <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          Flash File
                        </span>
                      )}

                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2 py-0.5 rounded-sm border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        100% Tested
                      </span>

                      <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-sm border border-slate-200 font-mono">
                        {file.chipset}
                      </span>

                      {file.isHot && (
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-0.5">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Popular
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-slate-600 line-clamp-1">
                      {file.title}
                    </p>

                    {/* Specifications Meta Chips */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <span className="text-slate-400">Type/OS:</span>
                        <strong className="text-slate-700 font-semibold">{file.androidVersion}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-slate-400">Tool / Box:</span>
                        <strong className="text-slate-700 font-semibold">{file.toolNeeded.split('/')[0]}</strong>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1">
                        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                        <strong className="text-slate-700 font-semibold">{file.fileSize}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Right Price & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        {isBox ? 'F64 Box Price' : 'Flash File Price'}
                      </span>
                      <span className={`text-xl font-black ${isBox ? 'text-indigo-600' : 'text-emerald-600'}`}>
                        ৳{file.priceBDT}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectFile(file.id)}
                        className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        id={`btn-instant-buy-${file.id}`}
                        onClick={() => onInstantBuy(file)}
                        className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 ${
                          isBox
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Instant Download (৳{file.priceBDT})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
