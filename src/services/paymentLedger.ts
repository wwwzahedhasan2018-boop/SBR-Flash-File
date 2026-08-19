import { MerchantPaymentSettings, ReceivedTransaction, PendingPaymentOrder, PaymentGateway, FirmwareFile, PurchasedFile } from '../types';

const SETTINGS_KEY = 'flashfilebd_merchant_settings';
const LEDGER_KEY = 'flashfilebd_received_ledger';
const PENDING_ORDERS_KEY = 'flashfilebd_pending_orders';

// Initial default merchant settings with user's number 01610138733
export const defaultMerchantSettings: MerchantPaymentSettings = {
  bkashNumber: '01610-138733',
  bkashType: 'Personal (Send Money)',
  nagadNumber: '01610-138733',
  nagadType: 'Personal (Send Money)',
  rocketNumber: '01610-138733-4',
  rocketType: 'Personal (Send Money)',
  autoMatchLedger: true,
};

// Initial verified payments in the owner's bKash/Nagad account ledger for demo
export const initialLedger: ReceivedTransaction[] = [
  {
    id: 'tx-101',
    gateway: 'bkash',
    trxId: 'BK7A9X2M1L',
    senderNumber: '01712984562',
    amount: 100,
    receivedAt: 'Today, 02:45 PM',
    isUsed: false,
    note: 'bKash App Transfer received for Flash File',
  },
  {
    id: 'tx-102',
    gateway: 'bkash',
    trxId: '9K7L2M5Q0A',
    senderNumber: '01819876543',
    amount: 200,
    receivedAt: 'Today, 03:10 PM',
    isUsed: false,
    note: 'bKash Send Money received for F64 Box File',
  },
  {
    id: 'tx-103',
    gateway: 'nagad',
    trxId: '71G84A9X',
    senderNumber: '01911223344',
    amount: 100,
    receivedAt: 'Today, 01:20 PM',
    isUsed: false,
    note: 'Nagad Cash-in received',
  },
];

export const getMerchantSettings = (): MerchantPaymentSettings => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return defaultMerchantSettings;
    const parsed = JSON.parse(saved);
    // If it was previous mock numbers, update to user's real number
    if (parsed.bkashNumber && (parsed.bkashNumber.includes('01755') || parsed.bkashNumber.includes('01700'))) {
      parsed.bkashNumber = '01610-138733';
      parsed.nagadNumber = '01610-138733';
      parsed.rocketNumber = '01610-138733-4';
      saveMerchantSettings(parsed);
    }
    return parsed;
  } catch {
    return defaultMerchantSettings;
  }
};

export const saveMerchantSettings = (settings: MerchantPaymentSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save merchant settings', e);
  }
};

export const getReceivedLedger = (): ReceivedTransaction[] => {
  try {
    const saved = localStorage.getItem(LEDGER_KEY);
    return saved ? JSON.parse(saved) : initialLedger;
  } catch {
    return initialLedger;
  }
};

export const saveReceivedLedger = (ledger: ReceivedTransaction[]): void => {
  try {
    localStorage.setItem(LEDGER_KEY, JSON.stringify(ledger));
  } catch (e) {
    console.error('Failed to save ledger', e);
  }
};

export const addTransactionToLedger = (tx: Omit<ReceivedTransaction, 'id' | 'receivedAt' | 'isUsed'>): ReceivedTransaction => {
  const ledger = getReceivedLedger();
  const newTx: ReceivedTransaction = {
    ...tx,
    id: `tx-${Date.now()}`,
    trxId: tx.trxId.trim().toUpperCase(),
    receivedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB'),
    isUsed: false,
  };
  const updated = [newTx, ...ledger];
  saveReceivedLedger(updated);
  return newTx;
};

export const getPendingOrders = (): PendingPaymentOrder[] => {
  try {
    const saved = localStorage.getItem(PENDING_ORDERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const savePendingOrders = (orders: PendingPaymentOrder[]): void => {
  try {
    localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save pending orders', e);
  }
};

export const createPendingOrder = (
  customerPhone: string,
  trxId: string,
  gateway: PaymentGateway,
  amount: number,
  files: FirmwareFile[]
): PendingPaymentOrder => {
  const orders = getPendingOrders();
  const newOrder: PendingPaymentOrder = {
    orderId: `FFBD-${Math.floor(100000 + Math.random() * 900000)}`,
    customerPhone: customerPhone.trim(),
    trxId: trxId.trim().toUpperCase(),
    gateway,
    amount,
    files,
    submittedAt: new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'pending',
  };
  const updated = [newOrder, ...orders];
  savePendingOrders(updated);
  return newOrder;
};

export type VerifyResultType = 
  | { success: true; message: string; transaction: ReceivedTransaction }
  | { success: false; reason: 'NOT_FOUND' | 'AMOUNT_MISMATCH' | 'ALREADY_USED' | 'GATEWAY_MISMATCH' | 'INVALID_FORMAT'; message: string };

/**
 * Verify against the actual money received in the owner's account ledger
 */
export const verifyAgainstMerchantAccount = (
  trxId: string,
  gateway: PaymentGateway,
  expectedAmount: number
): VerifyResultType => {
  const cleanTrx = trxId.trim().toUpperCase();
  const ledger = getReceivedLedger();

  const foundTx = ledger.find((t) => t.trxId.toUpperCase() === cleanTrx);

  if (!foundTx) {
    return {
      success: false,
      reason: 'NOT_FOUND',
      message: `❌ আপনার TrxID (${cleanTrx}) আমাদের ${gateway.toUpperCase()} নম্বরে পাওয়া যায়নি! অ্যাকাউন্টে কোনো টাকা জমা হওয়ার রেকর্ড মেলেনি।`
    };
  }

  if (foundTx.gateway !== gateway) {
    return {
      success: false,
      reason: 'GATEWAY_MISMATCH',
      message: `❌ এই ট্রানজেকশনটি ${foundTx.gateway.toUpperCase()} গেটওয়েতে জমা হয়েছে, কিন্তু আপনি ${gateway.toUpperCase()} নির্বাচন করেছেন।`
    };
  }

  if (foundTx.amount < expectedAmount) {
    const dueAmount = expectedAmount - foundTx.amount;
    return {
      success: false,
      reason: 'AMOUNT_MISMATCH',
      message: `❌ অপর্যাপ্ত টাকা পাঠানো হয়েছে! এই ফাইলের মূল্য ৳${expectedAmount} টাকা, কিন্তু আপনার TrxID-তে অ্যাকাউন্টে এসেছে মাত্র ৳${foundTx.amount} টাকা। বাকি ৳${dueAmount} টাকা না পাঠানো পর্যন্ত ফাইল আনলক হবে না।`
    };
  }

  if (foundTx.isUsed) {
    return {
      success: false,
      reason: 'ALREADY_USED',
      message: `❌ এই TrxID (${cleanTrx}) পূর্বেই অন্য একটি ফাইল ডাউনলোডের জন্য ব্যবহার করা হয়েছে!`
    };
  }

  // Mark transaction as used
  const updatedLedger = ledger.map((t) => 
    t.id === foundTx.id ? { ...t, isUsed: true, usedForOrderId: `AUTO-${Date.now()}` } : t
  );
  saveReceivedLedger(updatedLedger);

  return {
    success: true,
    message: `✅ পেমেন্ট সফলভাবে যাচাই হয়েছে! অ্যাকাউন্টে ৳${foundTx.amount} টাকা জমা পাওয়া গেছে।`,
    transaction: foundTx
  };
};
