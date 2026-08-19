import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  ShoppingCart, 
  Lock, 
  Unlock, 
  Key, 
  Copy, 
  Check, 
  Cpu, 
  HardDrive, 
  HelpCircle, 
  AlertTriangle, 
  Zap, 
  FileText, 
  Server, 
  Clock, 
  Layers, 
  Smartphone,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { FirmwareFile, Brand } from '../types';
import { BrandLogo } from './BrandLogo';

interface FileDetailViewProps {
  file: FirmwareFile;
  brand?: Brand;
  isUnlocked: boolean;
  onBackToBrand: () => void;
  onBackToHome: () => void;
  onInstantBuy: (file: FirmwareFile) => void;
  onAddToCart: (file: FirmwareFile) => void;
  isInCart: boolean;
}

export const FileDetailView: React.FC<FileDetailViewProps> = ({
  file,
  brand,
  isUnlocked,
  onBackToBrand,
  onBackToHome,
  onInstantBuy,
  onAddToCart,
  isInCart,
}) => {
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedMd5, setCopiedMd5] = useState(false);
  const [downloadingMirror, setDownloadingMirror] = useState<string | null>(null);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(file.zipPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2500);
  };

  const handleCopyMd5 = () => {
    navigator.clipboard.writeText(file.md5Checksum);
    setCopiedMd5(true);
    setTimeout(() => setCopiedMd5(false), 2500);
  };

  const handleSimulateDownload = (mirrorName: string) => {
    setDownloadingMirror(mirrorName);
    setTimeout(() => {
      setDownloadingMirror(null);
      // Trigger a simulated file download or alert
      const dummyLink = document.createElement('a');
      dummyLink.href = '#';
      dummyLink.setAttribute('download', `${file.modelName.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Firmware.zip`);
      document.body.appendChild(dummyLink);
      // Show download started feedback
    }, 1500);
  };

  return (
    <div id="file-details-page" className="py-6 sm:py-10 bg-white min-h-[85vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto">
            <button
              onClick={onBackToHome}
              className="hover:text-emerald-700 font-medium transition-colors hover:underline shrink-0"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <button
              onClick={onBackToBrand}
              className="hover:text-emerald-700 font-medium transition-colors hover:underline shrink-0"
            >
              {file.brandName}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md truncate max-w-[200px] sm:max-w-xs">
              {file.modelName}
            </span>
          </nav>

          <button
            id="btn-back-to-brand-folder"
            onClick={onBackToBrand}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to {file.brandName}
          </button>
        </div>

        {/* Top Header Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-slate-900 text-white text-xs font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
              {file.brandName}
            </span>
            {file.isBoxFile || file.fileCategory === 'box_file' || file.priceBDT === 200 ? (
              <span className="bg-indigo-100 text-indigo-900 text-xs font-black px-3 py-1 rounded-full border border-indigo-300 flex items-center gap-1.5 shadow-2xs">
                <span>📦</span>
                F64 Box File (৳200 Taka)
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-900 text-xs font-black px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <span>⚡</span>
                Flash File (৳100 Taka)
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              100% Tested Lab Certified
            </span>
            <span className="bg-blue-50 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md border border-blue-200 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              {file.chipset} ({file.chipsetModel})
            </span>
            {file.isNew && (
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2 py-0.5 rounded-sm">
                Latest Update
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
            {file.title}
          </h1>

          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            {file.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Tested Date: <strong className="text-slate-700">{file.testedDate}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-slate-400" />
              Region: <strong className="text-slate-700">{file.region}</strong>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              {file.downloadsCount.toLocaleString()} Successful Downloads
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Main 2-Columns: Specifications Table & How to Flash */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1: Specifications Table (2-Column clean table inspired by firmwarefile.com) */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="bg-slate-100 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Firmware File Specifications
                </h2>
                <span className="text-[11px] font-bold text-slate-500">Official Stock ROM</span>
              </div>

              <div className="divide-y divide-slate-200 text-xs sm:text-sm">
                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-white">
                  <span className="font-bold text-slate-500">Mobile Brand:</span>
                  <span className="col-span-2 font-bold text-slate-900">{file.brandName}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-slate-50/50">
                  <span className="font-bold text-slate-500">Model Name / Number:</span>
                  <span className="col-span-2 font-bold text-emerald-800">{file.modelName}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-white">
                  <span className="font-bold text-slate-500">Android Version:</span>
                  <span className="col-span-2 font-semibold text-slate-900">{file.androidVersion}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-slate-50/50">
                  <span className="font-bold text-slate-500">Binary / Bit Version:</span>
                  <span className="col-span-2 font-mono font-bold text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded-sm inline-block w-fit border border-indigo-200">
                    {file.binaryBitVersion}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-white">
                  <span className="font-bold text-slate-500">Build Number / PDA:</span>
                  <span className="col-span-2 font-mono font-semibold text-slate-800">{file.buildNumber}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-slate-50/50">
                  <span className="font-bold text-slate-500">Chipset / CPU:</span>
                  <span className="col-span-2 font-semibold text-slate-900">
                    {file.chipset} ({file.chipsetModel})
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-white">
                  <span className="font-bold text-slate-500">Flashing Tool Needed:</span>
                  <span className="col-span-2 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-sm inline-block w-fit border border-amber-200">
                    {file.toolNeeded}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-slate-50/50">
                  <span className="font-bold text-slate-500">USB Driver Needed:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{file.driverNeeded}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-white">
                  <span className="font-bold text-slate-500">File Size:</span>
                  <span className="col-span-2 font-bold text-slate-900 flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-slate-400" />
                    {file.fileSize}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-slate-50/50">
                  <span className="font-bold text-slate-500">File Format:</span>
                  <span className="col-span-2 font-mono text-slate-700">{file.fileExtension}</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-3 p-3.5 bg-white">
                  <span className="font-bold text-slate-500">MD5 Checksum:</span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-600 truncate max-w-[200px] sm:max-w-none">
                      {file.md5Checksum}
                    </span>
                    <button
                      onClick={handleCopyMd5}
                      className="text-xs text-slate-500 hover:text-emerald-700 p-1 hover:bg-slate-100 rounded-sm"
                      title="Copy MD5"
                    >
                      {copiedMd5 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Zip Password Notice Row */}
                <div className="grid grid-cols-3 sm:grid-cols-3 p-4 bg-emerald-50/60 border-t-2 border-emerald-500">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-emerald-700" />
                    Zip Password:
                  </span>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-900 text-sm bg-white px-2.5 py-1 rounded-md border border-emerald-300 shadow-2xs">
                      {file.zipPassword}
                    </span>
                    {file.zipPassword !== 'No Password (Official)' && (
                      <button
                        onClick={handleCopyPassword}
                        className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md border border-emerald-300 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        {copiedPass ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        {copiedPass ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Step-by-Step How to Flash */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Step-by-Step How to Flash {file.modelName}
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Official Guide
                </span>
              </div>

              <div className="space-y-3">
                {file.howToFlashSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Safety Warning */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900 mt-4">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Technician Flashing Warning:</strong> Always ensure your phone's battery is charged to at least 50% before flashing. Take a backup of important data if device can boot. Use quality original USB data cables to prevent disconnection errors.
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Pricing Box & Instant Download Action */}
          <div className="space-y-6">
            {/* Main Action Box */}
            <div className="bg-white border-2 border-emerald-500 rounded-2xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                Instant Automatic Unlock
              </div>

              <div className="mb-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Firmware Access Fee
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">
                    ৳{file.priceBDT}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    BDT (One-Time)
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Permanent direct download link + VIP High Speed Server Access
                </p>
              </div>

              {/* Instant Status Unlocked or Locked */}
              {isUnlocked ? (
                <div className="space-y-4 my-4 p-4 bg-emerald-50 border border-emerald-300 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <Unlock className="w-4 h-4 text-emerald-600" />
                    File Unlocked & Ready!
                  </div>
                  <p className="text-xs text-emerald-700">
                    Your payment was verified. You have unlimited high-speed access to this firmware.
                  </p>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleSimulateDownload('VIP High Speed Server')}
                      disabled={downloadingMirror !== null}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Download className="w-4 h-4 animate-bounce" />
                      <span>
                        {downloadingMirror === 'VIP High Speed Server' ? 'Generating VIP Link...' : 'Download via VIP Server (Fast)'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleSimulateDownload('Google Drive Mirror')}
                      disabled={downloadingMirror !== null}
                      className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>
                        {downloadingMirror === 'Google Drive Mirror' ? 'Connecting...' : 'Google Drive Mirror'}
                      </span>
                    </button>

                    <button
                      onClick={() => handleSimulateDownload('Mega.nz Mirror')}
                      disabled={downloadingMirror !== null}
                      className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <span>Mega.nz Cloud Mirror</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 my-4">
                  {/* Primary Buy & Instant Download Button */}
                  <button
                    id="btn-buy-instant-download"
                    onClick={() => onInstantBuy(file)}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>🛒 Buy & Instant Download</span>
                  </button>

                  {/* Secondary Add to Cart Button */}
                  <button
                    id="btn-add-to-cart"
                    onClick={() => onAddToCart(file)}
                    className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-2 ${
                      isInCart
                        ? 'bg-slate-100 text-emerald-800 border-emerald-300'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                    }`}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 text-slate-500" />
                        <span>Add to Cart (Bulk Buy)</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Supported Payment Logos */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
                  Instant Payment Gateways (Auto Unlocked)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-pink-50 border border-pink-200 rounded-lg">
                    <span className="font-extrabold text-pink-700 text-xs block">bKash</span>
                    <span className="text-[9px] text-pink-600">Personal / Send</span>
                  </div>
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="font-extrabold text-orange-700 text-xs block">Nagad</span>
                    <span className="text-[9px] text-orange-600">Send Money</span>
                  </div>
                  <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
                    <span className="font-extrabold text-purple-700 text-xs block">Rocket</span>
                    <span className="text-[9px] text-purple-600">Instant</span>
                  </div>
                </div>
              </div>

              {/* Guarantee list */}
              <div className="mt-4 space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Tested in Bangladesh Hardware Lab</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Virus-free clean official factory package</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No download speed limit (100MB/s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp live technician support</span>
                </div>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                Having trouble flashing?
              </div>
              <p>
                Our expert GSM technicians are available on WhatsApp 24/7 to help you with driver installation, test points, and unlocking.
              </p>
              <a
                href="https://wa.me/8801700000000?text=Hello%20FlashFileBD%20Support%20I%20need%20help%20with%20flashing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 hover:underline pt-1"
              >
                Chat on WhatsApp (+8801700000000)
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
