import React, { useState, useRef, useEffect } from 'react';
import { Search, Smartphone, ShoppingCart, HelpCircle, Wrench, DownloadCloud, Menu, X, ArrowRight, Cpu } from 'lucide-react';
import { FirmwareFile, Brand } from '../types';

interface HeaderProps {
  currentView: 'home' | 'brand' | 'file';
  onNavigateHome: () => void;
  onSelectBrand: (brandId: string) => void;
  onSelectFile: (fileId: string) => void;
  onOpenRequestModal: () => void;
  onOpenCartModal: () => void;
  onOpenToolsModal: () => void;
  onOpenDownloadsModal: () => void;
  onOpenAdminPanel?: () => void;
  cartCount: number;
  purchasedCount: number;
  allFiles: FirmwareFile[];
  allBrands: Brand[];
}

export const Header: React.FC<HeaderProps> = ({
  onNavigateHome,
  onSelectBrand,
  onSelectFile,
  onOpenRequestModal,
  onOpenCartModal,
  onOpenToolsModal,
  onOpenDownloadsModal,
  onOpenAdminPanel,
  cartCount,
  purchasedCount,
  allFiles,
  allBrands,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim().length > 0
    ? {
        brands: allBrands.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())),
        files: allFiles.filter(f =>
          f.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.buildNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.chipsetModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.brandName.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6),
      }
    : { brands: [], files: [] };

  const handleSelectFileResult = (fileId: string) => {
    onSelectFile(fileId);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleSelectBrandResult = (brandId: string) => {
    onSelectBrand(brandId);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              id="logo-button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              title="SBRFlashFile Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform font-black text-sm tracking-tighter">
                SBR
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                    <span className="text-emerald-600">SBR</span>FlashFile
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-1.5 py-0.2 rounded-sm uppercase tracking-wider">
                    Official
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  100% Tested Mobile Firmware & ROM Directory
                </p>
              </div>
            </button>
          </div>

          {/* Quick Search Bar (Prominent in Center) */}
          <div className="flex-1 max-w-lg relative hidden md:block" ref={searchRef}>
            <div className="relative">
              <input
                id="header-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search model (e.g. A12, Redmi Note 10, i74, Hot 10, Y20)..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchOpen && (searchResults.brands.length > 0 || searchResults.files.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100">
                {/* Brands Match */}
                {searchResults.brands.length > 0 && (
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Matched Brands
                    </p>
                    <div className="flex flex-wrap gap-1.5 p-1">
                      {searchResults.brands.map(b => (
                        <button
                          key={b.id}
                          onClick={() => handleSelectBrandResult(b.id)}
                          className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 rounded-md text-xs font-semibold text-slate-700 transition-colors border border-slate-200"
                        >
                          <span>{b.name}</span>
                          <span className="text-[10px] text-slate-400">({b.fileCount})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Files Match */}
                {searchResults.files.length > 0 && (
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Matching Firmware Files ({searchResults.files.length})
                    </p>
                    <div className="space-y-1">
                      {searchResults.files.map(f => (
                        <button
                          key={f.id}
                          onClick={() => handleSelectFileResult(f.id)}
                          className="w-full text-left p-2 hover:bg-emerald-50 rounded-lg flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 group-hover:bg-emerald-100 group-hover:text-emerald-700">
                              <Cpu className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-700">
                                {f.modelName}
                              </p>
                              <p className="text-[11px] text-slate-500 truncate">
                                {f.chipset} | {f.binaryBitVersion} | {f.fileSize}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                              ৳{f.priceBDT}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Flash Tools & Drivers Button */}
            <button
              id="nav-btn-tools"
              onClick={onOpenToolsModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
              title="Flash Tools & USB Drivers"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span>Tools & Drivers</span>
            </button>

            {/* Request File Button */}
            <button
              id="nav-btn-request-file"
              onClick={onOpenRequestModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 hover:text-emerald-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
              title="Request Unlisted Firmware"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Request File</span>
            </button>

            {/* Merchant / Admin Panel Button */}
            {onOpenAdminPanel && (
              <button
                id="nav-btn-admin"
                onClick={onOpenAdminPanel}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                title="Merchant Account & Payment Manager"
              >
                <span>⚙️ Merchant Admin</span>
              </button>
            )}

            {/* Purchased Downloads History */}
            {purchasedCount > 0 && (
              <button
                id="nav-btn-my-downloads"
                onClick={onOpenDownloadsModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-300 transition-colors relative"
                title="My Unlocked Files"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">My Downloads</span>
                <span className="bg-emerald-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {purchasedCount}
                </span>
              </button>
            )}

            {/* Cart Button */}
            <button
              id="nav-btn-cart"
              onClick={onOpenCartModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all shadow-xs relative"
              title="View Cart"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-emerald-500 text-slate-950 text-[11px] font-black px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                placeholder="Search any model or brand..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Mobile Search Results */}
            {isSearchOpen && (searchResults.brands.length > 0 || searchResults.files.length > 0) && (
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-2">
                {searchResults.files.map(f => (
                  <button
                    key={f.id}
                    onClick={() => {
                      handleSelectFileResult(f.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 bg-white rounded-md border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-slate-800 truncate">{f.modelName}</span>
                    <span className="font-bold text-emerald-600 shrink-0">৳{f.priceBDT}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  onNavigateHome();
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-left font-semibold text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-200"
              >
                🏠 Home Directory
              </button>
              <button
                onClick={() => {
                  onOpenToolsModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-left font-semibold text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-200"
              >
                🔧 Tools & Drivers
              </button>
              <button
                onClick={() => {
                  onOpenRequestModal();
                  setMobileMenuOpen(false);
                }}
                className="p-2 text-left font-semibold text-xs text-slate-700 bg-slate-50 rounded-lg border border-slate-200"
              >
                ❓ Request File
              </button>
              {purchasedCount > 0 && (
                <button
                  onClick={() => {
                    onOpenDownloadsModal();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2 text-left font-semibold text-xs text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200"
                >
                  📥 My Downloads ({purchasedCount})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
