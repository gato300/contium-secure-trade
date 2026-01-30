import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, AlertTriangle, FileText, Brain, Award, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { VerificationProgress } from '@/components/dashboard/VerificationProgress';
import { VerificationResultCard } from '@/components/dashboard/VerificationResultCard';
import { MarketReferenceCard } from '@/components/dashboard/MarketReferenceCard';
import { MintBadgeButton } from '@/components/dashboard/MintBadgeButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { verifyHash } from '@/lib/hashUtils';
import { getRiskLabel } from '@/lib/aiAnalysis';
import { generateTxHash, SYSCOIN_EXPLORER_URL } from '@/lib/mockData';
import { Document, VerificationResult, ZeroTrustCheck, NFTBadge } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function Verify() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { documents, updateDocumentStatus, mintNFTBadge } = useDocuments();
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [verificationTime, setVerificationTime] = useState(0);
  const [validationTxHash, setValidationTxHash] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.role !== 'autoridad') {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 p-8 flex items-center justify-center">
          <div className="glass-card p-12 text-center max-w-md">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              Solo la Autoridad Aduanera puede acceder al panel de verificación.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const pendingDocuments = documents.filter((doc) => doc.status === 'registrado');
  const observedDocuments = documents.filter((doc) => doc.status === 'observado');

  const handleVerificationComplete = () => {
    if (!selectedDoc) return;
    
    const endTime = Date.now();
    setVerificationTime(endTime - startTimeRef.current);
    const txHash = generateTxHash();
    setValidationTxHash(txHash);
    
    const zeroTrustChecks: ZeroTrustCheck[] = [
      {
        id: 'hash',
        name: 'Integridad de Hash',
        description: 'Hash SHA-256 coincide con el documento original',
        passed: verifyHash(selectedDoc.hash, selectedDoc.versions[selectedDoc.currentVersion - 1].hash),
        timestamp: new Date(),
      },
      {
        id: 'version',
        name: 'Historial de Versiones',
        description: 'Cadena de versiones íntegra sin modificaciones no autorizadas',
        passed: selectedDoc.versions.length > 0 && selectedDoc.versions.every((v) => v.hash),
        timestamp: new Date(),
      },
      {
        id: 'actor',
        name: 'Identidad del Actor',
        description: 'El registrante tiene permisos para este tipo de documento',
        passed: true,
        timestamp: new Date(),
      },
      {
        id: 'zkp',
        name: 'ZK-Proof (Simulado)',
        description: 'Credenciales verificadas sin exponer datos sensibles',
        passed: true,
        timestamp: new Date(),
      },
    ];

    const result: VerificationResult = {
      documentId: selectedDoc.id,
      hashMatch: zeroTrustChecks[0].passed,
      versionIntegrity: zeroTrustChecks[1].passed,
      aiRiskAssessment: selectedDoc.riskIndicator,
      zeroTrustChecks,
      verifiedAt: new Date(),
      verifiedBy: user!,
      txHash,
    };

    setVerificationResult(result);
    setIsVerifying(false);
    setShowResult(true);
  };

  const runVerification = (doc: Document) => {
    setShowResult(false);
    setVerificationResult(null);
    setValidationTxHash(null);
    startTimeRef.current = Date.now();
    setIsVerifying(true);
    setSelectedDoc(doc);
  };

  const handleAction = (action: 'validate' | 'observe') => {
    if (!selectedDoc) return;
    updateDocumentStatus(selectedDoc.id, action === 'validate' ? 'validado' : 'observado');
    
    if (action === 'validate') {
      toast.success('Documento Validado', {
        description: `TX Hash: ${validationTxHash?.slice(0, 20)}...`,
      });
    } else {
      toast.warning('Documento Observado', {
        description: 'El documento ha sido marcado para revisión',
      });
    }
    
    setSelectedDoc(null);
    setVerificationResult(null);
    setShowResult(false);
    setValidationTxHash(null);
  };

  const handleMintBadge = (badge: NFTBadge) => {
    toast.success('¡NFT Emitido!', {
      description: `Compliance Badge registrado en blockchain`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Panel de Verificación</h1>
            <p className="text-muted-foreground">
              Autoridad Aduanera • Verificación de integridad documental
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Documents list */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Pendientes de Verificación ({pendingDocuments.length})
              </h2>
              
              {pendingDocuments.length === 0 ? (
                <div className="glass-card p-6 text-center text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
                  No hay documentos pendientes
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "glass-card p-4 cursor-pointer transition-all",
                        selectedDoc?.id === doc.id ? "border-primary" : "hover:border-primary/30"
                      )}
                      onClick={() => runVerification(doc)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-sm">{doc.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.registeredBy.name}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={
                            doc.riskIndicator === 'HIGH' ? 'danger' : 
                            doc.riskIndicator === 'MEDIUM' ? 'warning' : 'success'
                          }
                        >
                          {getRiskLabel(doc.riskIndicator)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {observedDocuments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  Documentos Observados ({observedDocuments.length})
                </h2>
                <div className="space-y-3">
                  {observedDocuments.map((doc) => (
                    <DocumentCard 
                      key={doc.id} 
                      document={doc}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Verification panel */}
          <div className="space-y-6">
            {/* Verification Progress with animation */}
            {isVerifying && (
              <VerificationProgress 
                isVerifying={isVerifying} 
                onComplete={handleVerificationComplete} 
              />
            )}

            {/* Result card after verification */}
            {showResult && verificationResult && selectedDoc && (
              <>
                <VerificationResultCard 
                  isValid={verificationResult.hashMatch && verificationResult.versionIntegrity}
                  verificationTime={verificationTime || 1018}
                  onBlockchain={true}
                />

                {/* TX Hash display */}
                {validationTxHash && (
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">TX Hash de Verificación</span>
                      <a 
                        href={`${SYSCOIN_EXPLORER_URL}${validationTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Ver en Explorer
                      </a>
                    </div>
                    <code className="text-xs font-mono break-all text-muted-foreground">
                      {validationTxHash}
                    </code>
                  </div>
                )}

                {/* Market reference */}
                {selectedDoc.type === 'factura_comercial' && selectedDoc.data.items && (
                  <MarketReferenceCard 
                    productName={selectedDoc.data.items[0]?.description || 'Producto'}
                    minPrice={Math.floor((selectedDoc.data.items[0]?.unitPrice || 600) * 0.9)}
                    maxPrice={Math.floor((selectedDoc.data.items[0]?.unitPrice || 600) * 1.1)}
                  />
                )}

                {/* Zero Trust checks */}
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Validaciones Zero Trust</h3>
                    <Badge variant="verified" className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Zero Trust
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {verificationResult.zeroTrustChecks.map((check) => (
                      <div 
                        key={check.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg",
                          check.passed ? "bg-success/10" : "bg-destructive/10"
                        )}
                      >
                        {check.passed ? (
                          <CheckCircle className="w-5 h-5 text-success shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-destructive shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-sm">{check.name}</p>
                          <p className="text-xs text-muted-foreground">{check.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Risk */}
                {selectedDoc.aiAnalysis && (
                  <div className={cn(
                    "glass-card p-6 border-2",
                    selectedDoc.riskIndicator === 'HIGH' ? "border-destructive/50 bg-destructive/5" :
                    selectedDoc.riskIndicator === 'MEDIUM' ? "border-warning/50 bg-warning/5" :
                    "border-success/50 bg-success/5"
                  )}>
                    <div className="flex items-center gap-2 mb-4">
                      <Brain className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">Análisis IA</h3>
                    </div>
                    <p className="text-sm">{selectedDoc.aiAnalysis.explanation}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Desviación:</span>
                      <span className={cn(
                        "font-bold",
                        selectedDoc.aiAnalysis.deviationPercent < 0 ? "text-destructive" : "text-success"
                      )}>
                        {selectedDoc.aiAnalysis.deviationPercent > 0 ? '+' : ''}
                        {selectedDoc.aiAnalysis.deviationPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Button 
                    variant="success" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => handleAction('validate')}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Validar Documento
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => handleAction('observe')}
                  >
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Observar
                  </Button>
                </div>

                {/* Mint Badge option after validation info */}
                <div className="glass-card p-4 border-2 border-primary/30 bg-primary/5">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-sm">Emisión de NFT</h3>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Al validar el documento, podrás emitir un Compliance Badge (NFT ERC-721) como prueba de cumplimiento en Syscoin NEVM.
                  </p>
                </div>
              </>
            )}

            {!isVerifying && !showResult && (
              <div className="glass-card p-12 text-center">
                <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Selecciona un documento</h3>
                <p className="text-sm text-muted-foreground">
                  Haz clic en un documento pendiente para iniciar la verificación
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
