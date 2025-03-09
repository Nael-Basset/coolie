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
import './App.css'; // Assurez-vous que le CSS est bien importé

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
    // Structure complètement revue pour garantir le défilement
    <div className="app-outer-container">
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              {/* Conteneur principal avec débordement visible */}
              <div className="main-scroll-container">
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
              </div>
              
              {/* Navigation fixe en bas */}
              <footer className="nav-footer">
                <BottomNavigation active={activePage} setActive={setActivePage} />
              </footer>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
