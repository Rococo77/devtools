"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowsExchange, IconCopy, IconTrash, IconEyeOff, IconEye } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { encryptAES, decryptAES } from "@/lib/cryptography";

export default function AesEncryption() {
  const [originalText, setOriginalText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleConversion = () => {
    if (!originalText) {
      toast.error("Veuillez entrer du texte à traiter");
      return;
    }
    
    if (!passphrase) {
      toast.error("Veuillez entrer une phrase secrète");
      return;
    }
    
    try {
      setErrorMsg("");
      if (mode === "encrypt") {
        const encrypted = encryptAES(originalText, passphrase);
        setConvertedText(encrypted);
      } else {
        const decrypted = decryptAES(originalText, passphrase);
        if (!decrypted) {
          setErrorMsg("Impossible de déchiffrer le texte. Vérifiez la phrase secrète.");
          setConvertedText("");
        } else {
          setConvertedText(decrypted);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Une erreur est survenue");
      }
      setConvertedText("");
    }
  };

  useEffect(() => {
    // Reset error message when input changes
    setErrorMsg("");
  }, [originalText, passphrase, mode]);

  const copyToClipboard = () => {
    if (convertedText) {
      navigator.clipboard.writeText(convertedText);
      toast.success("Texte copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setOriginalText("");
    setConvertedText("");
    setErrorMsg("");
  };

  const toggleMode = () => {
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
    setOriginalText("");
    setConvertedText("");
    setErrorMsg("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chiffrement AES {mode === "encrypt" ? "(Chiffrer)" : "(Déchiffrer)"}</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleMode}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <IconArrowsExchange size={16} className="mr-1" />
            {mode === "encrypt" ? "Passer au déchiffrement" : "Passer au chiffrement"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            {mode === "encrypt" ? "Texte à chiffrer" : "Texte à déchiffrer"}
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-32 font-mono"
            placeholder={mode === "encrypt" ? "Entrez le texte à chiffrer..." : "Entrez le texte chiffré à déchiffrer..."}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Phrase secrète
          </label>
          <div className="relative">
            <input
              type={showPassphrase ? "text" : "password"}
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white font-mono pr-10"
              placeholder="Entrez votre phrase secrète..."
            />
            <button
              type="button"
              onClick={() => setShowPassphrase(!showPassphrase)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassphrase ? <IconEyeOff size={18} /> : <IconEye size={18} />}
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cette phrase est utilisée comme clé de chiffrement. Gardez-la secrète et ne la perdez pas.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleConversion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            {mode === "encrypt" ? "Chiffrer" : "Déchiffrer"}
          </button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode === "encrypt" ? "Résultat chiffré" : "Résultat déchiffré"}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!convertedText}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                title="Copier"
              >
                <IconCopy size={18} />
              </button>
              <button
                onClick={clearAll}
                disabled={!originalText}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                title="Effacer"
              >
                <IconTrash size={18} />
              </button>
            </div>
          </div>
          <textarea
            value={convertedText}
            readOnly
            className={`w-full bg-slate-900 border rounded-md p-3 text-white h-32 font-mono ${
              errorMsg ? "border-red-500" : "border-slate-700"
            }`}
            placeholder="Résultat..."
          />
          {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
        </div>
      </div>
    </div>
  );
}