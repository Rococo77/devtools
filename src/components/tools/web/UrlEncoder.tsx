"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowsExchange, IconCopy, IconTrash } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { encodeURL, decodeURL } from "@/lib/web";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (input) {
      try {
        if (mode === "encode") {
          setOutput(encodeURL(input));
        } else {
          setOutput(decodeURL(input));
        }
      } catch (error) {
        setOutput("Erreur de décodage");
      }
    } else {
      setOutput("");
    }
  }, [input, mode]);

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    // Swap input and output when changing modes for better user experience
    if (input) {
      setInput(output);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {mode === "encode" ? "Encodeur" : "Décodeur"} URL
        </h2>
        <button
          onClick={toggleMode}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
        >
          <IconArrowsExchange size={16} className="mr-2" />
          {mode === "encode" ? "Passer au décodage" : "Passer à l'encodage"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode === "encode" ? "Texte à encoder" : "URL à décoder"}
            </label>
            <button
              onClick={clearAll}
              className="text-slate-400 hover:text-white"
              title="Effacer"
            >
              <IconTrash size={16} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "encode"
                ? "Entrez du texte à encoder..."
                : "Entrez une URL à décoder..."
            }
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-40 font-mono"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode === "encode" ? "URL encodée" : "Texte décodé"}
            </label>
            <button
              onClick={copyToClipboard}
              className="text-slate-400 hover:text-white"
              title="Copier"
              disabled={!output}
            >
              <IconCopy size={16} />
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-40 font-mono"
            placeholder="Résultat..."
          />
        </div>
      </div>

      <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
        <h3 className="font-medium text-white mb-2">À propos de l'encodage URL</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>L'encodage URL remplace les caractères spéciaux par des codes de pourcentage.</li>
          <li>Les caractères comme l'espace sont remplacés par %20.</li>
          <li>Utile pour inclure des caractères spéciaux dans les URLs.</li>
          <li>Le décodage URL convertit ces codes en caractères normaux.</li>
        </ul>
      </div>
    </div>
  );
}