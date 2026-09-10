import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartFooterBarProps {
  onOpenCheckout: () => void;
}

export const CartFooterBar: React.FC<CartFooterBarProps> = ({ onOpenCheckout }) => {
  const { totalItems, totalAmount, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl animate-slide-up">
      <div className="container max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Total Summary */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="relative w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shadow-sm shrink-0">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
              {totalItems}
            </span>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {totalItems === 1 ? '1 produto' : `${totalItems} produtos`}
            </div>
            <div className="text-base font-extrabold text-slate-900 tracking-tight">
              R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </button>

        {/* Checkout Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCartOpen(true)}
            className="hidden sm:inline-flex px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
          >
            Ver Carrinho
          </button>

          <button
            onClick={onOpenCheckout}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-orange-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <span>Finalizar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
