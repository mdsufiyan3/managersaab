'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const gallery = [
  {
    title: "Global Network",
    description: "Connecting businesses worldwide",
    image: "/27e8d66c924747a28615155a9bd16466.webp"
  },
  {
    title: "Smart Solutions",
    description: "AI-powered logistics",
    image: "/52af1aba864e4c1698bbbc33f5bbbd79.webp"
  },
  {
    title: "Fast Delivery",
    description: "Express shipping services",
    image: "/11758be325784ce5a7ac54df9abc4202.webp"
  },
  {
    title: "Secure Transport",
    description: "Safe and reliable delivery",
    image: "/20f2cb7fc8af471a9a1abd18dd6a3371.webp"
  },
  {
    title: "Modern Fleet",
    description: "State-of-the-art vehicles",
    image: "/27e8d66c924747a28615155a9bd16466.webp"
  },
  {
    title: "24/7 Support",
    description: "Always here to help",
    image: "/52af1aba864e4c1698bbbc33f5bbbd79.webp"
  }
];

export default function HorizontalScrollGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="h-[1000vh] relative"> {/* Reduced height */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {gallery.map((item, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 w-full h-full"
            style={{
              x: useTransform(
                scrollYProgress,
                [
                  i * 0.15,           // Start entering (reduced from 0.18)
                  i * 0.15 + 0.03,    // Reach center (reduced from 0.06)
                  i * 0.15 + 0.12,    // Start leaving (same)
                  i * 0.15 + 0.15     // Complete exit (reduced from 0.18)
                ],
                ["-100%", "0%", "0%", "100%"]
              ),
              opacity: useTransform(
                scrollYProgress,
                [
                  i * 0.15,           // Start fade in
                  i * 0.15 + 0.03,    // Fully visible
                  i * 0.15 + 0.12,    // Stay visible
                  i * 0.15 + 0.15     // Fade out
                ],
                [0, 1, 1, 0]
              ),
              scale: useTransform(
                scrollYProgress,
                [
                  i * 0.15,
                  i * 0.15 + 0.03,
                  i * 0.15 + 0.12,
                  i * 0.15 + 0.15
                ],
                [0.95, 1, 1, 0.95]
              ),
              zIndex: gallery.length - i
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[90vw] h-[80vh] max-w-[1400px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded-2xl transition-transform duration-4000" // Increased duration
                  priority
                />

                <div className="absolute inset-0 bg-black/30 rounded-2xl" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="max-w-4xl w-full mx-auto p-8"
                  >
                    <div className="bg-black/50 backdrop-blur-md p-8 rounded-2xl">
                      <h3 className="text-5xl font-bold text-white mb-4">{item.title}</h3>
                      <p className="text-gray-200 text-xl">{item.description}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Progress indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-[60]"> {/* Reduced gap */}
          {gallery.map((_, index) => (
            <motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-white" // Reduced size
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [
                    index * 0.15,
                    index * 0.15 + 0.075,
                    index * 0.15 + 0.15
                  ],
                  [0.3, 1, 0.3]
                )
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
