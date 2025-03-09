import React, { useRef, useEffect } from 'react';

const MapComponent = ({ center, zoom, markers = [], height = "400px", onMarkerClick }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  
  // Fonction améliorée pour créer une icône personnalisée
  const createCustomIcon = (marker) => {
    const colorMap = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-green-primary': '#558B2F',
      'bg-yellow-500': '#eab308',
      'bg-red-500': '#ef4444',
      'bg-purple-500': '#a855f7',
      'bg-orange-secondary': '#FFB300'
    };
    
    const color = colorMap[marker.color?.replace('bg-', '')] || '#558B2F';
    
    // Vérifier si c'est un marqueur de région
    const isRegion = marker.category === "Région" || marker.id?.startsWith('region-');
    
    // Taille différente basée sur le type de marqueur
    const size = isRegion ? 42 : 30;
    
    // Style du marqueur avec taille adaptée
    const markerHtmlStyles = `
      background-color: ${color}; 
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${isRegion ? '8px' : '50%'};
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      color: white;
      font-weight: bold;
      font-size: ${isRegion ? '16px' : '14px'};
      text-align: center;
    `;
    
    // Ajouter une étiquette au marqueur
    const label = marker.label || marker.number || '';
    
    // Créer l'icône avec des dimensions et ancrages optimisés
    const icon = window.L.divIcon({
      className: "custom-pin",
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2],
      html: `
        <div class="marker-wrapper">
          <div style="${markerHtmlStyles}" class="${isRegion ? 'region-marker' : 'pulse-animation'}">${label}</div>
          ${marker.showLabel ? `<div class="marker-label">${marker.title || ''}</div>` : ''}
        </div>
      `
    });
    
    return icon;
  };
  
  // Initialisation et gestion de la carte
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;
    
    // Créer la carte si elle n'existe pas déjà
    if (!mapInstanceRef.current) {
      // Créer la carte avec des options améliorées
      mapInstanceRef.current = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true, // Activation du zoom avec la molette
        dragging: true,
        tap: false // Désactivation du tap qui peut causer des problèmes sur certains appareils
      }).setView(center, zoom);
      
      // Utiliser un style de tuile plus clair pour une meilleure lisibilité
      window.L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
      
      // Ajouter une légende si nécessaire
      if (markers.length > 0 && markers.some(m => m.category)) {
        addLegend(mapInstanceRef.current, markers);
      }
    } else {
      // Mettre à jour la vue si la carte existe déjà avec une animation fluide
      mapInstanceRef.current.setView(center, zoom, {
        animate: true,
        duration: 0.5
      });
    }
    
    // Nettoyer les anciens marqueurs
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Ajouter les nouveaux marqueurs avec une vérification de position valide
    markers.forEach(markerData => {
      // Vérifier que la position est valide
      if (!Array.isArray(markerData.position) || markerData.position.length !== 2 ||
          isNaN(markerData.position[0]) || isNaN(markerData.position[1])) {
        console.warn('Position de marqueur invalide:', markerData.position);
        return;
      }
      
      const marker = window.L.marker(markerData.position, { 
        icon: createCustomIcon(markerData),
        title: markerData.title || '', // Info-bulle au survol
        alt: markerData.title || 'Marqueur', // Texte alternatif pour accessibilité
        riseOnHover: true // Le marqueur passe au premier plan au survol
      });
      
      // Créer un popup plus attractif
      if (markerData.popup) {
        const popupContent = `
          <div class="custom-popup">
            <h3 style="font-weight: bold; margin-bottom: 0.25rem; color: #558B2F;">${markerData.title || ""}</h3>
            ${markerData.description ? `<p style="font-size: 0.875rem; margin-bottom: 0.5rem;">${markerData.description}</p>` : ""}
            ${markerData.category ? `<p style="font-size: 0.75rem; color: #666; margin-bottom: 0.5rem;">Catégorie: ${markerData.category}</p>` : ""}
            <button 
              style="background-color: #558B2F; color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: none; width: 100%; cursor: pointer;"
              onclick="document.dispatchEvent(new CustomEvent('mapMarkerSelect', {detail: '${markerData.id || ''}'}))"
            >
              Voir détails
            </button>
          </div>
        `;
        marker.bindPopup(popupContent, {
          closeButton: true,
          className: 'custom-popup-container',
          maxWidth: 250
        });
      }
      
      // Ajouter des événements interactifs
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(markerData);
        }
      });
      
      // Animation au survol
      marker.on('mouseover', function() {
        this._icon.classList.add(markerData.category === "Région" ? 'region-hover' : 'marker-hover');
        
        if (this._popup) {
          this.openPopup();
        }
      });
      
      marker.on('mouseout', function() {
        this._icon.classList.remove('marker-hover');
        this._icon.classList.remove('region-hover');
        if (this._popup) {
          // Fermer le popup après un délai pour permettre la navigation vers le popup
          setTimeout(() => {
            if (document.querySelector('.leaflet-popup') && !document.querySelector('.leaflet-popup:hover')) {
              this.closePopup();
            }
          }, 300);
        }
      });
      
      marker.addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });
    
    // Adapter le zoom pour montrer tous les marqueurs si nécessaire
    if (markers.length > 1 && !center) {
      try {
        const group = new window.L.featureGroup(markersRef.current);
        mapInstanceRef.current.fitBounds(group.getBounds(), {
          padding: [30, 30],
          maxZoom: 13, // Limiter le zoom max pour éviter un zoom excessif
          animate: true
        });
      } catch (e) {
        console.error("Erreur lors de l'adaptation du zoom:", e);
      }
    }
    
    // Écouter les événements personnalisés pour la communication avec le popup
    const handleMarkerSelect = (e) => {
      const markerId = e.detail;
      const markerData = markers.find(m => m.id === markerId);
      if (markerData && onMarkerClick) {
        onMarkerClick(markerData);
      }
    };
    
    document.addEventListener('mapMarkerSelect', handleMarkerSelect);
    
    // Nettoyage lors de la destruction du composant
    return () => {
      document.removeEventListener('mapMarkerSelect', handleMarkerSelect);
      
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
      }
    };
  }, [center, zoom, markers, onMarkerClick]);
  
  // Fonction pour ajouter une légende à la carte
  const addLegend = (map, markers) => {
    // Extraire les catégories uniques des marqueurs
    const categories = [...new Set(markers.filter(m => m.category).map(m => m.category))];
    
    if (categories.length === 0) return;
    
    const legend = window.L.control({ position: 'bottomright' });
    
    legend.onAdd = function() {
      const div = window.L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '6px 8px';
      div.style.border = '1px solid #ccc';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 0 15px rgba(0,0,0,0.1)';
      
      div.innerHTML = '<h4 style="margin:0 0 5px 0;font-weight:bold;font-size:14px;">Légende</h4>';
      
      categories.forEach(category => {
        // Trouver un marqueur avec cette catégorie pour obtenir la couleur
        const marker = markers.find(m => m.category === category);
        const color = marker ? getCategoryColor(marker) : '#558B2F';
        
        div.innerHTML += `
          <div style="display:flex;align-items:center;margin-bottom:3px;">
            <span style="background-color:${color};width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:5px;"></span>
            <span style="font-size:12px;">${category}</span>
          </div>
        `;
      });
      
      return div;
    };
    
    legend.addTo(map);
  };
  
  // Fonction pour obtenir la couleur d'une catégorie de marqueur
  const getCategoryColor = (marker) => {
    const colorMap = {
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#22c55e',
      'bg-green-primary': '#558B2F',
      'bg-yellow-500': '#eab308',
      'bg-red-500': '#ef4444',
      'bg-purple-500': '#a855f7',
      'bg-orange-secondary': '#FFB300'
    };
    
    return colorMap[marker.color?.replace('bg-', '')] || '#558B2F';
  };
  
  return (
    <div 
      ref={mapContainerRef} 
      className="rounded-lg overflow-hidden bg-blue-50"
      style={{ height, width: '100%', position: 'relative' }}
    >
      {/* Carte chargée ici */}
      {(!window.L || markers.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Chargement de la carte...</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
