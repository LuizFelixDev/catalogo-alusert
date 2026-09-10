import React, { createContext, useContext, useState, useMemo } from 'react';
import type { CartItem, Produto } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (produto: Produto, quantidade?: number) => void;
  updateQuantity: (id_produto: number | string, quantidade: number) => void;
  removeFromCart: (id_produto: number | string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (produto: Produto, quantidade: number = 1) => {
    if (quantidade <= 0) return;
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.produto.id_produto === produto.id_produto
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantidade: updated[existingIndex].quantidade + quantidade
        };
        return updated;
      }

      return [...prevCart, { produto, quantidade }];
    });
  };

  const updateQuantity = (id_produto: number | string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(id_produto);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.produto.id_produto === id_produto ? { ...item, quantidade } : item
      )
    );
  };

  const removeFromCart = (id_produto: number | string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.produto.id_produto !== id_produto)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantidade, 0);
  }, [cart]);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.produto.preco * item.quantidade, 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};
