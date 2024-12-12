import React, { useState, useEffect } from 'react';

const AnimatedCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const animate = () => {
      // Create a figure-8 pattern
      const time = Date.now() / 1000;
      const x = Math.sin(time) * 100 + 150; // Adjust multiplier to change width
      const y = Math.sin(time * 2) * 50 + 50; // Adjust multiplier to change height
      
      setPosition({ x, y });
    };

    const animationFrame = setInterval(animate, 16); // ~60fps

    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="relative h-64 w-full max-w-lg mx-auto overflow-hidden">
      <h1 className="text-4xl font-bold text-center mt-8">
        Hover Area
      </h1>
      
      <div 
        className="absolute pointer-events-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* Cursor circle */}
        <div className="relative">
          <div className="w-4 h-4 bg-blue-500 rounded-full opacity-50" />
          
          {/* Label */}
          <div className="absolute left-5 top-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Guest User
          </div>
          
          {/* Cursor icon */}
          <div 
            className="absolute -left-1 -top-1 border-solid border-l-[6px] border-t-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-t-transparent border-r-transparent border-b-blue-500 transform -rotate-45"
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedCursor;