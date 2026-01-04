import { useState } from 'react';
import { FileCheck, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DocumentData, Document } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DAMFormProps {
  availableDocuments: Document[];
  onSubmit: (data: DocumentData) => void;
  isLoading?: boolean;
}

export function DAMForm({ availableDocuments, onSubmit, isLoading }: DAMFormProps) {
  const [damNumber, setDamNumber] = useState('');
  const [customsOffice, setCustomsOffice] = useState('');
  const [regime, setRegime] = useState('10 - Importación para el Consumo');
  const [linkedDocuments, setLinkedDocuments] = useState<string[]>([]);

  const toggleDocument = (docId: string) => {
    setLinkedDocuments((prev) =>
      prev.includes(docId)
        ? prev.filter((id) => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      damNumber,
      customsOffice,
      regime,
      linkedDocuments,
    });
  };

  const validDocuments = availableDocuments.filter(
    (doc) => doc.type !== 'dam' && doc.status === 'validado'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="damNumber">Número de DAM</Label>
          <Input
            id="damNumber"
            value={damNumber}
            onChange={(e) => setDamNumber(e.target.value)}
            placeholder="118-2024-10-000123"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="regime">Régimen Aduanero</Label>
          <Input
            id="regime"
            value={regime}
            onChange={(e) => setRegime(e.target.value)}
            placeholder="10 - Importación para el Consumo"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="customsOffice">Oficina de Aduanas</Label>
        <Input
          id="customsOffice"
          value={customsOffice}
          onChange={(e) => setCustomsOffice(e.target.value)}
          placeholder="Intendencia de Aduana Marítima del Callao"
          required
        />
      </div>

      {/* Linked Documents */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-primary" />
          <Label>Documentos Vinculados</Label>
        </div>

        {validDocuments.length === 0 ? (
          <div className="glass-card p-4 text-center text-muted-foreground">
            No hay documentos validados disponibles para vincular
          </div>
        ) : (
          <div className="grid gap-3">
            {validDocuments.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => toggleDocument(doc.id)}
                className={cn(
                  "glass-card p-4 text-left transition-all",
                  linkedDocuments.includes(doc.id)
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/30"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{doc.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {doc.type === 'factura_comercial' ? 'Factura Comercial' : 'Packing List'}
                    </p>
                  </div>
                  <Badge variant={linkedDocuments.includes(doc.id) ? 'verified' : 'ghost'}>
                    {linkedDocuments.includes(doc.id) ? 'Vinculado' : 'Seleccionar'}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {linkedDocuments.length > 0 && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">Documentos a vincular:</p>
          <p className="font-semibold">{linkedDocuments.length} documento(s) seleccionado(s)</p>
        </div>
      )}

      <Button 
        type="submit" 
        variant="hero" 
        size="lg" 
        className="w-full" 
        disabled={isLoading || linkedDocuments.length === 0}
      >
        <FileCheck className="w-5 h-5 mr-2" />
        {isLoading ? 'Registrando...' : 'Registrar DAM'}
      </Button>
    </form>
  );
}
