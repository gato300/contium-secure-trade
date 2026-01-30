import { User, Document, UserRole, BlockchainTransaction, NFTBadge } from './types';

// Syscoin NEVM Explorer URL
export const SYSCOIN_EXPLORER_URL = 'https://explorer.syscoin.org/tx/';

// Generate mock transaction hash
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Generate mock blockchain transaction
export function generateBlockchainTransaction(): BlockchainTransaction {
  const txHash = generateTxHash();
  return {
    txHash,
    blockNumber: Math.floor(4000000 + Math.random() * 100000),
    gasUsed: Math.floor(80000 + Math.random() * 200000),
    gasCost: parseFloat((0.001 + Math.random() * 0.01).toFixed(4)),
    timestamp: new Date(),
    status: 'confirmed',
    explorerUrl: `${SYSCOIN_EXPLORER_URL}${txHash}`,
  };
}

// Mock Users with scores and NFTs
export const mockUsers: Record<UserRole, User> = {
  exportador: {
    id: 'user-001',
    name: 'Carlos Mendoza',
    email: 'carlos@exportperu.com',
    role: 'exportador',
    company: 'Export Perú S.A.C.',
    score: 145,
    totalDocuments: 12,
    nftBadges: [
      {
        id: 'nft-001',
        type: 'compliance',
        name: 'Compliance Badge #1',
        description: 'NFT de cumplimiento por verificación exitosa',
        txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        mintedAt: new Date('2024-01-15T10:31:00'),
        documentId: 'doc-001',
      },
    ],
  },
  importador: {
    id: 'user-002',
    name: 'María García',
    email: 'maria@importchile.cl',
    role: 'importador',
    company: 'Import Chile Ltda.',
    score: 85,
    totalDocuments: 8,
    nftBadges: [],
  },
  agente_aduanas: {
    id: 'user-003',
    name: 'Roberto Sánchez',
    email: 'roberto@aduanas.com',
    role: 'agente_aduanas',
    company: 'Agencia Aduanera Continental',
    score: 210,
    totalDocuments: 25,
    nftBadges: [
      {
        id: 'nft-002',
        type: 'verification',
        name: 'Verification Master',
        description: 'NFT por 20+ verificaciones exitosas',
        txHash: '0xb2c3d4e5f67890123456789012345678901234567890abcdef1234567890abcd',
        mintedAt: new Date('2024-01-10T15:00:00'),
      },
    ],
  },
  autoridad: {
    id: 'user-004',
    name: 'Ana Torres',
    email: 'ana.torres@sunat.gob.pe',
    role: 'autoridad',
    company: 'SUNAT - Aduanas',
    score: 520,
    totalDocuments: 0,
    nftBadges: [
      {
        id: 'nft-003',
        type: 'verification',
        name: 'Gold Verifier',
        description: 'NFT por 50+ verificaciones exitosas',
        txHash: '0xc3d4e5f678901234567890123456789012345678901234567890abcdef123456',
        mintedAt: new Date('2024-01-05T09:00:00'),
      },
    ],
  },
};

// Market price ranges for AI analysis (mock)
export const marketPriceRanges: Record<string, { min: number; max: number; avg: number }> = {
  '8471.30': { min: 450, max: 800, avg: 625 }, // Laptops
  '8517.12': { min: 200, max: 1200, avg: 700 }, // Smartphones
  '6403.99': { min: 25, max: 150, avg: 85 }, // Footwear
  '8528.72': { min: 150, max: 500, avg: 320 }, // TVs
  '9403.60': { min: 50, max: 300, avg: 175 }, // Furniture
};

