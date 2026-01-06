import { useState, useEffect } from 'react';
import { Shield, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface VerificationProgressProps {
  isVerifying: boolean;
  onComplete?: () => void;
}

const verificationSteps = [
  { id: 1, label: 'Verificando hash SHA-256', duration: 800 },
  { id: 2, label: 'Validando cadena de versiones', duration: 600 },
  { id: 3, label: 'Comprobando credenciales ZK-Proof', duration: 700 },
  { id: 4, label: 'Ejecutando análisis de riesgo IA', duration: 900 },
];

export function VerificationProgress({ isVerifying, onComplete }: VerificationProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVerifying) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    let totalTime = 0;
    const timers: NodeJS.Timeout[] = [];

    verificationSteps.forEach((step, idx) => {
      const timer = setTimeout(() => {
        setCurrentStep(idx + 1);
        setProgress(((idx + 1) / verificationSteps.length) * 100);
      }, totalTime);
      timers.push(timer);
      totalTime += step.duration;
    });

    const finalTimer = setTimeout(() => {
      onComplete?.();
    }, totalTime + 300);
    timers.push(finalTimer);

    return () => timers.forEach(clearTimeout);
  }, [isVerifying, onComplete]);

  if (!isVerifying && currentStep === 0) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        {progress < 100 ? (
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success-foreground" />
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">
            {progress < 100 ? 'Verificando documento...' : '✅ Validado correctamente'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {progress < 100 ? 'Ejecutando validaciones Zero Trust' : 'Todas las validaciones pasaron'}
          </p>
        </div>
      </div>

      <Progress value={progress} className="h-2 mb-6" />

      <div className="space-y-3">
        {verificationSteps.map((step, idx) => (
          <div 
            key={step.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              currentStep > idx ? "bg-success/10" : 
              currentStep === idx ? "bg-primary/10" : "bg-secondary/30"
            )}
          >
            {currentStep > idx ? (
              <CheckCircle className="w-5 h-5 text-success shrink-0" />
            ) : currentStep === idx ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            ) : (
              <Clock className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <span className={cn(
              "text-sm",
              currentStep > idx ? "text-success font-medium" :
              currentStep === idx ? "text-primary font-medium" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
