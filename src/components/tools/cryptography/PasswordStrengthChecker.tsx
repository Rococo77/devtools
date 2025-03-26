"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconEye, IconEyeOff, IconShieldLock, IconAlertTriangle } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

export default function PasswordStrengthChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [estimatedCrackTime, setEstimatedCrackTime] = useState("");
  
  useEffect(() => {
    if (!password) {
      setStrength(0);
      setFeedback([]);
      setEstimatedCrackTime("");
      return;
    }
    
    // Calcul de la force du mot de passe
    let score = 0;
    const feedbackPoints: string[] = [];
    
    // Longueur (pondération élevée)
    if (password.length >= 12) {
      score += 25;
    } else if (password.length >= 8) {
      score += 15;
      feedbackPoints.push("Pour plus de sécurité, utilisez au moins 12 caractères.");
    } else {
      score += 5;
      feedbackPoints.push("Mot de passe trop court. Utilisez au moins 8 caractères.");
    }
    
    // Complexité
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    if (hasLower) score += 10;
    if (hasUpper) score += 15;
    if (hasDigit) score += 15;
    if (hasSpecial) score += 20;
    
    if (!hasLower) feedbackPoints.push("Ajoutez des lettres minuscules.");
    if (!hasUpper) feedbackPoints.push("Ajoutez des lettres majuscules.");
    if (!hasDigit) feedbackPoints.push("Ajoutez des chiffres.");
    if (!hasSpecial) feedbackPoints.push("Ajoutez des caractères spéciaux (!@#$%, etc.)");
    
    // Répétitions et séquences
    const repeats = password.match(/(.)\1{2,}/);
    const sequences = password.match(/(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i);
    
    if (repeats) {
      score -= 15;
      feedbackPoints.push("Évitez les caractères répétés (ex: aaa).");
    }
    
    if (sequences) {
      score -= 15;
      feedbackPoints.push("Évitez les séquences prévisibles (ex: abc, 123).");
    }
    
    // Mots courants ou modèles
    const commonPatterns = ["password", "123456", "qwerty", "admin", "letmein", "welcome"];
    const lowerPass = password.toLowerCase();
    
    if (commonPatterns.some(pattern => lowerPass.includes(pattern))) {
      score -= 25;
      feedbackPoints.push("Votre mot de passe contient des termes courants facilement devinables.");
    }
    
    // Normalisation du score
    score = Math.max(0, Math.min(100, score));
    setStrength(score);
    
    // Temps estimé de craquage (très approximatif)
    let crackTimeText = "";
    if (score < 20) {
      crackTimeText = "Instantané";
    } else if (score < 40) {
      crackTimeText = "Quelques minutes à quelques heures";
    } else if (score < 60) {
      crackTimeText = "Quelques jours à quelques semaines";
    } else if (score < 80) {
      crackTimeText = "Quelques mois à quelques années";
    } else {
      crackTimeText = "Plusieurs décennies ou plus";
    }
    
    setEstimatedCrackTime(crackTimeText);
    
    // Ajouter des conseils basés sur le score
    if (score > 80) {
      feedbackPoints.push("Excellent mot de passe!");
    } else if (score > 60) {
      feedbackPoints.push("Bon mot de passe, mais peut être amélioré.");
    }
    
    setFeedback(feedbackPoints);
    
  }, [password]);
  
  const getStrengthLabel = () => {
    if (strength >= 80) return "Très fort";
    if (strength >= 60) return "Fort";
    if (strength >= 40) return "Moyen";
    if (strength >= 20) return "Faible";
    return "Très faible";
  };
  
  const getStrengthColor = () => {
    if (strength >= 80) return "bg-green-500";
    if (strength >= 60) return "bg-blue-500";
    if (strength >= 40) return "bg-yellow-500";
    if (strength >= 20) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Vérificateur de force de mot de passe</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Entrez un mot de passe à analyser
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white font-mono"
              placeholder="Entrez votre mot de passe..."
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
            </button>
          </div>
        </div>
        
        {password && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium text-slate-300">Force: {getStrengthLabel()}</div>
                <div className="text-sm text-slate-400">{strength}%</div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getStrengthColor()}`}
                  style={{ width: `${strength}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-md p-4">
              <h3 className="text-md font-medium mb-2">Analyse de sécurité</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-slate-300">Caractéristiques</h4>
                  <ul className="space-y-1 text-sm">
                    <li className={`flex items-center ${password.length >= 8 ? "text-green-400" : "text-red-400"}`}>
                      <div className={`w-2 h-2 ${password.length >= 8 ? "bg-green-400" : "bg-red-400"} rounded-full mr-2`}></div>
                      Longueur: {password.length} caractères
                    </li>
                    <li className={`flex items-center ${/[a-z]/.test(password) ? "text-green-400" : "text-red-400"}`}>
                      <div className={`w-2 h-2 ${/[a-z]/.test(password) ? "bg-green-400" : "bg-red-400"} rounded-full mr-2`}></div>
                      Lettres minuscules
                    </li>
                    <li className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-400" : "text-red-400"}`}>
                      <div className={`w-2 h-2 ${/[A-Z]/.test(password) ? "bg-green-400" : "bg-red-400"} rounded-full mr-2`}></div>
                      Lettres majuscules
                    </li>
                    <li className={`flex items-center ${/\d/.test(password) ? "text-green-400" : "text-red-400"}`}>
                      <div className={`w-2 h-2 ${/\d/.test(password) ? "bg-green-400" : "bg-red-400"} rounded-full mr-2`}></div>
                      Chiffres
                    </li>
                    <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? "text-green-400" : "text-red-400"}`}>
                      <div className={`w-2 h-2 ${/[^A-Za-z0-9]/.test(password) ? "bg-green-400" : "bg-red-400"} rounded-full mr-2`}></div>
                      Caractères spéciaux
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 text-slate-300">Durée estimée pour le craquage</h4>
                  <div className="bg-slate-800 p-3 rounded-md text-sm">
                    <IconShieldLock size={16} className="inline-block mr-1 text-purple-400" />
                    {estimatedCrackTime}
                  </div>
                  
                  <h4 className="text-sm font-medium mt-4 mb-2 text-slate-300">Recommandations</h4>
                  <ul className="space-y-1 text-sm">
                    {feedback.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <IconAlertTriangle size={16} className="mr-1 mt-0.5 text-yellow-400" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
          <h3 className="font-medium text-white mb-2">À propos des mots de passe sécurisés</h3>
          <p>Un mot de passe fort doit :</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Contenir au moins 12 caractères</li>
            <li>Inclure des majuscules, minuscules, chiffres et caractères spéciaux</li>
            <li>Éviter les séquences prévisibles et mots du dictionnaire</li>
            <li>Être unique pour chaque service</li>
          </ul>
          <p className="mt-2">Conseil: Utilisez un gestionnaire de mots de passe pour générer et stocker des mots de passe complexes.</p>
        </div>
      </div>
    </div>
  );
}