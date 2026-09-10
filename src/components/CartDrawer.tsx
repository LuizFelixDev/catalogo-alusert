import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalAmount
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs animate-fade-in transition-opacity"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-up sm:animate-none">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Seu Carrinho</h2>
                <p className="text-xs text-slate-500 font-medium">
                  {totalItems === 1 ? '1 item selecionado' : `${totalItems} itens selecionados`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 text-base">Carrinho vazio</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Adicione produtos do catálogo para começar a montar o seu pedido.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Itens do Pedido</span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-700 hover:underline"
                  >
                    Esvaziar carrinho
                  </button>
                </div>

                {cart.map(({ produto, quantidade }) => {
                  const subtotal = produto.preco * quantidade;
                  return (
                    <div
                      key={produto.id_produto}
                      className="flex items-center gap-3 p-3 bg-slate-50/80 hover:bg-slate-50 rounded-2xl border border-slate-200/80 transition-all"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                        {produto.imagem ? (
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-slate-300" />
                        )}
                      </div>

                      {/* Details & Controls */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {produto.nome}
                        </h4>
                        <div className="text-xs font-semibold text-slate-500 mt-0.5">
                          R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} un.
                        </div>

                        {/* Stepper & Subtotal */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
                            <button
                              onClick={() => updateQuantity(produto.id_produto, quantidade - 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                              aria-label="Diminuir"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center text-xs font-bold text-slate-900">
                              {quantidade}
                            </span>
                            <button
                              onClick={() => updateQuantity(produto.id_produto, quantidade + 1)}
                              className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                              aria-label="Aumentar"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-xs font-black text-slate-900">
                            Subtotal: <span className="text-orange-600">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(produto.id_produto)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Remover item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer with Summary & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-white space-y-3.5 shadow-lg">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-medium">
                  <span>Quantidade total:</span>
                  <span className="font-bold text-slate-900">{totalItems} itens</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-slate-100">
                  <span className="text-sm font-extrabold text-slate-900">Total do Pedido:</span>
                  <span className="text-xl font-black text-orange-600">
                    R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 italic text-center">
                  * O total é informativo. O backend recalcula tudo ao receber o pedido.
                </p>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
