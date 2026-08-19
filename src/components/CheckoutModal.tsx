import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  ArrowRight, 
  Key, 
  Lock, 
  Smartphone, 
  AlertCircle, 
  Zap, 
  ExternalLink,
  Receipt,
  Sparkles,
  RefreshCw,
  HelpCircle,
  AlertTriangle,
  Clock,
  Send
} from 'lucide-react';
import { FirmwareFile, PaymentGateway, PurchasedFile, PendingPaymentOrder } from '../types';
import { 
  getMerchantSettings, 
  verifyAgainstMerchantAccount, 
  createPendingOrder, 
  getReceivedLedger 
} from '../services/paymentLedger';

interface CheckoutModalProps {
  files: FirmwareFile[]; // single file or multiple cart files
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (purchases: PurchasedFile[]) => void;
  onOpenAdminPanel?: () => void;
}

// Known fake / test keywords and patterns to reject immediately
const BANNED_PATTERNS = [
  '123456',
  '1234567',
  '12345678',
  '123456789',
  '1234567890',
  '000000',
  '111111',
  '222222',
  '333333',
  '444444',
  '555555',
  '666666',
  '777777',
  '888888',
  '999999',
  'AAAAAA',
  'BBBBBB',
  'CCCCCC',
  'ASDFGH',
  'QWERTY',
  'ZXCVBN',
  'TEST',
  'TESTING',
  'FAKE',
  'DUMMY',
  'ADMIN',
  'DEMO',
  'SAMPLE',
  'TRX123',
  'TX1234',
  'NIL',
  'NULL',
  'NONE',
  'ABCD',
  'ABCDEF',
  'PAYMENT'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  files,
  isOpen,
  onClose,
  onPaymentSuccess,
  onOpenAdminPanel,
}) => {
  const [merchantSettings, setMerchantSettings] = useState(getMerchantSettings());
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('bkash');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPendingSubmitted, setIsPendingSubmitted] = useState(false);
  const [pendingOrderInfo, setPendingOrderInfo] = useState<PendingPaymentOrder | null>(null);
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [unlockedPurchases, setUnlockedPurchases] = useState<PurchasedFile[]>([]);

  useEffect(() => {
    if (isOpen) {
      setMerchantSettings(getMerchantSettings());
      setIsPendingSubmitted(false);
      setPendingOrderInfo(null);
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen || files.length === 0) return null;

  const totalPrice = files.reduce((acc, file) => acc + file.priceBDT, 0);

  const currentNumber = selectedGateway === 'bkash' 
    ? merchantSettings.bkashNumber 
    : selectedGateway === 'nagad' 
    ? merchantSettings.nagadNumber 
    : merchantSettings.rocketNumber;

  const currentType = selectedGateway === 'bkash' 
    ? merchantSettings.bkashType 
    : selectedGateway === 'nagad' 
    ? merchantSettings.nagadType 
    : merchantSettings.rocketType;

  const gatewayDetails: Record<PaymentGateway, { name: string; color: string; bgColor: string; borderColor: string; feeText: string; trxFormat: string }> = {
    bkash: {
      name: 'bKash',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-500',
      feeText: 'No extra gateway charge',
      trxFormat: '10 Alphanumeric (e.g. BK7A9X2M1L)',
    },
    nagad: {
      name: 'Nagad',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-500',
      feeText: 'Lowest cash out cost',
      trxFormat: '8 Alphanumeric (e.g. 71G84A9X)',
    },
    rocket: {
      name: 'Rocket',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-500',
      feeText: 'Instant verification',
      trxFormat: '10-12 Digits (e.g. 24589632145)',
    },
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentNumber.replace(/[^0-9]/g, ''));
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  // Helper to load an actual received TrxID from the ledger for quick demo
  const handleAutoFillReceivedTrx = () => {
    const ledger = getReceivedLedger().filter(t => !t.isUsed && t.amount >= totalPrice);
    if (ledger.length > 0) {
      const match = ledger[0];
      setSelectedGateway(match.gateway);
      setSenderPhone(match.senderNumber);
      setTrxId(match.trxId);
      setErrorMessage('');
    } else {
      // Fallback
      setSenderPhone('01712984562');
      setTrxId(selectedGateway === 'bkash' ? 'BK7A9X2M1L' : selectedGateway === 'nagad' ? '71G84A9X' : '24589632145');
      setErrorMessage('');
    }
  };

  // Strict Validation Logic for Bangladeshi Phone & TrxID
  const validateBasicFormat = (): { isValid: boolean; error?: string } => {
    const cleanPhone = senderPhone.trim().replace(/[- ]/g, '');
    const cleanTrx = trxId.trim().toUpperCase();

    // 1. Phone number validation (11 digits, valid BD mobile operator prefixes)
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      return {
        isValid: false,
        error: '⚠️ অবৈধ মোবাইল নম্বর! অনুগ্রহ করে আপনার সঠিক ১১ ডিজিটের নম্বর দিন (যেমন: 01712345678)।'
      };
    }

    // Check for repetitive/fake phone patterns
    const phoneRest = cleanPhone.substring(3);
    if (/^(\d)\1+$/.test(phoneRest) || cleanPhone === '01234567890') {
      return {
        isValid: false,
        error: '⚠️ ভুয়া মোবাইল নম্বর গ্রহণযোগ্য নয়। সঠিক নম্বর দিন।'
      };
    }

    // 2. TrxID Basic presence & length
    if (!cleanTrx || cleanTrx.length < 6) {
      return {
        isValid: false,
        error: `⚠️ Transaction ID (TrxID) দিন। SMS থেকে সঠিক TrxID কপি করে দিন।`
      };
    }

    // 3. Check against banned/fake keyword patterns
    for (const banned of BANNED_PATTERNS) {
      if (cleanTrx.includes(banned) || cleanTrx === banned) {
        return {
          isValid: false,
          error: `❌ ভুয়া TrxID ("${cleanTrx}") সনাক্ত হয়েছে! অ্যাকাউন্টে কোনো লেনদেনের রেকর্ড নেই। টাকা না পাঠিয়ে ট্রানজেকশন আইডি দিলে ফাইল ডাউনলোড হবে না।`
        };
      }
    }

    // Check for character repetitions (e.g. AAAAAAAAAA, 1111111111)
    if (/^(.)\1+$/.test(cleanTrx) || /^(.{2})\1+$/.test(cleanTrx)) {
      return {
        isValid: false,
        error: '❌ অবৈধ TrxID! পুনরাবৃত্তিমূলক বা ভুয়া ট্রানজেকশন কোড গ্রহণযোগ্য নয়।'
      };
    }

    return { isValid: true };
  };

  const handleVerifyPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const basicCheck = validateBasicFormat();
    if (!basicCheck.isValid) {
      setErrorMessage(basicCheck.error || 'Invalid payment credentials');
      return;
    }

    setIsVerifying(true);
    setVerificationStep(`Checking ${gatewayDetails[selectedGateway].name} account ledger for incoming ৳${totalPrice} BDT...`);

    setTimeout(() => {
      setVerificationStep(`Matching TrxID ${trxId.toUpperCase()} with receiver ${currentNumber}...`);
    }, 600);

    setTimeout(() => {
      // Query the actual merchant ledger
      const verification = verifyAgainstMerchantAccount(trxId, selectedGateway, totalPrice);

      if (verification.success) {
        // Successful payment match in account ledger!
        setIsVerifying(false);
        setIsCompleted(true);

        const newPurchases: PurchasedFile[] = files.map((file) => ({
          orderId: `FFBD-${Math.floor(100000 + Math.random() * 900000)}`,
          fileId: file.id,
          fileTitle: file.title,
          modelName: file.modelName,
          brandName: file.brandName,
          pricePaid: file.priceBDT,
          paymentGateway: selectedGateway,
          senderNumber: senderPhone,
          trxId: trxId.toUpperCase(),
          purchaseDate: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          downloadUrl: `https://vip-server.flashfilebd.com/download/${file.id}?token=auth_${Math.random().toString(36).substring(2, 10)}`,
          zipPassword: file.zipPassword,
          md5: file.md5Checksum,
        }));

        setUnlockedPurchases(newPurchases);
        onPaymentSuccess(newPurchases);
      } else {
        // FAILED: Money not in account ledger / Fake TrxID
        setIsVerifying(false);
        setErrorMessage(verification.message);
      }
    }, 1400);
  };

  // Submit order for manual review by the owner
  const handleSubmitForManualReview = () => {
    const basicCheck = validateBasicFormat();
    if (!basicCheck.isValid) {
      setErrorMessage(basicCheck.error || 'Invalid details');
      return;
    }

    const newPendingOrder = createPendingOrder(senderPhone, trxId, selectedGateway, totalPrice, files);
    setPendingOrderInfo(newPendingOrder);
    setIsPendingSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 transition-all">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {isCompleted 
                  ? 'Payment Verified & Unlocked' 
                  : isPendingSubmitted 
                  ? 'Verification Request Submitted' 
                  : 'Instant Payment & Live Account Verification'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {isCompleted 
                  ? 'Download links are ready below' 
                  : isPendingSubmitted 
                  ? 'Admin is verifying received money in bank' 
                  : 'Automated Account Balance & SMS Matching'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Main Payment Input Form */}
        {!isCompleted && !isPendingSubmitted && (
          <div className="p-5 space-y-4">
            {/* Selected File Summary Banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {files.length === 1 ? 'Selected Firmware' : `Cart Items (${files.length})`}
                </span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate max-w-[240px]">
                  {files.length === 1 ? files[0].modelName : `${files[0].modelName} + ${files.length - 1} more`}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-medium block">Total Payable:</span>
                <span className="text-xl font-black text-emerald-600">৳{totalPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                1. Select Payment Method:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['bkash', 'nagad', 'rocket'] as PaymentGateway[]).map((gateway) => (
                  <button
                    key={gateway}
                    type="button"
                    onClick={() => {
                      setSelectedGateway(gateway);
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-center font-bold text-xs capitalize transition-all cursor-pointer ${
                      selectedGateway === gateway
                        ? `${gatewayDetails[gateway].bgColor} ${gatewayDetails[gateway].borderColor} border-2 ${gatewayDetails[gateway].color} shadow-xs scale-102`
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-sm font-extrabold">{gatewayDetails[gateway].name}</span>
                    <span className="text-[10px] font-normal text-slate-500">Live Account Check</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Instructions Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  2. Send ৳{totalPrice} to this {gatewayDetails[selectedGateway].name} Number:
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                  {currentType}
                </span>
              </div>

              {/* Number display with 1-click copy */}
              <div className="flex items-center justify-between bg-white border border-slate-300 rounded-lg p-2.5">
                <span className="font-mono font-black text-base sm:text-lg text-slate-900 tracking-wider">
                  {currentNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedNumber ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Quick instructions steps */}
              <div className="text-[11px] text-slate-600 space-y-1 bg-white/80 p-2.5 rounded-md border border-slate-200">
                <p>• আপনার <strong>{gatewayDetails[selectedGateway].name}</strong> থেকে <strong>৳{totalPrice}</strong> টাকা <strong>{currentNumber}</strong> নম্বরে পাঠান।</p>
                <p>• টাকা আসার পর ফিরতি SMS-এর আসল <strong>TrxID</strong> নিচে দিন। আমাদের অ্যাকাউন্টে টাকা জমা নিশ্চিত হলেই ফাইল আনলক হবে।</p>
              </div>
            </div>

            {/* Verification Form */}
            <form onSubmit={handleVerifyPayment} className="space-y-3">
              {/* Error Message Display if Fake TrxID or Money not in account */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl space-y-2 text-xs text-rose-900">
                  <div className="flex items-start gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>

                  <div className="bg-white/80 p-2 rounded-lg border border-rose-200 text-[11px] text-slate-700 space-y-1">
                    <p className="font-semibold text-rose-950">টাকা কি ইতিমধ্যে পাঠিয়েছেন?</p>
                    <p>যদি টাকা পাঠিয়ে থাকেন তবে bKash/Nagad সার্ভার থেকে আপডেট হতে ১-২ মিনিট সময় লাগতে পারে। আপনি চাইলে সরাসরি অ্যাডমিন ভেরিফিকেশন রিকোয়েস্ট জমা দিতে পারেন:</p>
                    
                    <button
                      type="button"
                      onClick={handleSubmitForManualReview}
                      className="w-full mt-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-md text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>অ্যাডমিন রিভিউয়ের জন্য জমা দিন (Submit for Manual Review)</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  প্রেরকের মোবাইল নম্বর (Sender Mobile Number):
                </label>
                <input
                  type="tel"
                  required
                  value={senderPhone}
                  onChange={(e) => {
                    setSenderPhone(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="e.g. 01712345678"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Transaction ID (TrxID):
                  </label>
                  <span className="text-[11px] font-mono text-slate-500 font-medium">
                    {gatewayDetails[selectedGateway].trxFormat}
                  </span>
                </div>

                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => {
                    setTrxId(e.target.value.toUpperCase());
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={selectedGateway === 'bkash' ? 'e.g. BK7A9X2M1L' : selectedGateway === 'nagad' ? 'e.g. 71G84A9X' : 'e.g. 24589632145'}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />

                {/* Account Balance Match Helper */}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Account Ledger Verification Active
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillReceivedTrx}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Fill Test Received TrxID</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75 mt-2"
              >
                {isVerifying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{verificationStep || `Checking account balance...`}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>অ্যাকাউন্টে টাকা যাচাই ও আনলক করুন (Verify & Unlock)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* 2. Pending Verification Submitted Screen */}
        {isPendingSubmitted && pendingOrderInfo && (
          <div className="p-6 space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-500 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Pending Admin Verification
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                পেমেন্ট যাচাইয়ের জন্য জমা হয়েছে
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                অর্ডার আইডি: <strong className="font-mono text-slate-900">{pendingOrderInfo.orderId}</strong> • TrxID: <strong className="font-mono text-indigo-900">{pendingOrderInfo.trxId}</strong>
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-left space-y-2 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">ফাইল:</span>
                <strong className="text-slate-900">{pendingOrderInfo.files.map(f => f.modelName).join(', ')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">টাকার পরিমাণ:</span>
                <strong className="text-emerald-700 font-black">৳{pendingOrderInfo.amount} BDT</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">প্রেরকের নম্বর:</span>
                <strong className="font-mono">{pendingOrderInfo.customerPhone}</strong>
              </div>
              <p className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                আমাদের অ্যাডমিন তার bKash/Nagad অ্যাপে আপনার প্রেরিত টাকা চেক করার পর আপনার ডাউনলোড লিংক সক্রিয় করে দেওয়া হবে।
              </p>
            </div>

            {/* WhatsApp Quick Notification */}
            <div className="space-y-2">
              <a
                href={`https://wa.me/8801610138733?text=Hello%20SBRFlashFile%20Admin%2C%20I%20have%20sent%20Tk%20${pendingOrderInfo.amount}%20for%20order%20${pendingOrderInfo.orderId}%20with%20TrxID%20${pendingOrderInfo.trxId}.%20Please%20approve.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>WhatsApp-এ দ্রুত অনুমোদনের জন্য মেসেজ দিন</span>
              </a>

              {onOpenAdminPanel && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-slate-300"
                >
                  ⚙️ অ্যাডমিন প্যানেল খুলে এখনই অ্যাপ্রুভ করুন (Admin View)
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 underline block mx-auto cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        )}

        {/* 3. Success & Unlocked Screen */}
        {isCompleted && (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Account Payment 100% Verified
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                অ্যাকাউন্টে টাকা নিশ্চিত হয়েছে!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                TrxID: <span className="font-mono font-bold text-slate-800">{trxId}</span> • Gateway: <span className="capitalize font-bold text-emerald-700">{selectedGateway}</span>
              </p>
            </div>

            {/* Unlocked Files List */}
            <div className="space-y-3 text-left">
              {unlockedPurchases.map((purchase) => (
                <div
                  key={purchase.orderId}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Order ID: {purchase.orderId}</span>
                      <h4 className="font-bold text-slate-900 text-sm">{purchase.modelName}</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      ৳{purchase.pricePaid} Paid
                    </span>
                  </div>

                  {/* Password & Security Details */}
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-emerald-600" />
                      Zip Password: <strong className="font-mono text-slate-900">{purchase.zipPassword}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(purchase.zipPassword);
                        setCopiedPass(true);
                        setTimeout(() => setCopiedPass(false), 2000);
                      }}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 p-1 cursor-pointer"
                    >
                      {copiedPass ? 'Copied!' : 'Copy Pass'}
                    </button>
                  </div>

                  {/* Primary VIP Download Button */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Download started for ${purchase.modelName}!\nFile will be saved with fast VIP mirror.`);
                    }}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Official Firmware ZIP</span>
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close & View Downloads History
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
