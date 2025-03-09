import { useState } from 'react';
import { FaAppleAlt, FaShoppingCart } from 'react-icons/fa'
import SuggestionOfTheDay from '../components/SuggestionOfTheDay'
import RecipeButton from '../components/RecipeButton'
import PlanningButton from '../components/PlanningButton'
import CartModal from '../components/CartModal';
import GlobalSearch from '../components/GlobalSearch';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const { getCartCount } = useCart();
  const { isDarkMode } = useTheme();
  const [showCart, setShowCart] = useState(false);
  
  return (
    <div className="flex flex-col pb-20 dark:bg-gray-900">
      {/* Header with logo and search */}
      <header className="bg-green-primary rounded-b-card p-4 mb-6 flex items-center justify-between dark:bg-gray-800">
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
          <GlobalSearch />
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
      
      {/* Main content */}
      <div className="space-y-8 p-4">
        {/* Suggestion of the day */}
        <SuggestionOfTheDay />
        
        {/* Feature buttons */}
        <div className="grid grid-cols-2 gap-4">
          <RecipeButton />
          <PlanningButton />
        </div>
      </div>
      
      {/* Cart Modal */}
      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </div>
  )
}

export default HomePage
