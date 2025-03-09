import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = () => {
  // Utilisation de try/catch pour éviter les erreurs
  try {
    const { getCartCount, toggleCart, cartVisible } = useContext(CartContext);
    const count = getCartCount ? getCartCount() : 0;

    return (
      <div 
        className="cart-icon-container cursor-pointer relative p-1" 
        onClick={() => toggleCart && toggleCart()}
        aria-label={cartVisible ? "Masquer le panier" : "Afficher le panier"}
      >
        <FaShoppingCart size={24} className="text-green-primary" />
        {count > 0 && (
          <div className="absolute -top-2 -right-2 bg-orange-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {count}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Erreur dans CartIcon:", error);
    return (
      <div className="cart-icon-container cursor-pointer relative p-1">
        <FaShoppingCart size={24} className="text-gray-400" />
      </div>
    );
  }
};

export default CartIcon;
