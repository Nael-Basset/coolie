import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const RecipeDetail = ({ recipe }) => {
  const { addToCart } = useContext(CartContext);
  
  // Fonction pour ajouter tous les ingrédients au panier
  const addAllIngredientsToCart = () => {
    // Vérifie que la recette et ses ingrédients existent
    if (!recipe || !recipe.ingredients || !Array.isArray(recipe.ingredients)) {
      console.error("Aucun ingrédient trouvé pour cette recette");
      return;
    }
    
    // Ajoute chaque ingrédient au panier
    recipe.ingredients.forEach(ingredient => {
      addToCart({
        id: ingredient.id || `ingredient-${Math.random().toString(36).substr(2, 9)}`,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        price: ingredient.price || 0,
        // Ajoute d'autres propriétés selon votre modèle de données
      });
    });
    
    // Feedback utilisateur (optionnel)
    alert(`${recipe.ingredients.length} ingrédients ajoutés au panier !`);
  };
  
  return (
    <div className="recipe-detail card">
      <h2 className="text-xl font-semibold mb-4">{recipe.name}</h2>
      
      {/* Liste des ingrédients */}
      <div className="ingredients-section mb-4">
        <h3 className="text-lg font-medium mb-2">Ingrédients</h3>
        <ul className="list-disc pl-5">
          {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Bouton pour ajouter tous les ingrédients */}
      <button 
        className="btn-primary w-full mt-4"
        onClick={addAllIngredientsToCart}
      >
        Ajouter les ingrédients
      </button>
    </div>
  );
};

export default RecipeDetail;