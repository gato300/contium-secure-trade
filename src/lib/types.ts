// Contium Types

export type UserRole = 'exportador' | 'importador' | 'agente_aduanas' | 'autoridad';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
  score?: number;
  totalDocuments?: number;
  nftBadges?: NFTBadge[];
}

export interface NFTBadge {
  id: string;
  type: 'compliance' | 'verification' | 'registration';
  name: string;
  description: string;
  txHash: string;
  mintedAt: Date;
  documentId?: string;
}

export interface BlockchainTransaction {
  txHash: string;
  blockNumber: number;
  gasUsed: number;
  gasCost: number; // in USD
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  explorerUrl: string;
}

export type DocumentType = 'factura_comercial' | 'packing_list' | 'dam';

export type DocumentStatus = 'registrado' | 'validado' | 'observado';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface DocumentVersion {
  version: number;
  hash: string;
  timestamp: Date;
  actor: User;
  changes: string;
  txHash?: string;
}

export interface AIAnalysis {
  riskLevel: RiskLevel;
  deviationPercent: number;
  explanation: string;
  analyzedAt: Date;
}

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  hash: string;
  currentVersion: number;
  versions: DocumentVersion[];
  registeredBy: User;
  status: DocumentStatus;
  riskIndicator: RiskLevel;
  aiAnalysis?: AIAnalysis;
  createdAt: Date;
  updatedAt: Date;
  data: DocumentData;
  blockchain?: BlockchainTransaction;
  nftBadge?: NFTBadge;
}

export interface DocumentData {
  // Factura Comercial
  invoiceNumber?: string;
  exporter?: string;
  importer?: string;
  items?: InvoiceItem[];
  totalValue?: number;
  currency?: string;
  
  // Packing List
  packages?: Package[];
  totalWeight?: number;
  totalVolume?: number;
  
  // DAM
  damNumber?: string;
  customsOffice?: string;
  regime?: string;
  linkedDocuments?: string[];
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  hsCode: string;
}

export interface Package {
  packageNumber: number;
  contents: string;
  weight: number;
  dimensions: string;
}

export interface ZeroTrustCheck {
  id: string;
  name: string;
  description: string;
  passed: boolean;
  timestamp: Date;
}

export interface VerificationResult {
  documentId: string;
  hashMatch: boolean;
  versionIntegrity: boolean;
  aiRiskAssessment: RiskLevel;
  zeroTrustChecks: ZeroTrustCheck[];
  verifiedAt: Date;
  verifiedBy: User;
  txHash?: string;
}

export interface LeaderboardEntry {
  user: User;
  verificationsCount: number;
  documentsRegistered: number;
  nftBadgesCount: number;
  rank: number;
}
