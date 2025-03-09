import React, { useContext, useEffect } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal, cartVisible, hideCart } = useContext(CartContext);
  
  // Log pour le débogage
  useEffect(() => {
    console.log("Cart component rendered, visibility:", cartVisible);
  }, [cartVisible]);
  
  // Si le panier n'est pas visible, ne rien afficher
  if (!cartVisible) return null;

  return (
    <div className="cart-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
      <div className="cart-container bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="cart-header flex justify-between items-center p-4 bg-green-primary text-white">
          <h3 className="text-xl font-semibold">Panier</h3>
          <button 
            onClick={hideCart} 
            className="text-white p-2 hover:bg-green-600 rounded-full"
            aria-label="Fermer"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="cart-items p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {!cart || cart.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Votre panier est vide</p>
          ) : (
            cart.map(item => (
              <div key={item.id || `item-${Math.random()}`} className="cart-item flex justify-between items-center py-3 border-b">
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-medium">{item.name || "Produit sans nom"}</h4>
                  <p className="text-sm text-gray-600">
                    {typeof item.price === 'string' ? item.price : 
                     (item.price ? `${parseFloat(item.price).toFixed(2)} €` : "Prix non disponible")}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={() => updateQuantity(item.id, Math.max(0, (item.quantity || 1) - 1))}
                    className="px-2 py-1 bg-gray-200 rounded-l"
                    aria-label="Diminuer quantité"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="px-3 py-1 bg-gray-100">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-r"
                    aria-label="Augmenter quantité"
                  >
                    <FaPlus size={10} />
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="ml-3 text-red-500 p-1"
                    aria-label="Supprimer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart && cart.length > 0 && (
          <div className="cart-footer p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-xl">{calculateTotal()} €</span>
            </div>
            <button 
              className="w-full py-3 bg-green-primary text-white rounded-md font-medium"
              onClick={hideCart}
            >
              Passer au paiement
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
