import React, { useState } from 'react';
import { X, Search, Zap, CheckCircle } from 'lucide-react';
import { StockItem } from '../types/StockItem';
import { AddModal } from './AddModal';

interface UpdatePanelProps {
  onClose: () => void;
  onSearch: (searchTerm: string) => StockItem | null;
  onEdit: (item: StockItem | null) => void;
  editingItem: StockItem | null;
  onSave: (item: StockItem) => boolean | Promise<boolean>;
}

export function UpdatePanel({ onClose, onSearch, onEdit, editingItem, onSave }: UpdatePanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<StockItem | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);


  const handleSearch = () => {
    if (!searchTerm.trim()) {
      return;
    }

    const result = onSearch(searchTerm);
    setSearchResult(result);
    setSearchPerformed(true);

    if (result) {
      onEdit(result);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSave = async (updatedData: Omit<StockItem, 'id' | 'updatedAt'>) => {
    if (!editingItem) return false;

    const updatedItem: StockItem = {
      ...editingItem,
      ...updatedData
    };

    return await onSave(updatedItem);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40 animate-in fade-in duration-300">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md transform transition-all animate-in slide-in-from-bottom duration-500 border border-white/20">
          <div className="flex justify-between items-center p-8 border-b border-white/20">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-emerald-400 animate-pulse" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Find & Update Item
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-emerald-300 hover:text-white transition-all duration-300 p-2 hover:bg-white/10 rounded-xl hover:rotate-90 transform"
            >
              <X size={26} />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label htmlFor="search" className="block text-sm font-bold text-white mb-3">
                Search by Stock Number or Product Name
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" size={20} />
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-white placeholder-purple-200 hover:bg-white/20"
                    placeholder="Enter stock number or product name"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={!searchTerm.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-2xl font-semibold transition-all duration-300 hover:scale-105 transform shadow-lg shadow-emerald-500/25"
                >
                  Search
                </button>
              </div>
            </div>

            {searchPerformed && !searchResult && (
              <div className="p-6 bg-amber-500/20 border border-amber-400/30 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top duration-300">
                <p className="text-amber-200 font-medium">
                  <strong>Item not found.</strong> Please check the stock number or product name and try again.
                </p>
              </div>
            )}

            {searchResult && !editingItem && (
              <div className="p-6 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl backdrop-blur-sm animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-200 font-bold">
                    Item found!
                  </p>
                </div>
                <div className="text-sm text-emerald-100 space-y-2 bg-white/10 p-4 rounded-xl">
                  <p><strong className="text-emerald-300">Stock Number:</strong> {searchResult.stockNumber}</p>
                  <p><strong className="text-emerald-300">Product:</strong> {searchResult.productName}</p>
                  <p><strong className="text-emerald-300">Quantity:</strong> {searchResult.quantity}</p>
                  <p><strong className="text-emerald-300">Price per Unit:</strong> ₹{searchResult.price.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {editingItem && (
        <AddModal
          onClose={() => onEdit(null)}
          onSave={handleSave}
          initialData={editingItem}
          isEditing={true}
        />
      )}
    </>
  );
}