import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaClock, FaAppleAlt, FaTimes, FaShoppingCart, FaInfoCircle } from 'react-icons/fa';
import { products } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';
import CartModal from '../components/CartModal';

const ProductsPage = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showPurchaseAdvice, setShowPurchaseAdvice] = useState(false);
  const { cartItems, removeFromCart, clearCart, getCartCount } = useCart();
  
  const categories = ['tous', 'fruits', 'légumes', 'viandes', 'produits laitiers'];
  
  const filteredProducts = activeCategory === 'tous' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const searchResults = searchQuery 
    ? filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.producer?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProducts;
  
  const calculateTotal = () => {
    // In a real app, this would calculate the actual total
    return "-- €";
  };

  // Fonction pour identifier les ingrédients indisponibles
  const getUnavailableIngredients = () => {
    // Dans un cas réel, on comparerait avec une API pour savoir les produits disponibles
    // Pour cette démo, on suppose que certains ingrédients spécifiques ne sont pas disponibles
    const unavailableIngredients = cartItems.filter(item => 
      item.isIngredient && 
      !products.some(p => p.name.toLowerCase().includes(item.name.toLowerCase()))
    );
    
    return unavailableIngredients;
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
        <div className="flex space-x-2">
          <button 
            className="p-2 text-white"
            onClick={() => setShowSearchBar(!showSearchBar)}
          >
            {showSearchBar ? <FaTimes size={20} /> : <FaSearch size={20} className="text-orange-secondary" />}
          </button>
          <button 
            className="p-2 text-white relative"
            onClick={() => setShowCart(true)}
          >
            <FaShoppingCart size={20} className="text-orange-secondary" />
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 bg-orange-secondary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {getCartCount() > 9 ? '9+' : getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>
      
      {/* Search Bar */}
      {showSearchBar && (
        <div className="px-4 mb-4">
          <input
            type="text"
            className="w-full p-2 rounded-lg border border-gray-200"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}
      
      {/* Category filter */}
      <div className="mb-6 overflow-x-auto px-4">
        <div className="flex space-x-3 pb-2">
          {categories.map(category => (
            <button 
              key={category}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-green-primary text-white' 
                  : 'bg-background-darker text-text-dark'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products list */}
      <div className="space-y-4 px-4">
        {searchResults.length > 0 ? (
          searchResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-8 text-text-light">
            Aucun produit trouvé
          </div>
        )}
      </div>
      
      {/* Cart Modal */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
      
      {/* Conseils d'achat modal */}
      {showPurchaseAdvice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  // Fonction pour obtenir une image en fonction du nom du produit
  const getProductImage = (productName) => {
    if (productName.includes("Carotte")) {
      return "https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (productName.includes("Pommes de Terre")) {
      return "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (productName.includes("Pommes")) {
      return "https://images.pexels.com/photos/1453713/pexels-photo-1453713.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (productName.includes("Salade")) {
      return "https://images.pexels.com/photos/539431/pexels-photo-539431.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (productName.includes("Tomate")) {
      return "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (productName.includes("Courgette")) {
      return "https://images.pexels.com/photos/8105063/pexels-photo-8105063.jpeg?auto=compress&cs=tinysrgb&w=800";
    } else if (productName.includes("Fraise")) {
      return "https://images.pexels.com/photos/46174/strawberries-berries-fruit-freshness-46174.jpeg?auto=compress&cs=tinysrgb&w=800";
    }
    return "https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800";
  };

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="flex bg-background-darker rounded-card shadow-card overflow-hidden">
      {/* Product image */}
      <div className="w-2/5 h-32 overflow-hidden">
        <img 
          src={getProductImage(product.name)} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product details */}
      <div className="w-3/5 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-lg">{product.name}</h3>
          <div className="text-xs text-text-light mt-1">
            {product.time}
          </div>
          <div className="mt-1 font-medium">
            {product.price}
          </div>
        </div>
        
        <button 
          className="bg-green-primary text-white text-sm px-4 py-2 rounded-button mt-2 w-full text-center"
          onClick={handleAddToCart}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;
