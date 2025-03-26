"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconCalendar, IconCopy, IconRefresh } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { format, fromUnixTime, getUnixTime, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type DateFormat = "iso" | "unix" | "human" | "custom";

interface FormatOption {
  id: DateFormat;
  label: string;
  description: string;
}

export default function DateConverter() {
  const [inputDate, setInputDate] = useState("");
  const [inputFormat, setInputFormat] = useState<DateFormat>("human");
  const [outputFormat, setOutputFormat] = useState<DateFormat>("unix");
  const [customFormat, setCustomFormat] = useState("dd/MM/yyyy HH:mm:ss");
  const [convertedDate, setConvertedDate] = useState<string>("");
  const [error, setError] = useState("");
  
  const formatOptions: FormatOption[] = [
    { id: "human", label: "Date lisible", description: "Format de date standard" },
    { id: "unix", label: "Timestamp Unix", description: "Nombre de secondes depuis 1970" },
    { id: "iso", label: "ISO 8601", description: "Format international standard" },
    { id: "custom", label: "Format personnalisé", description: "Définir un format spécifique" }
  ];

  useEffect(() => {
    // Initialement, on remplit avec la date actuelle
    if (!inputDate) {
      if (inputFormat === "human") {
        setInputDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
      } else if (inputFormat === "unix") {
        setInputDate(String(getUnixTime(new Date())));
      } else if (inputFormat === "iso") {
        setInputDate(new Date().toISOString());
      } else {
        setInputDate(format(new Date(), customFormat));
      }
    }
  }, [inputFormat, customFormat, inputDate]);

  useEffect(() => {
    convertDate();
  }, [inputDate, inputFormat, outputFormat, customFormat]);

  const convertDate = () => {
    if (!inputDate) {
      setConvertedDate("");
      return;
    }

    setError("");

    try {
      let date: Date;

      // Parsing de la date d'entrée selon le format
      switch (inputFormat) {
        case "unix":
          date = fromUnixTime(Number(inputDate));
          break;
        case "iso":
          date = parseISO(inputDate);
          break;
        case "human":
          date = new Date(inputDate);
          break;
        case "custom":
          // Pour le format custom, on suppose que c'est déjà un objet Date
          date = new Date(inputDate);
          break;
        default:
          date = new Date();
      }

      // Vérifier si la date est valide
      if (isNaN(date.getTime())) {
        throw new Error("Date invalide");
      }

      // Formater la date de sortie selon le format choisi
      let result: string;
      switch (outputFormat) {
        case "unix":
          result = String(getUnixTime(date));
          break;
        case "iso":
          result = date.toISOString();
          break;
        case "human":
          result = format(date, "PPPPpp", { locale: fr });
          break;
        case "custom":
          result = format(date, customFormat);
          break;
        default:
          result = date.toString();
      }

      setConvertedDate(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erreur lors de la conversion de la date");
      }
      setConvertedDate("");
    }
  };

  const copyToClipboard = () => {
    if (convertedDate) {
      navigator.clipboard.writeText(convertedDate);
      toast.success("Date copiée dans le presse-papiers");
    }
  };

  const refreshWithCurrentDate = () => {
    const now = new Date();
    
    if (inputFormat === "unix") {
      setInputDate(String(getUnixTime(now)));
    } else if (inputFormat === "iso") {
      setInputDate(now.toISOString());
    } else if (inputFormat === "custom") {
      setInputDate(format(now, customFormat));
    } else {
      setInputDate(format(now, "yyyy-MM-dd'T'HH:mm"));
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <IconCalendar size={24} className="text-blue-500 mr-2" />
          <h2 className="text-xl font-bold">Convertisseur de Date et Heure</h2>
        </div>
        <button
          onClick={refreshWithCurrentDate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
        >
          <IconRefresh size={16} className="mr-1" />
          Date actuelle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-md font-semibold mb-3">Format d'entrée</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`
                    border p-2 rounded-md cursor-pointer text-center
                    ${inputFormat === option.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 hover:border-slate-500'}
                  `}
                  onClick={() => setInputFormat(option.id)}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.description}</div>
                </div>
              ))}
            </div>
            
            {inputFormat === "custom" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Format personnalisé
                </label>
                <input
                  type="text"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="yyyy-MM-dd HH:mm:ss"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Exemple: 'dd/MM/yyyy HH:mm:ss' pour 31/12/2023 23:59:59
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Date à convertir
              </label>
              {inputFormat === "human" ? (
                <input
                  type="datetime-local"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                />
              ) : (
                <input
                  type="text"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder={
                    inputFormat === "unix" 
                      ? "Timestamp (ex: 1672531200)" 
                      : inputFormat === "iso" 
                        ? "ISO 8601 (ex: 2023-01-01T00:00:00Z)" 
                        : "Format personnalisé"
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-3">Format de sortie</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((option) => (
                <div 
                  key={option.id}
                  className={`
                    border p-2 rounded-md cursor-pointer text-center
                    ${outputFormat === option.id ? 'border-blue-500 bg-blue-900/20' : 'border-slate-700 hover:border-slate-500'}
                  `}
                  onClick={() => setOutputFormat(option.id)}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.description}</div>
                </div>
              ))}
            </div>
            
            {outputFormat === "custom" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Format personnalisé
                </label>
                <input
                  type="text"
                  value={customFormat}
                  onChange={(e) => setCustomFormat(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="yyyy-MM-dd HH:mm:ss"
                />
              </div>
            )}
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-300">
                  Résultat
                </label>
                <button
                  onClick={copyToClipboard}
                  disabled={!convertedDate}
                  className="text-slate-400 hover:text-white disabled:opacity-50"
                  title="Copier"
                >
                  <IconCopy size={18} />
                </button>
              </div>
              
              <div className={`w-full bg-slate-900 border rounded-md p-3 min-h-[80px] text-sm font-mono break-all ${
                error ? "border-red-500 text-red-400" : "border-slate-700 text-white"
              }`}>
                {error ? error : convertedDate || "Entrez une date valide pour voir le résultat"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-slate-400">
        <h3 className="font-semibold">Formats de date couramment utilisés</h3>
        <ul className="mt-2 space-y-1 list-disc pl-5">
          <li><span className="text-slate-300">ISO 8601:</span> 2023-12-31T23:59:59.999Z (standard international)</li>
          <li><span className="text-slate-300">Unix Timestamp:</span> 1704067199 (secondes depuis le 1er janvier 1970)</li>
          <li><span className="text-slate-300">RFC 2822:</span> Sun, 31 Dec 2023 23:59:59 +0000 (emails)</li>
          <li><span className="text-slate-300">Date SQL:</span> 2023-12-31 23:59:59 (bases de données)</li>
        </ul>
      </div>
    </div>
  );
}