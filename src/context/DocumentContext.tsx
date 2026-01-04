import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Document, DocumentType, DocumentStatus, User, DocumentData } from '@/lib/types';
import { initialDocuments } from '@/lib/mockData';
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
        },
      ],
      registeredBy,
      status: 'registrado',
      riskIndicator,
      aiAnalysis,
      createdAt: now,
      updatedAt: now,
      data,
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
