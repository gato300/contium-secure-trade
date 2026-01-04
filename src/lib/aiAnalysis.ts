import { AIAnalysis, InvoiceItem, RiskLevel } from './types';
import { marketPriceRanges } from './mockData';

interface AnalysisInput {
  items: InvoiceItem[];
}

export function analyzeDocument(input: AnalysisInput): AIAnalysis {
  const { items } = input;
  
  let totalDeviation = 0;
  let analyzedItems = 0;
  let highRiskItems: string[] = [];
  
  for (const item of items) {
    const priceRange = marketPriceRanges[item.hsCode];
    
    if (priceRange) {
      const deviation = ((item.unitPrice - priceRange.avg) / priceRange.avg) * 100;
      totalDeviation += deviation;
      analyzedItems++;
      
      if (item.unitPrice < priceRange.min) {
        highRiskItems.push(item.description);
      }
    }
  }
  
  const avgDeviation = analyzedItems > 0 ? totalDeviation / analyzedItems : 0;
  
  let riskLevel: RiskLevel;
  let explanation: string;
  
  if (avgDeviation < -30 || highRiskItems.length > 0) {
    riskLevel = 'HIGH';
    explanation = `ALERTA: ${highRiskItems.length > 0 ? `Productos con precios bajo el rango de mercado: ${highRiskItems.join(', ')}.` : ''} Desviación promedio de ${avgDeviation.toFixed(1)}% respecto al precio de mercado. Se recomienda inspección física y verificación de origen.`;
  } else if (avgDeviation < -15 || avgDeviation > 30) {
    riskLevel = 'MEDIUM';
    explanation = `Atención: Desviación de ${avgDeviation.toFixed(1)}% respecto al precio de mercado. Se sugiere revisión documental adicional.`;
  } else {
    riskLevel = 'LOW';
    explanation = `Precios dentro del rango de mercado (desviación de ${avgDeviation.toFixed(1)}%). Sin anomalías detectadas en el análisis automatizado.`;
  }
  
  return {
    riskLevel,
    deviationPercent: avgDeviation,
    explanation,
    analyzedAt: new Date(),
  };
}

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW':
      return 'text-success';
    case 'MEDIUM':
      return 'text-warning';
    case 'HIGH':
      return 'text-destructive';
  }
}

export function getRiskBgColor(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW':
      return 'bg-success/20 border-success/30';
    case 'MEDIUM':
      return 'bg-warning/20 border-warning/30';
    case 'HIGH':
      return 'bg-destructive/20 border-destructive/30';
  }
}

export function getRiskLabel(risk: RiskLevel): string {
  switch (risk) {
    case 'LOW':
      return 'Riesgo Bajo';
    case 'MEDIUM':
      return 'Riesgo Medio';
    case 'HIGH':
      return 'Riesgo Alto';
  }
}
