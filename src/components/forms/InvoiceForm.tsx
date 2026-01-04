import { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InvoiceItem, DocumentData } from '@/lib/types';

interface InvoiceFormProps {
  onSubmit: (data: DocumentData) => void;
  isLoading?: boolean;
}

export function InvoiceForm({ onSubmit, isLoading }: InvoiceFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [exporter, setExporter] = useState('');
  const [importer, setImporter] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 0, unitPrice: 0, totalPrice: 0, hsCode: '' }
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 0, unitPrice: 0, totalPrice: 0, hsCode: '' }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    
    setItems(newItems);
  };

  const totalValue = items.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      invoiceNumber,
      exporter,
      importer,
      items,
      totalValue,
      currency,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Número de Factura</Label>
          <Input
            id="invoiceNumber"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="FC-2024-001"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Input
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="USD"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="exporter">Exportador</Label>
          <Input
            id="exporter"
            value={exporter}
            onChange={(e) => setExporter(e.target.value)}
            placeholder="Nombre de la empresa exportadora"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="importer">Importador</Label>
          <Input
            id="importer"
            value={importer}
            onChange={(e) => setImporter(e.target.value)}
            placeholder="Nombre de la empresa importadora"
            required
          />
        </div>
      </div>

      {/* Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Productos</Label>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-1" />
            Agregar producto
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={index} className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Producto {index + 1}</span>
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Descripción del producto"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Código HS</Label>
                <Input
                  value={item.hsCode}
                  onChange={(e) => updateItem(index, 'hsCode', e.target.value)}
                  placeholder="8471.30"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Precio Unitario ({currency})</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Total</Label>
                <Input
                  type="number"
                  value={item.totalPrice.toFixed(2)}
                  readOnly
                  className="bg-secondary/50"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20">
        <span className="font-semibold">Valor Total</span>
        <span className="text-2xl font-bold text-primary">
          {currency} {totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
        <FileText className="w-5 h-5 mr-2" />
        {isLoading ? 'Registrando...' : 'Registrar Factura Comercial'}
      </Button>
    </form>
  );
}
