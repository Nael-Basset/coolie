import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import ProductsPage from './pages/ProductsPage';
import RegionMapPage from './pages/RegionMapPage';
import PodiumPage from './pages/PodiumPage';
import PlanningPage from './pages/PlanningPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Version simplifiée pour détecter uniquement l'orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
  // Suppression de la logique d'échelle qui peut causer des problèmes
  return (
    <div className="app-container">
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              {/* Suppression de la classe h-screen qui limite la hauteur */}
              <div className="flex flex-col">
                {/* Amélioration du conteneur principal pour permettre le défilement */}
                <main className="flex-1 pb-16 scrollable-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/recipes" element={<RecipesPage />} />
                    <Route path="/shop" element={<ProductsPage />} />
                    <Route path="/map" element={<RegionMapPage />} />
                    <Route path="/podium" element={<PodiumPage />} />
                    <Route path="/planning" element={<PlanningPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                  </Routes>
                </main>
                {/* Position fixe pour la barre de navigation inférieure */}
                <div className="fixed bottom-0 left-0 right-0 bg-white z-10 nav-container">
                  <BottomNavigation active={activePage} setActive={setActivePage} />
                </div>
              </div>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
