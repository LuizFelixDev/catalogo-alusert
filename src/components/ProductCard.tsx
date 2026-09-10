import React, { useState } from 'react';
import { Plus, Minus, Check, Package } from 'lucide-react';
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
    <div className="group bg-white rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-md border border-slate-200/80 hover:border-orange-200 transition-all duration-200 flex flex-col gap-3 relative">
      
      {/* Badge if item is in cart */}
      {currentQuantityInCart > 0 && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs animate-fade-in">
          <Check className="w-3 h-3 text-orange-400" />
          <span>{currentQuantityInCart} no carrinho</span>
        </div>
      )}

      {/* Top Layout: Left Thumbnail + Right Info */}
      <div className="flex gap-3.5 items-start">
        
        {/* Left Image Thumbnail Container */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-slate-100/90 relative shrink-0 overflow-hidden border border-slate-100 flex items-center justify-center">
          {produto.imagem && !imageError ? (
            <img
              src={produto.imagem}
              alt={produto.nome}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
              <Package className="w-6 h-6 text-orange-500/80 mb-0.5" />
              <span className="text-[9px] font-bold text-slate-400 leading-tight">AluSert Componente</span>
            </div>
          )}

          {/* Dark Category Pill Badge inside Image (matching design screenshot) */}
          {produto.categoria && (
            <span className="absolute bottom-1.5 left-1.5 right-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-[9px] font-bold text-center py-0.5 rounded-md px-1 truncate shadow-xs">
              {produto.categoria}
            </span>
          )}
        </div>

        {/* Right Info Details */}
        <div className="flex-1 min-w-0 flex flex-col">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
            {produto.nome}
          </h3>

          {produto.descricao ? (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
              {produto.descricao}
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-0.5 italic">
              Perfil de alta precisão em alumínio
            </p>
          )}

          {/* Price Tag */}
          <div className="mt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">PREÇO</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-orange-600 tracking-tight">
                R$ {formattedPrice}
              </span>
              {produto.unidade && (
                <span className="text-xs font-medium text-slate-400">
                  /{produto.unidade}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: Stepper + Add Button (Separated by Dashed Border) */}
      <div className="pt-3 border-t border-dashed border-slate-200/90 flex items-center justify-between gap-3">
        
        {/* Stepper Controls */}
        <div className="flex items-center rounded-xl bg-slate-100/80 p-0.5 border border-slate-200/60 shrink-0">
          <button
            type="button"
            onClick={handleDecrement}
            aria-label="Diminuir quantidade"
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition-all active:scale-90 font-bold"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <span className="w-7 text-center text-xs font-black text-slate-900">
            {cartItem ? cartItem.quantidade : quantityInput}
          </span>

          <button
            type="button"
            onClick={handleIncrement}
            aria-label="Aumentar quantidade"
            className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-orange-600 hover:bg-white rounded-lg transition-all active:scale-90 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 py-2 px-4 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs ${
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
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{cartItem ? 'Adicionar +' : 'Adicionar'}</span>
            </>
          )}
        </button>

      </div>

    </div>
  );
};
