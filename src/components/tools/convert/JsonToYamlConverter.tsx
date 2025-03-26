"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconArrowsExchange, IconCopy, IconTrash, IconFileCode } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import * as yaml from 'js-yaml';

type ConversionMode = "json-to-yaml" | "yaml-to-json";

export default function JsonYamlConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("json-to-yaml");
  const [error, setError] = useState("");
  const [jsonSpaces, setJsonSpaces] = useState(2);

  useEffect(() => {
    if (input) {
      convertData();
    } else {
      setOutput("");
      setError("");
    }
  }, [input, mode, jsonSpaces]);

  const convertData = () => {
    if (!input) return;
    
    setError("");
    
    try {
      if (mode === "json-to-yaml") {
        // Parse JSON and convert to YAML
        const jsonObj = JSON.parse(input);
        const yamlStr = yaml.dump(jsonObj, {
          indent: 2,
          lineWidth: -1 // No line wrapping
        });
        setOutput(yamlStr);
      } else {
        // Parse YAML and convert to JSON
        const yamlObj = yaml.load(input);
        const jsonStr = JSON.stringify(yamlObj, null, jsonSpaces);
        setOutput(jsonStr);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(`Erreur: ${err.message}`);
      } else {
        setError("Une erreur inconnue s'est produite");
      }
      setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Texte copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const toggleMode = () => {
    setMode(mode === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml");
    // Swap input/output when toggling if we have output
    if (output && !error) {
      setInput(output);
      setOutput("");
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <IconFileCode size={24} className="text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">
            Convertisseur {mode === "json-to-yaml" ? "JSON → YAML" : "YAML → JSON"}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {mode === "yaml-to-json" && (
            <div className="flex items-center">
              <label className="text-sm text-slate-400 mr-2">Indentation</label>
              <select
                value={jsonSpaces}
                onChange={(e) => setJsonSpaces(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white"
              >
                <option value="0">Minifié</option>
                <option value="2">2 espaces</option>
                <option value="4">4 espaces</option>
                <option value="8">8 espaces</option>
              </select>
            </div>
          )}
          
          <button
            onClick={toggleMode}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <IconArrowsExchange size={16} className="mr-1" />
            Inverser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode === "json-to-yaml" ? "JSON" : "YAML"}
            </label>
            <button
              onClick={clearAll}
              disabled={!input}
              className="text-slate-400 hover:text-white disabled:opacity-50"
              title="Effacer"
            >
              <IconTrash size={18} />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full bg-slate-900 border rounded-md p-3 text-white h-[400px] font-mono ${
              error ? "border-red-500" : "border-slate-700"
            }`}
            placeholder={
              mode === "json-to-yaml" 
                ? `{\n  "exemple": "Copiez votre JSON ici",\n  "array": [1, 2, 3],\n  "nested": {\n    "value": true\n  }\n}`
                : `# Copiez votre YAML ici\nexemple: Voici un exemple\narray:\n  - 1\n  - 2\n  - 3\nnested:\n  value: true`
            }
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode === "json-to-yaml" ? "YAML" : "JSON"}
            </label>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="text-slate-400 hover:text-white disabled:opacity-50"
              title="Copier"
            >
              <IconCopy size={18} />
            </button>
          </div>
          
          {error ? (
            <div className="w-full bg-red-900/30 border border-red-700 rounded-md p-3 text-red-300 h-[400px] overflow-auto text-sm">
              {error}
            </div>
          ) : (
            <textarea
              value={output}
              readOnly
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-[400px] font-mono"
              placeholder="Résultat..."
            />
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <h3 className="font-semibold">À propos de JSON et YAML</h3>
        <ul className="mt-2 space-y-1 list-disc pl-5">
          <li><span className="text-slate-300">JSON</span> (JavaScript Object Notation) est un format léger d'échange de données.</li>
          <li><span className="text-slate-300">YAML</span> (YAML Ain't Markup Language) est un standard de sérialisation de données lisible par les humains.</li>
          <li>YAML est souvent utilisé pour les fichiers de configuration, tandis que JSON est plus utilisé pour l'API REST.</li>
          <li>YAML supporte les commentaires, contrairement à JSON.</li>
        </ul>
      </div>
    </div>
  );
}