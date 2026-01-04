// Contium Types

export type UserRole = 'exportador' | 'importador' | 'agente_aduanas' | 'autoridad';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company: string;
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
}
