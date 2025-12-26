import React, { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { StockItem } from '../types/StockItem';
import { validateStockItem } from '../utils/validation';

interface AddModalProps {
  onClose: () => void;
  onSave: (item: Omit<StockItem, 'id' | 'updatedAt'>) => boolean | Promise<boolean>;
  initialData?: StockItem;
  isEditing?: boolean;
}

export function AddModal({ onClose, onSave, initialData, isEditing = false, nextStockNumber }: AddModalProps & { nextStockNumber?: string }) {
  const [formData, setFormData] = useState({
    stockNumber: initialData?.stockNumber || nextStockNumber || '',
    productName: initialData?.productName || '',
    quantity: initialData?.quantity || 0,
    price: initialData?.price || 0
  });

  useEffect(() => {
    if (!isEditing && nextStockNumber) {
      setFormData(prev => ({ ...prev, stockNumber: nextStockNumber }));
    }
  }, [nextStockNumber, isEditing]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validation = validateStockItem(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const success = await onSave(formData);

      if (success) {
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-in slide-in-from-bottom duration-500 border border-white/20">
        <div className="flex justify-between items-center p-8 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {isEditing ? 'Update Stock Item' : 'Add New Stock Item'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-xl hover:rotate-90 transform"
          >
            <X size={26} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label htmlFor="stockNumber" className="block text-sm font-bold text-white mb-2">
              Stock Number *
            </label>
            <input
              type="text"
              id="stockNumber"
              value={formData.stockNumber}
              readOnly
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-purple-200 cursor-not-allowed opacity-70 ${errors.stockNumber ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/30'
                }`}
              placeholder="e.g., STK001"
            />
            {errors.stockNumber && (
              <p className="mt-2 text-sm text-red-300 animate-in slide-in-from-left duration-300">{errors.stockNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="productName" className="block text-sm font-bold text-white mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="productName"
              value={formData.productName}
              onChange={(e) => handleInputChange('productName', e.target.value)}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-purple-200 hover:bg-white/20 ${errors.productName ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/30'
                }`}
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="mt-2 text-sm text-red-300 animate-in slide-in-from-left duration-300">{errors.productName}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-bold text-white mb-2">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              min="0"
              step="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-purple-200 hover:bg-white/20 ${errors.quantity ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/30'
                }`}
            />
            {errors.quantity && (
              <p className="mt-2 text-sm text-red-300 animate-in slide-in-from-left duration-300">{errors.quantity}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-bold text-white mb-2">
              Price per Unit (₹) *
            </label>
            <input
              type="number"
              id="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300 text-white placeholder-purple-200 hover:bg-white/20 ${errors.price ? 'border-red-400 ring-2 ring-red-400/50' : 'border-white/30'
                }`}
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-2 text-sm text-red-300 animate-in slide-in-from-left duration-300">{errors.price}</p>
            )}
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 text-white bg-white/10 hover:bg-white/20 rounded-2xl font-semibold transition-all duration-300 border border-white/20 hover:scale-105 transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 transform shadow-lg shadow-purple-500/25"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <>
                  <Save size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                  {isEditing ? 'Update' : 'Save'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}