"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconClock, IconCopy, IconRefresh } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

interface CronValue {
  minutes: string;
  hours: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  command: string;
}

export default function CrontabGenerator() {
  const [cronExpression, setCronExpression] = useState("");
  const [cronValue, setCronValue] = useState<CronValue>({
    minutes: "*",
    hours: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*",
    command: ""
  });
  
  const [selectedPreset, setSelectedPreset] = useState("");
  const [description, setDescription] = useState("");

  const presets = [
    { name: "Tous les jours à minuit", value: "0 0 * * *", description: "S'exécute tous les jours à 00:00" },
    { name: "Toutes les heures", value: "0 * * * *", description: "S'exécute au début de chaque heure" },
    { name: "Toutes les 30 minutes", value: "*/30 * * * *", description: "S'exécute toutes les 30 minutes" },
    { name: "Tous les lundis à 9h", value: "0 9 * * 1", description: "S'exécute tous les lundis à 9h00" },
    { name: "Premier jour du mois", value: "0 0 1 * *", description: "S'exécute le premier jour de chaque mois à minuit" },
    { name: "Toutes les 5 minutes en semaine", value: "*/5 * * * 1-5", description: "S'exécute toutes les 5 minutes, du lundi au vendredi" },
    { name: "Trois fois par jour", value: "0 */8 * * *", description: "S'exécute toutes les 8 heures (00:00, 08:00, 16:00)" },
    { name: "Tous les weekends", value: "0 0 * * 0,6", description: "S'exécute à minuit les samedis et dimanches" }
  ];

  useEffect(() => {
    generateCronExpression();
  }, [cronValue]);

  useEffect(() => {
    if (cronExpression) {
      generateDescription();
    } else {
      setDescription("");
    }
  }, [cronExpression]);

  const generateCronExpression = () => {
    const { minutes, hours, dayOfMonth, month, dayOfWeek, command } = cronValue;
    const cron = `${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`;
    setCronExpression(cron.trim());
  };

  const generateDescription = () => {
    let desc = "S'exécute ";
    const { minutes, hours, dayOfMonth, month, dayOfWeek } = cronValue;
    
    // Check for common patterns and generate human-readable descriptions
    if (minutes === "*" && hours === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      desc += "chaque minute";
    } else if (minutes.startsWith("*/")) {
      const interval = minutes.replace("*/", "");
      desc += `toutes les ${interval} minutes`;
    } else if (minutes === "0" && hours === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      desc += "toutes les heures (à la minute 0)";
    } else if (hours === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      if (minutes.includes(",")) {
        desc += `aux minutes ${minutes} de chaque heure`;
      } else {
        desc += `à la minute ${minutes} de chaque heure`;
      }
    } else if (minutes === "0" && hours.startsWith("*/")) {
      const interval = hours.replace("*/", "");
      desc += `toutes les ${interval} heures`;
    } else if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      if (minutes === "0") {
        if (hours.includes(",")) {
          desc += `tous les jours aux heures suivantes: ${hours}:00`;
        } else {
          desc += `tous les jours à ${hours}:00`;
        }
      } else {
        desc += `tous les jours à ${hours}:${minutes}`;
      }
    } else if (dayOfWeek === "0,6" || dayOfWeek === "6,0") {
      desc += "les weekends";
      if (hours !== "*" || minutes !== "*") {
        desc += ` à ${hours === "*" ? "chaque heure" : hours}:${minutes === "*" ? "chaque minute" : minutes}`;
      }
    } else if (dayOfWeek === "1-5") {
      desc += "en semaine (lundi au vendredi)";
      if (hours !== "*" || minutes !== "*") {
        desc += ` à ${hours === "*" ? "chaque heure" : hours}:${minutes === "*" ? "chaque minute" : minutes}`;
      }
    } else if (dayOfMonth !== "*" && month !== "*") {
      desc += `le ${dayOfMonth} ${getMonthName(month)}`;
      if (hours !== "*" || minutes !== "*") {
        desc += ` à ${hours === "*" ? "chaque heure" : hours}:${minutes === "*" ? "chaque minute" : minutes}`;
      }
    } else if (dayOfMonth !== "*") {
      desc += `le ${dayOfMonth} de chaque mois`;
      if (hours !== "*" || minutes !== "*") {
        desc += ` à ${hours === "*" ? "chaque heure" : hours}:${minutes === "*" ? "chaque minute" : minutes}`;
      }
    } else if (month !== "*") {
      desc += `en ${getMonthName(month)}`;
      if (hours !== "*" || minutes !== "*") {
        desc += ` à ${hours === "*" ? "chaque heure" : hours}:${minutes === "*" ? "chaque minute" : minutes}`;
      }
    } else if (dayOfWeek !== "*") {
      desc += `${getDayOfWeekName(dayOfWeek)}`;
      if (hours !== "*" || minutes !== "*") {
        desc += ` à ${hours === "*" ? "chaque heure" : hours}:${minutes === "*" ? "chaque minute" : minutes}`;
      }
    }
    
    setDescription(desc);
  };
  
  // Fonction auxiliaire pour obtenir le nom du mois
  const getMonthName = (month: string) => {
    const months = {
      "1": "janvier", "2": "février", "3": "mars", "4": "avril",
      "5": "mai", "6": "juin", "7": "juillet", "8": "août",
      "9": "septembre", "10": "octobre", "11": "novembre", "12": "décembre"
    };
    return months[month as keyof typeof months] || month;
  };
  
  // Fonction auxiliaire pour obtenir le nom du jour de la semaine
  const getDayOfWeekName = (dayOfWeek: string) => {
    const days = {
      "0": "le dimanche", "1": "le lundi", "2": "le mardi", "3": "le mercredi",
      "4": "le jeudi", "5": "le vendredi", "6": "le samedi"
    };
    
    if (dayOfWeek.includes(",")) {
      const dayNames = dayOfWeek.split(",").map(d => days[d as keyof typeof days].replace("le ", ""));
      return `les ${dayNames.join(" et ")}`;
    } else if (dayOfWeek.includes("-")) {
      const [start, end] = dayOfWeek.split("-");
      return `du ${days[start as keyof typeof days].replace("le ", "")} au ${days[end as keyof typeof days].replace("le ", "")}`;
    }
    
    return days[dayOfWeek as keyof typeof days] || dayOfWeek;
  };

  // Fonction pour appliquer un preset
  const applyPreset = (presetValue: string) => {
    if (!presetValue) return;
    
    const preset = presets.find(p => p.value === presetValue);
    if (!preset) return;
    
    const parts = preset.value.split(" ");
    setCronValue({
      minutes: parts[0],
      hours: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4],
      command: cronValue.command
    });
    
    setSelectedPreset(presetValue);
  };

  // Fonction pour copier l'expression cron au presse-papiers
  const copyToClipboard = () => {
    const fullCron = cronValue.command 
      ? `${cronExpression} ${cronValue.command}` 
      : cronExpression;
      
    navigator.clipboard.writeText(fullCron);
    toast.success("Expression cron copiée dans le presse-papiers");
  };

  // Fonction pour mettre à jour une partie spécifique de l'expression cron
  const updateCronValue = (field: keyof CronValue, value: string) => {
    setCronValue(prev => ({
      ...prev,
      [field]: value
    }));
    setSelectedPreset("");
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <IconClock size={24} className="text-blue-500 mr-2" />
          Générateur d'expressions Crontab
        </h2>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Préréglages courants
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => applyPreset(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
        >
          <option value="">-- Choisir un préréglage --</option>
          {presets.map((preset) => (
            <option key={preset.value} value={preset.value}>
              {preset.name} ({preset.value})
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Minutes (0-59)
          </label>
          <input
            type="text"
            value={cronValue.minutes}
            onChange={(e) => updateCronValue("minutes", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
            placeholder="*"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Heures (0-23)
          </label>
          <input
            type="text"
            value={cronValue.hours}
            onChange={(e) => updateCronValue("hours", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
            placeholder="*"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Jour du mois (1-31)
          </label>
          <input
            type="text"
            value={cronValue.dayOfMonth}
            onChange={(e) => updateCronValue("dayOfMonth", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
            placeholder="*"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Mois (1-12)
          </label>
          <input
            type="text"
            value={cronValue.month}
            onChange={(e) => updateCronValue("month", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
            placeholder="*"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Jour de la semaine (0-6)
          </label>
          <input
            type="text"
            value={cronValue.dayOfWeek}
            onChange={(e) => updateCronValue("dayOfWeek", e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
            placeholder="*"
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Commande à exécuter (optionnel)
        </label>
        <input
          type="text"
          value={cronValue.command}
          onChange={(e) => updateCronValue("command", e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white"
          placeholder="/chemin/vers/script.sh"
        />
      </div>
      
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Expression Cron</h3>
          <button
            onClick={copyToClipboard}
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            <IconCopy size={16} className="mr-1" />
            Copier
          </button>
        </div>
        <div className="bg-slate-900 p-3 rounded font-mono text-lg">
          {cronExpression} {cronValue.command}
        </div>
      </div>
      
      {description && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900/30 border border-blue-800 rounded-lg p-4"
        >
          <h3 className="text-md font-medium mb-1 text-blue-300">Description</h3>
          <p className="text-white">{description}</p>
        </motion.div>
      )}
      
      <div className="mt-8 bg-slate-700/50 rounded-lg p-4">
        <h3 className="text-md font-medium mb-2">Aide sur la syntaxe Cron</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="text-left py-2">Valeur</th>
              <th className="text-left py-2">Description</th>
              <th className="text-left py-2">Exemple</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-600">
              <td className="py-2">*</td>
              <td>Toutes les valeurs</td>
              <td>"* * * * *" = toutes les minutes</td>
            </tr>
            <tr className="border-b border-slate-600">
              <td className="py-2">,</td>
              <td>Liste de valeurs</td>
              <td>"1,3,5 * * * *" = 1ère, 3ème et 5ème minute</td>
            </tr>
            <tr className="border-b border-slate-600">
              <td className="py-2">-</td>
              <td>Plage de valeurs</td>
              <td>"1-5 * * * *" = toutes les minutes de 1 à 5</td>
            </tr>
            <tr className="border-b border-slate-600">
              <td className="py-2">/</td>
              <td>Valeurs à intervalle</td>
              <td>"*/15 * * * *" = toutes les 15 minutes</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}