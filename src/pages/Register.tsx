import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Package, FileCheck, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { InvoiceForm } from '@/components/forms/InvoiceForm';
import { PackingListForm } from '@/components/forms/PackingListForm';
import { DAMForm } from '@/components/forms/DAMForm';
import { Button } from '@/components/ui/button';
import { DocumentType, DocumentData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const documentTypes = [
  { 
    type: 'factura_comercial' as DocumentType, 
    label: 'Factura Comercial', 
    icon: FileText,
    roles: ['exportador'],
    description: 'Documento comercial con detalles de la transacción'
  },
  { 
    type: 'packing_list' as DocumentType, 
    label: 'Packing List', 
    icon: Package,
    roles: ['exportador'],
    description: 'Lista de empaque con detalle de bultos'
  },
  { 
    type: 'dam' as DocumentType, 
    label: 'DAM', 
    icon: FileCheck,
    roles: ['agente_aduanas'],
    description: 'Declaración Aduanera de Mercancías'
  },
];

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { documents, addDocument } = useDocuments();
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const availableTypes = documentTypes.filter((dt) => dt.roles.includes(user.role));

  const handleSubmit = async (data: DocumentData) => {
    if (!selectedType) return;

    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const title = selectedType === 'factura_comercial'
        ? `Factura Comercial #${data.invoiceNumber}`
        : selectedType === 'packing_list'
        ? `Packing List #PL-${Date.now().toString().slice(-6)}`
        : `DAM #${data.damNumber}`;

      const newDoc = await addDocument(selectedType, title, data, user);
      
      setSuccess(true);
      toast.success('Documento registrado exitosamente', {
        description: `Hash generado: ${newDoc.hash.slice(0, 16)}...`,
      });

      // Navigate after short delay
      setTimeout(() => {
        navigate(`/documents/${newDoc.id}`);
      }, 2000);
    } catch (error) {
      toast.error('Error al registrar documento');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 p-8 flex items-center justify-center">
          <div className="glass-card p-12 text-center max-w-md animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">¡Documento Registrado!</h2>
            <p className="text-muted-foreground mb-4">
              El hash SHA-256 fue generado y el documento quedó registrado en el sistema con trazabilidad inmutable.
            </p>
            <p className="text-sm text-muted-foreground">Redirigiendo al documento...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Registrar Documento</h1>
          <p className="text-muted-foreground">
            Selecciona el tipo de documento y completa la información requerida
          </p>
        </div>

        {/* Type selector */}
        {!selectedType && (
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {availableTypes.map((dt) => (
              <button
                key={dt.type}
                onClick={() => setSelectedType(dt.type)}
                className="glass-card p-6 text-left hover:border-primary/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <dt.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{dt.label}</h3>
                <p className="text-sm text-muted-foreground">{dt.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Form */}
        {selectedType && (
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedType(null)}
              >
                ← Cambiar tipo
              </Button>
              <span className="text-muted-foreground">|</span>
              <span className="font-medium">
                {documentTypes.find((dt) => dt.type === selectedType)?.label}
              </span>
            </div>

            <div className="glass-card p-6">
              {selectedType === 'factura_comercial' && (
                <InvoiceForm onSubmit={handleSubmit} isLoading={isLoading} />
              )}
              {selectedType === 'packing_list' && (
                <PackingListForm onSubmit={handleSubmit} isLoading={isLoading} />
              )}
              {selectedType === 'dam' && (
                <DAMForm 
                  availableDocuments={documents} 
                  onSubmit={handleSubmit} 
                  isLoading={isLoading} 
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
