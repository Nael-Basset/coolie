import { useState } from 'react';
import { FaUser, FaTrophy, FaCreditCard, FaLock, FaChevronRight, FaCheckCircle, FaMapMarkerAlt, FaMedal, FaAppleAlt, FaShoppingBasket, FaLeaf, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  const userInfo = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    points: 1250,
    level: "Intermédiaire"
  };
  
  const achievements = [
    { id: 1, name: "Premier achat", icon: <FaShoppingBasket />, completed: true, points: 50 },
    { id: 2, name: "5 commandes réalisées", icon: <FaShoppingBasket />, completed: true, points: 100 },
    { id: 3, name: "Commande bio", icon: <FaLeaf />, completed: true, points: 75 },
    { id: 4, name: "Commande 100% locale", icon: <FaMapMarkerAlt />, completed: false, points: 150 },
    { id: 5, name: "Cuisiner 10 recettes", icon: <FaAppleAlt />, completed: false, points: 200 },
  ];
  
  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <header className="bg-green-primary rounded-b-card p-4 mb-6 flex items-center justify-between">
        <div className="logo text-3xl text-white flex items-center">
          <span>C</span>
          <span>O</span>
          <span className="text-orange-secondary">🍅</span>
          <span>L</span>
          <span>I</span>
          <span className="text-orange-secondary">🍆</span>
          <span>E</span>
        </div>
      </header>
      
      <div className="p-4 space-y-6">
        {/* User info card */}
        <div className="bg-background-darker rounded-card shadow-card p-4">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full bg-green-primary flex items-center justify-center text-white text-2xl mr-4">
              <FaUser />
            </div>
            <div>
              <h2 className="text-xl font-medium">{userInfo.name}</h2>
              <p className="text-sm text-text-light">{userInfo.email}</p>
              <div className="flex items-center mt-1">
                <FaTrophy className="text-orange-secondary mr-1" size={14} />
                <span className="text-sm font-medium">{userInfo.points} points • {userInfo.level}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment methods */}
        <div className="bg-background-darker rounded-card shadow-card p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <FaCreditCard className="mr-2 text-green-primary" />
            Coordonnées bancaires
          </h3>
          
          <button 
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg mb-2"
            onClick={() => setShowPaymentModal(true)}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white mr-3">
                <FaCreditCard />
              </div>
              <div className="text-left">
                <div className="font-medium">Carte Visa</div>
                <div className="text-xs text-text-light">Finissant par 4242</div>
              </div>
            </div>
            <FaChevronRight className="text-text-light" />
          </button>
          
          <button 
            className="w-full flex items-center justify-between p-3 border-2 border-dashed border-gray-300 rounded-lg text-text-light"
            onClick={() => setShowPaymentModal(true)}
          >
            <span>Ajouter une carte</span>
            <FaChevronRight />
          </button>
        </div>
        
        {/* Mode sombre / Mode clair */}
        <div className="bg-background-darker rounded-card shadow-card p-4 dark:bg-gray-800 dark:text-white">
          <h3 className="font-medium mb-3 flex items-center">
            {isDarkMode ? 
              <FaMoon className="mr-2 text-blue-400" /> : 
              <FaSun className="mr-2 text-yellow-400" />
            }
            Apparence
          </h3>
          
          <div className="flex items-center justify-between">
            <span>{isDarkMode ? 'Mode sombre' : 'Mode clair'}</span>
            <div 
              className={`w-14 h-7 rounded-full p-1 flex items-center cursor-pointer ${
                isDarkMode ? 'bg-blue-400 justify-end' : 'bg-yellow-400 justify-start'
              }`}
              onClick={toggleTheme}
            >
              <div className="bg-white w-5 h-5 rounded-full shadow-md"></div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="bg-background-darker rounded-card shadow-card p-4">
          <h3 className="font-medium mb-3 flex items-center">
            <FaMedal className="mr-2 text-green-primary" />
            Mes badges
          </h3>
          
          <div className="space-y-3">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`flex items-center p-3 rounded-lg ${
                  achievement.completed ? 'bg-green-primary bg-opacity-10' : 'bg-white'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                  achievement.completed ? 'bg-green-primary text-white' : 'bg-gray-200 text-text-light'
                }`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="font-medium">{achievement.name}</h4>
                    {achievement.completed && (
                      <FaCheckCircle className="text-green-primary ml-2" />
                    )}
                  </div>
                  <div className="text-xs text-text-light">
                    {achievement.completed ? 'Obtenu' : 'Non débloqué'} • {achievement.points} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h3 className="text-xl font-medium mb-4">Ajouter une carte</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Numéro de carte</label>
                  <div className="flex items-center border border-gray-300 rounded-lg p-2">
                    <FaCreditCard className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="flex-1 outline-none"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date d'expiration</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg p-2"
                      placeholder="MM/AA"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Code CVC</label>
                    <div className="flex items-center border border-gray-300 rounded-lg p-2">
                      <FaLock className="text-gray-400 mr-2" />
                      <input
                        type="text"
                        className="flex-1 outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nom sur la carte</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    placeholder="Jean Dupont"
                  />
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <button 
                    type="button" 
                    className="flex-1 py-2 bg-gray-200 rounded-lg"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="button" 
                    className="flex-1 py-2 bg-green-primary text-white rounded-lg"
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Sauvegarder
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
