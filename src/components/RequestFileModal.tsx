import React, { useState } from 'react';
import { X, HelpCircle, Send, CheckCircle2, Clock, Smartphone, MessageSquare } from 'lucide-react';
import { BRANDS } from '../data/firmwareData';

interface RequestFileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RequestFileModal: React.FC<RequestFileModalProps> = ({ isOpen, onClose }) => {
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('');
  const [chipset, setChipset] = useState('MTK');
  const [androidVersion, setAndroidVersion] = useState('Android 12');
  const [problemDetails, setProblemDetails] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = `REQ-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketId(newTicket);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setModel('');
    setProblemDetails('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Request Unlisted Flash File</h3>
              <p className="text-[11px] text-slate-300">
                Our lab uploads requested tested ROMs within 2 hours
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

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Brand Name:
                </label>
                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {BRANDS.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                  <option value="Other">Other / Feature Phone</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Chipset / CPU:
                </label>
                <select
                  value={chipset}
                  onChange={(e) => setChipset(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="MTK">MediaTek (MTK)</option>
                  <option value="Qualcomm">Qualcomm Snapdragon</option>
                  <option value="SPD">Spreadtrum / Unisoc</option>
                  <option value="Exynos">Samsung Exynos</option>
                  <option value="Apple">Apple iOS</option>
                  <option value="Unknown">Not Sure / Auto Detect</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Model Name / Board Number: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Walton Primo S8, Symphony i74 HW2, Vivo Y12s PD2036F"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Android / OS Version:
                </label>
                <input
                  type="text"
                  value={androidVersion}
                  onChange={(e) => setAndroidVersion(e.target.value)}
                  placeholder="e.g. Android 11 / Go"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contact Phone / WhatsApp: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Problem Description / Flashing Reason:
              </label>
              <textarea
                rows={3}
                value={problemDetails}
                onChange={(e) => setProblemDetails(e.target.value)}
                placeholder="e.g. Phone is stuck on logo after update, needs Dead Boot recovery or FRP bypass file..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Our technical team tests firmware on real hardware before providing download links. You will receive an SMS and WhatsApp notification once uploaded.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Firmware Request</span>
            </button>
          </form>
        ) : (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-slate-900">Request Submitted Successfully!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Tracking Ticket ID: <strong className="font-mono text-emerald-700">{ticketId}</strong>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-1.5 text-slate-600">
              <p>• Model: <strong className="text-slate-900">{brand} {model}</strong></p>
              <p>• Chipset: <strong className="text-slate-900">{chipset}</strong></p>
              <p>• Notification will be sent to: <strong className="text-slate-900">{contactNumber}</strong></p>
              <p>• Estimated upload time: <strong className="text-emerald-700 font-bold">Within 1-2 Hours</strong></p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Done & Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
