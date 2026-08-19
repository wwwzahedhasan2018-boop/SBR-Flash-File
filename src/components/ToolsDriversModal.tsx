import React, { useState } from 'react';
import { X, Wrench, Download, Cpu, HardDrive, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FLASH_TOOLS } from '../data/firmwareData';
import { FlashTool } from '../types';

interface ToolsDriversModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ToolsDriversModal: React.FC<ToolsDriversModalProps> = ({ isOpen, onClose }) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'tool' | 'driver'>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredTools = FLASH_TOOLS.filter((item) => {
    if (filterCategory === 'all') return true;
    return item.category === filterCategory;
  });

  const handleDownload = (tool: FlashTool) => {
    setDownloadingId(tool.id);
    setTimeout(() => {
      setDownloadingId(null);
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', `${tool.name.replace(/[^a-zA-Z0-9]/g, '_')}.zip`);
      document.body.appendChild(link);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Flash Tools & USB Drivers Archive</h3>
              <p className="text-[11px] text-slate-300">
                100% Free & Tested official utilities for Windows 10 & 11 (64-bit)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Utilities ({FLASH_TOOLS.length})
            </button>
            <button
              onClick={() => setFilterCategory('tool')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterCategory === 'tool'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Flashing Tools (5)
            </button>
            <button
              onClick={() => setFilterCategory('driver')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterCategory === 'driver'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              USB Drivers (3)
            </button>
          </div>

          <span className="text-xs text-slate-500 font-semibold hidden sm:inline">
            Direct High Speed CDN
          </span>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-3">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white border border-slate-200 hover:border-emerald-500 rounded-xl p-4 transition-all duration-150 shadow-2xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-extrabold text-slate-900 text-sm">{tool.name}</h4>
                  <span className="bg-slate-100 text-slate-700 font-mono font-bold text-[10px] px-2 py-0.5 rounded-sm border border-slate-200">
                    {tool.version}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                    {tool.category === 'tool' ? 'Flashing Tool' : 'USB Driver'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {tool.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Cpu className="w-3 h-3 text-slate-400" />
                    {tool.supportedChipsets.join(', ')}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-slate-400" />
                    Size: <strong>{tool.fileSize}</strong>
                  </span>
                </div>
              </div>

              <div className="shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex items-center justify-between sm:justify-end gap-2">
                <span className="text-xs font-bold text-emerald-600 sm:hidden">Free Download</span>
                <button
                  onClick={() => handleDownload(tool)}
                  disabled={downloadingId === tool.id}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-75"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === tool.id ? 'Downloading...' : 'Free Download'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            All files scanned with VirusTotal & clean
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
