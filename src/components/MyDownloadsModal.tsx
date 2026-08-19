import React, { useState } from 'react';
import { X, Download, Key, Copy, Check, ExternalLink, ShieldCheck, Clock, FileText } from 'lucide-react';
import { PurchasedFile } from '../types';

interface MyDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: PurchasedFile[];
  onSelectFile: (fileId: string) => void;
}

export const MyDownloadsModal: React.FC<MyDownloadsModalProps> = ({
  isOpen,
  onClose,
  purchases,
  onSelectFile,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyPassword = (fileId: string, password: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(fileId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">My Purchased Firmware</h3>
              <p className="text-[11px] text-slate-300">
                Permanent high-speed VIP download links and zip passwords
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          {purchases.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">No Purchased Files Yet</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Once you complete instant bKash or Nagad payment for any firmware, it will appear here permanently.
              </p>
            </div>
          ) : (
            purchases.map((purchase) => (
              <div
                key={purchase.orderId}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <div>
                    <button
                      onClick={() => {
                        onSelectFile(purchase.fileId);
                        onClose();
                      }}
                      className="font-black text-slate-900 text-sm hover:text-emerald-700 text-left"
                    >
                      {purchase.modelName} ({purchase.brandName})
                    </button>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>Order: <strong className="font-mono">{purchase.orderId}</strong></span>
                      <span>•</span>
                      <span>TrxID: <strong className="font-mono text-slate-700">{purchase.trxId}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                      ৳{purchase.pricePaid} Paid
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {purchase.purchaseDate}
                    </span>
                  </div>
                </div>

                {/* Password & Checksum Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between">
                    <span className="font-bold text-slate-600 flex items-center gap-1">
                      <Key className="w-3 h-3 text-emerald-600" />
                      Password:
                    </span>
                    <div className="flex items-center gap-1 font-mono font-bold text-emerald-900">
                      <span>{purchase.zipPassword}</span>
                      <button
                        onClick={() => handleCopyPassword(purchase.fileId, purchase.zipPassword)}
                        className="p-1 hover:text-emerald-700 text-slate-400"
                        title="Copy Password"
                      >
                        {copiedId === purchase.fileId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center justify-between overflow-hidden">
                    <span className="font-bold text-slate-600 shrink-0">Status:</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1 truncate">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      Unlocked & Active
                    </span>
                  </div>
                </div>

                {/* Download Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={purchase.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download VIP Server</span>
                  </a>

                  <a
                    href={purchase.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Drive</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
