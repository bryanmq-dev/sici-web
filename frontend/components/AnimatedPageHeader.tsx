'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export default function AnimatedPageHeader({ title, description }: { title: ReactNode; description: string }) {
  return (
    <div className="text-center mb-24">
      <motion.h1
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70"
      >
        {description}
      </motion.p>
    </div>
  );
}
