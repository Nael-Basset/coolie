import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { FaTimes, FaPlus, FaMinus } from 'react-icons/fa';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, calculateTotal, cartVisible, hideCart } = useContext(CartContext);
  
  // Si le panier n'est pas visible, ne rien afficher
  if (!cartVisible) return null;

  return (
    <div className="cart-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start">
      <div className="cart-container bg-white w-full max-w-md mt-20 rounded-t-lg shadow-lg overflow-hidden">
        <div className="cart-header flex justify-between items-center p-4 bg-green-primary text-white">
          <h3 className="text-xl font-semibold">Panier</h3>
          <button onClick={hideCart} className="text-white" aria-label="Fermer">
            <FaTimes />
          </button>
        </div>
        
        <div className="cart-items p-4 max-h-[60vh] overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-6">Votre panier est vide</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item flex justify-between items-center py-3 border-b">
                <div className="flex-1">
                  <h4 className="text-sm font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{typeof item.price === 'string' ? item.price : `${item.price.toFixed(2)} €`}</p>
                </div>
                
                <div className="flex items-center">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-200 rounded-l"
                    aria-label="Diminuer quantité"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="px-3 py-1 bg-gray-100">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded-r"
                    aria-label="Augmenter quantité"
                  >
                    <FaPlus size={10} />
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="ml-3 text-red-500"
                    aria-label="Supprimer"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="cart-footer p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-xl">{calculateTotal()} €</span>
            </div>
            <button 
              className="w-full py-3 bg-green-primary text-white rounded-md font-medium"
              onClick={() => {
                // Logique de paiement ou navigation
                hideCart();
              }}
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
