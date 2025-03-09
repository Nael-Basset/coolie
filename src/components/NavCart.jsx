import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const NavCart = () => {
  const { getCartCount, showCart } = useContext(CartContext);
  
  // Récupération du nombre d'articles dans le panier
  const count = getCartCount ? getCartCount() : 0;
  
  // Fonction pour ouvrir le panier lorsqu'on clique sur l'icône
  const handleOpenCart = () => {
    console.log("Ouverture du panier");
    showCart();
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
