import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from './ToastContext';
// Vérifier si le module mockData existe, sinon créer des produits fictifs
let products = [];
try {
  const { products: mockProducts } = require('../data/mockData');
  products = mockProducts || [];
} catch (error) {
  console.warn("Module mockData non trouvé, utilisation d'un tableau vide");
  products = [];
}

export const CartContext = createContext();

export const useCart = () => useContext(CartContext);

// Liste des points de retrait
export const pickupLocations = [
  { 
    id: 'market-1', 
    name: 'Marché Saint-Martin', 
    address: '31 Rue du Château d\'Eau, 75010 Paris', 
    hours: 'Mar-Sam: 8h-13h, 16h-19h' 
  },
  { 
    id: 'market-2', 
    name: 'Marché d\'Aligre', 
    address: 'Place d\'Aligre, 75012 Paris', 
    hours: 'Mar-Dim: 8h-13h30' 
  },
  { 
    id: 'farm-1', 
    name: 'Ferme de la Colline', 
    address: '14 Chemin des Vergers, 91400 Saclay', 
    hours: 'Mer, Ven: 15h-19h, Sam: 10h-18h' 
  },
  { 
    id: 'farm-2', 
    name: 'Ferme Bio du Vexin', 
    address: '3 Route de Mantes, 95450 Sagy', 
    hours: 'Ven: 16h-19h, Sam: 10h-17h' 
  },
  { 
    id: 'shop-1', 
    name: 'Coolie Shop - Bastille', 
    address: '18 Rue de la Roquette, 75011 Paris', 
    hours: 'Lun-Sam: 10h-20h' 
  }
];

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartVisible, setCartVisible] = useState(false);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const { showToast } = useToast ? useToast() : { showToast: () => {} };

  // Charger le panier depuis le stockage local au montage du composant
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du panier:', error);
      // Réinitialiser le panier en cas d'erreur
      setCart([]);
    }
  }, []);
  
  // Sauvegarder le panier dans le stockage local à chaque modification
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du panier:', error);
    }
  }, [cart]);
  
  // Ajouter un élément au panier
  const addToCart = (item) => {
    if (!item || !item.name) {
      console.error("Impossible d'ajouter un élément invalide au panier", item);
      return;
    }
    
    // Assurer que l'item a un ID
    const itemWithId = {
      ...item,
      id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    setCart(prevCart => {
      // Vérifier si l'élément existe déjà
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === itemWithId.id || cartItem.name === itemWithId.name
      );
      
      // Si l'élément existe déjà, augmenter sa quantité
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (parseFloat(updatedCart[existingItemIndex].quantity) || 0) + 
                    (parseFloat(itemWithId.quantity) || 1)
        };
        return updatedCart;
      } 
      // Sinon, ajouter le nouvel élément
      else {
        return [...prevCart, { ...itemWithId, quantity: itemWithId.quantity || 1 }];
      }
    });
    
    // Afficher automatiquement le panier lors de l'ajout d'un élément
    setCartVisible(true);
    
    // Message plus court
    if (showToast) {
      showToast(`${item.name} ajouté`, 'success');
    }
  };

  const addIngredientsToCart = (ingredients) => {
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      console.error("Liste d'ingrédients invalide", ingredients);
      return;
    }
    
    // Simplifier la conversion d'ingrédients
    const ingredientProducts = ingredients.map((ingredient, index) => ({
      id: `ingredient-${Date.now()}-${index}`,
      name: typeof ingredient === 'string' ? ingredient : (ingredient.name || 'Ingrédient'),
      price: 0,
      quantity: 1,
      isIngredient: true
    }));
    
    // Ajouter tous les ingrédients
    ingredientProducts.forEach(product => {
      addToCart(product);
    });
    
    if (showToast) {
      showToast(`${ingredients.length} ingrédients ajoutés`, 'success');
    }
  };

  const removeFromCart = (itemId) => {
    if (!itemId) return;
    
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    
    if (showToast) {
      showToast("Produit retiré", 'success');
    }
  };

  const clearCart = () => {
    setCart([]);
    
    if (showToast) {
      showToast("Panier vidé", 'success');
    }
  };

  const getCartCount = () => {
    if (!cart || !Array.isArray(cart)) return 0;
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const calculateTotal = () => {
    if (!cart || !Array.isArray(cart)) return "0.00";
    
    try {
      return cart.reduce((total, item) => {
        // Pour les prix avec format "1,50 € / Kg"
        if (typeof item.price === 'string') {
          // Extraire le montant numérique du prix
          const priceMatch = item.price.replace(/,/g, '.').match(/\d+\.\d+|\d+/);
          const numericPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
          
          return total + (numericPrice * (item.quantity || 1));
        }
        // Pour les prix numériques directs
        return total + ((item.price || 0) * (item.quantity || 1));
      }, 0).toFixed(2);
    } catch (error) {
      console.error("Erreur dans le calcul du total", error);
      return "0.00";
    }
  };
  
  const selectPickupLocation = (location) => {
    setSelectedPickupLocation(location);
    
    if (showToast) {
      showToast(`Point de retrait: ${location.name}`, 'success');
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (!itemId) return;
    
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => prevCart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Fonctions pour contrôler la visibilité du panier
  const showCart = () => {
    console.log("showCart called, setting visibility to true");
    setCartVisible(true);
  };
  
  const hideCart = () => {
    console.log("hideCart called, setting visibility to false");
    setCartVisible(false);
  };
  
  const toggleCart = () => {
    console.log("toggleCart called, current visibility:", cartVisible);
    setCartVisible(prev => !prev);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getCartCount,
      addIngredientsToCart,
      calculateTotal,
      selectedPickupLocation,
      selectPickupLocation,
      pickupLocations,
      updateQuantity,
      cartVisible,
      showCart,
      hideCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
