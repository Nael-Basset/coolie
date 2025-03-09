import { useState, useEffect } from 'react';
import { FaSearch, FaArrowLeft, FaAppleAlt, FaMapMarkerAlt, FaInfoCircle, FaTree, FaUtensils } from 'react-icons/fa';
import { regionalRecipes } from '../data/mockData';
import AbstractFranceMap from '../components/AbstractFranceMap';
import MapWrapper from '../components/MapWrapper';

const RegionMapPage = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regions, setRegions] = useState([]);
  
  // Définition des régions avec leurs coordonnées géographiques
  useEffect(() => {
    setRegions([
      { 
        id: 'bretagne', 
        name: 'Bretagne', 
        position: [48.2020, -2.9326],
        mapCenter: [48.2020, -2.9326],
        mapZoom: 8,
        color: 'bg-blue-500',
        description: "Région reconnue pour ses fruits de mer, galettes et kouign-amann.",
        producers: 45,
        specialties: ["Galette", "Kouign-Amann", "Homard"]
      },
      { 
        id: 'centre-val-de-loire', 
        name: 'Centre Val de Loire', 
        position: [47.7515, 1.6750],
        mapCenter: [47.7515, 1.6750],
        mapZoom: 8,
        color: 'bg-green-500',
        description: "Région des châteaux et des vignobles, réputée pour ses vins et fromages.",
        producers: 32,
        specialties: ["Tarte Tatin", "Rillettes", "Sainte-Maure"]
      },
      { 
        id: 'provence', 
        name: 'Provence', 
        position: [43.9352, 6.0679],
        mapCenter: [43.9352, 6.0679],
        mapZoom: 8,
        color: 'bg-yellow-500',
        description: "Terre ensoleillée aux saveurs méditerranéennes et à l'huile d'olive.",
        producers: 58,
        specialties: ["Ratatouille", "Bouillabaisse", "Tapenade"]
      },
      { 
        id: 'nord', 
        name: 'Hauts-de-France', 
        position: [50.4809, 2.7928],
        mapCenter: [50.4809, 2.7928],
        mapZoom: 8,
        color: 'bg-red-500',
        description: "Région du nord avec des plats réconfortants comme le welsh et le maroilles.",
        producers: 28,
        specialties: ["Carbonade", "Maroilles", "Welsh"]
      },
      { 
        id: 'alsace', 
        name: 'Grand Est', 
        position: [48.6998, 6.1878],
        mapCenter: [48.6998, 6.1878],
        mapZoom: 7,
        color: 'bg-purple-500',
        description: "Région à l'influence germanique avec sa choucroute et ses vins blancs.",
        producers: 40,
        specialties: ["Choucroute", "Flammeküeche", "Baeckeoffe"]
      },
    ]);
  }, []);
  
  // Ajout d'un effet pour recalculer la taille des cartes au redimensionnement
  useEffect(() => {
    const handleResize = () => {
      // Déclencher un événement de redimensionnement pour forcer la mise à jour des cartes Leaflet
      window.dispatchEvent(new Event('resize'));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Déclencher une fois au chargement pour s'assurer que la carte est bien dimensionnée
    setTimeout(handleResize, 300);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
        <div className="flex items-center">
          <button className="p-2 text-white">
            <FaAppleAlt size={20} className="text-orange-secondary" />
          </button>
        </div>
      </header>
      
      <div className="px-4">
        {selectedRegion ? (
          <RegionDetail 
            region={selectedRegion} 
            onBack={() => setSelectedRegion(null)}
            allRegions={regions}
          />
        ) : (
          <FranceMap 
            onRegionSelect={setSelectedRegion}
            regions={regions}
          />
        )}
      </div>
    </div>
  );
};

const FranceMap = ({ onRegionSelect, regions }) => {
  // États pour le filtre et l'affichage des infos sur survol
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [filterActive, setFilterActive] = useState(false);
  const [filter, setFilter] = useState("");
  
  // Filtre les régions en fonction de la recherche
  const filteredRegions = filter 
    ? regions.filter(region => 
        region.name.toLowerCase().includes(filter.toLowerCase()) || 
        region.specialties.some(s => s.toLowerCase().includes(filter.toLowerCase()))
      )
    : regions;
  
  return (
    <div className="bg-background-darker rounded-card shadow-card p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-header font-medium text-green-primary">
          Découvrir une région
        </h2>
        <button 
          className={`p-2 ${filterActive ? 'text-orange-secondary' : 'text-green-primary'}`}
          onClick={() => setFilterActive(!filterActive)}
        >
          <FaSearch size={18} />
        </button>
      </div>
      
      {/* Barre de recherche */}
      {filterActive && (
        <div className="mb-4">
          <input
            type="text"
            className="w-full py-2 px-3 rounded-lg border border-green-primary bg-white text-sm"
            placeholder="Rechercher une région ou une spécialité..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      )}
      
      {/* Carte abstraite de la France avec les régions */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-inner">
        <AbstractFranceMap 
          regions={filteredRegions}
          onRegionSelect={onRegionSelect}
        />
      </div>
      
      {/* Liste des régions */}
      <div>
        <h3 className="font-medium text-lg mb-3 flex items-center">
          <FaTree className="text-green-primary mr-2" />
          <span>Régions culinaires</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredRegions.map((region) => (
            <button 
              key={region.id} 
              className="block w-full text-left p-3 bg-white rounded-lg shadow-sm hover:bg-green-50 transition-colors"
              onClick={() => onRegionSelect(region)}
            >
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${region.color} rounded-full`}></div>
                <h4 className="font-medium">{region.name}</h4>
              </div>
              <div className="mt-1 flex justify-between text-xs text-text-light">
                <span>{region.producers} producteurs</span>
                <span className="text-green-primary font-medium">Découvrir →</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {region.specialties.map((specialty, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-background px-2 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
        
        {filteredRegions.length === 0 && (
          <div className="text-center py-8 text-text-light">
            Aucune région trouvée pour cette recherche
          </div>
        )}
      </div>
    </div>
  );
};

const RegionDetail = ({ region, onBack, allRegions }) => {
  const recipes = regionalRecipes.filter(recipe => recipe.region === region.id);
  const [activeTab, setActiveTab] = useState('recipes'); // 'recipes' ou 'producers'
  
  // Générer des marqueurs améliorés pour les producteurs dans cette région
  const generateProducerMarkers = () => {
    // Définition des types de producteurs avec des positions cohérentes
    const producerTypes = [
      "Maraîcher", "Éleveur", "Fromager", "Boulanger", "Vigneron", "Apiculteur", "Arboriculteur", "Pêcheur"
    ];
    
    // Coordinées du centre de la région
    const [lat, lng] = region.position;
    
    // Création de marqueurs répartis autour du centre de la région
    return Array.from({ length: 8 }).map((_, index) => {
      // Calculer un angle uniforme autour du cercle
      const angle = (index / 8) * 2 * Math.PI;
      
      // Calculer des positions en spirale pour éviter les superpositions
      const radius = 0.1 + (index / 20); // Rayon croissant pour créer une spirale
      const offsetLat = radius * Math.cos(angle);
      const offsetLng = radius * Math.sin(angle) * 1.5; // Facteur 1.5 pour tenir compte de la projection
      
      const producerType = producerTypes[index % producerTypes.length];
      
      return {
        id: `producer-${region.id}-${index}`,
        position: [lat + offsetLat, lng + offsetLng],
        title: `${producerType} local`,
        description: `${producerType} proposant des produits frais et locaux`,
        color: 'bg-orange-secondary',
        number: index + 1,
        category: producerType,
        popup: true
      };
    });
  };
  
  // Obtenir une image pour chaque région
  const getRegionImage = (regionId) => {
    const images = {
      'bretagne': "https://images.pexels.com/photos/2499699/pexels-photo-2499699.jpeg?auto=compress&cs=tinysrgb&w=800", // Mont-Saint-Michel
      'centre-val-de-loire': "https://images.pexels.com/photos/3881034/pexels-photo-3881034.jpeg?auto=compress&cs=tinysrgb&w=800", // Château de la Loire
      'provence': "https://images.pexels.com/photos/4577811/pexels-photo-4577811.jpeg?auto=compress&cs=tinysrgb&w=800", // Champs de lavande en Provence
      'nord': "https://images.pexels.com/photos/461902/pexels-photo-461902.jpeg?auto=compress&cs=tinysrgb&w=800", // Paysage du Nord
      'alsace': "https://images.pexels.com/photos/2610756/pexels-photo-2610756.jpeg?auto=compress&cs=tinysrgb&w=800" // Village alsacien
    };
    return images[regionId] || "https://images.pexels.com/photos/532826/pexels-photo-532826.jpeg?auto=compress&cs=tinysrgb&w=800"; // Paris par défaut
  };

  return (
    <div className="bg-background-darker rounded-card shadow-card p-4 mb-6">
      {/* Header avec bouton retour */}
      <div className="flex items-center mb-4">
        <button 
          className="p-2 text-green-primary mr-2" 
          onClick={onBack}
        >
          <FaArrowLeft size={18} />
        </button>
        <h2 className="text-xl font-header font-medium text-green-primary">
          {region.name}
        </h2>
      </div>
      
      {/* Image de la région avec overlay */}
      <div className="relative rounded-xl overflow-hidden h-40 mb-4">
        <img 
          src={getRegionImage(region.id)} 
          alt={`${region.name} paysage`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center text-white mb-1">
            <FaMapMarkerAlt className="mr-1" />
            <h3 className="font-bold">{region.name}</h3>
          </div>
          <p className="text-xs text-white">{region.description}</p>
        </div>
      </div>
      
      {/* Onglets: Recettes et Producteurs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'recipes' 
              ? 'border-b-2 border-green-primary text-green-primary' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('recipes')}
        >
          Spécialités
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'producers' 
              ? 'border-b-2 border-green-primary text-green-primary' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('producers')}
        >
          Producteurs
        </button>
      </div>
      
      {/* Contenu de l'onglet actif */}
      {activeTab === 'recipes' ? (
        <div className="space-y-3">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <RegionRecipeCard key={recipe.id} recipe={recipe} />
            ))
          ) : (
            <div className="text-center py-8 text-text-light">
              Aucune recette disponible pour cette région
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-green-primary bg-opacity-10 rounded-lg p-4">
            <div>
              <h4 className="font-medium">Découvrez nos producteurs</h4>
              <p className="text-sm text-text-light mt-1">
                {region.producers} producteurs locaux répartis sur la région
              </p>
            </div>
            <div className="bg-green-primary text-white rounded-full h-12 w-12 flex items-center justify-center">
              {region.producers}
            </div>
          </div>
          
          {/* Carte interactive des producteurs avec OpenStreetMap */}
          <div className="bg-white rounded-lg p-3">
            <div className="text-center text-sm text-text-light mb-2">
              <FaInfoCircle className="inline mr-1" />
              Découvrez les producteurs près de chez vous
            </div>
            <div className="rounded-lg overflow-hidden shadow-inner">
              <div style={{ height: "250px", width: "100%" }}>
                <MapWrapper 
                  center={region.mapCenter}
                  zoom={region.mapZoom}
                  markers={generateProducerMarkers()}
                  height="250px"
                />
              </div>
            </div>
            
            {/* Légende des producteurs */}
            <div className="mt-3 p-2 bg-background-darker rounded-lg">
              <h4 className="text-xs font-medium mb-2">Légende des producteurs</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {["Maraîcher", "Éleveur", "Fromager", "Boulanger", "Vigneron", "Apiculteur", "Arboriculteur", "Pêcheur"]
                  .map((type, idx) => (
                    <div key={type} className="flex items-center">
                      <div className="bg-orange-secondary w-5 h-5 rounded-full flex items-center justify-center text-white mr-1.5">
                        {idx + 1}
                      </div>
                      <span>{type}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Liste des types de producteurs */}
          <div className="grid grid-cols-2 gap-2">
            {["Maraîchers", "Éleveurs", "Fromagers", "Boulangers", "Vignerons", "Arboriculteurs"].map(type => (
              <div key={type} className="bg-white p-3 rounded-lg flex items-center">
                <div className="bg-green-primary bg-opacity-10 p-2 rounded-full mr-2">
                  <FaTree className="text-green-primary" size={14} />
                </div>
                <span className="text-sm">{type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Régions proches / Suggestions - Correction de l'incohérence de style */}
      <div className="mt-6">
        <h3 className="font-medium mb-3">Régions à découvrir</h3>
        <div className="flex overflow-x-auto space-x-3 pb-2">
          {allRegions
            .filter(r => r.id !== region.id)
            .map(nearbyRegion => (
              <button
                key={nearbyRegion.id}
                className="flex-shrink-0 bg-white rounded-lg overflow-hidden shadow-sm w-32"
                onClick={() => {
                  // Correction pour sélectionner la bonne région directement
                  setSelectedRegion(nearbyRegion);
                }}
              >
                <div className={`h-2 ${nearbyRegion.color}`}></div>
                <div className="p-2">
                  <h4 className="font-medium text-sm">{nearbyRegion.name}</h4>
                  <p className="text-xs text-text-light mt-1">
                    {nearbyRegion.producers} producteurs
                  </p>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

const RegionRecipeCard = ({ recipe }) => {
  // Generate difficulty indicators
  const renderDifficulty = (level) => {
    return "🌶️".repeat(level);
  };
  
  // Generate popularity indicators
  const renderPopularity = (level) => {
    return "⭐".repeat(level);
  };
  
  // Fonction pour obtenir une image en fonction du nom de la recette régionale
  const getRegionalRecipeImage = (recipeName) => {
    // Vérifier si la recette a une image dans les données
    const recipeData = regionalRecipes.find(r => r.name === recipeName);
    if (recipeData && recipeData.image) {
      return recipeData.image;
    }
    
    // Fallback par nom de recette
    if (recipeName.includes("Galette")) {
      return "https://images.pexels.com/photos/5454019/pexels-photo-5454019.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (recipeName.includes("Kouign-Amann")) {
      return "https://images.pexels.com/photos/5848696/pexels-photo-5848696.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (recipeName.includes("Tarte Tatin")) {
      return "https://images.pexels.com/photos/7354875/pexels-photo-7354875.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (recipeName.includes("Rillettes")) {
      return "https://images.pexels.com/photos/5945568/pexels-photo-5945568.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (recipeName.includes("Bouillabaisse")) {
      return "https://images.pexels.com/photos/9646543/pexels-photo-9646543.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (recipeName.includes("Ratatouille")) {
      return "https://images.pexels.com/photos/6248997/pexels-photo-6248997.jpeg?auto=compress&cs=tinysrgb&w=800";
    }
    return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden flex">
      {/* Recipe details */}
      <div className="flex-1 p-3">
        <h3 className="font-medium">{recipe.name}</h3>
        <p className="text-xs text-text-light mt-1 line-clamp-2">{recipe.description}</p>
        <div className="flex justify-between mt-2">
          <div className="text-orange-secondary text-sm">
            {renderDifficulty(recipe.difficulty)}
          </div>
          <div className="text-orange-secondary text-sm">
            {renderPopularity(recipe.popularity)}
          </div>
        </div>
      </div>
      
      {/* Recipe image */}
      <div className="w-24 h-24 overflow-hidden">
        <img 
          src={getRegionalRecipeImage(recipe.name)} 
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default RegionMapPage;
