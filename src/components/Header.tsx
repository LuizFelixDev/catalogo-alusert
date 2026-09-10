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
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 shadow-sm">
      {/* Top Banner / Logo & Client info */}
      <div className="container py-3.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 shadow-md ring-2 ring-orange-500/30 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-500/20 to-transparent"></div>
              <span className="text-xl font-black tracking-tighter text-white z-10 flex items-center">
                <span className="text-white">Alu</span>
                <span className="text-orange-500">Sert</span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Alu<span className="text-orange-500">Sert</span>
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[11px] font-bold text-orange-600 bg-orange-50 rounded-full border border-orange-200">
                  Catálogo Oficial
                </span>
              </div>

              {/* Subtitle with Client Greeting */}
              {nomeCliente ? (
                <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span>Catálogo para <strong className="text-slate-900 font-bold">{nomeCliente}</strong></span>
                </p>
              ) : (
                <p className="text-xs text-slate-500 font-medium">
                  {nomeCatalogo || 'Fábrica e Distribuidora de Alumínio'}
                </p>
              )}
            </div>
          </div>

          {/* Action Bar (Cart Button) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100/80 transition-all font-semibold text-sm active:scale-95 shadow-sm"
              aria-label="Abrir carrinho"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-orange-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-white bg-slate-900 rounded-full ring-2 ring-white animate-pulse">
                    {totalItems}
                  </span>
                )}
              </div>
              
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Seu Carrinho</span>
                <span className="text-xs font-extrabold text-slate-900">
                  R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos pelo nome ou código..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm font-medium text-slate-900 border border-slate-200 focus:border-orange-500 rounded-xl outline-none transition-all focus:ring-4 focus:ring-orange-500/15"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-200/80 hover:bg-slate-300 w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
