import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Search, Filter } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentType, DocumentStatus } from '@/lib/types';

const typeLabels: Record<DocumentType, string> = {
  factura_comercial: 'Factura Comercial',
  packing_list: 'Packing List',
  dam: 'DAM',
};

export default function Documents() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { documents } = useDocuments();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DocumentType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');

  if (!user) {
    navigate('/login');
    return null;
  }

  // Filter documents based on role
  let visibleDocuments = documents.filter((doc) => {
    if (user.role === 'autoridad') return true;
    if (user.role === 'agente_aduanas') return true;
    if (user.role === 'exportador') return doc.registeredBy.id === user.id || doc.type !== 'dam';
    if (user.role === 'importador') return doc.type === 'factura_comercial' || doc.type === 'packing_list';
    return false;
  });

  // Apply filters
  if (search) {
    visibleDocuments = visibleDocuments.filter((doc) =>
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.hash.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (typeFilter !== 'all') {
    visibleDocuments = visibleDocuments.filter((doc) => doc.type === typeFilter);
  }

  if (statusFilter !== 'all') {
    visibleDocuments = visibleDocuments.filter((doc) => doc.status === statusFilter);
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Documentos</h1>
          <p className="text-muted-foreground">
            Gestiona y visualiza todos los documentos de comercio exterior
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título o hash..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('all')}
              >
                Todos
              </Button>
              {(Object.keys(typeLabels) as DocumentType[]).map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                >
                  {typeLabels[type]}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge
              variant={statusFilter === 'all' ? 'default' : 'ghost'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('all')}
            >
              Todos los estados
            </Badge>
            <Badge
              variant={statusFilter === 'registrado' ? 'default' : 'ghost'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('registrado')}
            >
              Registrado
            </Badge>
            <Badge
              variant={statusFilter === 'validado' ? 'success' : 'ghost'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('validado')}
            >
              Validado
            </Badge>
            <Badge
              variant={statusFilter === 'observado' ? 'danger' : 'ghost'}
              className="cursor-pointer"
              onClick={() => setStatusFilter('observado')}
            >
              Observado
            </Badge>
          </div>
        </div>

        {/* Documents grid */}
        {visibleDocuments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No se encontraron documentos</h3>
            <p className="text-sm text-muted-foreground">
              {search || typeFilter !== 'all' || statusFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Aún no hay documentos registrados'}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleDocuments.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onClick={() => navigate(`/documents/${doc.id}`)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
