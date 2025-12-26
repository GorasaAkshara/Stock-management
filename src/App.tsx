import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { AddModal } from './components/AddModal';
import { UpdatePanel } from './components/UpdatePanel';
import { StockTable } from './components/StockTable';
import { AnimatedBackground } from './components/AnimatedBackground';
// import { useLocalStorage } from './hooks/useLocalStorage';
import { StockItem } from './types/StockItem';
// import { generateId } from './utils/helpers';

function App() {
  const undoTimerRef = useRef<number | null>(null);
  const [deletedStock, setDeletedStock] = useState<StockItem | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  // const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('stock_management_items', []); // REMOVED
  const [stockItems, setStockItems] = useState<StockItem[]>([]); // Using simple state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdatePanel, setShowUpdatePanel] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost/stock_management/backend/api.php';

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }, []);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setStockItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      showMessage('error', 'Failed to load items');
    } finally {
      setIsLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);




  const handleAddItem = async (newItem: Omit<StockItem, 'id' | 'updatedAt'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const result = await response.json();

      if (result.status === 'success') {
        await fetchItems(); // Refresh list
        setShowAddModal(false);
        showMessage('success', 'Item added successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
      showMessage('error', `Error: ${errorMessage}`);
      console.error(error);
    }
    return true;
  };

  const handleUpdateItem = async (updatedItem: StockItem) => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      const result = await response.json();

      if (result.status === 'success') {
        const updatedItems = stockItems.map(item =>
          item.id === updatedItem.id
            ? { ...updatedItem, updatedAt: new Date().toISOString() } // Optimistic update of date, really server sets it
            : item
        );
        setStockItems(updatedItems);
        // await fetchItems(); // Optional: fetch to be sure

        setEditingItem(null);
        setShowUpdatePanel(false);
        showMessage('success', 'Item updated successfully');
      } else {
        throw new Error(result.error);
      }
    } catch {
      showMessage('error', 'Failed to update item');
    }
    return true;
  };

  const handleSearch = (searchTerm: string): StockItem | null => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return null;

    return stockItems.find(item =>
      item.stockNumber.toLowerCase().includes(term) ||
      item.productName.toLowerCase().includes(term)
    ) || null;
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure?")) return; // Double check

    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await response.json();

      if (result.status === 'success') {
        const updatedItems = stockItems.filter(item => item.id !== id);
        setStockItems(updatedItems);
        showMessage('success', 'Item deleted successfully');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      showMessage('error', 'Failed to delete item');
    }
  };

  const handleUndoDelete = () => {
    if (deletedStock) {
      setStockItems([...stockItems, deletedStock]);
      setShowUndo(false);
      setDeletedStock(null);
      showMessage('success', 'Item restored');
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">Stock Management</h2>
          <p className="text-purple-200 animate-pulse">Loading your inventory...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <AnimatedBackground />

      {/* Floating orbs for ambient effect */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <Header
          onAddClick={() => setShowAddModal(true)}
          onUpdateClick={() => setShowUpdatePanel(true)}
        />

        {message && (
          <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm transition-all duration-500 transform animate-in slide-in-from-top-2 ${message.type === 'success'
            ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-100 shadow-lg shadow-emerald-500/20'
            : 'bg-red-500/20 border-red-400/30 text-red-100 shadow-lg shadow-red-500/20'
            }`}>
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${message.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'
                }`}></div>
              <span className="font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <StockTable
          items={stockItems}
          onDelete={handleDeleteItem}
        />

        {showUndo && deletedStock && (
          <div className="mb-6 p-4 rounded-xl border border-yellow-400/30 bg-yellow-500/20 text-yellow-900 font-semibold flex items-center justify-between animate-in fade-in duration-300">
            <span>Stock <strong>{deletedStock.stockNumber}</strong> deleted. <button onClick={handleUndoDelete} className="ml-4 px-4 py-2 bg-yellow-400 text-white rounded-lg font-bold hover:bg-yellow-500 transition">Undo Changes</button></span>
          </div>
        )}

        {showAddModal && (
          <AddModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddItem}
            nextStockNumber={(() => {
              const numbers = stockItems.map(item => parseInt(item.stockNumber.replace('STK', ''), 10)).filter(n => !isNaN(n));
              const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
              return `STK${nextNum.toString().padStart(3, '0')}`;
            })()}
          />
        )}

        {showUpdatePanel && (
          <UpdatePanel
            onClose={() => setShowUpdatePanel(false)}
            onSearch={handleSearch}
            onEdit={setEditingItem}
            editingItem={editingItem}
            onSave={handleUpdateItem}
          />
        )}
      </div>
    </div>
  );
}

export default App;