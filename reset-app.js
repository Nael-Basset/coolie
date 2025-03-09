const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Réinitialisation de l\'application COOLIE...');

try {
  // Supprimer le cache et les modules node
  console.log('🧹 Nettoyage des fichiers temporaires...');
  
  // Supprimer le répertoire node_modules s'il existe
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  }
  
  // Supprimer le cache
  const cachePaths = [
    path.join(__dirname, '.vite'),
    path.join(__dirname, 'dist'),
    path.join(__dirname, 'node_modules/.vite')
  ];
  
  cachePaths.forEach(cachePath => {
    if (fs.existsSync(cachePath)) {
      if (process.platform === 'win32') {
        execSync(`rmdir /s /q "${cachePath}"`, { stdio: 'inherit' });
      } else {
        execSync(`rm -rf "${cachePath}"`, { stdio: 'inherit' });
      }
    }
  });

  // Réinstaller les dépendances
  console.log('📦 Réinstallation des dépendances...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('✅ Réinitialisation terminée avec succès!');
  console.log('🚀 Vous pouvez maintenant démarrer le projet avec: npm run dev');
} catch (error) {
  console.error('❌ Erreur lors de la réinitialisation:', error.message);
  process.exit(1);
}
