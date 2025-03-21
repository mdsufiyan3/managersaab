'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaGoogle, FaGithub, FaYahoo } from 'react-icons/fa';
import { signInWithGoogle, signInWithGithub, signInWithYahoo } from '@/firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (provider: 'google' | 'github' | 'yahoo') => {
    try {
      setIsLoading(true);
      setError(null);
      
      let user;
      if (provider === 'google') {
        user = await signInWithGoogle();
      } else if (provider === 'github') {
        user = await signInWithGithub();
      } else if (provider === 'yahoo') {
        user = await signInWithYahoo();
      }

      if (user) {
        // After successful login, redirect to onboarding
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  const authMethods = [
    { icon: FaGoogle, color: 'hover:bg-red-500/20', text: 'Continue with Google', provider: 'google' as const },
    { icon: FaGithub, color: 'hover:bg-gray-500/20', text: 'Continue with GitHub', provider: 'github' as const },
    { icon: FaYahoo, color: 'hover:bg-purple-500/20', text: 'Continue with Yahoo', provider: 'yahoo' as const }
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Choose a service to sign in</p>
        </motion.div>

        {/* Login Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 relative overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10" />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, rgba(16,185,129,0.1) 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.1) 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </div>

          <div className="relative space-y-6">
            <p className="text-center text-gray-400 mb-6">Continue with</p>

            <div className="grid grid-cols-1 gap-4">
              {authMethods.map((social, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAuth(social.provider)}
                  disabled={isLoading}
                  className={`p-4 rounded-lg bg-white/5 ${social.color} transition-colors flex items-center justify-center gap-3 
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <social.icon className="w-5 h-5 text-white" />
                  <span className="text-white">{social.text}</span>
                </motion.button>
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center mt-4"
              >
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Background Decorative Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-blue-500/20 to-transparent"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-emerald-500/20 to-transparent"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
