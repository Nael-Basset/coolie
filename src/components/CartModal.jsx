import { useState } from 'react';
import { FaTimes, FaInfoCircle, FaMapMarkerAlt, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { useCart, pickupLocations } from '../contexts/CartContext';
import SliderButton from './SliderButton';

const CartModal = ({ onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    clearCart, 
    calculateTotal, 
    selectedPickupLocation,
    selectPickupLocation
  } = useCart();
  
  const [showPickupSelector, setShowPickupSelector] = useState(false);
  const [showPurchaseAdvice, setShowPurchaseAdvice] = useState(false);
  const [showOrderComplete, setShowOrderComplete] = useState(false);
  
  // Fonction pour identifier les ingrédients indisponibles
  const getUnavailableIngredients = () => {
    return cartItems.filter(item => item.isIngredient && !item.isAvailable);
  };

  const handleCheckout = () => {
    if (!selectedPickupLocation) {
      setShowPickupSelector(true);
      return;
    }
    
    // Afficher le modal de confirmation au lieu d'un simple alert
    setShowOrderComplete(true);
  };

  const finalizeOrder = () => {
    clearCart();
    setShowOrderComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Mon Panier</h3>
            <button 
              className="p-1 text-gray-500"
              onClick={onClose}
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          {cartItems.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div className="flex items-center">
                      <div className="ml-2">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-text-light">{item.price} x {item.quantity}</div>
                      </div>
                    </div>
                    <button 
                      className="text-red-500"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Conseil d'achat pour ingrédients non disponibles */}
              {getUnavailableIngredients().length > 0 && (
                <div className="bg-orange-secondary bg-opacity-20 p-3 rounded-lg mb-4">
                  <div className="flex items-center text-orange-secondary mb-2">
                    <FaInfoCircle className="mr-2" />
                    <span className="font-bold">Certains ingrédients ne sont pas disponibles</span>
                  </div>
                  <p className="text-sm mb-2">
                    Ces produits ne sont pas disponibles via COOLIE :
                  </p>
                  <ul className="list-disc list-inside text-sm mb-2">
                    {getUnavailableIngredients().map(item => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                  <button 
                    className="text-orange-secondary text-sm underline"
                    onClick={() => setShowPurchaseAdvice(true)}
                  >
                    Où trouver ces produits ?
                  </button>
                </div>
              )}
              
              {/* Lieu de retrait sélectionné */}
              <div className="bg-green-primary bg-opacity-10 p-3 rounded-lg mb-4">
                <div className="flex items-center text-green-primary mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span className="font-bold">Point de retrait</span>
                </div>
                {selectedPickupLocation ? (
                  <div className="text-sm">
                    <p className="font-medium">{selectedPickupLocation.name}</p>
                    <p>{selectedPickupLocation.address}</p>
                    <p className="text-text-light mt-1">{selectedPickupLocation.hours}</p>
                  </div>
                ) : (
                  <button
                    className="w-full text-center text-green-primary py-2 border border-green-primary rounded-lg"
                    onClick={() => setShowPickupSelector(true)}
                  >
                    Choisir un point de retrait
                  </button>
                )}
              </div>
              
              <div className="flex justify-between font-bold mb-4">
                <span>Total:</span>
                <span>{calculateTotal()} €</span>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  className="bg-red-500 text-white flex-1 py-2 rounded-lg"
                  onClick={clearCart}
                >
                  Vider le panier
                </button>
                <button 
                  className="bg-green-primary text-white flex-1 py-2 rounded-lg"
                  onClick={handleCheckout}
                >
                  Commander
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-light mb-4">Votre panier est vide</p>
              <button 
                className="bg-green-primary text-white px-4 py-2 rounded-lg"
                onClick={onClose}
              >
                Continuer mes achats
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Point de retrait Selector Modal */}
      {showPickupSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Choisir un point de retrait</h3>
                <button 
                  className="p-1 text-gray-500"
                  onClick={() => setShowPickupSelector(false)}
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-3 mb-4">
                {pickupLocations.map((location) => (
                  <button
                    key={location.id}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedPickupLocation?.id === location.id
                        ? 'border-green-primary bg-green-primary bg-opacity-10'
                        : 'border-gray-200'
                    }`}
                    onClick={() => {
                      selectPickupLocation(location);
                      setShowPickupSelector(false);
                    }}
                  >
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm">{location.address}</div>
                    <div className="text-xs text-text-light mt-1">{location.hours}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Conseils d'achat modal */}
      {showPurchaseAdvice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Conseils d'achat</h3>
                <button 
                  className="p-1 text-gray-500"
                  onClick={() => setShowPurchaseAdvice(false)}
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-green-primary mb-2">Alternatives locales</h4>
                <p className="text-sm mb-3">
                  Voici où trouver les ingrédients non disponibles sur COOLIE :
                </p>
                <ul className="list-disc list-inside text-sm space-y-2 mb-4">
                  <li>
                    <strong>Marchés locaux :</strong> Rendez-vous au marché de votre ville - généralement les mardi, 
                    jeudi et samedi matin. Vous y trouverez des produits frais et de saison.
                  </li>
                  <li>
                    <strong>Magasins bio :</strong> Les épiceries bio comme Biocoop ou Naturalia ont une large 
                    sélection d'ingrédients spécifiques et de qualité.
                  </li>
                  <li>
                    <strong>AMAP :</strong> Rejoignez une Association pour le Maintien d'une Agriculture Paysanne 
                    près de chez vous pour recevoir régulièrement des produits frais.
                  </li>
                  <li>
                    <strong>Vente directe à la ferme :</strong> De nombreux producteurs proposent de la vente directe. 
                    Consultez notre carte pour identifier les fermes près de chez vous.
                  </li>
                </ul>
                
                <h4 className="font-medium text-green-primary mb-2">Substitutions possibles</h4>
                <p className="text-sm mb-3">
                  Si vous ne trouvez pas certains ingrédients, voici quelques substitutions recommandées :
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li><strong>Herbes fraîches</strong> → herbes séchées (1/3 de la quantité)</li>
                  <li><strong>Échalotes</strong> → oignons rouges</li>
                  <li><strong>Crème fraîche</strong> → yaourt grec</li>
                  <li><strong>Vin de cuisine</strong> → bouillon avec une touche de vinaigre</li>
                </ul>
              </div>
              
              <button 
                className="bg-green-primary text-white w-full py-2 rounded-lg"
                onClick={() => setShowPurchaseAdvice(false)}
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Écran de confirmation de commande */}
      {showOrderComplete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <div className="flex flex-col items-center py-6">
                <div className="text-green-primary mb-4">
                  <FaCheckCircle size={70} />
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">
                  Commande confirmée !
                </h3>
                <p className="text-text-light text-center mb-6">
                  Votre commande a été validée avec succès
                </p>
                
                <div className="bg-green-primary bg-opacity-10 p-4 rounded-lg w-full mb-6">
                  <div className="flex items-center mb-3">
                    <FaMapMarkerAlt className="text-green-primary mr-2" size={18} />
                    <span className="font-bold">Point de retrait</span>
                  </div>
                  <p className="font-medium">{selectedPickupLocation.name}</p>
                  <p className="text-sm">{selectedPickupLocation.address}</p>
                  <p className="text-sm text-text-light mt-1">{selectedPickupLocation.hours}</p>
                  
                  <div className="flex items-center mt-4">
                    <FaCalendarAlt className="text-green-primary mr-2" size={18} />
                    <span className="font-medium">
                      Prêt à retirer dès demain
                    </span>
                  </div>
                </div>
                
                <SliderButton 
                  onComplete={finalizeOrder}
                  text="Glisser pour confirmer"
                  completedText="Commande confirmée !"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartModal;
