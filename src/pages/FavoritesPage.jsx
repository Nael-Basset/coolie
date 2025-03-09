import { useState } from 'react';
import { FaHeart, FaTrash, FaAppleAlt, FaShoppingBasket, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

const FavoritesPage = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const { favorites, removeFavorite } = useFavorites();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const tabs = [
    { id: 'recipes', label: 'Recettes', icon: <FaAppleAlt /> },
    { id: 'products', label: 'Produits', icon: <FaShoppingBasket /> },
    { id: 'regions', label: 'Régions', icon: <FaMapMarkerAlt /> }
  ];

  const handleNavigate = (item, type) => {
    switch(type) {
      case 'recipes':
        navigate('/recipes');
        break;
      case 'products':
        navigate('/shop');
        break;
      case 'regions':
        navigate('/map');
        break;
      default:
        navigate('/');
    }
    showToast(`Navigation vers ${item.name}`, 'info');
  };

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <header className="bg-green-primary rounded-b-card p-4 mb-6 flex items-center justify-between">
        <div className="logo text-3xl text-white flex items-center">
          <span>C</span>
          <span>O</span>
          <span className="text-orange-secondary">🍅</span>
          <span>L</span>
          <span>I</span>
          <span className="text-orange-secondary">🍆</span>
          <span>E</span>
        </div>
        <FaHeart size={24} className="text-orange-secondary" />
      </header>
      
      <div className="p-4">
        <div className="bg-background-darker rounded-card shadow-card p-4">
          <h2 className="text-xl font-header font-medium text-green-primary mb-6">
            Mes favoris
          </h2>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center py-2 px-4 font-medium text-sm ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-green-primary text-green-primary' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Tab content */}
          <div>
            {activeTab === 'recipes' && (
              favorites.recipes.length > 0 ? (
                <div className="space-y-3">
                  {favorites.recipes.map(recipe => (
                    <div key={recipe.id} className="flex bg-white rounded-lg overflow-hidden shadow-sm">
                      <div className="w-24 h-24 overflow-hidden">
                        <img 
                          src={recipe.image} 
                          alt={recipe.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium">{recipe.name}</h4>
                          <p className="text-xs text-text-light">{recipe.category}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <button 
                            className="text-green-primary text-sm"
                            onClick={() => handleNavigate(recipe, 'recipes')}
                          >
                            Voir
                          </button>
                          <button 
                            className="text-red-500"
                            onClick={() => removeFavorite(recipe.id, 'recipes')}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-light">
                  <p className="mb-2">Vous n'avez pas encore de recettes favorites</p>
                  <button 
                    className="bg-green-primary text-white px-4 py-2 rounded-lg mt-2 inline-flex items-center"
                    onClick={() => navigate('/recipes')}
                  >
                    <FaArrowLeft className="mr-2" /> Découvrir des recettes
                  </button>
                </div>
              )
            )}
            
            {activeTab === 'products' && (
              favorites.products.length > 0 ? (
                <div className="space-y-3">
                  {favorites.products.map(product => (
                    <div key={product.id} className="flex bg-white rounded-lg overflow-hidden shadow-sm">
                      <div className="w-24 h-24 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-xs text-text-light">{product.price}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <button 
                            className="text-green-primary text-sm"
                            onClick={() => handleNavigate(product, 'products')}
                          >
                            Acheter
                          </button>
                          <button 
                            className="text-red-500"
                            onClick={() => removeFavorite(product.id, 'products')}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-light">
                  <p className="mb-2">Vous n'avez pas encore de produits favoris</p>
                  <button 
                    className="bg-green-primary text-white px-4 py-2 rounded-lg mt-2 inline-flex items-center"
                    onClick={() => navigate('/shop')}
                  >
                    <FaArrowLeft className="mr-2" /> Découvrir des produits
                  </button>
                </div>
              )
            )}
            
            {activeTab === 'regions' && (
              favorites.regions.length > 0 ? (
                <div className="space-y-3">
                  {favorites.regions.map(region => (
                    <div key={region.id} className="flex bg-white rounded-lg overflow-hidden shadow-sm">
                      <div className={`w-2 ${region.color}`}></div>
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-medium">{region.name}</h4>
                          <p className="text-xs text-text-light">{region.producers} producteurs</p>
                        </div>
                        <div className="flex flex-wrap gap-1 my-2">
                          {region.specialties.slice(0, 3).map((specialty, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-background px-2 py-0.5 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <button 
                            className="text-green-primary text-sm"
                            onClick={() => handleNavigate(region, 'regions')}
                          >
                            Explorer
                          </button>
                          <button 
                            className="text-red-500"
                            onClick={() => removeFavorite(region.id, 'regions')}
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-light">
                  <p className="mb-2">Vous n'avez pas encore de régions favorites</p>
                  <button 
                    className="bg-green-primary text-white px-4 py-2 rounded-lg mt-2 inline-flex items-center"
                    onClick={() => navigate('/map')}
                  >
                    <FaArrowLeft className="mr-2" /> Découvrir des régions
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
