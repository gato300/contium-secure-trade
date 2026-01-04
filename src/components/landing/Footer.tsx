import { Shield } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-xl">CONTIUM</span>
              <p className="text-xs text-muted-foreground">Verificación Documental para Comercio Exterior</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              Demo técnica • No usar en producción
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              © 2024 Contium. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
