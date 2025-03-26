import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconCrown, IconX } from '@tabler/icons-react';

export default function PremiumBanner() {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg p-4 relative mb-6"
    >
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-yellow-900 hover:text-yellow-950"
        aria-label="Fermer"
      >
        <IconX size={18} />
      </button>
      
      <div className="flex items-center">
        <IconCrown size={24} className="text-yellow-900 mr-2" />
        <h3 className="font-bold text-yellow-900">Version Premium</h3>
      </div>
      
      <p className="text-sm text-yellow-900 mt-2">
        Passez à la version premium pour des outils avancés, des fonctionnalités supplémentaires et une expérience sans publicité.
      </p>
      
      <button 
        className="mt-3 bg-yellow-900 text-yellow-100 px-4 py-1.5 rounded-md text-sm font-medium hover:bg-yellow-950 transition-colors"
      >
        Débloquer Premium - 3,99€
      </button>
    </motion.div>
  );
}