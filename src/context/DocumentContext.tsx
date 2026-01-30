import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, DocumentType, DocumentStatus, User, DocumentData, NFTBadge } from '@/lib/types';
import { initialDocuments, generateBlockchainTransaction, generateTxHash, SYSCOIN_EXPLORER_URL } from '@/lib/mockData';
import { generateHash } from '@/lib/hashUtils';
import { analyzeDocument } from '@/lib/aiAnalysis';

interface DocumentContextType {
  documents: Document[];
  addDocument: (
    type: DocumentType,
    title: string,
    data: DocumentData,
    registeredBy: User
  ) => Promise<Document>;
  updateDocumentStatus: (id: string, status: DocumentStatus) => void;
  mintNFTBadge: (documentId: string) => NFTBadge | null;
  getDocumentById: (id: string) => Document | undefined;
  getDocumentsByType: (type: DocumentType) => Document[];
  getDocumentsByUser: (userId: string) => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const addDocument = async (
    type: DocumentType,
    title: string,
    data: DocumentData,
    registeredBy: User
  ): Promise<Document> => {
    const hash = await generateHash(data);
    const now = new Date();
    const blockchain = generateBlockchainTransaction();
    
    // Run AI analysis for commercial invoices
    let aiAnalysis;
    let riskIndicator: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    
    if (type === 'factura_comercial' && data.items) {
      aiAnalysis = analyzeDocument({ items: data.items });
      riskIndicator = aiAnalysis.riskLevel;
    }

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      type,
      title,
      hash,
      currentVersion: 1,
      versions: [
        {
          version: 1,
          hash,
          timestamp: now,
          actor: registeredBy,
          changes: 'Documento registrado inicialmente',
          txHash: blockchain.txHash,
        },
      ],
      registeredBy,
      status: 'registrado',
      riskIndicator,
      aiAnalysis,
      createdAt: now,
      updatedAt: now,
      data,
      blockchain,
    };

    setDocuments((prev) => [...prev, newDocument]);
    return newDocument;
  };

  const updateDocumentStatus = (id: string, status: DocumentStatus) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status, updatedAt: new Date() } : doc
      )
    );
  };

  const mintNFTBadge = (documentId: string): NFTBadge | null => {
    const doc = documents.find((d) => d.id === documentId);
    if (!doc || doc.nftBadge) return null;

    const txHash = generateTxHash();
    const badge: NFTBadge = {
      id: `nft-${Date.now()}`,
      type: 'compliance',
      name: `Compliance Badge #${doc.title.split('#')[1] || doc.id}`,
      description: 'NFT de cumplimiento emitido por verificación exitosa en Contium',
      txHash,
      mintedAt: new Date(),
      documentId,
    };

    setDocuments((prev) =>
      prev.map((d) =>
        d.id === documentId ? { ...d, nftBadge: badge } : d
      )
    );

    return badge;
  };

  const getDocumentById = (id: string) => {
    return documents.find((doc) => doc.id === id);
  };

  const getDocumentsByType = (type: DocumentType) => {
    return documents.filter((doc) => doc.type === type);
  };

  const getDocumentsByUser = (userId: string) => {
    return documents.filter((doc) => doc.registeredBy.id === userId);
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        addDocument,
        updateDocumentStatus,
        mintNFTBadge,
        getDocumentById,
        getDocumentsByType,
        getDocumentsByUser,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}
