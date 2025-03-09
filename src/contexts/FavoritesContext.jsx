import { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from './ToastContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState({
    recipes: [],
    products: [],
    regions: []
  });
  const { showToast } = useToast();

  // Charger les favoris depuis le stockage local au démarrage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('coolieFavorites');
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites));
      } catch (error) {
        console.error("Erreur lors du chargement des favoris:", error);
      }
    }
  }, []);

  // Sauvegarder les favoris dans le stockage local à chaque modification
  useEffect(() => {
    localStorage.setItem('coolieFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (item, type) => {
    if (!['recipes', 'products', 'regions'].includes(type)) {
      console.error("Type de favori invalide:", type);
      return;
    }

    setFavorites(prev => {
      const currentItems = prev[type];
      // Vérifier si l'item est déjà dans les favoris
      if (currentItems.some(favItem => favItem.id === item.id)) {
        showToast(`${item.name} est déjà dans vos favoris`, 'info');
        return prev;
      }
      
      showToast(`${item.name} ajouté aux favoris`, 'success');
      return {
        ...prev,
        [type]: [...currentItems, item]
      };
    });
  };

  const removeFavorite = (itemId, type) => {
    setFavorites(prev => ({
      ...prev,
      [type]: prev[type].filter(item => item.id !== itemId)
    }));
    showToast("Supprimé des favoris", 'success');
  };

  const isFavorite = (itemId, type) => {
    return favorites[type].some(item => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      addFavorite, 
      removeFavorite,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
