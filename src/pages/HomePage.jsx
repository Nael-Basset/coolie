import { useState } from 'react';
import SuggestionOfTheDay from '../components/SuggestionOfTheDay';
import RecipeButton from '../components/RecipeButton';
import PlanningButton from '../components/PlanningButton';
import GlobalSearch from '../components/GlobalSearch';
import NavCart from '../components/NavCart';
import { useTheme } from '../contexts/ThemeContext';

// Suppression du composant CartModal qui cause peut-être un conflit

const HomePage = () => {
  const { isDarkMode } = useTheme();
  
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
          <NavCart />
        </div>
      </header>
      
      {/* Main content */}
      <div className="space-y-8 p-4">
        <SuggestionOfTheDay />
        
        <div className="grid grid-cols-2 gap-4">
          <RecipeButton />
          <PlanningButton />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
