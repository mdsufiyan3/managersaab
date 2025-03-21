'use client';

import { motion, useMotionValue, useSpring, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';

const bubbles = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  size: Math.random() * 100 + 50,
  duration: Math.random() * 15 + 10,
  delay: Math.random() * 5,
  initialX: Math.random() * 100,
  initialY: Math.random() * 100,
}));

const colors = [
  'from-blue-500/20 to-cyan-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-emerald-500/20 to-green-500/20',
  'from-orange-500/20 to-amber-500/20',
  'from-indigo-500/20 to-violet-500/20'
];

export default function Bubbles() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const unsubscribeScroll = scrollY.onChange(latest => {
      setScrollPosition(latest);
    });

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      unsubscribeScroll();
    };
  }, [cursorX, cursorY, scrollY]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <BubbleElement
          key={bubble.id}
          bubble={bubble}
          mousePosition={mousePosition}
          scrollPosition={scrollPosition}
          color={colors[bubble.id % colors.length]}
        />
      ))}
    </div>
  );
}

interface BubbleProps {
  bubble: {
    id: number;
    size: number;
    duration: number;
    delay: number;
    initialX: number;
    initialY: number;
  };
  mousePosition: { x: number; y: number };
  scrollPosition: number;
  color: string;
}

function BubbleElement({ bubble, mousePosition, scrollPosition, color }: BubbleProps) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  const [isNearMouse, setIsNearMouse] = useState(false);

  // Create smooth spring animations
  const x = useSpring(0, {
    stiffness: 100,
    damping: 30
  });
  const y = useSpring(0, {
    stiffness: 100,
    damping: 30
  });

  // Add scroll-based movement
  const scrollOffset = useSpring(0, {
    stiffness: 50,  // Lower stiffness for smoother scroll movement
    damping: 20
  });

  useEffect(() => {
    if (!ref) return;

    const checkMouseProximity = () => {
      const rect = ref.getBoundingClientRect();
      const bubbleX = rect.left + rect.width / 2;
      const bubbleY = rect.top + rect.height / 2;
      
      const distance = Math.hypot(
        mousePosition.x - bubbleX,
        mousePosition.y - bubbleY
      );

      const isNear = distance < 200;
      setIsNearMouse(isNear);

      if (isNear) {
        const angle = Math.atan2(bubbleY - mousePosition.y, bubbleX - mousePosition.x);
        const force = (200 - distance) * 0.5;
        
        x.set(Math.cos(angle) * force);
        y.set(Math.sin(angle) * force);
      } else {
        x.set(0);
        y.set(0);
      }

      // Add scroll-based movement
      const scrollEffect = (Math.sin(scrollPosition * 0.003 + bubble.id) * 30) + 
                         (Math.cos(scrollPosition * 0.005 + bubble.id) * 20);
      scrollOffset.set(scrollEffect);
    };

    const animationFrame = requestAnimationFrame(checkMouseProximity);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePosition, ref, x, y, scrollPosition, bubble.id, scrollOffset]);

  return (
    <motion.div
      ref={setRef}
      className={`absolute rounded-full bg-gradient-to-br ${color} backdrop-blur-sm transition-opacity duration-300`}
      style={{
        width: bubble.size,
        height: bubble.size,
        left: `${bubble.initialX}%`,
        top: `${bubble.initialY}%`,
        x: x,
        y: y,
        translateX: scrollOffset,  // Add horizontal scroll-based movement
        translateY: scrollOffset,  // Add vertical scroll-based movement
        filter: isNearMouse ? 'brightness(1.2)' : 'brightness(1)',
      }}
      animate={{
        scale: isNearMouse ? 1.1 : 1,
        opacity: isNearMouse ? 0.8 : 0.2,
        rotate: scrollPosition * 0.05, // Add subtle rotation based on scroll
      }}
      transition={{
        scale: {
          type: "spring",
          stiffness: 300,
          damping: 20
        },
        opacity: {
          duration: 0.2
        },
        rotate: {
          type: "spring",
          stiffness: 50,
          damping: 15
        }
      }}
      initial={false}
    >
      <div
        className={`absolute inset-0 rounded-full transition-opacity duration-300 ${
          isNearMouse ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
        }}
      />
    </motion.div>
  );
}
