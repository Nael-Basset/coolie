import React from 'react';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const NavCart = () => {
  // Utilisation de useCart plutôt que useContext directement
  const cartContext = useCart();
  
  // Protection contre les erreurs avec des valeurs par défaut
  const getCartCount = cartContext?.getCartCount || (() => 0);
  const showCart = cartContext?.showCart || (() => console.log("showCart not available"));
  
  // Récupération du nombre d'articles dans le panier
  const count = getCartCount();
  
  // Fonction pour ouvrir le panier lorsqu'on clique sur l'icône
  const handleOpenCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("NavCart: handleOpenCart called");
    if (typeof showCart === 'function') {
      showCart();
    }
  };
  
  return (
    <div 
      className="cart-button bg-orange-secondary text-white rounded-full p-2 shadow-md flex items-center justify-center cursor-pointer"
      onClick={handleOpenCart}
      aria-label="Ouvrir le panier"
    >
      <FaShoppingCart className="text-white" size={18} />
      {count > 0 && (
        <span className="ml-1 text-sm font-semibold">{count}</span>
      )}
    </div>
  );
};

export default NavCart;
