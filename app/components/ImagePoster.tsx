'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

const posters = [
  {
    image: '/has1.webp',
    title: 'Global Delivery Solutions',
    description: 'Experience seamless shipping across borders',
    stats: { value: '24/7', label: 'Support' }
  },
  {
    image: '/has1.webp',
    title: 'Express Shipping',
    description: 'Lightning-fast delivery when time matters most',
    stats: { value: '2-Day', label: 'Delivery' }
  },
  {
    image: '/has1.webp',
    title: 'Worldwide Coverage',
    description: 'Connecting businesses across continents',
    stats: { value: '200+', label: 'Countries' }
  },
  {
    image: '/images/eco-friendly.jpg',
    title: 'Eco-Friendly Shipping',
    description: 'Sustainable solutions for a better tomorrow',
    stats: { value: 'Zero', label: 'Carbon' }
  },
  {
    image: '/images/secure-delivery.jpg',
    title: 'Secure Transport',
    description: 'Your packages, our priority',
    stats: { value: '100%', label: 'Protected' }
  }
];

export default function ImagePoster() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Split animation into horizontal and vertical phases
  const horizontalScrollProgress = useTransform(
    scrollYProgress,
    [0, 0.5],
    [0, 1]
  );

  const verticalScrollProgress = useTransform(
    scrollYProgress,
    [0.5, 1],
    [0, 1]
  );

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[400vh] bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Section Title */}
        <motion.h3
          className="absolute top-8 left-1/2 transform -translate-x-1/2 text-3xl font-bold text-white z-10"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1])
          }}
        >
          Scroll to Explore Our Services
        </motion.h3>

        {/* Horizontal Scroll Phase */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{
            opacity: useTransform(verticalScrollProgress, [0, 0.2], [1, 0]),
          }}
        >
          <motion.div
            className="flex space-x-6 px-12"
            style={{
              x: useTransform(horizontalScrollProgress, [0, 1], ["0%", "-100%"]),
            }}
          >
            {posters.map((poster, i) => (
              <motion.div
                key={`horizontal-${i}`}
                className="w-[600px] h-[400px] relative flex-shrink-0"
                style={{
                  scale: useTransform(horizontalScrollProgress, 
                    [i * 0.2, i * 0.2 + 0.1, i * 0.2 + 0.2],
                    [0.8, 1, 0.8]
                  ),
                }}
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                  <Image
                    src={poster.image}
                    alt={poster.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  <motion.div
                    className="absolute bottom-0 left-0 p-8 w-full"
                    style={{
                      y: useTransform(
                        verticalScrollProgress,
                        [i * 0.15, i * 0.15 + 0.1],
                        [50, 0]
                      ),
                    }}
                  >
                    <h3 className="text-4xl font-bold text-white mb-4">
                      {poster.title}
                    </h3>
                    <p className="text-xl text-gray-200 mb-6">
                      {poster.description}
                    </p>
                    {/* Stats Badge */}
                    <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                      <span className="text-3xl font-bold text-blue-400 mr-3">
                        {poster.stats.value}
                      </span>
                      <span className="text-white">{poster.stats.label}</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Vertical Scroll Phase */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: useTransform(verticalScrollProgress, [0, 0.2], [0, 1]),
          }}
        >
          {posters.map((poster, i) => (
            <motion.div
              key={`vertical-${i}`}
              className="w-[800px] h-[500px] relative mb-8"
              style={{
                opacity: useTransform(
                  verticalScrollProgress,
                  [i * 0.15, i * 0.15 + 0.1],
                  [0, 1]
                ),
                y: useTransform(
                  verticalScrollProgress,
                  [i * 0.15, i * 0.15 + 0.1],
                  ['100vh', '0vh']
                ),
                scale: useTransform(
                  verticalScrollProgress,
                  [i * 0.15, i * 0.15 + 0.1],
                  [0.8, 1]
                ),
                rotateX: useTransform(
                  verticalScrollProgress,
                  [i * 0.15, i * 0.15 + 0.1],
                  [30, 0]
                ),
              }}
            >
              <div className="relative w-full h-full rounded-2xl overflow-hidden group">
                <Image
                  src={poster.image}
                  alt={poster.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                
                <motion.div
                  className="absolute bottom-0 left-0 p-8 w-full"
                  style={{
                    y: useTransform(
                      verticalScrollProgress,
                      [i * 0.15, i * 0.15 + 0.1],
                      [50, 0]
                    ),
                  }}
                >
                  <h3 className="text-4xl font-bold text-white mb-4">
                    {poster.title}
                  </h3>
                  <p className="text-xl text-gray-200 mb-6">
                    {poster.description}
                  </p>
                  {/* Stats Badge */}
                  <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
                    <span className="text-3xl font-bold text-blue-400 mr-3">
                      {poster.stats.value}
                    </span>
                    <span className="text-white">{poster.stats.label}</span>
                  </div>
                </motion.div>
              </div>

              {/* Parallax Shadow */}
              <motion.div
                className="absolute -bottom-4 left-[5%] right-[5%] h-[20px] bg-black/50 blur-xl rounded-full"
                style={{
                  opacity: useTransform(
                    verticalScrollProgress,
                    [i * 0.15, i * 0.15 + 0.1],
                    [0, 0.3]
                  ),
                  scale: useTransform(
                    verticalScrollProgress,
                    [i * 0.15, i * 0.15 + 0.1],
                    [0.5, 1]
                  ),
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Progress Indicator */}
        <motion.div 
          className="fixed right-8 top-1/2 transform -translate-y-1/2 flex flex-col gap-2"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          {posters.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              style={{
                scale: useTransform(
                  scrollYProgress,
                  [i * 0.15, i * 0.15 + 0.1],
                  [1, 1.5]
                ),
                opacity: useTransform(
                  scrollYProgress,
                  [i * 0.15, i * 0.15 + 0.1],
                  [0.3, 1]
                )
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