// Initial mock documents with blockchain data
export const initialDocuments: Document[] = [
  {
    id: 'doc-001',
    type: 'factura_comercial',
    title: 'Factura Comercial #FC-2024-001',
    hash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    currentVersion: 1,
    versions: [
      {
        version: 1,
        hash: 'a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
        timestamp: new Date('2024-01-15T10:30:00'),
        actor: mockUsers.exportador,
        changes: 'Documento registrado inicialmente',
        txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      },
    ],
    registeredBy: mockUsers.exportador,
    status: 'validado',
    riskIndicator: 'LOW',
    aiAnalysis: {
      riskLevel: 'LOW',
      deviationPercent: 5.2,
      explanation: 'Precios dentro del rango de mercado. Sin anomalías detectadas.',
      analyzedAt: new Date('2024-01-15T10:31:00'),
    },
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:31:00'),
    data: {
      invoiceNumber: 'FC-2024-001',
      exporter: 'Export Perú S.A.C.',
      importer: 'Import Chile Ltda.',
      items: [
        {
          description: 'Laptop HP ProBook 450 G8',
          quantity: 50,
          unitPrice: 580,
          totalPrice: 29000,
          hsCode: '8471.30',
        },
      ],
      totalValue: 29000,
      currency: 'USD',
    },
    blockchain: {
      txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
      blockNumber: 4123456,
      gasUsed: 125000,
      gasCost: 0.0045,
      timestamp: new Date('2024-01-15T10:30:00'),
      status: 'confirmed',
      explorerUrl: 'https://explorer.syscoin.org/tx/0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    },
    nftBadge: {
      id: 'nft-001',
      type: 'compliance',
      name: 'Compliance Badge #FC-2024-001',
      description: 'NFT de cumplimiento por verificación exitosa',
      txHash: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123457',
      mintedAt: new Date('2024-01-15T10:32:00'),
      documentId: 'doc-001',
    },
  },
  {
    id: 'doc-002',
    type: 'factura_comercial',
    title: 'Factura Comercial #FC-2024-002',
    hash: 'b4g9c3d2e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
    currentVersion: 2,
    versions: [
      {
        version: 1,
        hash: 'x1y2z3a4b5c6d7e8f9g0h1i2j3k4l5m6n7o8p9q0r1s2t3u4v5w6x7y8z9a0b1c2',
        timestamp: new Date('2024-01-16T14:00:00'),
        actor: mockUsers.exportador,
        changes: 'Documento registrado inicialmente',
        txHash: '0xd4e5f678901234567890123456789012345678901234567890abcdef12345678',
      },
      {
        version: 2,
        hash: 'b4g9c3d2e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2',
        timestamp: new Date('2024-01-16T15:30:00'),
        actor: mockUsers.exportador,
        changes: 'Corrección de cantidad de unidades',
        txHash: '0xe5f6789012345678901234567890123456789012345678901234567890abcdef1',
      },
    ],
    registeredBy: mockUsers.exportador,
    status: 'observado',
    riskIndicator: 'HIGH',
    aiAnalysis: {
      riskLevel: 'HIGH',
      deviationPercent: -45.7,
      explanation: 'ALERTA: Precio unitario ($120) significativamente inferior al rango de mercado ($200-$1200). Posible subvaluación detectada.',
      analyzedAt: new Date('2024-01-16T14:01:00'),
    },
    createdAt: new Date('2024-01-16T14:00:00'),
    updatedAt: new Date('2024-01-16T15:30:00'),
    data: {
      invoiceNumber: 'FC-2024-002',
      exporter: 'Tech Solutions Ltd.',
      importer: 'Electro Importadora S.A.',
      items: [
        {
          description: 'Smartphone Samsung Galaxy S23',
          quantity: 200,
          unitPrice: 120,
          totalPrice: 24000,
          hsCode: '8517.12',
        },
      ],
      totalValue: 24000,
      currency: 'USD',
    },
    blockchain: {
      txHash: '0xd4e5f678901234567890123456789012345678901234567890abcdef12345678',
      blockNumber: 4123789,
      gasUsed: 145000,
      gasCost: 0.0052,
      timestamp: new Date('2024-01-16T14:00:00'),
      status: 'confirmed',
      explorerUrl: 'https://explorer.syscoin.org/tx/0xd4e5f678901234567890123456789012345678901234567890abcdef12345678',
    },
  },
  {
    id: 'doc-003',
    type: 'packing_list',
    title: 'Packing List #PL-2024-001',
    hash: 'c5h0d4e3f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
    currentVersion: 1,
    versions: [
      {
        version: 1,
        hash: 'c5h0d4e3f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3',
        timestamp: new Date('2024-01-15T11:00:00'),
        actor: mockUsers.exportador,
        changes: 'Documento registrado inicialmente',
        txHash: '0xf6789012345678901234567890123456789012345678901234567890abcdef12',
      },
    ],
    registeredBy: mockUsers.exportador,
    status: 'validado',
    riskIndicator: 'LOW',
    createdAt: new Date('2024-01-15T11:00:00'),
    updatedAt: new Date('2024-01-15T11:00:00'),
    data: {
      packages: [
        { packageNumber: 1, contents: 'Laptops HP ProBook (25 unidades)', weight: 75, dimensions: '80x60x50 cm' },
        { packageNumber: 2, contents: 'Laptops HP ProBook (25 unidades)', weight: 75, dimensions: '80x60x50 cm' },
      ],
      totalWeight: 150,
      totalVolume: 0.48,
    },
    blockchain: {
      txHash: '0xf6789012345678901234567890123456789012345678901234567890abcdef12',
      blockNumber: 4123500,
      gasUsed: 95000,
      gasCost: 0.0034,
      timestamp: new Date('2024-01-15T11:00:00'),
      status: 'confirmed',
      explorerUrl: 'https://explorer.syscoin.org/tx/0xf6789012345678901234567890123456789012345678901234567890abcdef12',
    },
  },
  {
    id: 'doc-004',
    type: 'dam',
    title: 'DAM #118-2024-10-000123',
    hash: 'd6i1e5f4g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
    currentVersion: 1,
    versions: [
      {
        version: 1,
        hash: 'd6i1e5f4g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4',
        timestamp: new Date('2024-01-15T14:00:00'),
        actor: mockUsers.agente_aduanas,
        changes: 'DAM registrada con documentación de soporte',
        txHash: '0x789012345678901234567890123456789012345678901234567890abcdef1234',
      },
    ],
    registeredBy: mockUsers.agente_aduanas,
    status: 'registrado',
    riskIndicator: 'LOW',
    createdAt: new Date('2024-01-15T14:00:00'),
    updatedAt: new Date('2024-01-15T14:00:00'),
    data: {
      damNumber: '118-2024-10-000123',
      customsOffice: 'Intendencia de Aduana Marítima del Callao',
      regime: '10 - Importación para el Consumo',
      linkedDocuments: ['doc-001', 'doc-003'],
    },
    blockchain: {
      txHash: '0x789012345678901234567890123456789012345678901234567890abcdef1234',
      blockNumber: 4123600,
      gasUsed: 180000,
      gasCost: 0.0065,
      timestamp: new Date('2024-01-15T14:00:00'),
      status: 'confirmed',
      explorerUrl: 'https://explorer.syscoin.org/tx/0x789012345678901234567890123456789012345678901234567890abcdef1234',
    },
  },
];

// Mock leaderboard data
export const mockLeaderboard = [
  { user: mockUsers.autoridad, verificationsCount: 52, documentsRegistered: 0, nftBadgesCount: 3, rank: 1 },
  { user: mockUsers.agente_aduanas, verificationsCount: 21, documentsRegistered: 25, nftBadgesCount: 2, rank: 2 },
  { user: mockUsers.exportador, verificationsCount: 8, documentsRegistered: 12, nftBadgesCount: 1, rank: 3 },
  { user: mockUsers.importador, verificationsCount: 5, documentsRegistered: 8, nftBadgesCount: 0, rank: 4 },
];

// Role labels in Spanish
export const roleLabels: Record<UserRole, string> = {
  exportador: 'Exportador',
  importador: 'Importador',
  agente_aduanas: 'Agente de Aduanas',
  autoridad: 'Autoridad Aduanera',
};

// Role descriptions
export const roleDescriptions: Record<UserRole, string> = {
  exportador: 'Registra facturas comerciales y packing lists',
  importador: 'Visualiza documentos de importación',
  agente_aduanas: 'Gestiona declaraciones aduaneras (DAM)',
  autoridad: 'Verifica integridad y detecta fraude',
};

// Role icons (lucide icon names)
export const roleIcons: Record<UserRole, string> = {
  exportador: 'Package',
  importador: 'ShoppingCart',
  agente_aduanas: 'FileCheck',
  autoridad: 'Shield',
};
