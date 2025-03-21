'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const services = [
  {
    title: "International Shipping",
    description: "Connect globally with our worldwide shipping network",
    image: "/images/international.jpg",
    gradient: "from-blue-500 to-indigo-500"
  },
  {
    title: "Express Delivery",
    description: "Same-day and next-day delivery options",
    image: "/27e8d66c924747a28615155a9bd16466.webp",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    title: "Secure Transport",
    description: "Maximum security for valuable shipments",
    image: "/52af1aba864e4c1698bbbc33f5bbbd79.webp",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Eco-Friendly Delivery",
    description: "Sustainable shipping solutions",
    image: "/11758be325784ce5a7ac54df9abc4202.webp",
    gradient: "from-emerald-500 to-green-500"
  },
  {
    title: "Warehouse Management",
    description: "State-of-the-art storage and inventory solutions",
    image: "/images/warehouse.jpg",
    gradient: "from-orange-500 to-amber-500"
  },
  {
    title: "Cold Chain Logistics",
    description: "Temperature-controlled transportation services",
    image: "/images/cold-chain.jpg",
    gradient: "from-cyan-500 to-blue-500"
  },
  {
    title: "Special Cargo Handling",
    description: "Expert handling of delicate and valuable items",
    image: "/images/special-cargo.jpg",
    gradient: "from-rose-500 to-red-500"
  }
];

export default function VerticalDrivenScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <div ref={containerRef} className="h-[400vh] relative">
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        <motion.div 
          className="flex flex-nowrap gap-8 px-[10vw]"
          style={{
            x: useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]),
            perspective: "1000px"
          }}
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 w-[500px] h-[600px] rounded-2xl overflow-hidden group"
              style={{
                rotateY: useTransform(
                  scrollYProgress,
                  [i/services.length, (i+1)/services.length],
                  [0, 30]
                ),
                z: useTransform(
                  scrollYProgress,
                  [i/services.length, (i+1)/services.length],
                  [0, -200]
                )
              }}
            >
              {/* Background Image */}
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end transform transition-transform duration-500">
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-black/50 backdrop-blur-sm p-6 rounded-xl"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-gray-200">{service.description}</p>
                </motion.div>
              </div>

              {/* Interactive Lighting Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
              </div>

              {/* Edge Highlight */}
              <div className="absolute inset-0 border border-white/10 rounded-2xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
          }}
        >
          {services.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [(i-0.1)/services.length, i/services.length, (i+0.1)/services.length],
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
