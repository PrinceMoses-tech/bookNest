import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('booknest-wishlist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('booknest-wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggle = (book) => {
    setWishlist(prev => {
      const exists = prev.find(b => b.id === book.id);
      return exists ? prev.filter(b => b.id !== book.id) : [...prev, book];
    });
  };

  const isWishlisted = (id) => wishlist.some(b => b.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
};
