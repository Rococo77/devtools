import { useState } from "react";
import { motion } from "framer-motion";
import { IconCopy, IconEye, IconEyeOff, IconCheck } from "@tabler/icons-react";

interface PasswordDisplayProps {
  password: string;
  copyPassword: () => void;
  strength: number;
  strengthColor: string;
}

export default function PasswordDisplay({ password, copyPassword, strength, strengthColor }: PasswordDisplayProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyPassword();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 w-full">
      <div className="relative">
        <div className="flex items-center justify-between bg-slate-900 border border-slate-700 rounded-md p-3 mb-2">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={password}
            className={`font-mono text-lg ${showPassword ? 'text-white' : 'text-slate-300'}`}
          >
            {showPassword ? password : "•".repeat(password.length)}
          </motion.span>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-slate-800 rounded-md text-slate-400 hover:text-white transition-colors"
              aria-label="Copier le mot de passe"
            >
              {copied ? <IconCheck size={20} className="text-green-500" /> : <IconCopy size={20} />}
            </button>
          </div>
        </div>
        
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className={`h-full ${strengthColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${strength}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        <div className="flex justify-between mt-1 text-xs text-slate-400">
          <span>Faible</span>
          <span>Fort</span>
        </div>
      </div>
    </div>
  );
}