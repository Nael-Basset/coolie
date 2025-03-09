import { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { recipes } from '../data/mockData';
import { products } from '../data/mockData';
import { regionalRecipes } from '../data/mockData';

const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Recherche uniquement si au moins 2 caractères sont saisis
    if (searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Rechercher dans les recettes
    const matchingRecipes = recipes.filter(recipe => 
      recipe.name.toLowerCase().includes(term) ||
      recipe.ingredients.some(ing => ing.toLowerCase().includes(term))
    ).map(recipe => ({
      ...recipe,
      type: 'recipe',
      route: '/recipes',
      highlight: `Recette - ${recipe.category}`
    }));
    
    // Rechercher dans les produits
    const matchingProducts = products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.producer?.toLowerCase().includes(term)
    ).map(product => ({
      ...product,
      type: 'product',
      route: '/shop',
      highlight: `Produit - ${product.category}`
    }));
    
    // Rechercher dans les recettes régionales
    const matchingRegionalRecipes = regionalRecipes.filter(recipe => 
      recipe.name.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term)
    ).map(recipe => ({
      ...recipe,
      type: 'regional',
      route: '/map',
      highlight: `Spécialité régionale`
    }));
    
    // Combiner et limiter les résultats
    setSearchResults([
      ...matchingRecipes, 
      ...matchingProducts, 
      ...matchingRegionalRecipes
    ].slice(0, 8));
  }, [searchTerm]);

  const handleItemClick = (item) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(item.route);
  };

  return (
    <>
      <button 
        className="p-2 text-white"
        onClick={() => setIsOpen(true)}
      >
        <FaSearch size={20} className="text-orange-secondary" />
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-16 px-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-3 border-b flex items-center">
              <FaSearch className="text-green-primary mr-2" />
              <input
                type="text"
                className="flex-1 outline-none"
                placeholder="Rechercher partout..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button 
                className="p-1 text-gray-500"
                onClick={() => setIsOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="overflow-auto p-2">
              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((item) => (
                    <div 
                      key={`${item.type}-${item.id}`} 
                      className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden mr-3">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-text-light">{item.highlight}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm.length > 0 ? (
                <div className="text-center py-6 text-text-light">
                  Aucun résultat trouvé pour "{searchTerm}"
                </div>
              ) : (
                <div className="text-center py-6 text-text-light">
                  Commencez à taper pour rechercher
                </div>
              )}
            </div>
            
            <div className="p-3 border-t bg-gray-50 text-center">
              <button 
                className="text-green-primary text-sm font-medium"
                onClick={() => setIsOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSearch;
