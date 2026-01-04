import { Package, FileText, FileCheck2, Shield, ArrowDown, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Package,
    role: 'Exportador',
    title: 'Registro de Documentos',
    description: 'El exportador registra la Factura Comercial y Packing List. El sistema genera hash y versión inicial.',
    color: 'bg-primary',
  },
  {
    icon: FileText,
    role: 'Sistema IA',
    title: 'Análisis Automático',
    description: 'El agente de IA analiza precios, cantidades y detecta anomalías comparando con datos de mercado.',
    color: 'bg-warning',
  },
  {
    icon: FileCheck2,
    role: 'Agente de Aduanas',
    title: 'Elaboración DAM',
    description: 'Con documentos validados, el agente de aduanas prepara la Declaración Aduanera de Mercancías.',
    color: 'bg-success',
  },
  {
    icon: Shield,
    role: 'Autoridad Aduanera',
    title: 'Verificación Final',
    description: 'La autoridad verifica integridad de hashes, historial de cambios y resultados de IA.',
    color: 'bg-destructive',
  },
];

export function WorkflowSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Flujo de <span className="text-gradient">Verificación</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Un proceso seguro donde cada actor tiene permisos específicos y cada acción queda registrada.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />
              )}
              
              <div className="flex gap-6 mb-12">
                {/* Icon */}
                <div className={`relative z-10 w-12 h-12 rounded-xl ${step.color} flex items-center justify-center shrink-0 shadow-lg`}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="glass-card p-6 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                      {step.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Paso {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  
                  {/* Checkmarks */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-success">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Zero Trust</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Hash Verificado</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Auditado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
