"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconCode, IconCopy, IconTrash, IconBraces, IconFileText } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { formatJSON, formatSQL } from "@/lib/formatter";

type FormatType = "json" | "sql";

export default function CodeFormatter() {
  const [code, setCode] = useState("");
  const [formattedCode, setFormattedCode] = useState("");
  const [error, setError] = useState("");
  const [formatType, setFormatType] = useState<FormatType>("json");
  const [indentSize, setIndentSize] = useState(2);
  const [sqlOptions, setSqlOptions] = useState({
    uppercase: true,
    linesBetweenQueries: 1,
  });

  const formatCode = () => {
    if (!code.trim()) {
      setError("Veuillez entrer du code à formater");
      setFormattedCode("");
      return;
    }

    setError("");
    try {
      if (formatType === "json") {
        const formatted = formatJSON(code, indentSize);
        setFormattedCode(formatted);
      } else if (formatType === "sql") {
        const formatted = formatSQL(code, {
          uppercase: sqlOptions.uppercase,
          linesBetweenQueries: sqlOptions.linesBetweenQueries,
        });
        setFormattedCode(formatted);
      }
      toast.success("Code formaté avec succès");
    } catch (err) {
      setError(`Erreur lors du formatage : ${(err as Error).message}`);
      setFormattedCode("");
    }
  };

  const copyToClipboard = () => {
    if (formattedCode) {
      navigator.clipboard.writeText(formattedCode);
      toast.success("Code copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setCode("");
    setFormattedCode("");
    setError("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IconCode className="mr-2 text-green-500" size={24} />
          Formateur de Code
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFormatType("json")}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
              formatType === "json"
                ? "bg-green-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            <IconBraces size={16} className="mr-1" />
            JSON
          </button>
          <button
            onClick={() => setFormatType("sql")}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
              formatType === "sql"
                ? "bg-blue-600 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            <IconFileText size={16} className="mr-1" />
            SQL
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formatType === "json" && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Taille de l'indentation
              </label>
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white w-full"
              >
                <option value={2}>2 espaces</option>
                <option value={4}>4 espaces</option>
                <option value={8}>8 espaces</option>
              </select>
            </div>
          )}

          {formatType === "sql" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Mots-clés SQL
                </label>
                <select
                  value={sqlOptions.uppercase ? "uppercase" : "lowercase"}
                  onChange={(e) =>
                    setSqlOptions({
                      ...sqlOptions,
                      uppercase: e.target.value === "uppercase",
                    })
                  }
                  className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white w-full"
                >
                  <option value="uppercase">MAJUSCULES</option>
                  <option value="lowercase">minuscules</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Lignes entre requêtes
                </label>
                <select
                  value={sqlOptions.linesBetweenQueries}
                  onChange={(e) =>
                    setSqlOptions({
                      ...sqlOptions,
                      linesBetweenQueries: Number(e.target.value),
                    })
                  }
                  className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white w-full"
                >
                  <option value={1}>1 ligne</option>
                  <option value={2}>2 lignes</option>
                  <option value={3}>3 lignes</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Code à formater
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white font-mono h-48"
            placeholder={
              formatType === "json"
                ? '{"example": "Copiez votre JSON ici", "array": [1, 2, 3]}'
                : "SELECT * FROM users WHERE id = 1;"
            }
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={clearAll}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <IconTrash size={16} className="mr-1" />
            Effacer
          </button>
          <button
            onClick={formatCode}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
          >
            <IconCode size={16} className="mr-1" />
            Formater
          </button>
        </div>

        {error && (
          <div className="bg-red-900/40 border border-red-800 text-red-100 p-3 rounded-md">
            {error}
          </div>
        )}

        {formattedCode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Code formaté
              </label>
              <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white"
                title="Copier"
              >
                <IconCopy size={18} />
              </button>
            </div>
            <pre className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 overflow-x-auto text-green-400 font-mono h-48 whitespace-pre">
              {formattedCode}
            </pre>
          </motion.div>
        )}

        <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
          <h3 className="font-medium text-white mb-2">
            {formatType === "json" ? "À propos du formatage JSON" : "À propos du formatage SQL"}
          </h3>
          {formatType === "json" ? (
            <ul className="list-disc pl-5 space-y-1">
              <li>Le formatage JSON ajoute des sauts de ligne et des espaces pour une meilleure lisibilité.</li>
              <li>Le code JSON doit être valide pour être formaté correctement.</li>
              <li>Vous pouvez choisir la taille de l'indentation (2, 4 ou 8 espaces).</li>
              <li>Pour minifier du JSON, vous pouvez utiliser JSON.stringify() sans espaces.</li>
            </ul>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              <li>Le formatage SQL améliore la lisibilité des requêtes.</li>
              <li>Les mots-clés SQL peuvent être formatés en majuscules ou minuscules.</li>
              <li>L'outil prend en charge la plupart des dialectes SQL (MySQL, PostgreSQL, SQLite).</li>
              <li>Plusieurs requêtes peuvent être formatées en même temps.</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}