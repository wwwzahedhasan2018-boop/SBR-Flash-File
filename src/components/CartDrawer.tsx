import React from 'react';
import { X, Trash2, ShoppingCart, ArrowRight, ShieldCheck, HardDrive, Download } from 'lucide-react';
import { CartItem, FirmwareFile } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (fileId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  onSelectFile: (fileId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  onSelectFile,
}) => {
  if (!isOpen) return null;

  const totalBDT = cartItems.reduce((acc, item) => acc + item.file.priceBDT, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Firmware Cart</h3>
              <p className="text-[11px] text-slate-300">
                {cartItems.length} {cartItems.length === 1 ? 'file' : 'files'} selected
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

        {/* Cart List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <ShoppingCart className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Your Cart is Empty</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Browse our mobile brand folders to add tested firmware files to your cart.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Browse Brands Directory
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="font-bold text-slate-600">Selected Files</span>
                <button
                  onClick={onClearCart}
                  className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear All
                </button>
              </div>

              {cartItems.map(({ file }) => (
                <div
                  key={file.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 group hover:border-emerald-300 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <button
                      onClick={() => {
                        onSelectFile(file.id);
                        onClose();
                      }}
                      className="font-bold text-slate-900 text-xs hover:text-emerald-700 text-left line-clamp-1"
                    >
                      {file.modelName}
                    </button>
                    <p className="text-[11px] text-slate-500">
                      {file.chipset} • {file.fileSize} • {file.binaryBitVersion}
                    </p>
                    <span className="text-xs font-black text-emerald-600 block">
                      ৳{file.priceBDT}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveItem(file.id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-white transition-colors"
                    title="Remove from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant automated link delivery via bKash / Nagad / Rocket.</span>
              </div>
            </>
          )}
        </div>

        {/* Footer with Total & Checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Payable:</span>
                <span className="text-2xl font-black text-slate-900">৳{totalBDT}</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            </div>

            <button
              id="cart-checkout-btn"
              onClick={onProceedToCheckout}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Instant Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
