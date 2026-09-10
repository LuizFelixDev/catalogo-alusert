import React from 'react';
import { ShoppingBag, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  nomeCatalogo?: string;
  nomeCliente?: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  nomeCatalogo,
  nomeCliente,
  searchQuery,
  setSearchQuery
}) => {
  const { totalItems, totalAmount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100 shadow-xs">
      <div className="container py-3 space-y-3">
        
        {/* Top Header Row: Logo & Client vs Cart Pill */}
        <div className="flex items-center justify-between gap-2">
          
          {/* Logo & Client Info */}
          <div className="flex items-center gap-3">
            {/* Circle Logo Badge */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-slate-950 shadow-md ring-2 ring-orange-500/20 shrink-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/30 to-amber-500/20"></div>
              <span className="text-lg font-black tracking-tighter text-white z-10">
                Alu<span className="text-orange-500">Sert</span>
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  Alu<span className="text-orange-500">Sert</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold text-orange-600 bg-orange-100/70 border border-orange-200/80 rounded-full uppercase tracking-wider">
                  OFICIAL
                </span>
              </div>

              {/* Client Name Subtitle */}
              <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-500 font-medium">
                <User className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>
                  {nomeCliente ? (
                    <>Cliente <strong className="text-slate-900 font-extrabold">{nomeCliente}</strong></>
                  ) : (
                    nomeCatalogo || 'Catálogo de Produtos'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Cart Pill Button (Matching exact image style) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label="Abrir carrinho"
          >
            <div className="relative w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-slate-900 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </div>

            <div className="flex flex-col text-left leading-tight pr-1">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">TOTAL</span>
              <span className="text-xs font-black text-slate-900 tracking-tight">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </button>
        </div>

        {/* Search Bar (Matching image input placeholder & icon) */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar produtos pelo nome ou código..."
            className="w-full pl-10 pr-9 py-2 bg-slate-50/90 hover:bg-slate-100/60 focus:bg-white text-xs sm:text-sm font-medium text-slate-900 border border-slate-200/80 focus:border-orange-500 rounded-full outline-none transition-all focus:ring-4 focus:ring-orange-500/10 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200/80 w-4 h-4 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
