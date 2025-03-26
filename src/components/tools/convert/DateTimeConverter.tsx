"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconCalendar, IconClock, IconRefresh, IconCopy } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { format, parse, fromUnixTime } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FormatOption {
  label: string;
  value: string;
  example: string;
}

export default function DateTimeConverter() {
  const [date, setDate] = useState<Date>(new Date());
  const [unixTimestamp, setUnixTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [isoString, setIsoString] = useState<string>("");
  const [customFormat, setCustomFormat] = useState<string>("dd/MM/yyyy HH:mm:ss");
  const [formattedDate, setFormattedDate] = useState<string>("");
  
  const formatOptions: FormatOption[] = [
    { label: "Standard (DD/MM/YYYY)", value: "dd/MM/yyyy HH:mm:ss", example: "31/12/2023 23:59:59" },
    { label: "US (MM/DD/YYYY)", value: "MM/dd/yyyy hh:mm:ss a", example: "12/31/2023 11:59:59 PM" },
    { label: "ISO 8601", value: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", example: "2023-12-31T23:59:59.000+00:00" },
    { label: "Année-Mois-Jour", value: "yyyy-MM-dd", example: "2023-12-31" },
    { label: "Format long", value: "EEEE d MMMM yyyy 'à' HH:mm", example: "Dimanche 31 décembre 2023 à 23:59" },
    { label: "Format personnalisé", value: "custom", example: "Personnalisez le format" },
  ];

  useEffect(() => {
    updateFormattedDate();
  }, [date, customFormat]);

  useEffect(() => {
    setIsoString(date.toISOString());
    setUnixTimestamp(Math.floor(date.getTime() / 1000));
  }, [date]);

  const updateFormattedDate = () => {
    try {
      setFormattedDate(format(date, customFormat, { locale: fr }));
    } catch (error) {
      setFormattedDate("Format invalide");
    }
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    if (selectedValue !== "custom") {
      setCustomFormat(selectedValue);
    }
  };

  const updateFromUnixTimestamp = (timestamp: number) => {
    try {
      const newDate = fromUnixTime(timestamp);
      setDate(newDate);
    } catch (error) {
      toast.error("Timestamp UNIX invalide");
    }
  };

  const updateFromISOString = (iso: string) => {
    try {
      const newDate = new Date(iso);
      if (isNaN(newDate.getTime())) {
        throw new Error("Date invalide");
      }
      setDate(newDate);
    } catch (error) {
      toast.error("Date ISO invalide");
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const setNow = () => {
    setDate(new Date());
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Convertisseur Date/Heure</h2>
        <motion.button
          onClick={setNow}
          className="text-slate-300 hover:text-white px-2 py-1 rounded-md flex items-center text-sm"
          whileTap={{ scale: 0.95 }}
        >
          <IconRefresh size={16} className="mr-1" />
          Maintenant
        </motion.button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center text-sm font-medium text-slate-300 mb-1">
              <IconCalendar size={16} className="mr-1" />
              Date
            </label>
            <input
              type="date"
              value={format(date, 'yyyy-MM-dd')}
              onChange={(e) => {
                const newDate = new Date(date);
                const [year, month, day] = e.target.value.split('-').map(Number);
                newDate.setFullYear(year, month - 1, day);
                setDate(newDate);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
            />
          </div>
          <div>
            <label className="flex items-center text-sm font-medium text-slate-300 mb-1">
              <IconClock size={16} className="mr-1" />
              Heure
            </label>
            <input
              type="time"
              value={format(date, 'HH:mm')}
              onChange={(e) => {
                const newDate = new Date(date);
                const [hours, minutes] = e.target.value.split(':').map(Number);
                newDate.setHours(hours, minutes);
                setDate(newDate);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300 mb-1">
                Unix Timestamp (secondes)
              </label>
              <button
                onClick={() => copyToClipboard(unixTimestamp.toString(), "Timestamp UNIX copié")}
                className="text-slate-400 hover:text-white"
                title="Copier"
              >
                <IconCopy size={16} />
              </button>
            </div>
            <div className="flex">
              <input
                type="number"
                value={unixTimestamp}
                onChange={(e) => setUnixTimestamp(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white"
                placeholder="Timestamp UNIX..."
              />
              <button
                onClick={() => updateFromUnixTimestamp(unixTimestamp)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
              >
                Appliquer
              </button>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-slate-300 mb-1">
                Date ISO 8601
              </label>
              <button
                onClick={() => copyToClipboard(isoString, "Date ISO copiée")}
                className="text-slate-400 hover:text-white"
                title="Copier"
              >
                <IconCopy size={16} />
              </button>
            </div>
            <div className="flex">
              <input
                type="text"
                value={isoString}
                onChange={(e) => setIsoString(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white text-xs md:text-sm font-mono"
                placeholder="Date au format ISO..."
              />
              <button
                onClick={() => updateFromISOString(isoString)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-slate-300">Format</label>
            <button
              onClick={() => copyToClipboard(formattedDate, "Date formatée copiée")}
              className="text-slate-400 hover:text-white"
              title="Copier"
            >
              <IconCopy size={16} />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-2 mb-2">
            <select
              onChange={handleFormatChange}
              className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <input
              type="text"
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white font-mono flex-grow"
              placeholder="Format personnalisé..."
            />
          </div>
          
          <div className="bg-slate-900 border border-slate-700 rounded-md p-3 text-white min-h-12 flex items-center justify-between">
            <span className="font-medium">{formattedDate}</span>
          </div>
        </div>

        <div className="bg-slate-700 p-3 rounded-lg text-sm">
          <h3 className="font-medium mb-2">Aide au formatage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div><code>yyyy</code>: Année (4 chiffres)</div>
            <div><code>MM</code>: Mois (01-12)</div>
            <div><code>dd</code>: Jour (01-31)</div>
            <div><code>HH</code>: Heures 24h (00-23)</div>
            <div><code>mm</code>: Minutes (00-59)</div>
            <div><code>ss</code>: Secondes (00-59)</div>
            <div><code>EEEE</code>: Jour de la semaine</div>
            <div><code>MMMM</code>: Nom du mois</div>
          </div>
        </div>
      </div>
    </div>
  );
}