import React from 'react';
import { useLocation } from 'react-router-dom';
import NavCart from './NavCart';

const AppHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  // Ne pas afficher sur la page d'accueil qui a son propre header
  if (isHomePage) return null;
  
  // Header simple et robuste pour les autres pages
  return (
    <header className="sticky top-0 left-0 right-0 z-10 bg-green-primary py-3 px-4 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">COOLIE</h1>
      <NavCart />
    </header>
  );
};

export default AppHeader;
