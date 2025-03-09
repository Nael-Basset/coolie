import React, { useState, useEffect } from 'react';
import MapComponent from './MapComponent';

const MapWrapper = (props) => {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  
  // Vérifier si Leaflet est chargé
  useEffect(() => {
    let timeoutId;
    const maxAttempts = 50; // Maximum de tentatives (5 secondes)
    let attempts = 0;
    
    const checkLeaflet = () => {
      if (window.L) {
        setLeafletLoaded(true);
        return;
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        // En cas d'échec après plusieurs tentatives, afficher le placeholder
        setLoadingTimeout(true);
        return;
      }
      
      // Réessayer toutes les 100ms
      timeoutId = setTimeout(checkLeaflet, 100);
    };
    
    checkLeaflet();
    
    // Nettoyer le timeout lors du démontage du composant
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);
  
  // Afficher un placeholder stylisé pendant le chargement
  if (!leafletLoaded) {
    return (
      <div 
        className="rounded-lg overflow-hidden bg-blue-50 flex flex-col items-center justify-center"
        style={{ 
          height: props.height || '400px', 
          width: '100%',
        }}
      >
        {loadingTimeout ? (
          <div className="text-center p-4">
            <p className="text-gray-600 font-medium mb-2">Impossible de charger la carte</p>
            <p className="text-gray-500 text-sm">
              Vérifiez votre connexion internet ou actualisez la page
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <div className="text-gray-600">Chargement de la carte...</div>
          </>
        )}
      </div>
    );
  }
  
  return <MapComponent {...props} />;
};

export default MapWrapper;
