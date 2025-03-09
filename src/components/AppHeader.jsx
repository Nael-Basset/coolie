import React from 'react';
import { useLocation } from 'react-router-dom';
import NavCart from './NavCart';
import { CartProvider } from '../contexts/CartContext';

const AppHeader = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  
  // Si nous sommes sur la page d'accueil, ne pas afficher cet en-tête 
  if (isHomePage) return null;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-green-primary p-3 shadow-md flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">COOLIE</h1>
      {/* Pas besoin de rewrapper dans un CartProvider car App.jsx l'a déjà fait */}
      <NavCart />
    </header>
  );
};

export default AppHeader;
