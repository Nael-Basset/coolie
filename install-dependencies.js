// Script pour installer les dépendances nécessaires
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🌿 Installation des dépendances de COOLIE App...');

// Vérifier si le package.json existe
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Fichier package.json non trouvé.');
  process.exit(1);
}

try {
  // Installer les dépendances de base
  console.log('📦 Installation des dépendances de base...');
  execSync('npm install', { stdio: 'inherit' });

  // Installer les dépendances spécifiques pour la cartographie
  console.log('🗺️ Installation des packages de cartographie...');
  execSync('npm install leaflet react-leaflet', { stdio: 'inherit' });

  console.log('✅ Installation terminée avec succès!');
  console.log('🚀 Vous pouvez maintenant démarrer le projet avec: npm run dev');
} catch (error) {
  console.error('❌ Erreur lors de l\'installation:', error.message);
  process.exit(1);
}
