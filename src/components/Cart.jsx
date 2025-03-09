import React from 'react';
import { useCart } from '../contexts/CartContext';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const { 
    cart = [], 
    cartVisible = false, 
    hideCart, 
    removeFromCart, 
    updateQuantity, 
    calculateTotal = () => "0.00" 
  } = useCart();
  
  // Ne rien rendre si le panier est invisible
  if (!cartVisible) return null;
  
  // Gestionnaire pour fermer le panier de manière sécurisée
  const handleClose = () => {
    if (typeof hideCart === 'function') hideCart();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16"
      onClick={handleClose} // Fermer en cliquant en dehors
    >
      <div 
        className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden"
        onClick={e => e.stopPropagation()} // Empêcher la fermeture en cliquant sur le contenu
      >
        <div className="flex justify-between items-center p-4 bg-green-primary text-white">
          <h3 className="text-xl font-semibold">Panier</h3>
          <button 
            onClick={handleClose}
            className="text-white p-2 hover:bg-green-600 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {!cart || cart.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Votre panier est vide</p>
          ) : (
            cart.map(item => (
              <div 
                key={item.id || `item-${Math.random()}`} 
                className="flex justify-between items-center py-3 border-b"
              >
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-medium">{item.name || "Produit sans nom"}</h4>
                  <p className="text-sm text-gray-600">
                    {typeof item.price === 'string' ? item.price : 
                     (item.price ? `${parseFloat(item.price).toFixed(2)} €` : "Prix non disponible")}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={() => updateQuantity && updateQuantity(item.id, (item.quantity || 1) - 1)}
                    className="px-2 py-1 bg-gray-200 rounded-l"
                    aria-label="Diminuer"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="px-3 py-1 bg-gray-100">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity && updateQuantity(item.id, (item.quantity || 1) + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-r"
                    aria-label="Augmenter"
                  >
                    <FaPlus size={10} />
                  </button>
                  <button 
                    onClick={() => removeFromCart && removeFromCart(item.id)}
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
          <div className="p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-xl">{calculateTotal()} €</span>
            </div>
            <button 
              className="w-full py-3 bg-green-primary text-white rounded-md font-medium"
              onClick={handleClose}
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
