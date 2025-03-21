'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || 
          target.tagName.toLowerCase() === 'a' ||
          target.closest('button') ||
          target.closest('a')) {
        setCursorVariant('hover');
      }
    };

    const handleMouseLeave = () => setCursorVariant('default');

    window.addEventListener('mousemove', mouseMove);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      opacity: 1,
    },
    hover: {
      x: mousePosition.x - 12, // Reduced from 16
      y: mousePosition.y - 12, // Reduced from 16
      height: 60, // Reduced from 80
      width: 60, // Reduced from 80
      opacity: 0.8,
      mixBlendMode: "difference" as const,
    }
  };

  const ringVariants = {
    default: {
      x: mousePosition.x - 20, // Reduced from 25
      y: mousePosition.y - 20, // Reduced from 25
      scale: 1,
      opacity: 0.2,
    },
    hover: {
      x: mousePosition.x - 20, // Reduced from 25
      y: mousePosition.y - 20, // Reduced from 25
      scale: 1.2, // Reduced from 1.5
      opacity: 0.3, // Reduced from 0.4
    }
  };

  if (!isHydrated) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 pointer-events-none z-[999] mix-blend-difference"
        animate={cursorVariant}
        variants={variants}
        transition={{
          type: "spring",
          stiffness: 1000, // Increased from 150
          damping: 30, // Increased from 15
          mass: 0.2, // Reduced from 0.5
          restDelta: 0.001 // Added for more precise movement
        }}
      >
        <div className="relative w-full h-full">
          {/* Inner circle */}
          <div className="absolute inset-0 rounded-full bg-white" />
          
          {/* Glow effect */}
          <div className="absolute inset-[-4px] rounded-full bg-white blur-[2px] opacity-50" />
        </div>
      </motion.div>

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 w-[40px] h-[40px] pointer-events-none z-[998]" // Reduced from 50px
        animate={cursorVariant}
        variants={ringVariants}
        transition={{
          type: "spring",
          stiffness: 800, // Increased from 150
          damping: 35, // Increased from 15
          mass: 0.4, // Reduced from 0.8
          restDelta: 0.001 // Added for more precise movement
        }}
      >
        <div className="relative w-full h-full">
          {/* Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white opacity-50" />
          
          {/* Trailing effect */}
          <motion.div
            className="absolute inset-0 rounded-full border border-white"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        
        /* Add magnetic effect for interactive elements */
        a, button {
          transition: transform 0.2s ease;
        }
        
        a:hover, button:hover {
          transform: scale(1.05);
        }
        
        /* Disable cursor styles for touch devices */
        @media (hover: none) and (pointer: coarse) {
          * {
            cursor: auto !important;
          }
          .cursor-custom {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
