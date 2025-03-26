"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconCopy, IconRefresh } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

interface BaseOption {
  id: number;
  name: string;
  prefix: string;
  regex: RegExp;
}

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [inputBase, setInputBase] = useState<number>(10);
  const [results, setResults] = useState<{base: number, value: string}[]>([]);
  const [error, setError] = useState("");

  const baseOptions: BaseOption[] = [
    { id: 2, name: "Binaire", prefix: "0b", regex: /^[01]+$/ },
    { id: 8, name: "Octal", prefix: "0o", regex: /^[0-7]+$/ },
    { id: 10, name: "Décimal", prefix: "", regex: /^[0-9]+$/ },
    { id: 16, name: "Hexadécimal", prefix: "0x", regex: /^[0-9A-Fa-f]+$/ }
  ];

  const outputBases = [2, 8, 10, 16, 32, 36];

  useEffect(() => {
    convertNumber();
  }, [input, inputBase]);

  const convertNumber = () => {
    if (!input) {
      setResults([]);
      setError("");
      return;
    }

    // Validation de l'entrée selon la base
    const currentBaseOption = baseOptions.find(opt => opt.id === inputBase);
    if (!currentBaseOption?.regex.test(input)) {
      setError(`Entrée invalide pour la base ${inputBase}`);
      setResults([]);
      return;
    }

    try {
      // Conversion de l'entrée en nombre décimal
      const decimalValue = parseInt(input, inputBase);
      
      if (isNaN(decimalValue)) {
        setError("Conversion impossible");
        setResults([]);
        return;
      }

      // Conversion du nombre en différentes bases
      const newResults = outputBases.map(base => ({
        base,
        value: decimalValue.toString(base).toUpperCase()
      }));
      
      setResults(newResults);
      setError("");
    } catch (err) {
      setError("Erreur de conversion");
      setResults([]);
    }
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Copié dans le presse-papiers");
  };

  const clearAll = () => {
    setInput("");
    setResults([]);
    setError("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Convertisseur de Bases Numériques</h2>
        <button
          onClick={clearAll}
          disabled={!input}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
        >
          <IconRefresh size={16} className="mr-1" />
          Réinitialiser
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre à convertir
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full bg-slate-900 border rounded-md p-2 text-white ${
                error ? "border-red-500" : "border-slate-700"
              }`}
              placeholder="Entrez un nombre..."
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Base d'entrée
            </label>
            <select
              value={inputBase}
              onChange={(e) => setInputBase(parseInt(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
            >
              {baseOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name} (base {option.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <h3 className="text-md font-semibold mb-3">Résultats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((result) => (
                <div
                  key={result.base}
                  className="bg-slate-700 rounded-md p-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-sm font-medium text-slate-300">
                      Base {result.base}
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.value)}
                      className="text-slate-400 hover:text-white"
                      title="Copier"
                    >
                      <IconCopy size={16} />
                    </button>
                  </div>
                  <div className="font-mono text-sm bg-slate-800 p-2 rounded overflow-x-auto">
                    {result.base === 16 && "0x"}
                    {result.base === 2 && "0b"}
                    {result.base === 8 && "0o"}
                    {result.value}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="bg-slate-700/30 p-4 rounded-md text-sm text-slate-300 mt-4">
          <h3 className="font-medium text-white mb-2">À propos des bases numériques</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="text-white">Base 2 (Binaire)</span> : Utilise uniquement 0 et 1, utilisé en informatique</li>
            <li><span className="text-white">Base 8 (Octal)</span> : Utilise les chiffres 0-7, ancien système pour les permissions Unix</li>
            <li><span className="text-white">Base 10 (Décimal)</span> : Système standard à 10 chiffres (0-9)</li>
            <li><span className="text-white">Base 16 (Hexadécimal)</span> : Utilise 0-9 et A-F, couramment utilisé en programmation</li>
            <li><span className="text-white">Base 32</span> : Utilise les lettres A-Z et les chiffres 2-7</li>
            <li><span className="text-white">Base 36</span> : Utilise 0-9 et A-Z, permet les identifiants courts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}