import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Check, Package } from 'lucide-react';
import type { Produto } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  produto: Produto;
}

export const ProductCard: React.FC<ProductCardProps> = ({ produto }) => {
  const { cart, addToCart, updateQuantity } = useCart();
  const [imageError, setImageError] = useState(false);
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Check if item is already in cart
  const cartItem = cart.find((item) => item.produto.id_produto === produto.id_produto);
  const currentQuantityInCart = cartItem ? cartItem.quantidade : 0;

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(produto.id_produto, cartItem.quantidade + 1);
    } else {
      setQuantityInput((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(produto.id_produto, cartItem.quantidade - 1);
    } else {
      setQuantityInput((prev) => Math.max(1, prev - 1));
    }
  };

  const handleAddToCart = () => {
    const qtyToAdd = cartItem ? 1 : quantityInput;
    addToCart(produto, qtyToAdd);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  // Formatar preço em R$
  const formattedPrice = produto.preco.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-200 overflow-hidden relative">
      
      {/* Badge if item is in cart */}
      {currentQuantityInCart > 0 && (
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md animate-fade-in">
          <Check className="w-3.5 h-3.5 text-orange-400" />
          <span>{currentQuantityInCart} no carrinho</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-slate-100/80 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {produto.imagem && !imageError ? (
          <img
            src={produto.imagem}
            alt={produto.nome}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          /* Neutral AluSert Image Placeholder */
          <div className="flex flex-col items-center justify-center p-4 text-center text-slate-400">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/60 flex items-center justify-center mb-2">
              <Package className="w-6 h-6 text-slate-400" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400">AluSert Componente</span>
          </div>
        )}

        {produto.categoria && (
          <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60 shadow-xs">
            {produto.categoria}
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 min-h-[2.5rem]">
          {produto.nome}
        </h3>

        {produto.descricao ? (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {produto.descricao}
          </p>
        ) : (
          <p className="text-xs text-slate-400 mt-1 italic">
            Perfil de alta precisão em alumínio
          </p>
        )}

        {/* Price & Unit */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-baseline justify-between gap-1">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Preço</span>
            <div className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              <span className="text-xs font-bold text-orange-600 mr-0.5">R$</span>
              {formattedPrice}
            </div>
          </div>
          {produto.unidade && (
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              /{produto.unidade}
            </span>
          )}
        </div>

        {/* Quantity Controls & Add Button */}
        <div className="mt-3 flex items-center gap-2">
          {/* Stepper */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/50 p-0.5">
            <button
              type="button"
              onClick={handleDecrement}
              aria-label="Diminuir quantidade"
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition-all active:scale-90"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-extrabold text-slate-900">
              {cartItem ? cartItem.quantidade : quantityInput}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              aria-label="Aumentar quantidade"
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition-all active:scale-90"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-sm ${
              addedAnimation
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>{cartItem ? 'Adicionar +' : 'Adicionar'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
