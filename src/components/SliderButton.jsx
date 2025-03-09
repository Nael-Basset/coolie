import { useState, useRef, useEffect } from 'react';
import { FaChevronRight, FaCheck } from 'react-icons/fa';

const SliderButton = ({ onComplete, text = 'Glisser pour confirmer', completedText = 'Confirmé !' }) => {
  const [position, setPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [width, setWidth] = useState(0);
  
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      setWidth(trackRef.current.clientWidth - (thumbRef.current?.clientWidth || 0));
    }
    
    const updateWidth = () => {
      if (trackRef.current) {
        setWidth(trackRef.current.clientWidth - (thumbRef.current?.clientWidth || 0));
      }
    };
    
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMouseDown = (e) => {
    if (completed) return;
    setIsDragging(true);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || completed) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const trackRect = track.getBoundingClientRect();
    const newPosition = Math.min(Math.max(0, e.clientX - trackRect.left - thumb.clientWidth/2), width);
    setPosition(newPosition);

    // Check if slider is completed
    if (newPosition >= width * 0.9) {
      handleComplete();
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || completed) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const trackRect = track.getBoundingClientRect();
    const newPosition = Math.min(Math.max(0, e.touches[0].clientX - trackRect.left - thumb.clientWidth/2), width);
    setPosition(newPosition);

    // Check if slider is completed
    if (newPosition >= width * 0.9) {
      handleComplete();
    }
  };

  const handleMouseUp = () => {
    if (completed) return;
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);

    // Reset position if not completed
    if (position < width * 0.9) {
      setPosition(0);
    }
  };

  const handleTouchEnd = handleMouseUp;

  const handleComplete = () => {
    setPosition(width);
    setCompleted(true);
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
    setTimeout(() => {
      onComplete && onComplete();
    }, 300);
  };

  const progressPercent = (position / width) * 100;

  return (
    <div 
      className="relative h-14 bg-gray-100 rounded-full overflow-hidden select-none"
      ref={trackRef}
    >
      {/* Progress bar */}
      <div 
        className="absolute top-0 left-0 h-full bg-green-primary transition-width duration-150"
        style={{ width: `${progressPercent}%` }}
      />
      
      {/* Slider text */}
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-text-dark pointer-events-none">
        {completed ? completedText : text}
      </div>
      
      {/* Thumb */}
      <div
        ref={thumbRef}
        className="absolute top-0 h-full aspect-square rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer transition-transform duration-150 z-10"
        style={{ 
          left: position,
          transform: `translateX(0)`
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {completed ? (
          <FaCheck className="text-green-primary" />
        ) : (
          <FaChevronRight className="text-green-primary" />
        )}
      </div>
    </div>
  );
};

export default SliderButton;
