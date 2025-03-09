import { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaAward, FaAppleAlt, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { podiumUsers, quizQuestions } from '../data/mockData';
import { useToast } from '../contexts/ToastContext';
import SliderButton from '../components/SliderButton';

const PodiumPage = () => {
  const { showToast } = useToast();
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [displayedUsers, setDisplayedUsers] = useState(6);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [userRank, setUserRank] = useState({
    username: "@vous",
    points: "870 000",
    rank: 8
  });
  
  const currentQuiz = quizQuestions[currentQuizIndex];
  
  useEffect(() => {
    // Réinitialiser les options sélectionnées à chaque changement de quiz
    setSelectedOptions({});
    setQuizCompleted(false);
  }, [currentQuizIndex]);

  const handleOptionSelect = (questionId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: optionId
    });
  };
  
  const submitQuiz = () => {
    // Vérifier si une réponse a été sélectionnée
    if (Object.keys(selectedOptions).length === 0) {
      showToast('Veuillez sélectionner une réponse', 'error');
      return;
    }
    
    // Vérifier si la réponse est correcte
    const isCorrect = selectedOptions[currentQuiz.id] === currentQuiz.correctAnswer;
    
    // Mettre à jour le score de l'utilisateur
    if (isCorrect) {
      setQuizScore(prev => prev + currentQuiz.points);
      setUserRank(prev => ({
        ...prev,
        points: `${parseInt(prev.points.replace(/\s+/g, '')) + currentQuiz.points}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
      }));
      showToast(`Bonne réponse ! +${currentQuiz.points} points`, 'success');
    } else {
      showToast('Mauvaise réponse !', 'error');
    }
    
    // Enregistrer la réponse de l'utilisateur
    setUserAnswers(prev => ({
      ...prev,
      [currentQuiz.id]: {
        selected: selectedOptions[currentQuiz.id],
        correct: isCorrect
      }
    }));
    
    setQuizCompleted(true);
  };
  
  const nextQuiz = () => {
    // Passer à la question suivante ou revenir à la première
    setCurrentQuizIndex(prev => (prev + 1) % quizQuestions.length);
  };
  
  const toggleShowMore = () => {
    setShowMoreUsers(!showMoreUsers);
    setDisplayedUsers(showMoreUsers ? 6 : podiumUsers.length);
  };
  
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
        <div className="flex items-center">
          <div className="text-white text-sm mr-2">
            <span className="font-bold">{quizScore}</span> pts
          </div>
          <FaAppleAlt size={20} className="text-orange-secondary" />
        </div>
      </header>
      
      <div className="p-4">
        <div className="bg-background-darker rounded-card shadow-card p-4">
          <h2 className="text-xl font-header font-medium text-green-primary text-center mb-6">
            Podium
          </h2>
          
          {/* Top 3 users */}
          <div className="flex justify-center items-end mb-8">
            {/* 2nd place */}
            <div className="flex flex-col items-center mx-2">
              <div className="text-gray-500 mb-1">
                <FaMedal size={24} className="text-gray-400" />
              </div>
              <div className="bg-orange-secondary bg-opacity-70 w-20 h-16 rounded-t-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">2</span>
              </div>
              <div className="text-xs mt-1">{podiumUsers[1].username}</div>
              <div className="text-xs font-bold">{podiumUsers[1].points} pts</div>
            </div>
            
            {/* 1st place */}
            <div className="flex flex-col items-center mx-2">
              <div className="mb-1">
                <FaTrophy size={30} className="text-yellow-500" />
              </div>
              <div className="bg-green-primary w-20 h-24 rounded-t-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <div className="text-xs mt-1">{podiumUsers[0].username}</div>
              <div className="text-xs font-bold">{podiumUsers[0].points} pts</div>
            </div>
            
            {/* 3rd place */}
            <div className="flex flex-col items-center mx-2">
              <div className="mb-1">
                <FaAward size={24} className="text-amber-700" />
              </div>
              <div className="bg-orange-secondary bg-opacity-40 w-20 h-12 rounded-t-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">3</span>
              </div>
              <div className="text-xs mt-1">{podiumUsers[2].username}</div>
              <div className="text-xs font-bold">{podiumUsers[2].points} pts</div>
            </div>
          </div>
          
          {/* User's rank highlight */}
          <div className="mb-6 px-4 py-3 bg-green-primary bg-opacity-10 rounded-lg border border-green-primary border-opacity-30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-green-primary rounded-full flex items-center justify-center text-xs font-bold text-white mr-3">
                  <FaUser />
                </span>
                <div>
                  <span className="font-medium">{userRank.username}</span>
                  <div className="text-xs text-text-light">Votre rang: {userRank.rank}</div>
                </div>
              </div>
              <span className="font-bold">{userRank.points} pts</span>
            </div>
          </div>
          
          {/* Other rankings */}
          <div className="mb-6">
            <h3 className="font-medium mb-3">Classement</h3>
            <div className="space-y-2">
              {podiumUsers.slice(3, displayedUsers).map((user, index) => (
                <div key={user.id} className="flex items-center justify-between border-b border-background pb-2 last:border-0">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-green-primary rounded-full flex items-center justify-center text-xs font-bold text-white mr-3">
                      {index + 4}
                    </span>
                    <span>{user.username}</span>
                  </div>
                  <span className="font-bold text-sm">{user.points} pts</span>
                </div>
              ))}
            </div>
            
            <button 
              className="w-full text-center text-green-primary font-medium mt-3"
              onClick={toggleShowMore}
            >
              {showMoreUsers ? "Voir moins" : "Voir plus"}
            </button>
          </div>
          
          {/* Quiz section */}
          <div className="bg-green-primary rounded-card p-4">
            <h3 className="font-medium text-white mb-1 text-center">Quiz du jour</h3>
            <p className="text-white text-xs text-center opacity-80 mb-4">
              Question {currentQuizIndex + 1}/{quizQuestions.length} • {currentQuiz.points} points
            </p>
            
            {currentQuiz && (
              <div>
                <p className="text-white text-center font-medium mb-4">{currentQuiz.question}</p>
                
                <div className="space-y-3 mb-5">
                  {currentQuiz.options.map((option, index) => (
                    <button
                      key={index}
                      disabled={quizCompleted}
                      className={`w-full p-3 rounded-lg text-left relative transition-all duration-200 ${
                        quizCompleted
                          ? index === currentQuiz.correctAnswer
                            ? 'bg-green-100 border-2 border-green-500 text-green-800 font-medium'
                            : selectedOptions[currentQuiz.id] === index
                              ? 'bg-red-100 border-2 border-red-500 text-red-800'
                              : 'bg-background opacity-60'
                          : selectedOptions[currentQuiz.id] === index
                            ? 'bg-green-100 border-2 border-green-primary text-green-700 font-medium'
                            : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => !quizCompleted && handleOptionSelect(currentQuiz.id, index)}
                    >
                      <div className="pr-8">{option}</div>
                      {quizCompleted && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {index === currentQuiz.correctAnswer ? (
                            <FaCheck className="text-green-500" />
                          ) : selectedOptions[currentQuiz.id] === index ? (
                            <FaTimes className="text-red-500" />
                          ) : null}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                
                {!quizCompleted ? (
                  <button 
                    className={`bg-white text-green-primary rounded-button py-3 px-4 w-full font-bold transition-all duration-200 ${
                      Object.keys(selectedOptions).length === 0 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'opacity-100 hover:bg-gray-50'
                    }`}
                    onClick={submitQuiz}
                    disabled={Object.keys(selectedOptions).length === 0}
                  >
                    Valider ma réponse
                  </button>
                ) : (
                  <div className="mt-4">
                    <p className="text-white text-center mb-3 font-medium">
                      {userAnswers[currentQuiz.id]?.correct
                        ? '🎉 Bonne réponse !'
                        : '😕 Pas de chance, ce sera pour la prochaine fois !'}
                    </p>
                    <button 
                      className="bg-white text-green-primary rounded-button py-3 px-4 w-full font-bold hover:bg-gray-50 transition-colors"
                      onClick={nextQuiz}
                    >
                      Question suivante
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodiumPage;
