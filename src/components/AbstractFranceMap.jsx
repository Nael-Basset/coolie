import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const AbstractFranceMap = ({ regions, onRegionSelect }) => {
  const [expandedMap, setExpandedMap] = useState(false);

  // Coordonnées simplifiées pour dessiner les régions sous forme de polygones SVG
  const regionCoordinates = {
    'bretagne': "10,40 20,30 10,20 0,30",
    'centre-val-de-loire': "40,50 50,40 40,30 30,40",
    'provence': "60,60 70,50 60,40 50,50",
    'nord': "30,10 40,0 50,10 40,20",
    'alsace': "70,20 80,10 90,20 80,30"
  };

  const toggleMapSize = () => {
    setExpandedMap(!expandedMap);
  };

  return (
    <>
      <div 
        className={`abstract-france-map-container ${expandedMap ? 'hidden' : ''}`} 
        onClick={toggleMapSize}
      >
        <div className="text-center text-sm text-text-light mb-2">
          Cliquez sur la carte pour l'agrandir
        </div>
        <svg 
          viewBox="0 0 100 100" 
          className="abstract-france-map"
        >
          {/* Contour simplifié de la France */}
          <path 
            d="M20,10 L80,10 L90,30 L80,80 L60,90 L20,80 L10,50 Z" 
            className="france-outline" 
          />
          
          {/* Régions individuelles */}
          {regions.map(region => (
            <polygon 
              key={region.id}
              points={regionCoordinates[region.id]}
              className={`region-polygon ${region.color.replace('bg-', 'fill-')}`}
              data-region-name={region.name}
            />
          ))}
          
          {/* Étiquettes des régions */}
          {regions.map(region => {
            // Calcul simplifié du centre des polygones pour placer les étiquettes
            const points = regionCoordinates[region.id].split(' ').map(point => {
              const [x, y] = point.split(',').map(Number);
              return { x, y };
            });
            
            const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
            const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
            
            return (
              <text 
                key={`label-${region.id}`}
                x={centerX} 
                y={centerY}
                className="region-label"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {region.name.charAt(0)}
              </text>
            );
          })}
        </svg>
      </div>
      
      {/* Modal pour la carte agrandie */}
      {expandedMap && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 max-w-xl w-full max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Carte des régions</h3>
              <button 
                className="p-1 text-gray-500"
                onClick={toggleMapSize}
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="abstract-france-map-expanded">
              <svg 
                viewBox="0 0 100 100" 
                className="abstract-france-map"
              >
                {/* Contour simplifié de la France */}
                <path 
                  d="M20,10 L80,10 L90,30 L80,80 L60,90 L20,80 L10,50 Z" 
                  className="france-outline" 
                />
                
                {/* Régions individuelles */}
                {regions.map(region => (
                  <polygon 
                    key={region.id}
                    points={regionCoordinates[region.id]}
                    className={`region-polygon ${region.color.replace('bg-', 'fill-')}`}
                    onClick={() => onRegionSelect(region)}
                    data-region-name={region.name}
                  />
                ))}
                
                {/* Étiquettes des régions */}
                {regions.map(region => {
                  // Calcul simplifié du centre des polygones pour placer les étiquettes
                  const points = regionCoordinates[region.id].split(' ').map(point => {
                    const [x, y] = point.split(',').map(Number);
                    return { x, y };
                  });
                  
                  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
                  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;
                  
                  return (
                    <text 
                      key={`label-${region.id}`}
                      x={centerX} 
                      y={centerY}
                      className="region-label-expanded"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      onClick={() => onRegionSelect(region)}
                    >
                      {region.name}
                    </text>
                  );
                })}
              </svg>

              <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {regions.map(region => (
                    <div 
                      key={region.id} 
                      className="bg-white p-2 rounded-lg border border-gray-200 cursor-pointer hover:bg-green-50"
                      onClick={() => {
                        onRegionSelect(region);
                        setExpandedMap(false);
                      }}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 ${region.color} rounded-sm mr-2`}></div>
                        <span className="text-sm font-medium">{region.name}</span>
                      </div>
                      <div className="text-xs text-text-light mt-1">
                        {region.producers} producteurs • {region.specialties.length} spécialités
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AbstractFranceMap;
