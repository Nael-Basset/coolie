import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = () => {
  const { getCartCount, toggleCart, cartVisible, showCart } = useContext(CartContext);
  
  const handleClick = () => {
    console.log("CartIcon clicked, current visibility:", cartVisible);
    // Utiliser directement showCart au lieu de toggleCart pour s'assurer que le panier s'ouvre
    showCart();
  };
  
  const count = getCartCount ? getCartCount() : 0;

  return (
    <div 
      className="cart-icon-container cursor-pointer relative p-2" 
      onClick={handleClick}
      aria-label="Afficher le panier"
    >
      <FaShoppingCart size={24} className="text-green-primary" />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-orange-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {count}
        </div>
      )}
    </div>
  );
};

export default CartIcon;
