import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { BlockchainTimeline } from '@/components/dashboard/BlockchainTimeline';
import { AIAnalysisCard } from '@/components/dashboard/AIAnalysisCard';
import { ZeroTrustPanel } from '@/components/dashboard/ZeroTrustPanel';
import { GasInfoCard } from '@/components/dashboard/GasInfoCard';
import { MarketReferenceCard } from '@/components/dashboard/MarketReferenceCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { truncateHash } from '@/lib/hashUtils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const typeLabels = {
  factura_comercial: 'Factura Comercial',
  packing_list: 'Packing List',
  dam: 'Declaración Aduanera de Mercancías',
};

const statusConfig = {
  registrado: { label: 'Registrado', variant: 'ghost' as const },
  validado: { label: 'Validado', variant: 'success' as const },
  observado: { label: 'Observado', variant: 'danger' as const },
};

export default function DocumentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getDocumentById, updateDocumentStatus } = useDocuments();

  if (!user) {
    navigate('/login');
    return null;
  }

  const document = getDocumentById(id || '');

  if (!document) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 p-8">
          <div className="glass-card p-12 text-center">
            <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Documento no encontrado</h3>
            <Button variant="outline" onClick={() => navigate('/documents')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a documentos
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const status = statusConfig[document.status];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/documents')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a documentos
        </Button>

        {/* Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-1">{document.title}</h1>
                <p className="text-muted-foreground">{typeLabels[document.type]}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant={status.variant} className="text-sm py-1 px-3">
                {status.label}
              </Badge>
              
              {user.role === 'autoridad' && document.status === 'registrado' && (
                <div className="flex gap-2">
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => updateDocumentStatus(document.id, 'validado')}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Validar
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => updateDocumentStatus(document.id, 'observado')}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Observar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Hash display */}
          <div className="mt-6 p-4 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">Hash SHA-256</p>
            <code className="font-mono text-sm break-all">{document.hash}</code>
          </div>

          {/* Metadata */}
          <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Versión Actual</p>
              <p className="font-semibold">v{document.currentVersion}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Registrado por</p>
              <p className="font-semibold">{document.registeredBy.name}</p>
              <p className="text-xs text-muted-foreground">{document.registeredBy.company}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Fecha de Registro</p>
              <p className="font-semibold">
                {format(new Date(document.createdAt), 'dd MMMM yyyy, HH:mm', { locale: es })}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Document data */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-semibold mb-4">Datos del Documento</h2>
              
              {document.type === 'factura_comercial' && document.data.items && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">N° Factura</p>
                      <p className="font-medium">{document.data.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Moneda</p>
                      <p className="font-medium">{document.data.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Exportador</p>
                      <p className="font-medium">{document.data.exporter}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Importador</p>
                      <p className="font-medium">{document.data.importer}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <p className="text-sm font-medium mb-3">Productos ({document.data.items.length})</p>
                    {document.data.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-secondary/50 mb-2">
                        <p className="font-medium text-sm">{item.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <span>HS: {item.hsCode}</span>
                          <span>Qty: {item.quantity}</span>
                          <span>Unit: ${item.unitPrice}</span>
                          <span className="text-primary font-medium">Total: ${item.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Valor Total</span>
                      <span className="text-xl font-bold text-primary">
                        {document.data.currency} {document.data.totalValue?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {document.type === 'packing_list' && document.data.packages && (
                <div className="space-y-4">
                  {document.data.packages.map((pkg, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-secondary/50">
                      <p className="font-medium text-sm">Bulto #{pkg.packageNumber}</p>
                      <p className="text-sm text-muted-foreground mt-1">{pkg.contents}</p>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Peso: {pkg.weight} kg</span>
                        <span>Dim: {pkg.dimensions}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Peso Total</span>
                      <span className="text-xl font-bold text-primary">
                        {document.data.totalWeight} kg
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {document.type === 'dam' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">N° DAM</p>
                      <p className="font-medium">{document.data.damNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Oficina de Aduanas</p>
                      <p className="font-medium">{document.data.customsOffice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Régimen</p>
                      <p className="font-medium">{document.data.regime}</p>
                    </div>
                  </div>
                  
                  {document.data.linkedDocuments && document.data.linkedDocuments.length > 0 && (
                    <div className="pt-4 border-t border-border/50">
                      <p className="text-sm font-medium mb-2">Documentos Vinculados</p>
                      <div className="flex gap-2 flex-wrap">
                        {document.data.linkedDocuments.map((docId) => (
                          <Badge key={docId} variant="verified">
                            {docId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Analysis */}
            {document.aiAnalysis && (
              <AIAnalysisCard analysis={document.aiAnalysis} />
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <GasInfoCard 
              gasUsed={Math.floor(80000 + Math.random() * 200000)} 
              txHash={`0x${document.hash.slice(0, 40)}`}
            />
            
            {document.type === 'factura_comercial' && document.data.items && (
              <MarketReferenceCard 
                productName={document.data.items[0]?.description || 'Producto'}
                minPrice={Math.floor(document.data.items[0]?.unitPrice * 0.9) || 550}
                maxPrice={Math.floor(document.data.items[0]?.unitPrice * 1.1) || 620}
              />
            )}
            
            <BlockchainTimeline versions={[...document.versions].reverse()} />
            <ZeroTrustPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
