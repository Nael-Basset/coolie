import React from 'react';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

// Composant simplifié
const NavCart = () => {
  // Utiliser useCart qui a une protection intégrée
  const { getCartCount, showCart } = useCart();
  
  // Éviter les erreurs null/undefined
  const count = typeof getCartCount === 'function' ? getCartCount() : 0;
  
  // Gestionnaire d'événement simplifié mais robuste
  const handleClick = (e) => {
    // Empêcher la propagation par sécurité
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Appeler showCart de manière sécurisée
    if (typeof showCart === 'function') showCart();
  };
  
  return (
    <button 
      className="cart-button bg-orange-secondary text-white rounded-full p-2 shadow-md flex items-center justify-center"
      onClick={handleClick}
      type="button"
    >
      <FaShoppingCart className="text-white" size={18} />
      {count > 0 && (
        <span className="ml-1 text-sm font-semibold">{count}</span>
      )}
    </button>
  );
};

export default NavCart;
