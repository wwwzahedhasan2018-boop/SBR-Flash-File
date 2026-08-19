export type ChipsetType = 'All' | 'MTK' | 'Qualcomm' | 'SPD' | 'Exynos' | 'Unisoc' | 'Apple';
export type FileCategoryType = 'all' | 'flash_file' | 'box_file';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  badge?: string;
  description: string;
  fileCount: number;
  featuredModels: string[];
  themeColor: string;
  country: string;
  rank: number;
}

export interface FirmwareFile {
  id: string;
  brandId: string;
  brandName: string;
  modelName: string;
  title: string;
  androidVersion: string;
  binaryBitVersion: string;
  buildNumber: string;
  chipset: 'MTK' | 'Qualcomm' | 'SPD' | 'Exynos' | 'Unisoc' | 'Apple';
  chipsetModel: string;
  toolNeeded: string;
  fileSize: string;
  fileExtension: string;
  zipPassword: string;
  priceBDT: number;
  fileCategory?: 'flash_file' | 'box_file';
  isBoxFile?: boolean;
  isTested?: boolean;
  testedDevice?: string;
  testedDate: string;
  downloadServer: string;
  releaseDate: string;
  region: string;
  downloadsCount: number;
  rating: number;
  description: string;
  howToFlashSteps: string[];
  driverNeeded: string;
  md5Checksum: string;
  isHot?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  file: FirmwareFile;
  addedAt: number;
}

export type PaymentGateway = 'bkash' | 'nagad' | 'rocket';

export interface PurchasedFile {
  orderId: string;
  fileId: string;
  fileTitle: string;
  modelName: string;
  brandName: string;
  pricePaid: number;
  paymentGateway: PaymentGateway;
  senderNumber: string;
  trxId: string;
  purchaseDate: string;
  downloadUrl: string;
  zipPassword: string;
  md5: string;
}

export interface RequestFileSubmission {
  id: string;
  brand: string;
  model: string;
  chipset: string;
  androidVersion: string;
  problemDetails: string;
  contactNumber: string;
  email: string;
  timestamp: string;
  status: 'Pending' | 'Reviewing' | 'Uploaded';
}

export interface FlashTool {
  id: string;
  name: string;
  version: string;
  supportedChipsets: string[];
  description: string;
  fileSize: string;
  downloadUrl: string;
  category: 'tool' | 'driver';
}

export interface MerchantPaymentSettings {
  bkashNumber: string;
  bkashType: string;
  nagadNumber: string;
  nagadType: string;
  rocketNumber: string;
  rocketType: string;
  autoMatchLedger: boolean;
}

export interface ReceivedTransaction {
  id: string;
  gateway: PaymentGateway;
  trxId: string;
  senderNumber: string;
  amount: number;
  receivedAt: string;
  isUsed: boolean;
  usedForOrderId?: string;
  note?: string;
}

export interface PendingPaymentOrder {
  orderId: string;
  customerPhone: string;
  trxId: string;
  gateway: PaymentGateway;
  amount: number;
  files: FirmwareFile[];
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}
