import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from './ToastContext';
import { products } from '../data/mockData';

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
  const [cartVisible, setCartVisible] = useState(false); // Ajout d'un état pour la visibilité du panier
  const [selectedPickupLocation, setSelectedPickupLocation] = useState(null);
  const { showToast } = useToast();

  // Charger le panier depuis le stockage local au montage du composant
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);
  
  // Sauvegarder le panier dans le stockage local à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Ajouter un élément au panier
  const addToCart = (item) => {
    if (!item || !item.name) {
      console.error("Impossible d'ajouter un élément invalide au panier", item);
      return;
    }
    
    setCart(prevCart => {
      // Vérifier si l'élément existe déjà
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id || cartItem.name === item.name
      );
      
      // Si l'élément existe déjà, augmenter sa quantité
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (parseFloat(updatedCart[existingItemIndex].quantity) || 0) + 
                    (parseFloat(item.quantity) || 1)
        };
        return updatedCart;
      } 
      // Sinon, ajouter le nouvel élément
      else {
        return [...prevCart, { ...item, quantity: item.quantity || 1 }];
      }
    });
    
    // Afficher automatiquement le panier lors de l'ajout d'un élément
    setCartVisible(true);
    
    // Message plus court
    showToast(`${item.name} ajouté`, 'success');
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

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    // Message plus court
    showToast("Produit retiré", 'success');
  };

  const clearCart = () => {
    setCart([]);
    showToast("Panier vidé", 'success');
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
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

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => prevCart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Fonctions pour contrôler la visibilité du panier
  const showCart = () => setCartVisible(true);
  const hideCart = () => setCartVisible(false);
  const toggleCart = () => setCartVisible(prev => !prev);

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
      // Exposer les contrôles de visibilité du panier
      cartVisible,
      showCart,
      hideCart,
      toggleCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
