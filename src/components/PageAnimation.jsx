'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageAnimation({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        
        transition={{
          type: 'tween',
          ease: 'easeInOut',
          duration: 0.3,
         
        }}
        className="min-h-screen mt-[64px] bg-stone-100"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}