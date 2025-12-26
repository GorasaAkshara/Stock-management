import React, { useState } from 'react';
import { Trash2, Package, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { StockItem } from '../types/StockItem';
import { formatPrice, formatDate } from '../utils/helpers';

interface StockTableProps {
  items: StockItem[];
  onDelete: (id: string) => void;
}

export function StockTable({ items, onDelete }: StockTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StockItem;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const sortedItems = React.useMemo(() => {
    if (!sortConfig) return items;

    return [...items].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [items, sortConfig]);

  const handleSort = (key: keyof StockItem) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: keyof StockItem) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <Minus size={14} className="text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ?
      <TrendingUp size={14} className="text-purple-400" /> :
      <TrendingDown size={14} className="text-purple-400" />;
  };

  const handleDelete = (item: StockItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.productName}"?`)) {
      onDelete(item.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-white/20 animate-in fade-in duration-1000">
        <div className="relative mb-6">
          <Package size={80} className="mx-auto text-purple-300 animate-pulse" />
          {/* <Star className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" /> */}
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">No Stock Items Yet</h3>
        <p className="text-purple-200 text-lg">Start building your inventory by adding your first item</p>
        <div className="mt-6 w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom duration-1000">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm">
            <tr>
              <th
                className="px-6 py-5 text-left text-sm font-bold text-white cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                onClick={() => handleSort('stockNumber')}
              >
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  Stock Number
                  <span className="transition-transform duration-200 group-hover:scale-110">{getSortIcon('stockNumber')}</span>
                </div>
              </th>
              <th
                className="px-6 py-5 text-left text-sm font-bold text-white cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                onClick={() => handleSort('productName')}
              >
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  Product Name
                  <span className="transition-transform duration-200 group-hover:scale-110">{getSortIcon('productName')}</span>
                </div>
              </th>
              <th
                className="px-6 py-5 text-left text-sm font-bold text-white cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                onClick={() => handleSort('quantity')}
              >
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  Quantity
                  <span className="transition-transform duration-200 group-hover:scale-110">{getSortIcon('quantity')}</span>
                </div>
              </th>
              <th className="px-6 py-5 text-left text-sm font-bold text-white">Status</th>
              <th
                className="px-6 py-5 text-left text-sm font-bold text-white cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  Price per Unit
                  <span className="transition-transform duration-200 group-hover:scale-110">{getSortIcon('price')}</span>
                </div>
              </th>
              <th
                className="px-6 py-5 text-left text-sm font-bold text-white cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center gap-3 group-hover:scale-105 transition-transform duration-200">
                  Last Updated
                  <span className="transition-transform duration-200 group-hover:scale-110">{getSortIcon('updatedAt')}</span>
                </div>
              </th>
              <th className="px-6 py-5 text-right text-sm font-bold text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {sortedItems.map((item, index) => (
              <tr
                key={item.id}
                className={`hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] ${hoveredRow === item.id ? 'bg-white/5' : ''
                  }`}
                onMouseEnter={() => setHoveredRow(item.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                    {item.stockNumber}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium">
                  <span className="hover:text-purple-300 transition-colors duration-200">
                    {item.productName}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all duration-300 hover:scale-110 ${item.quantity === 0
                    ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                    : item.quantity < 10
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    }`}>
                    {item.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {item.quantity === 0
                    ? <span className="text-red-400 font-semibold">Out of Stock</span>
                    : item.quantity < 10
                      ? <span className="text-yellow-300 font-semibold">{`Only ${item.quantity} left`}</span>
                      : <span className="text-emerald-300 font-semibold">In stock</span>
                  }
                </td>
                <td className="px-6 py-4 text-sm text-white font-bold">
                  <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    ₹{formatPrice(item.price).replace('$', '')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-purple-200">
                  {formatDate(item.updatedAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(item)}
                    className="group text-red-400 hover:text-red-300 transition-all duration-300 p-2 hover:bg-red-500/20 rounded-xl hover:scale-110 transform"
                    title="Delete item"
                  >
                    <Trash2 size={18} className="group-hover:animate-pulse" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}