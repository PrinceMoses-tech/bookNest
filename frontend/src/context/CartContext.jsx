import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('bookease-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('bookease-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, quantity = 1, format = 'Paperback') => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === book.id && item.format === format
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === book.id && item.format === format
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { ...book, quantity, format }];
    });
  };

  const removeFromCart = (bookId, format) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === bookId && item.format === format))
    );
  };

  const updateQuantity = (bookId, format, quantity) => {
    if (quantity <= 0) {
      removeFromCart(bookId, format);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === bookId && item.format === format
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    getCartItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

