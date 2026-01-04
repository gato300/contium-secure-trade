import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package as PackageType, DocumentData } from '@/lib/types';

interface PackingListFormProps {
  onSubmit: (data: DocumentData) => void;
  isLoading?: boolean;
}

export function PackingListForm({ onSubmit, isLoading }: PackingListFormProps) {
  const [packages, setPackages] = useState<PackageType[]>([
    { packageNumber: 1, contents: '', weight: 0, dimensions: '' }
  ]);

  const addPackage = () => {
    setPackages([...packages, { 
      packageNumber: packages.length + 1, 
      contents: '', 
      weight: 0, 
      dimensions: '' 
    }]);
  };

  const removePackage = (index: number) => {
    if (packages.length > 1) {
      const newPackages = packages.filter((_, i) => i !== index);
      // Renumber packages
      setPackages(newPackages.map((pkg, i) => ({ ...pkg, packageNumber: i + 1 })));
    }
  };

  const updatePackage = (index: number, field: keyof PackageType, value: string | number) => {
    const newPackages = [...packages];
    newPackages[index] = { ...newPackages[index], [field]: value };
    setPackages(newPackages);
  };

  const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      packages,
      totalWeight,
      totalVolume: 0, // Could be calculated from dimensions
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Packages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Bultos / Paquetes</Label>
          <Button type="button" variant="outline" size="sm" onClick={addPackage}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar bulto
          </Button>
        </div>

        {packages.map((pkg, index) => (
          <div key={index} className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bulto #{pkg.packageNumber}</span>
              {packages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePackage(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label>Contenido</Label>
              <Input
                value={pkg.contents}
                onChange={(e) => updatePackage(index, 'contents', e.target.value)}
                placeholder="Descripción del contenido"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Peso (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={pkg.weight || ''}
                  onChange={(e) => updatePackage(index, 'weight', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Dimensiones</Label>
                <Input
                  value={pkg.dimensions}
                  onChange={(e) => updatePackage(index, 'dimensions', e.target.value)}
                  placeholder="80x60x50 cm"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
        <span className="font-semibold">Peso Total</span>
        <span className="text-2xl font-bold text-primary">
          {totalWeight.toFixed(2)} kg
        </span>
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
        <Package className="w-5 h-5 mr-2" />
        {isLoading ? 'Registrando...' : 'Registrar Packing List'}
      </Button>
    </form>
  );
}
