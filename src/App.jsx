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
  // Ajout d'un état pour gérer l'échelle de la vue
  const [scale, setScale] = useState(1);
  
  // Détecter l'orientation et définir l'échelle appropriée
  useEffect(() => {
    const checkSizeAndOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      
      // Calcul de l'échelle optimale pour les petits écrans
      // (cela ajuste l'application en fonction de la largeur de l'appareil)
      const optimalWidth = 375; // Largeur de conception cible pour iPhone
      if (window.innerWidth < 576) {
        // Petits ajustements pour les téléphones très petits ou très grands
        const calculatedScale = Math.min(Math.max(window.innerWidth / optimalWidth, 0.85), 1.1);
        setScale(calculatedScale);
      } else {
        setScale(1); // Échelle normale pour les écrans plus grands
      }
    };
    
    checkSizeAndOrientation();
    window.addEventListener('resize', checkSizeAndOrientation);
    window.addEventListener('orientationchange', checkSizeAndOrientation);
    
    return () => {
      window.removeEventListener('resize', checkSizeAndOrientation);
      window.removeEventListener('orientationchange', checkSizeAndOrientation);
    };
  }, []);
  
  return (
    <div className="app-container">
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <FavoritesProvider>
              {/* Applique l'échelle calculée si nécessaire */}
              <div 
                className={`flex flex-col h-screen mobile-view ${isLandscape ? 'landscape-mode' : ''}`}
                style={{
                  // Appliquer l'échelle calculée via transform
                  transform: `scale(${scale})`,
                  width: `${100 / scale}%`, // Compenser la largeur après mise à l'échelle
                  height: scale < 1 ? `${100 / scale}vh` : '100vh', // Compenser la hauteur
                  transformOrigin: 'top center'
                }}
              >
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
                <BottomNavigation 
                  active={activePage} 
                  setActive={setActivePage} 
                  className="mobile-icon"
                />
              </div>
            </FavoritesProvider>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
