import React from 'react';
import { Plus, Edit3, Package } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  onUpdateClick: () => void;
}

export function Header({ onAddClick, onUpdateClick }: HeaderProps) {
  return (
    <div className="mb-12 animate-in slide-in-from-top duration-1000">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Package className="w-12 h-12 text-purple-400 animate-bounce" />
            {/* <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" /> */}
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3 animate-in slide-in-from-top duration-1000 delay-300">
          Stock Management
        </h1>
        <p className="text-purple-200 text-lg animate-in slide-in-from-top duration-1000 delay-500">
          Manage your inventory with elegance and precision
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded-full animate-in slide-in-from-top duration-1000 delay-700"></div>
      </div>

      <div className="flex justify-center gap-6 animate-in slide-in-from-bottom duration-1000 delay-1000">
        <button
          onClick={onAddClick}
          className="group relative bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:shadow-purple-500/40 hover:scale-105 transform"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">Add Item</span>
          <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>

        <button
          onClick={onUpdateClick}
          className="group relative bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 transform"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <Edit3 size={22} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">Update Item</span>
          <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
}