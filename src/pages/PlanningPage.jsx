import { useState } from 'react';
import { FaCalendarAlt, FaPlus, FaAppleAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { recipes } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';

const PlanningPage = () => {
  const { showToast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(getWeekDates());
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [mealPlans, setMealPlans] = useState({});
  
  function getWeekDates() {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust to get Monday
    
    return Array(7).fill().map((_, i) => {
      const date = new Date(today);
      date.setDate(diff + i);
      return date;
    });
  }
  
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const navigateWeek = (direction) => {
    setCurrentWeek(prev => {
      const newWeek = prev.map(date => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
        return newDate;
      });
      return newWeek;
    });
  };

  const addMeal = (meal) => {
    setSelectedMeal(meal);
    setShowRecipeSelector(true);
  };

  const selectRecipe = (recipe) => {
    const mealKey = `${selectedMeal}-${new Date().toISOString()}`;
    setMealPlans(prev => ({
      ...prev,
      [mealKey]: recipe
    }));
    setShowRecipeSelector(false);
    showToast(`${recipe.name} ajouté à votre planning du ${selectedMeal}`, 'success');
  };
  
  const removeMeal = (mealKey) => {
    setMealPlans(prev => {
      const newPlans = {...prev};
      delete newPlans[mealKey];
      return newPlans;
    });
    showToast("Repas supprimé du planning", "success");
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
        <button className="p-2 text-white">
          <FaAppleAlt size={20} className="text-orange-secondary" />
        </button>
      </header>
      
      <div className="p-4">
        <div className="bg-background-darker rounded-card shadow-card p-4">
          <h2 className="text-xl font-header font-medium text-green-primary mb-6">
            Planning
          </h2>
          
          {/* Week navigation */}
          <div className="flex justify-center items-center mb-6">
            <button 
              className="p-2 text-green-primary"
              onClick={() => navigateWeek('prev')}
            >
              <FaChevronLeft size={16} />
            </button>
            <span className="mx-2 text-sm">
              Semaine du {currentWeek[0].getDate()} au {currentWeek[6].getDate()} {currentWeek[6].toLocaleString('default', { month: 'long' })}
            </span>
            <button 
              className="p-2 text-green-primary"
              onClick={() => navigateWeek('next')}
            >
              <FaChevronRight size={16} />
            </button>
          </div>
          
          {/* Week calendar */}
          <div className="grid grid-cols-7 gap-1 mb-6">
            {dayNames.map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-text-light mb-1">{day}</div>
                <div className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center text-xs ${
                  currentWeek[index].getDate() === new Date().getDate() ? 
                  'bg-green-primary text-white' : 'bg-white text-text-dark'
                }`}>
                  {currentWeek[index].getDate()}
                </div>
              </div>
            ))}
          </div>
          
          {/* Meal planner */}
          <div className="space-y-4">
            {['Petit déjeuner', 'Déjeuner', 'Dîner'].map(meal => {
              const mealKeys = Object.keys(mealPlans).filter(key => key.startsWith(meal));
              return (
                <div key={meal} className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-medium text-green-primary mb-3">{meal}</h3>
                  
                  {mealKeys.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {mealKeys.map(key => (
                        <div key={key} className="flex items-center justify-between bg-background rounded-lg p-3">
                          <span>{mealPlans[key].name}</span>
                          <button 
                            className="text-red-500"
                            onClick={() => removeMeal(key)}
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  
                  {/* Empty planner item */}
                  <button 
                    className="w-full border-2 border-dashed border-background rounded-lg p-4 flex items-center justify-center"
                    onClick={() => addMeal(meal)}
                  >
                    <FaPlus className="text-green-primary mr-2" />
                    <span className="text-sm text-text-light">Ajouter un plat</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Recipe Selector Modal */}
      {showRecipeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Choisir une recette pour {selectedMeal}</h3>
                <button 
                  className="p-1 text-gray-500"
                  onClick={() => setShowRecipeSelector(false)}
                >
                  <FaTimes size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                {recipes.map(recipe => (
                  <button 
                    key={recipe.id}
                    className="flex items-center w-full text-left p-3 bg-background hover:bg-background-darker rounded-lg transition-colors"
                    onClick={() => selectRecipe(recipe)}
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden mr-3">
                      <img 
                        src={getRecipeImage(recipe.name)} 
                        alt={recipe.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-sm text-text-light">Préparation: {recipe.prepTime}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              <button 
                className="bg-green-primary text-white w-full py-2 rounded-lg mt-4"
                onClick={() => setShowRecipeSelector(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Function to get recipe image from name, reused from RecipesPage
function getRecipeImage(recipeName) {
  // Vérifier si la recette existe dans les données
  const recipe = recipes.find(r => r.name === recipeName);
  if (recipe && recipe.image) {
    return recipe.image;
  }
  
  // Fallback pour les images par type de recette
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

export default PlanningPage;
