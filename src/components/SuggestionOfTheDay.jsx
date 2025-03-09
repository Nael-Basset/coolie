import { useState } from 'react';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';
import { useCart } from '../contexts/CartContext';

const SuggestionOfTheDay = () => {
  const { showToast } = useToast();
  const { addIngredientsToCart } = useCart();
  const [showDetails, setShowDetails] = useState(false);
  
  // Ingrédients de la salade de fruits
  const ingredients = [
    "2 pommes", 
    "2 poires", 
    "1 banane", 
    "200g de fraises", 
    "100g de myrtilles", 
    "Jus de citron", 
    "2 cuillères à soupe de miel"
  ];
  
  const handleClick = () => {
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };
  
  const saveRecipe = () => {
    showToast('Recette ajoutée à vos favoris !', 'success');
    setShowDetails(false);
  };

  const orderIngredients = () => {
    addIngredientsToCart(ingredients);
  };

  return (
    <>
      <div 
        className="bg-background-darker rounded-card shadow-card overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="p-4">
          <h3 className="text-green-primary text-lg font-semibold mb-3">
            Suggestion du jour
          </h3>
          
          {/* Image from web - updated with a more reliable fruit salad image */}
          <div className="h-48 w-full rounded-lg overflow-hidden">
            <img 
              src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Salade de fruits"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Recipe title */}
          <div className="mt-3">
            <h4 className="font-medium text-lg">Salade de fruits de saison</h4>
            <p className="text-text-light text-sm">Fraîche et délicieuse</p>
          </div>
        </div>
      </div>
      
      {/* Recipe Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Salade de fruits de saison</h3>
                <button 
                  className="p-1 text-gray-500"
                  onClick={closeDetails}
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="mb-4 h-48 overflow-hidden rounded-lg">
                <img 
                  src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=800" 
                  alt="Salade de fruits"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mb-4">
                <p className="text-sm mb-1"><strong>Préparation:</strong> 15 min</p>
                <p className="text-sm mb-1"><strong>Temps total:</strong> 15 min</p>
                <p className="text-sm mb-4"><strong>Difficulté:</strong> 🌶️</p>
                
                <h4 className="font-medium mb-2">Ingrédients:</h4>
                <ul className="list-disc list-inside mb-4">
                  {ingredients.map((ingredient, idx) => (
                    <li key={idx} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
                
                <h4 className="font-medium mb-2">Préparation:</h4>
                <p className="text-sm">
                  1. Lavez soigneusement tous les fruits sous l'eau froide.<br/>
                  2. Épluchez les pommes et les poires, retirez les trognons et coupez-les en dés de taille moyenne.<br/>
                  3. Épluchez la banane et coupez-la en rondelles.<br/> 
                  4. Équeutez les fraises et coupez-les en deux ou en quatre selon leur taille.<br/>
                  5. Rincez les myrtilles et égouttez-les bien.<br/>
                  6. Dans un grand saladier, mélangez délicatement tous les fruits.<br/>
                  7. Pressez le jus d'un demi-citron sur les fruits pour éviter qu'ils ne noircissent.<br/>
                  8. Ajoutez le miel et mélangez doucement pour ne pas écraser les fruits.<br/>
                  9. Laissez reposer au réfrigérateur pendant 30 minutes avant de servir pour que les saveurs se mélangent.
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button 
                  className="bg-green-primary text-white w-full py-2 rounded-lg flex items-center justify-center"
                  onClick={orderIngredients}
                >
                  <FaShoppingCart className="mr-2" />
                  Commander les ingrédients
                </button>
                
                <div className="flex space-x-2">
                  <button 
                    className="bg-orange-secondary text-white flex-1 py-2 rounded-lg"
                    onClick={closeDetails}
                  >
                    Fermer
                  </button>
                  <button 
                    className="bg-green-primary text-white flex-1 py-2 rounded-lg"
                    onClick={saveRecipe}
                  >
                    Ajouter aux favoris
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuggestionOfTheDay;
