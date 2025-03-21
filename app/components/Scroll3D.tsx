'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const cards = [
  {
    title: "International Shipping",
    description: "Ship worldwide with confidence",
    image: "public/27e8d66c924747a28615155a9bd16466.webp",
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Express Delivery",
    description: "Next-day delivery service",
    image: "/27e8d66c924747a28615155a9bd16466.webp",
    color: "from-emerald-500 to-blue-500"
  },
  {
    title: "Secure Transport",
    description: "Your items, our responsibility",
    image: "/images/secure-delivery.jpg",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Eco-Friendly",
    description: "Sustainable shipping solutions",
    image: "/images/eco-friendly.jpg",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "Track & Trace",
    description: "Real-time package tracking",
    image: "/images/tracking.jpg",
    color: "from-orange-500 to-red-500"
  }
];

export default function Scroll3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div className="h-[400vh] relative bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900" ref={containerRef}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div 
          className="flex items-center h-full relative"
          style={{
            perspective: "1000px",
            perspectiveOrigin: "center"
          }}
        >
          <motion.div
            className="flex space-x-6 px-12 absolute"
            style={{
              x: useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]),
              rotateY: useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20])
            }}
          >
            {cards.map((card, i) => (
              <motion.div
                key={i}
                className="w-[500px] h-[600px] relative flex-shrink-0"
                style={{
                  rotateY: useTransform(
                    scrollYProgress,
                    [0, 1],
                    [i * 5 - 10, i * -5 + 10]
                  ),
                  z: useTransform(
                    scrollYProgress,
                    [0, 0.5, 1],
                    [i * 50, 0, -i * 50]
                  )
                }}
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden group">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-50`} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <motion.h3
                      className="text-3xl font-bold mb-2"
                      style={{
                        rotateY: useTransform(
                          scrollYProgress,
                          [0, 1],
                          [-i * 5, i * 5]
                        )
                      }}
                    >
                      {card.title}
                    </motion.h3>
                    <p className="text-lg opacity-90">{card.description}</p>
                  </div>
                </div>

                {/* 3D lighting effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Edge highlight */}
                <div className="absolute inset-0 rounded-2xl border border-white/10" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Progress Indicator */}
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          {cards.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [i * 0.25, i * 0.25 + 0.1, i * 0.25 + 0.2],
                  [0.3, 1, 0.3]
                )
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
