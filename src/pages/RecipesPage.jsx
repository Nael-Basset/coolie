import { useState } from 'react';
import { FaSearch, FaAppleAlt, FaTimes, FaShoppingCart } from 'react-icons/fa';
import { recipes } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';
import CartModal from '../components/CartModal';

const RecipesPage = () => {
  const [activeCategory, setActiveCategory] = useState('tous');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { addIngredientsToCart, getCartCount } = useCart();
  
  const categories = ['tous', 'plat principal', 'accompagnement', 'dessert', 'entrée'];
  
  const filteredRecipes = activeCategory === 'tous' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === activeCategory);
  
  const searchResults = searchQuery 
    ? filteredRecipes.filter(recipe => 
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : filteredRecipes;

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
            placeholder="Rechercher une recette..."
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
      
      {/* Recipes list */}
      <div className="space-y-5 px-4">
        {searchResults.length > 0 ? (
          searchResults.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onSelect={() => setSelectedRecipe(recipe)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-text-light">
            Aucune recette trouvée
          </div>
        )}
      </div>
      
      {/* Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">{selectedRecipe.name}</h3>
                <button 
                  className="p-1 text-gray-500"
                  onClick={() => setSelectedRecipe(null)}
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="mb-4 h-48 overflow-hidden rounded-lg">
                <img 
                  src={getRecipeImage(selectedRecipe.name)} 
                  alt={selectedRecipe.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mb-4">
                <p className="text-sm mb-1"><strong>Préparation:</strong> {selectedRecipe.prepTime}</p>
                <p className="text-sm mb-1"><strong>Cuisson:</strong> {selectedRecipe.cookTime}</p>
                <p className="text-sm mb-4"><strong>Difficulté:</strong> {renderDifficulty(selectedRecipe.difficulty)}</p>
                
                <h4 className="font-medium mb-2">Ingrédients:</h4>
                <ul className="list-disc list-inside mb-4">
                  {selectedRecipe.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
                
                <h4 className="font-medium mb-2">Préparation:</h4>
                <p className="text-sm whitespace-pre-line">
                  {getRecipeInstructions(selectedRecipe.name)}
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button 
                  className="bg-green-primary text-white w-full py-2 rounded-lg flex items-center justify-center"
                  onClick={() => {
                    addIngredientsToCart(selectedRecipe.ingredients);
                  }}
                >
                  <FaShoppingCart className="mr-2" />
                  Commander les ingrédients
                </button>
                
                <button 
                  className="bg-orange-secondary text-white w-full py-2 rounded-lg"
                  onClick={() => setSelectedRecipe(null)}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cart Modal */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </div>
  );
};

// Functions for images and rendering difficulty/popularity
function getRecipeImage(recipeName) {
  // Vérifier si la recette a une image dans les données
  const recipe = recipes.find(r => r.name === recipeName);
  if (recipe && recipe.image) {
    return recipe.image;
  }
  
  // Fallback pour les recettes qui n'auraient pas d'image dans les données
  if (recipeName.includes("Boeuf")) {
    return "https://images.pexels.com/photos/8601418/pexels-photo-8601418.jpeg?auto=compress&cs=tinysrgb&w=800";
  } else if (recipeName.includes("Flamenkueche")) {
    return "https://images.pexels.com/photos/15126556/pexels-photo-15126556.jpeg?auto=compress&cs=tinysrgb&w=800";
  } else if (recipeName.includes("Ratatouille")) {
    return "https://images.pexels.com/photos/6248997/pexels-photo-6248997.jpeg?auto=compress&cs=tinysrgb&w=800";
  } else if (recipeName.includes("Blanquette")) {
    return "https://images.pexels.com/photos/5908255/pexels-photo-5908255.jpeg?auto=compress&cs=tinysrgb&w=800";
  } else if (recipeName.includes("Gratin")) {
    return "https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=800";
  } else if (recipeName.includes("Quiche")) {
    return "https://images.pexels.com/photos/6605207/pexels-photo-6605207.jpeg?auto=compress&cs=tinysrgb&w=800";
  } else if (recipeName.includes("Crème Brûlée")) {
    return "https://images.pexels.com/photos/8605175/pexels-photo-8605175.jpeg?auto=compress&cs=tinysrgb&w=800";
  }
  
  return "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800";
}

function renderDifficulty(level) {
  return "🌶️".repeat(level);
}

function renderPopularity(level) {
  return "⭐".repeat(level);
}

// Fonction pour obtenir les instructions de préparation selon la recette
function getRecipeInstructions(recipeName) {
  const instructions = {
    "Boeuf Bourguignon": "1. Faites revenir les lardons dans une cocotte. Réservez-les.\n2. Faites dorer les morceaux de bœuf dans la même cocotte.\n3. Ajoutez les oignons émincés et les carottes coupées en rondelles.\n4. Saupoudrez de farine, mélangez puis versez le vin rouge et le bouillon.\n5. Ajoutez le bouquet garni, les lardons et assaisonnez.\n6. Couvrez et laissez mijoter à feu doux pendant 2h.\n7. Ajoutez les champignons 15 min avant la fin de cuisson.\n8. Servez chaud avec des pommes de terre.",
    
    "Flamenkueche": "1. Étalez la pâte en un rectangle fin sur une plaque de cuisson.\n2. Dans un bol, mélangez la crème fraîche avec du sel, du poivre et de la muscade.\n3. Étalez ce mélange sur la pâte.\n4. Répartissez les lardons et les oignons émincés finement.\n5. Enfournez à 250°C pendant 15-20 minutes jusqu'à ce que les bords soient dorés.\n6. Servez aussitôt, découpé en rectangles.",
    
    "Ratatouille": "1. Coupez tous les légumes (aubergines, courgettes, poivrons, tomates, oignons) en cubes.\n2. Dans une grande poêle, faites revenir les oignons dans l'huile d'olive.\n3. Ajoutez ensuite les poivrons et laissez cuire 5 minutes.\n4. Incorporez les aubergines et les courgettes, poursuivez la cuisson 10 minutes.\n5. Ajoutez les tomates, l'ail écrasé, le thym et le laurier.\n6. Laissez mijoter à feu doux pendant 30-40 minutes en remuant régulièrement.\n7. Assaisonnez et servez chaud ou froid.",
    
    "Blanquette de Veau": "1. Faites blanchir les morceaux de veau dans une casserole d'eau bouillante pendant 5 minutes.\n2. Égouttez la viande et placez-la dans une cocotte avec les carottes en rondelles, l'oignon piqué de clous de girofle et le bouquet garni.\n3. Couvrez d'eau froide et portez à ébullition, puis réduisez le feu et laissez mijoter 1h30.\n4. Dans une casserole, préparez un roux avec le beurre et la farine, puis incorporez progressivement le bouillon de cuisson filtré.\n5. Ajoutez les champignons et la viande, poursuivez la cuisson 15 minutes.\n6. Hors du feu, liez la sauce avec les jaunes d'œufs et la crème fraîche.\n7. Réchauffez sans bouillir et servez avec du riz.",
    
    "Gratin Dauphinois": "1. Préchauffez le four à 180°C.\n2. Épluchez et coupez les pommes de terre en fines rondelles.\n3. Frottez un plat à gratin avec une gousse d'ail puis beurrez-le.\n4. Dans une casserole, faites chauffer le lait avec la crème, l'ail écrasé, le sel, le poivre et la muscade.\n5. Disposez les pommes de terre en couches dans le plat, versez le mélange lait-crème.\n6. Enfournez pour 1h jusqu'à ce que les pommes de terre soient tendres et le dessus doré.\n7. Laissez reposer 10 minutes avant de servir.",
    
    "Quiche Lorraine": "1. Préchauffez le four à 200°C.\n2. Étalez la pâte brisée dans un moule à tarte et piquez le fond avec une fourchette.\n3. Faites revenir les lardons dans une poêle sans matière grasse.\n4. Répartissez-les sur le fond de tarte.\n5. Battez les œufs avec la crème fraîche, le lait, le sel, le poivre et la muscade.\n6. Versez ce mélange sur les lardons.\n7. Enfournez pour 30-35 minutes jusqu'à ce que la quiche soit dorée et ferme.\n8. Servez tiède avec une salade verte.",
    
    "Crème Brûlée": "1. Préchauffez le four à 150°C.\n2. Fendez la gousse de vanille et grattez les graines.\n3. Faites chauffer la crème avec la gousse et les graines de vanille.\n4. Dans un saladier, fouettez les jaunes d'œufs avec le sucre jusqu'à blanchiment.\n5. Versez progressivement la crème chaude sur ce mélange en fouettant.\n6. Répartissez la préparation dans des ramequins.\n7. Faites cuire au bain-marie pendant 35-40 minutes.\n8. Laissez refroidir puis réfrigérez au moins 4 heures.\n9. Au moment de servir, saupoudrez de cassonade et caramélisez au chalumeau.",
    
    "Coq au Vin": "1. Faites dorer les morceaux de poulet dans une cocotte avec un peu d'huile.\n2. Réservez le poulet et faites revenir les lardons, les oignons et les carottes coupées en rondelles.\n3. Remettez le poulet, saupoudrez de farine et mélangez bien.\n4. Versez le vin rouge jusqu'à couvrir la viande et ajoutez le bouquet garni.\n5. Couvrez et laissez mijoter 1h à feu doux.\n6. Pendant ce temps, faites revenir les champignons dans du beurre.\n7. Ajoutez les champignons 15 minutes avant la fin de la cuisson.\n8. Servez bien chaud avec des pommes de terre.",
    
    "Salade Niçoise": "1. Lavez et coupez les tomates en quartiers, les haricots verts en tronçons après les avoir cuits à l'eau.\n2. Écalez les œufs durs et coupez-les en quartiers.\n3. Égouttez le thon et émiettez-le légèrement.\n4. Lavez, séchez et déchirez les feuilles de salade dans un saladier.\n5. Ajoutez les tomates, haricots, œufs, thon, olives noires et filets d'anchois.\n6. Préparez une vinaigrette avec l'huile d'olive, du vinaigre, du sel et du poivre.\n7. Arrosez la salade de vinaigrette juste avant de servir.",
    
    "Tarte Tatin": "1. Préchauffez le four à 200°C.\n2. Épluchez et coupez les pommes en quartiers.\n3. Dans un moule à tarte tatin, faites fondre le beurre avec le sucre jusqu'à obtenir un caramel doré.\n4. Disposez les pommes dans le caramel en les serrant bien.\n5. Laissez cuire à feu doux pendant 15 minutes.\n6. Déposez la pâte feuilletée sur les pommes en rentrant les bords à l'intérieur du moule.\n7. Enfournez pour 25-30 minutes jusqu'à ce que la pâte soit bien dorée.\n8. Laissez tiédir 5 minutes puis retournez délicatement sur un plat de service."
  };
  
  return instructions[recipeName] || "Instructions de préparation à venir pour cette recette.";
}

const RecipeCard = ({ recipe, onSelect }) => {
  const { showToast } = useToast();

  return (
    <div className="flex bg-background-darker rounded-card shadow-card overflow-hidden">
      {/* Recipe image */}
      <div className="w-2/5 h-32 overflow-hidden">
        <img 
          src={getRecipeImage(recipe.name)} 
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Recipe details */}
      <div className="w-3/5 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-lg">{recipe.name}</h3>
          
          <div className="mt-1">
            <div className="text-xs text-text-light">Difficulté</div>
            <div className="text-orange-secondary text-sm">
              {renderDifficulty(recipe.difficulty)}
            </div>
          </div>
          
          <div className="mt-1">
            <div className="text-xs text-text-light">Popularité</div>
            <div className="text-orange-secondary text-sm">
              {renderPopularity(recipe.popularity)}
            </div>
          </div>
        </div>
        
        <button 
          className="bg-orange-secondary text-white text-sm px-4 py-1 rounded-button mt-2 w-full text-center"
          onClick={() => {
            showToast(`Recette de ${recipe.name} ouverte`, 'success');
            onSelect();
          }}
        >
          Lire recette
        </button>
      </div>
    </div>
  );
};

export default RecipesPage;
