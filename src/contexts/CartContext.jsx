import React, { createContext, useState, useEffect } from 'react';

// Simplification maximale du contexte
export const CartContext = createContext({});

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    console.warn("useCart must be used within CartProvider");
    return {
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      getCartCount: () => 0,
      showCart: () => {},
      hideCart: () => {},
      cartVisible: false
    };
  }
  return context;
};

export const CartProvider = ({ children }) => {
  // États basiques
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  
  // Chargement du panier depuis localStorage
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }, []);
  
  // Sauvegarde dans localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);
  
  // Fonctions simplifiées
  const addToCart = (item) => {
    if (!item?.name) return;
    
    const newItem = {
      ...item,
      id: item.id || `item-${Date.now()}`,
      quantity: item.quantity || 1
    };
    
    setCart(prev => {
      const exists = prev.find(i => i.id === newItem.id || i.name === newItem.name);
      if (exists) {
        return prev.map(i => 
          (i.id === exists.id || i.name === exists.name) 
            ? { ...i, quantity: (i.quantity || 1) + (newItem.quantity || 1) } 
            : i
        );
      }
      return [...prev, newItem];
    });
    
    // Automatiquement afficher le panier
    setCartVisible(true);
  };
  
  const removeFromCart = (itemId) => {
    if (!itemId) return;
    setCart(prev => prev.filter(i => i.id !== itemId));
  };
  
  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  };
  
  const calculateTotal = () => {
    try {
      const total = cart.reduce((sum, item) => {
        let price = 0;
        if (typeof item.price === 'number') {
          price = item.price;
        } else if (typeof item.price === 'string') {
          const match = item.price.replace(',', '.').match(/\d+(\.\d+)?/);
          price = match ? parseFloat(match[0]) : 0;
        }
        return sum + (price * (item.quantity || 1));
      }, 0);
      return total.toFixed(2);
    } catch (e) {
      return "0.00";
    }
  };
  
  // Contrôle de visibilité
  const showCart = () => setCartVisible(true);
  const hideCart = () => setCartVisible(false);
  
  // Valeur de contexte simplifiée
  const value = {
    cart,
    cartVisible,
    addToCart,
    removeFromCart,
    getCartCount,
    calculateTotal,
    showCart,
    hideCart,
    updateQuantity: (id, qty) => {
      if (qty <= 0) return removeFromCart(id);
      setCart(prev => 
        prev.map(item => item.id === id ? { ...item, quantity: qty } : item)
      );
    }
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
