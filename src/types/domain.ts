export interface Company {
  id: string;
  name: string;
  tagline: string;
  color: string;
  abn: string;
  phone: string;
  email: string;
  logo: string;
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
  category: "General" | "Demolition" | "Services" | "Joinery" | "Finishes";
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

export interface Variation {
  id: string;
  mode: "quote" | "variation";
  title: string;
  description: string;
  elaboratedDescription: string;
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
  status: "draft" | "pending" | "approved" | "rejected" | "invoiced";
  customerComment: string;
  rejectionReason: string;
  customerSignature: string;
  createdAt: string;
  sentAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  changeLog?: ChangeLogEntry[];
  progressPhotos?: ProgressPhoto[];
  progressUpdates?: ProgressUpdate[];
  stageProgress?: Record<string, "Not Started" | "In Progress" | "Complete">;
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