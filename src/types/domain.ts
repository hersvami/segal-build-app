export interface Company {
  id: string;
  name: string;
  tagline: string;
  color: string;
  abn: string;
  phone: string;
  email: string;
  logo: string;
  // New: pricing defaults per company
  defaultOverheadPercent?: number;
  defaultProfitPercent?: number;
  licenceNumber?: string;
  builderRegistration?: string;
  warrantyInsurer?: string;
}

export interface TradeLine {
  id: string;
  trade: string;
  description: string;
  builderCost: number;
  clientCost: number;
}

export interface JobStage {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  builderCost: number;
  clientCost: number;
  trade: string;
  code?: string;
  isSelected: boolean;
  // New: Rawlinsons unit-rate fields
  quantity?: number;
  unit?: string;           // "m²", "lm", "item", "allow"
  unitRate?: number;        // Rawlinsons base rate
  rateSource?: string;      // "rawlinsons" | "cordell" | "custom"
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  builderCost: number;
  clientCost: number;
  timelineDays: number;
  stages: JobStage[];
  tradeLines: TradeLine[];
}

export interface SmartAnswer {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: "General" | "Demolition" | "Services" | "Joinery" | "Finishes" | string;
}

export interface PhotoItem {
  id: string;
  url?: string;
  data?: string;
  description: string;
  aiAnalysis: string;
}

export interface Message {
  id: string;
  sender: "builder" | "customer";
  senderName: string;
  text: string;
  timestamp: string;
  variationId?: string;
}

// ========================================
// NEW: Multi-scope quote model
// ========================================

export interface PCItem {
  id: string;
  description: string;
  allowance: number;
  unit: string;            // "each", "m²", "lm", "allow"
  actualCost?: number;     // filled in when customer selects
  suppliedBy?: "builder" | "customer";
  note?: string;
}

export interface InclusionItem {
  id: string;
  text: string;
  isDefault: boolean;      // from category template
}

export interface ExclusionItem {
  id: string;
  text: string;
  isDefault: boolean;      // from category template
}

export interface QuoteScope {
  id: string;
  categoryId: string;      // links to category file (e.g. "wetAreas", "kitchen")
  label: string;           // display name (e.g. "Main Bathroom", "Kitchen")
  description?: string;    // optional scope notes
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  answers: SmartAnswer[];
  stages: JobStage[];
  pcItems: PCItem[];
  inclusions: InclusionItem[];
  exclusions: ExclusionItem[];
  // Calculated totals for this scope
  tradeCost: number;       // sum of all stage builderCosts
  overheadAmount: number;
  profitAmount: number;
  clientPrice: number;     // tradeCost + overhead + profit
}

// ========================================
// NEW: Quote pricing summary
// ========================================

export interface QuotePricing {
  overheadPercent: number;   // default 12
  profitPercent: number;     // default 15
  contingencyPercent: number; // default 10 for reno, 5 for new build
  gstPercent: number;        // always 10 in Australia
  // Per-trade overrides
  tradeMargins?: Record<string, { overheadPercent?: number; profitPercent?: number }>;
  // Calculated
  totalTradeCost: number;
  totalOverhead: number;
  totalProfit: number;
  subtotalExGst: number;
  contingencyAmount: number;
  totalBeforeGst: number;
  gstAmount: number;
  totalIncGst: number;
}

// ========================================
// UPDATED: Variation now supports multi-scope
// ========================================

export interface Variation {
  id: string;
  mode: "quote" | "variation";
  title: string;
  description: string;
  elaboratedDescription: string;
  // Legacy single-room fields (kept for backward compat)
  roomType: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  answers: SmartAnswer[];
  photos: PhotoItem[];
  solutions: Solution[];
  selectedSolution: number;
  // Status
  status: "draft" | "pending" | "approved" | "rejected" | "invoiced";
  customerComment: string;
  rejectionReason: string;
  customerSignature: string;
  createdAt: string;
  sentAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  // Change tracking
  changeLog?: ChangeLogEntry[];
  // Progress tracking
  progressPhotos?: ProgressPhoto[];
  progressUpdates?: ProgressUpdate[];
  stageProgress?: Record<string, string>;
  // NEW: Multi-scope support
  scopes?: QuoteScope[];
  pricing?: QuotePricing;
  // NEW: Quote-wide inclusions/exclusions
  globalInclusions?: InclusionItem[];
  globalExclusions?: ExclusionItem[];
  // NEW: Quote-wide PC items
  globalPCItems?: PCItem[];
}

export interface ChangeLogEntry {
  id: string;
  timestamp: string;
  actor: "builder" | "customer";
  actorName: string;
  action: string;
  detail?: string;
}

export interface ProgressPhoto {
  id: string;
  url?: string;
  data?: string;
  publicId?: string;
  caption: string;
  stageTag: string;
  aiAnalysis: string;
  takenAt: string;
}

export interface ProgressUpdate {
  id: string;
  message: string;
  attachedPhotoUrl?: string;
  sentAt: string;
  sentVia: "sms" | "whatsapp" | "email" | "copy";
}

export interface ProjectCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export interface Project {
  id: string;
  name: string;
  address: string;
  customerName: string;
  customerEmail: string;
  customers: ProjectCustomer[];
  createdAt: string;
  variations: Variation[];
  messages: Message[];
}
