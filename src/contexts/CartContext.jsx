import { createContext, useState, useContext } from 'react';
import { useToast } from './ToastContext';
import { products } from '../data/mockData';

const CartContext = createContext();

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
  const [cartItems, setCartItems] = useState([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const { showToast } = useToast();

  const addToCart = (product) => {
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Product exists in cart, increase quantity
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += 1;
      setCartItems(updatedItems);
    } else {
      // Product is new to cart
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    
    // Message plus court
    showToast(`${product.name} ajouté`, 'success');
  };

  const addIngredientsToCart = (ingredients) => {
    // Transform ingredients into product-like objects
    const ingredientProducts = ingredients.map((ingredient, index) => {
      // Vérifier si l'ingrédient existe dans notre catalogue de produits
      const existingProduct = products.find(p => 
        p.name.toLowerCase().includes(ingredient.toLowerCase()) || 
        ingredient.toLowerCase().includes(p.name.toLowerCase())
      );
      
      return {
        id: `ingredient-${Date.now()}-${index}`,
        name: ingredient,
        // Si l'ingrédient existe dans notre catalogue, utiliser son prix, sinon "Prix variable"
        price: existingProduct ? existingProduct.price : "Prix variable",
        quantity: 1,
        isIngredient: true,
        // Marquer si l'ingrédient est disponible ou non
        isAvailable: !!existingProduct
      };
    });
    
    // Add each ingredient to cart
    ingredientProducts.forEach(product => {
      addToCart(product);
    });
    
    // Compte combien d'ingrédients ne sont pas disponibles
    const unavailableCount = ingredientProducts.filter(p => !p.isAvailable).length;
    
    // Messages plus courts
    if (unavailableCount > 0) {
      showToast(`${ingredients.length} ingrédients ajoutés (${unavailableCount} indispo.)`, 'success');
    } else {
      showToast(`${ingredients.length} ingrédients ajoutés`, 'success');
    }
  };

  const removeFromCart = (productId) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    // Message plus court
    showToast("Produit retiré", 'success');
  };

  const clearCart = () => {
    setCartItems([]);
    showToast("Panier vidé", 'success');
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      // Pour les prix avec format "1,50 € / Kg"
      if (typeof item.price === 'string') {
        // Extraire le montant numérique du prix
        const priceMatch = item.price.replace(/,/g, '.').match(/\d+\.\d+|\d+/);
        const numericPrice = priceMatch ? parseFloat(priceMatch[0]) : 0;
        
        // Si c'est un prix au kg et qu'on n'a pas de poids précisé, on suppose 1kg
        return total + (numericPrice * item.quantity);
      }
      // Pour les prix numériques directs
      return total + (item.price * item.quantity);
    }, 0).toFixed(2);
  };
  
  const selectPickupLocation = (location) => {
    setSelectedPickupLocation(location);
    // Message plus court
    showToast(`Point de retrait: ${location.name}`, 'success');
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart, 
      getCartCount,
      addIngredientsToCart,
      calculateTotal,
      selectedPickupLocation,
      selectPickupLocation,
      pickupLocations
    }}>
      {children}
    </CartContext.Provider>
  );
};
