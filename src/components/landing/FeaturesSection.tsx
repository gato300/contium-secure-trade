import { Shield, FileCheck, Brain, Link2, Eye, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Zero Trust',
    description: 'Cada transacción es verificada. Ningún actor o documento es confiable por defecto.',
    color: 'text-primary',
  },
  {
    icon: FileCheck,
    title: 'Hash Documental',
    description: 'Cada documento genera un hash SHA-256 único que garantiza su integridad.',
    color: 'text-success',
  },
  {
    icon: Brain,
    title: 'Agente de IA',
    description: 'Análisis automático de precios y detección de anomalías en tiempo real.',
    color: 'text-warning',
  },
  {
    icon: Link2,
    title: 'Trazabilidad Inmutable',
    description: 'Historial de versiones tipo blockchain para auditoría completa.',
    color: 'text-primary',
  },
  {
    icon: Eye,
    title: 'Detección de Fraude',
    description: 'Identifica subvaluación, subconteo y declaraciones inconsistentes.',
    color: 'text-destructive',
  },
  {
    icon: Lock,
    title: 'ZK-Proofs Simulado',
    description: 'Verificación de credenciales sin exponer datos sensibles.',
    color: 'text-primary',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tecnología de <span className="text-gradient">Vanguardia</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Combinamos criptografía, inteligencia artificial y arquitectura Zero Trust para proteger el comercio internacional.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card glow-border p-6 hover:border-primary/50 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
