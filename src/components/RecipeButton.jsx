import { FaUtensils } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const RecipeButton = () => {
  const navigate = useNavigate();
  
  return (
    <button 
      className="bg-background-darker rounded-card shadow-card p-4 h-28 flex items-center justify-start shadow-md"
      onClick={() => navigate('/recipes')}
    >
      <FaUtensils className="text-green-primary text-2xl mr-4" />
      <span className="font-header text-green-primary text-lg">Recettes</span>
    </button>
  )
}

export default RecipeButton
