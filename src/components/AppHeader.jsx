import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import NavCart from './NavCart';

const AppHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Si nous sommes sur la page d'accueil, ne pas afficher cet en-tête (la page d'accueil a son propre en-tête)
  if (isHomePage) return null;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-green-primary p-3 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">COOLIE</h1>
      <NavCart />
    </header>
  );
};

export default AppHeader;
