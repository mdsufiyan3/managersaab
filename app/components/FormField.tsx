'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  maxLength?: number;
  prefix?: string;
  disabled?: boolean;
  note?: string;
}

export default function FormField({ 
  label, 
  type, 
  value, 
  onChange, 
  icon, 
  prefix, 
  maxLength,
  disabled,
  note 
}: FormFieldProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <label className="block text-gray-400 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {prefix}
          </div>
        )}
        {icon && !prefix && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white 
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:border-transparent transition-all ${prefix ? 'pl-16' : icon ? 'pl-12' : ''}
                     ${disabled ? 'opacity-75 cursor-not-allowed' : ''}`}
          placeholder={`Enter your ${label.toLowerCase()}`}
          maxLength={maxLength}
        />
        {note && (
          <p className="mt-1 text-sm text-blue-400 italic">
            {note}
          </p>
        )}
      </div>
    </motion.div>
  );
}
