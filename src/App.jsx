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
  
  // Détecter l'orientation du dispositif
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
  
  return (
    <div className="app-container">
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              <div className={`flex flex-col h-screen ${isLandscape ? 'landscape-mode' : ''}`}>
                <main className={`flex-1 overflow-auto pb-16 ${isLandscape ? 'landscape-scroll' : ''}`}>
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
                <BottomNavigation active={activePage} setActive={setActivePage} />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
