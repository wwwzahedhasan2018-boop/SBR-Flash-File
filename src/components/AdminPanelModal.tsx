import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Receipt, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Smartphone, 
  Search, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  Key, 
  Check, 
  Copy, 
  RefreshCw, 
  Settings, 
  Layers, 
  ArrowRight,
  Send,
  Zap,
  Box
} from 'lucide-react';
import { 
  getMerchantSettings, 
  saveMerchantSettings, 
  getReceivedLedger, 
  saveReceivedLedger, 
  getPendingOrders, 
  savePendingOrders,
  addTransactionToLedger,
  defaultMerchantSettings
} from '../services/paymentLedger';
import { 
  MerchantPaymentSettings, 
  ReceivedTransaction, 
  PendingPaymentOrder, 
  PaymentGateway, 
  PurchasedFile 
} from '../types';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveOrder?: (purchases: PurchasedFile[]) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onApproveOrder,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'ledger' | 'settings'>('pending');
  const [settings, setSettings] = useState<MerchantPaymentSettings>(getMerchantSettings());
  const [ledger, setLedger] = useState<ReceivedTransaction[]>(getReceivedLedger());
  const [pendingOrders, setPendingOrders] = useState<PendingPaymentOrder[]>(getPendingOrders());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Transaction Form State
  const [newGateway, setNewGateway] = useState<PaymentGateway>('bkash');
  const [newTrxId, setNewTrxId] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newAmount, setNewAmount] = useState<number>(100);
  const [newNote, setNewNote] = useState('');
  const [addTxSuccess, setAddTxSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getMerchantSettings());
      setLedger(getReceivedLedger());
      setPendingOrders(getPendingOrders());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveMerchantSettings(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddNewTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTrxId.trim() || !newSender.trim()) return;

    const added = addTransactionToLedger({
      gateway: newGateway,
      trxId: newTrxId.trim().toUpperCase(),
      senderNumber: newSender.trim(),
      amount: Number(newAmount),
      note: newNote.trim() || `Manual entry by admin (${newGateway.toUpperCase()})`,
    });

    setLedger(getReceivedLedger());
    setNewTrxId('');
    setNewSender('');
    setNewNote('');
    setAddTxSuccess(true);
    setTimeout(() => setAddTxSuccess(false), 2500);
  };

  // Simulate an incoming SMS received on admin's phone
  const handleSimulateIncomingSms = (type: 'flash_100' | 'box_200' | 'partial_50') => {
    const amount = type === 'flash_100' ? 100 : type === 'box_200' ? 200 : 50;
    const randomChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let sampleTrx = 'BK';
    for (let i = 0; i < 8; i++) {
      sampleTrx += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    const sampleSender = '017' + Math.floor(10000000 + Math.random() * 90000000).toString();

    addTransactionToLedger({
      gateway: 'bkash',
      trxId: sampleTrx,
      senderNumber: sampleSender,
      amount,
      note: `Simulated bKash SMS: "You have received Tk ${amount}.00 from ${sampleSender}. Fee Tk 0.00. Balance Tk 4,500.00. TrxID ${sampleTrx}"`,
    });

    setLedger(getReceivedLedger());
    alert(`📢 Simulated SMS Received!\n\nGateway: bKash\nAmount: ৳${amount} BDT\nSender: ${sampleSender}\nTrxID: ${sampleTrx}\n\n${amount < 100 ? '⚠️ (Note: If customer uses this for ৳100 file, system will REJECT it and show: "❌ অপর্যাপ্ত টাকা! আরো ৳' + (100 - amount) + ' বকেয়া")' : '✅ Full amount received!'}`);
  };

  // Approve a pending customer order
  const handleApproveOrder = (order: PendingPaymentOrder) => {
    const newPurchases: PurchasedFile[] = order.files.map((file) => ({
      orderId: order.orderId,
      fileId: file.id,
      fileTitle: file.title,
      modelName: file.modelName,
      brandName: file.brandName,
      pricePaid: file.priceBDT,
      paymentGateway: order.gateway,
      senderNumber: order.customerPhone,
      trxId: order.trxId,
      purchaseDate: order.submittedAt,
      downloadUrl: `https://vip-server.flashfilebd.com/download/${file.id}?token=auth_approved_${Math.random().toString(36).substring(2, 10)}`,
      zipPassword: file.zipPassword,
      md5: file.md5Checksum,
    }));

    // Update pending order status to approved
    const updatedOrders = pendingOrders.map((o) =>
      o.orderId === order.orderId ? { ...o, status: 'approved' as const } : o
    );
    setPendingOrders(updatedOrders);
    savePendingOrders(updatedOrders);

    if (onApproveOrder) {
      onApproveOrder(newPurchases);
    }

    alert(`✅ Order ${order.orderId} Approved!\nCustomer TrxID ${order.trxId} is verified. Download access granted.`);
  };

  // Reject a fake pending customer order
  const handleRejectOrder = (orderId: string) => {
    const updatedOrders = pendingOrders.map((o) =>
      o.orderId === orderId ? { ...o, status: 'rejected' as const, rejectionReason: 'TrxID Fake / টাকা আমাদের অ্যাকাউন্টে আসেনি' } : o
    );
    setPendingOrders(updatedOrders);
    savePendingOrders(updatedOrders);
    alert(`❌ Order ${orderId} Rejected!\nReason: Money not received in Merchant Account.`);
  };

  const pendingCount = pendingOrders.filter((o) => o.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Merchant Account & Payment Verification Hub
                </h3>
                <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Verify money received on your bKash / Nagad number before unlocking files
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
              activeTab === 'pending'
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Customer Pending Orders</span>
            {pendingCount > 0 && (
              <span className="bg-amber-500 text-white text-[11px] font-black px-2 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
              activeTab === 'ledger'
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>Received Money Ledger ({ledger.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 cursor-pointer border-t border-x ${
              activeTab === 'settings'
                ? 'bg-white text-emerald-800 border-slate-200 border-b-white -mb-px shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>My Merchant Numbers</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. Pending Customer Orders Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                      সন্দেহজনক বা সরাসরি যাচাইকরণাধীন পেমেন্ট তালিকা
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      যদি কোনো গ্রাহকের ট্রানজেকশন অটো-লেজারে না মেলে, তবে সেটি এখানে জমা থাকে। আপনার bKash/Nagad অ্যাপে ব্যালেন্স চেক করে অনুমোদন বা বাতিল করুন।
                    </p>
                  </div>
                </div>
              </div>

              {pendingOrders.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center text-slate-500">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-bold text-slate-800 text-sm">কোনো পেন্ডিং অর্ডার নেই</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    গ্রাহক পেমেন্ট সাবমিট করলে এখানে সাথে সাথে রিয়েল-টাইমে নোটিফিকেশন আসবে।
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div
                      key={order.orderId}
                      className={`border rounded-xl p-4 sm:p-5 transition-all ${
                        order.status === 'pending'
                          ? 'bg-white border-amber-300 shadow-xs'
                          : order.status === 'approved'
                          ? 'bg-emerald-50/40 border-emerald-300 opacity-80'
                          : 'bg-rose-50/40 border-rose-300 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm">
                              {order.orderId}
                            </span>
                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full capitalize ${
                              order.gateway === 'bkash' ? 'bg-pink-100 text-pink-800' : order.gateway === 'nagad' ? 'bg-orange-100 text-orange-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {order.gateway}
                            </span>
                            <span className="font-bold text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                              টাকা: ৳{order.amount}
                            </span>
                            <span className="text-xs text-slate-400">
                              {order.submittedAt}
                            </span>
                          </div>

                          <div className="text-xs text-slate-700 font-medium pt-1">
                            <div>
                              গ্রাহকের মোবাইল: <strong className="font-mono text-slate-900 font-bold">{order.customerPhone}</strong>
                            </div>
                            <div>
                              গ্রাহকের দেওয়া TrxID: <strong className="font-mono text-indigo-900 font-black text-sm bg-indigo-50 px-1.5 py-0.2 rounded-sm border border-indigo-200">{order.trxId}</strong>
                            </div>
                            <div className="text-slate-500 pt-0.5">
                              ফাইল: <span className="font-bold text-slate-800">{order.files.map(f => f.modelName).join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {order.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleApproveOrder(order)}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>অনুমোদন ও আনলক (Approve)</span>
                              </button>
                              <button
                                onClick={() => handleRejectOrder(order.orderId)}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>ভুয়া (Reject)</span>
                              </button>
                            </>
                          ) : order.status === 'approved' ? (
                            <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                              <Check className="w-4 h-4 text-emerald-600" />
                              Approved & Unlocked
                            </span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1">
                              <X className="w-4 h-4 text-rose-600" />
                              Rejected (Fake TrxID)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. Received Money Ledger Tab */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              {/* Quick Demo Simulator Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    টাকা জমার লাইভ টেস্ট সিমুলেটর (Simulate Received Money SMS)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    বাটনে ক্লিক করলে আপনার অ্যাকাউন্টে টাকা আসার একটি এসএমএস লগ এন্ট্রি হবে, যা দিয়ে স্বয়ংক্রিয় ভেরিফিকেশন টেস্ট করা যাবে।
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => handleSimulateIncomingSms('partial_50')}
                    className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    title="Test Insufficient Payment"
                  >
                    <span>⚠️ টেস্ট ৳৫০ (কম টাকা)</span>
                  </button>
                  <button
                    onClick={() => handleSimulateIncomingSms('flash_100')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ টেস্ট ৳১০০ SMS</span>
                  </button>
                  <button
                    onClick={() => handleSimulateIncomingSms('box_200')}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span>+ টেস্ট ৳২০০ Box SMS</span>
                  </button>
                </div>
              </div>

              {/* Add New Received Money Manually */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
                <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  নতুন প্রাপ্ত টাকা এন্ট্রি করুন (Add Received Transaction)
                </h4>

                {addTxSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>লেনদেনটি সফলভাবে লেজারে যুক্ত হয়েছে! এখন গ্রাহক এটি দিয়ে সাথে সাথে আনলক করতে পারবেন।</span>
                  </div>
                )}

                <form onSubmit={handleAddNewTransaction} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">গেটওয়ে:</label>
                    <select
                      value={newGateway}
                      onChange={(e) => setNewGateway(e.target.value as PaymentGateway)}
                      className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2"
                    >
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                      <option value="rocket">Rocket</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">প্রাপ্ত TrxID (SMS থেকে):</label>
                    <input
                      type="text"
                      required
                      value={newTrxId}
                      onChange={(e) => setNewTrxId(e.target.value.toUpperCase())}
                      placeholder="e.g. BK7A9X2M1L"
                      className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">প্রেরকের নম্বর:</label>
                    <input
                      type="tel"
                      required
                      value={newSender}
                      onChange={(e) => setNewSender(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">টাকার পরিমাণ (৳):</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        required
                        value={newAmount}
                        onChange={(e) => setNewAmount(Number(e.target.value))}
                        className="w-full text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                    আপনার অ্যাকাউন্টে আসল টাকা জমার রেকর্ড (Verified Ledger Records)
                  </h4>
                  <span className="text-[11px] text-slate-500 font-bold">মোট: {ledger.length} টি</span>
                </div>

                <div className="divide-y divide-slate-200 text-xs">
                  {ledger.map((tx) => (
                    <div key={tx.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[11px] capitalize ${
                          tx.gateway === 'bkash' ? 'bg-pink-100 text-pink-700' : tx.gateway === 'nagad' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {tx.gateway.substring(0, 2)}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-900">{tx.trxId}</span>
                            <span className="font-mono text-slate-500">({tx.senderNumber})</span>
                            {tx.isUsed ? (
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-sm">
                                ব্যবহৃত (Used)
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-sm">
                                আনলকের জন্য প্রস্তুত (Ready)
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{tx.note || tx.receivedAt}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-black text-sm text-emerald-600">৳{tx.amount} BDT</span>
                        <span className="text-[10px] text-slate-400 block">{tx.receivedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Settings Tab */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">
                    আপনার ব্যক্তিগত পেমেন্ট নম্বর সেট করুন (Your Payment Numbers)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    গ্রাহক যখন চেকআউটে যাবে, তখন এই নম্বরগুলোই দেখবে এবং এখানে টাকা পাঠাবে।
                  </p>
                </div>
                {saveSuccess && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-md flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    নম্বর সংরক্ষিত হয়েছে!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* bKash Number */}
                <div className="p-3.5 bg-pink-50/60 border border-pink-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-pink-900 block">bKash Number:</label>
                    <span className="text-[10px] font-bold text-pink-700 bg-white px-2 py-0.5 rounded-sm">Personal</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.bkashNumber}
                    onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-pink-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings.bkashType}
                    onChange={(e) => setSettings({ ...settings, bkashType: e.target.value })}
                    placeholder="Type (e.g. Personal Send Money)"
                    className="w-full px-3 py-1.5 text-[11px] bg-white border border-pink-200 rounded-lg text-slate-600"
                  />
                </div>

                {/* Nagad Number */}
                <div className="p-3.5 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-orange-900 block">Nagad Number:</label>
                    <span className="text-[10px] font-bold text-orange-700 bg-white px-2 py-0.5 rounded-sm">Personal</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.nagadNumber}
                    onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-orange-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings.nagadType}
                    onChange={(e) => setSettings({ ...settings, nagadType: e.target.value })}
                    placeholder="Type (e.g. Personal Send Money)"
                    className="w-full px-3 py-1.5 text-[11px] bg-white border border-orange-200 rounded-lg text-slate-600"
                  />
                </div>

                {/* Rocket Number */}
                <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-purple-900 block">Rocket Number:</label>
                    <span className="text-[10px] font-bold text-purple-700 bg-white px-2 py-0.5 rounded-sm">Personal</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={settings.rocketNumber}
                    onChange={(e) => setSettings({ ...settings, rocketNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-purple-300 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    value={settings.rocketType}
                    onChange={(e) => setSettings({ ...settings, rocketType: e.target.value })}
                    placeholder="Type (e.g. Personal Send Money)"
                    className="w-full px-3 py-1.5 text-[11px] bg-white border border-purple-200 rounded-lg text-slate-600"
                  />
                </div>
              </div>

              {/* Automatic Ledger Matching Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">
                    কঠোর অটোমেটিক লেজার ভেরিফিকেশন (Strict Account Verification)
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    এটি চালু থাকলে কোনো গ্রাহক ভুয়া TrxID দিলে সরাসরি আটকে যাবে। শুধুমাত্র আপনার অ্যাকাউন্টে টাকা আসার রেকর্ড থাকলেই ফাইল আনলক হবে।
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoMatchLedger}
                  onChange={(e) => setSettings({ ...settings, autoMatchLedger: e.target.checked })}
                  className="w-5 h-5 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Save Payment Numbers & Settings
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="flex items-center gap-1 font-semibold text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            100% Anti-Fraud Protection Enabled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold transition-colors cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
