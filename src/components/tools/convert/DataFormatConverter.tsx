"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconArrowsExchange, IconCopy, IconTrash } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { 
  jsonToYaml,
  yamlToJson,
  jsonToToml,
  tomlToJson
} from "@/lib/converters";

type ConversionMode = "json2yaml" | "yaml2json" | "json2toml" | "toml2json";

export default function DataFormatConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("json2yaml");
  const [error, setError] = useState("");

  const handleConversion = () => {
    if (!input) {
      toast.error("Veuillez entrer du contenu à convertir");
      return;
    }

    setError("");
    
    try {
      let result = "";
      switch (mode) {
        case "json2yaml":
          result = jsonToYaml(input);
          break;
        case "yaml2json":
          result = yamlToJson(input);
          break;
        case "json2toml":
          result = jsonToToml(input);
          break;
        case "toml2json":
          result = tomlToJson(input);
          break;
      }
      setOutput(result);
      toast.success("Conversion réussie");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        toast.error("Erreur de conversion");
      }
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success("Résultat copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
        <h2 className="text-xl font-bold">Convertisseur de Format de Données</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as ConversionMode)}
            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-sm text-white"
          >
            <option value="json2yaml">JSON → YAML</option>
            <option value="yaml2json">YAML → JSON</option>
            <option value="json2toml">JSON → TOML</option>
            <option value="toml2json">TOML → JSON</option>
          </select>
          <button
            onClick={handleConversion}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <IconArrowsExchange size={16} className="mr-1" />
            Convertir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode.startsWith("json") ? "JSON" : mode.startsWith("yaml") ? "YAML" : "TOML"}
            </label>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`w-full bg-slate-900 border rounded-md p-3 text-white h-96 font-mono ${
              error ? "border-red-500" : "border-slate-700"
            }`}
            placeholder={`Entrez du ${mode.startsWith("json") ? "JSON" : mode.startsWith("yaml") ? "YAML" : "TOML"}...`}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-slate-300">
              {mode.endsWith("yaml") ? "YAML" : mode.endsWith("json") ? "JSON" : "TOML"}
            </label>
            <div className="flex space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                title="Copier"
              >
                <IconCopy size={18} />
              </button>
              <button
                onClick={clearAll}
                disabled={!input && !output}
                className="text-slate-400 hover:text-white disabled:opacity-50"
                title="Effacer"
              >
                <IconTrash size={18} />
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-96 font-mono"
            placeholder="Le résultat apparaîtra ici..."
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
      </div>
    </div>
  );
}