"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconCopy, IconRefresh, IconTrash } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { 
  hashMD5, 
  hashSHA1, 
  hashSHA256, 
  hashSHA512, 
  hashBcrypt 
} from "@/lib/cryptography";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [selectedHash, setSelectedHash] = useState<"md5" | "sha1" | "sha256" | "sha512" | "bcrypt">("sha256");
  const [saltRounds, setSaltRounds] = useState(10);
  const [hashOutput, setHashOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateHash = async () => {
      if (!input) {
        setHashOutput("");
        return;
      }

      setIsLoading(true);
      
      try {
        let hash = "";
        
        switch (selectedHash) {
          case "md5":
            hash = hashMD5(input);
            break;
          case "sha1":
            hash = hashSHA1(input);
            break;
          case "sha256":
            hash = hashSHA256(input);
            break;
          case "sha512":
            hash = hashSHA512(input);
            break;
          case "bcrypt":
            // Bcrypt est asynchrone
            hash = await hashBcrypt(input, saltRounds);
            break;
        }
        
        setHashOutput(hash);
      } catch (error) {
        toast.error("Erreur lors de la génération du hash");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    generateHash();
  }, [input, selectedHash, saltRounds]);

  const copyToClipboard = () => {
    if (hashOutput) {
      navigator.clipboard.writeText(hashOutput);
      toast.success("Hash copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setInput("");
    setHashOutput("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Générateur de Hash</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Texte à hasher
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-20 font-mono"
            placeholder="Entrez le texte à hasher..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Algorithme de hash
            </label>
            <select
              value={selectedHash}
              onChange={(e) => setSelectedHash(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
            >
              <option value="md5">MD5 (Non sécurisé)</option>
              <option value="sha1">SHA-1 (Non sécurisé)</option>
              <option value="sha256">SHA-256</option>
              <option value="sha512">SHA-512</option>
              <option value="bcrypt">Bcrypt (Mot de passe)</option>
            </select>
          </div>

          {selectedHash === "bcrypt" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Rounds de salage (coût)
              </label>
              <input
                type="range"
                min="4"
                max="16"
                value={saltRounds}
                onChange={(e) => setSaltRounds(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>4 (Rapide)</span>
                <span>{saltRounds}</span>
                <span>16 (Sécurisé)</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              Hash généré
            </label>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!hashOutput}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                title="Copier"
              >
                <IconCopy size={18} />
              </button>
              <button
                onClick={clearAll}
                disabled={!input}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                title="Effacer"
              >
                <IconTrash size={18} />
              </button>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={hashOutput}
              readOnly
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-20 font-mono"
              placeholder="Le hash apparaîtra ici..."
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50">
                <IconRefresh className="animate-spin text-purple-500" size={24} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}