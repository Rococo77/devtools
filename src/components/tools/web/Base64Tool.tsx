"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowsExchange, IconCopy, IconTrash } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { encodeBase64, decodeBase64 } from "@/lib/web";

export default function Base64Tool() {
  const [originalText, setOriginalText] = useState("");
  const [convertedText, setConvertedText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  useEffect(() => {
    if (originalText) {
      try {
        if (mode === "encode") {
          setConvertedText(encodeBase64(originalText));
        } else {
          setConvertedText(decodeBase64(originalText));
        }
      } catch (error) {
        setConvertedText("Erreur de conversion");
      }
    } else {
      setConvertedText("");
    }
  }, [originalText, mode]);

  const copyToClipboard = () => {
    if (convertedText) {
      navigator.clipboard.writeText(convertedText);
      toast.success("Texte copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setOriginalText("");
    setConvertedText("");
  };

  const toggleMode = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    // Swap the contents when toggling
    if (convertedText && convertedText !== "Erreur de conversion") {
      setOriginalText(convertedText);
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Base64 {mode === "encode" ? "Encoder" : "Decoder"}</h2>
        <div className="flex space-x-2">
          <button
            onClick={toggleMode}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <IconArrowsExchange size={16} className="mr-1" />
            {mode === "encode" ? "Passer au décodage" : "Passer à l'encodage"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            {mode === "encode" ? "Texte à encoder" : "Texte à décoder"}
          </label>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-40 font-mono"
            placeholder={mode === "encode" ? "Entrez le texte à encoder en Base64..." : "Entrez le texte Base64 à décoder..."}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode === "encode" ? "Résultat encodé" : "Résultat décodé"}
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
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-40 font-mono"
            placeholder="Résultat..."
          />
        </div>
      </div>
    </div>
  );
}