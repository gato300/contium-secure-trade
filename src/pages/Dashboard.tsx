import { useNavigate } from 'react-router-dom';
import { FileText, AlertTriangle, CheckCircle, Clock, Plus, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { ZeroTrustPanel } from '@/components/dashboard/ZeroTrustPanel';
import { Button } from '@/components/ui/button';
import { roleLabels } from '@/lib/mockData';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { documents } = useDocuments();

  if (!user) {
    navigate('/login');
    return null;
  }

  // Filter documents based on role
  const visibleDocuments = documents.filter((doc) => {
    if (user.role === 'autoridad') return true;
    if (user.role === 'agente_aduanas') return true;
    if (user.role === 'exportador') return doc.registeredBy.id === user.id || doc.type !== 'dam';
    if (user.role === 'importador') return doc.type === 'factura_comercial' || doc.type === 'packing_list';
    return false;
  });

  const stats = {
    total: visibleDocuments.length,
    validated: visibleDocuments.filter((d) => d.status === 'validado').length,
    observed: visibleDocuments.filter((d) => d.status === 'observado').length,
    highRisk: visibleDocuments.filter((d) => d.riskIndicator === 'HIGH').length,
  };

  const recentDocuments = visibleDocuments.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Hola, <span className="text-gradient">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-muted-foreground">
              {roleLabels[user.role]} • {user.company}
            </p>
          </div>
          
          {(user.role === 'exportador' || user.role === 'agente_aduanas') && (
            <Button variant="hero" onClick={() => navigate('/register')}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo documento
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Documentos Totales" 
            value={stats.total} 
            icon={FileText}
            variant="default"
          />
          <StatsCard 
            title="Validados" 
            value={stats.validated} 
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard 
            title="Observados" 
            value={stats.observed} 
            icon={Clock}
            variant="warning"
          />
          <StatsCard 
            title="Alto Riesgo" 
            value={stats.highRisk} 
            icon={AlertTriangle}
            variant="danger"
          />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Documents */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Documentos Recientes</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/documents')}>
                Ver todos
              </Button>
            </div>

            {recentDocuments.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No hay documentos</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comienza registrando tu primer documento
                </p>
                {user.role === 'exportador' && (
                  <Button variant="outline" onClick={() => navigate('/register')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Registrar documento
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {recentDocuments.map((doc) => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc}
                    onClick={() => navigate(`/documents/${doc.id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Zero Trust Panel */}
          <div className="space-y-4">
            <ZeroTrustPanel />
            
            {/* Quick actions based on role */}
            {user.role === 'autoridad' && (
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Acciones de Autoridad</h3>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/verify')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Ir a Panel de Verificación
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
