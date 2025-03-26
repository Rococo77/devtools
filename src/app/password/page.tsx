"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { IconRefresh, IconLock, IconShieldLock } from "@tabler/icons-react";
import InputRange from "@/components/InputRange";
import Checkbox from "@/components/Checkbox";
import PasswordDisplay from "@/components/PasswordDisplay";
import AdBanner from "@/components/AdBanner";

import { useWindowWidth } from '@react-hook/window-size';
import { generatePassword, calculatePasswordStrength } from "@/lib/password";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    // Génère automatiquement un mot de passe au chargement
    handleGeneratePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Recalcule la force du mot de passe à chaque changement
    if (password) {
      const strength = calculatePasswordStrength(password);
      setPasswordStrength(strength);
    }
  }, [password]);

  const handleGeneratePassword = () => {
    try {
      const options = { 
        length, 
        includeLowercase, 
        includeUppercase, 
        includeNumbers, 
        includeSymbols 
      };
      
      const newPassword = generatePassword(options);
      setPassword(newPassword);
      toast.success("Nouveau mot de passe généré !");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  const copyPassword = () => {
    if (!password) {
      toast.error("Aucun mot de passe à copier");
      return;
    }
    navigator.clipboard.writeText(password);
    toast.success("Mot de passe copié dans le presse-papiers!");
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-red-500";
    if (passwordStrength < 60) return "bg-yellow-500";
    if (passwordStrength < 80) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="flex flex-col items-center">
      <Toaster position="top-right" />
      
      {/* Bannière publicitaire en haut - format horizontal */}
      {windowWidth > 768 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-3xl mb-6"
        >
          <AdBanner adSlot="1234567890" format="horizontal" />
        </motion.div>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center"
      >
        <IconShieldLock size={40} className="text-purple-500 mr-3" />
        <h1 className="text-4xl font-bold text-white text-glow">
          Générateur de mot de passe
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="password-container glow"
      >
        {password && <PasswordDisplay password={password} copyPassword={copyPassword} strength={passwordStrength} strengthColor={getStrengthColor()} />}
        
        <div className="mt-6">
          <InputRange length={length} setLength={setLength} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
          <Checkbox 
            label="Minuscules (a-z)" 
            checked={includeLowercase} 
            onChange={() => setIncludeLowercase(!includeLowercase)} 
          />
          <Checkbox 
            label="Majuscules (A-Z)" 
            checked={includeUppercase} 
            onChange={() => setIncludeUppercase(!includeUppercase)} 
          />
          <Checkbox 
            label="Chiffres (0-9)" 
            checked={includeNumbers} 
            onChange={() => setIncludeNumbers(!includeNumbers)} 
          />
          <Checkbox 
            label="Symboles (@#$%)" 
            checked={includeSymbols} 
            onChange={() => setIncludeSymbols(!includeSymbols)} 
          />
        </div>
        
        <div className="flex justify-center mt-6">
          <motion.button 
            onClick={handleGeneratePassword} 
            className="btn-primary flex items-center justify-center"
            whileTap={{ scale: 0.95 }}
          >
            <IconRefresh size={20} className="mr-2" />
            Générer un nouveau mot de passe
          </motion.button>
        </div>
      </motion.div>
      
      {/* Bannière publicitaire rectangulaire */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 w-full max-w-md"
      >
        <AdBanner adSlot="0987654321" format="rectangle" />
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-slate-400 mt-8 text-center text-sm"
      >
        Vos mots de passe sont générés localement et ne sont jamais stockés ni transmis
        <br />
        <IconLock size={16} className="inline mr-1" /> Sécurisé et confidentiel
      </motion.p>
    </div>
  );
}