import { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Réduire la durée d'affichage de 3s à 1.5s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-primary' : 
                 type === 'error' ? 'bg-red-500' : 
                 'bg-orange-secondary';

  return (
    <div className={`fixed bottom-16 left-1/2 transform -translate-x-1/2 ${bgColor} text-white px-3 py-1.5 rounded-lg shadow-lg transition-opacity duration-300 z-50 ${visible ? 'opacity-100' : 'opacity-0'} text-sm max-w-[85%] truncate text-center`}>
      {message}
    </div>
  );
};

export default Toast;
