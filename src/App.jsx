import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './pages/HomePage';
import RecipesPage from './pages/RecipesPage';
import ProductsPage from './pages/ProductsPage';
import RegionMapPage from './pages/RegionMapPage';
import PodiumPage from './pages/PodiumPage';
import PlanningPage from './pages/PlanningPage';
import ProfilePage from './pages/ProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import Cart from './components/Cart'; // Importer le composant Cart
import { ToastProvider } from './contexts/ToastContext';
import { CartProvider } from './contexts/CartContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import './App.css';

// Configuration pour les gestes de swipe
const swipeConfig = {
  delta: 50, // Seuil minimal de swipe en pixels
  preventDefaultTouchmoveEvent: false, // Pour ne pas bloquer le défilement vertical
  trackTouch: true, // Suivre les événements tactiles
  trackMouse: false, // Ne pas suivre les événements de souris
  rotationAngle: 0, // Angle de rotation (0 pour aucune rotation)
};

function App() {
  const [activePage, setActivePage] = useState('home');
  const [isLandscape, setIsLandscape] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Gestion de l'orientation
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
  
  // Mise à jour de l'onglet actif en fonction de l'URL
  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'home';
    setActivePage(path);
  }, [location.pathname]);
  
  // Configuration du gestionnaire de swipe
  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    ...swipeConfig
  });
  
  // Gestionnaire de swipe pour la navigation
  const handleSwipe = (direction) => {
    const routes = ['', 'recipes', 'shop', 'map', 'podium', 'planning', 'profile', 'favorites'];
    const currentIndex = routes.indexOf(activePage === 'home' ? '' : activePage);
    
    if (currentIndex !== -1) {
      if (direction === 'left' && currentIndex < routes.length - 1) {
        const nextRoute = routes[currentIndex + 1];
        navigate(`/${nextRoute}`);
        setActivePage(nextRoute || 'home');
      } else if (direction === 'right' && currentIndex > 0) {
        const prevRoute = routes[currentIndex - 1];
        navigate(`/${prevRoute}`);
        setActivePage(prevRoute || 'home');
      }
    }
  };
  
  return (
    <div className="app-outer-container" {...handlers}>
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              {/* Restauration de la structure originale */}
              <div className="main-scroll-container swipeable-element">
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
              
              {/* Le panier */}
              <Cart />
              
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
