"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconRuler, IconArrowsExchange } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

type UnitCategory = "length" | "mass" | "volume" | "temperature" | "area" | "speed" | "time";

interface UnitConversion {
  name: string;
  factor: number;
  offset?: number;
}

interface UnitCategoryConfig {
  name: string;
  units: Record<string, UnitConversion>;
}

const unitCategories: Record<UnitCategory, UnitCategoryConfig> = {
  length: {
    name: "Longueur",
    units: {
      m: { name: "Mètre (m)", factor: 1 },
      km: { name: "Kilomètre (km)", factor: 1000 },
      cm: { name: "Centimètre (cm)", factor: 0.01 },
      mm: { name: "Millimètre (mm)", factor: 0.001 },
      inch: { name: "Pouce (in)", factor: 0.0254 },
      ft: { name: "Pied (ft)", factor: 0.3048 },
      yd: { name: "Yard (yd)", factor: 0.9144 },
      mile: { name: "Mile (mi)", factor: 1609.344 }
    }
  },
  mass: {
    name: "Masse",
    units: {
      kg: { name: "Kilogramme (kg)", factor: 1 },
      g: { name: "Gramme (g)", factor: 0.001 },
      mg: { name: "Milligramme (mg)", factor: 0.000001 },
      ton: { name: "Tonne (t)", factor: 1000 },
      lb: { name: "Livre (lb)", factor: 0.45359237 },
      oz: { name: "Once (oz)", factor: 0.028349523125 }
    }
  },
  volume: {
    name: "Volume",
    units: {
      l: { name: "Litre (L)", factor: 1 },
      ml: { name: "Millilitre (mL)", factor: 0.001 },
      m3: { name: "Mètre cube (m³)", factor: 1000 },
      gal: { name: "Gallon US", factor: 3.78541 },
      qt: { name: "Quart US", factor: 0.946353 },
      pt: { name: "Pinte US", factor: 0.473176 },
      cup: { name: "Tasse US", factor: 0.236588 },
      floz: { name: "Once liquide US (fl oz)", factor: 0.0295735 }
    }
  },
  temperature: {
    name: "Température",
    units: {
      c: { name: "Celsius (°C)", factor: 1, offset: 0 },
      f: { name: "Fahrenheit (°F)", factor: 5/9, offset: -32 },
      k: { name: "Kelvin (K)", factor: 1, offset: -273.15 }
    }
  },
  area: {
    name: "Surface",
    units: {
      m2: { name: "Mètre carré (m²)", factor: 1 },
      km2: { name: "Kilomètre carré (km²)", factor: 1000000 },
      cm2: { name: "Centimètre carré (cm²)", factor: 0.0001 },
      mm2: { name: "Millimètre carré (mm²)", factor: 0.000001 },
      ha: { name: "Hectare (ha)", factor: 10000 },
      acre: { name: "Acre", factor: 4046.8564224 },
      ft2: { name: "Pied carré (ft²)", factor: 0.09290304 },
      in2: { name: "Pouce carré (in²)", factor: 0.00064516 }
    }
  },
  speed: {
    name: "Vitesse",
    units: {
      mps: { name: "Mètre par seconde (m/s)", factor: 1 },
      kph: { name: "Kilomètre par heure (km/h)", factor: 0.277778 },
      mph: { name: "Mile par heure (mph)", factor: 0.44704 },
      kt: { name: "Nœud (kt)", factor: 0.514444 },
      fps: { name: "Pied par seconde (ft/s)", factor: 0.3048 }
    }
  },
  time: {
    name: "Temps",
    units: {
      s: { name: "Seconde (s)", factor: 1 },
      min: { name: "Minute (min)", factor: 60 },
      h: { name: "Heure (h)", factor: 3600 },
      day: { name: "Jour", factor: 86400 },
      week: { name: "Semaine", factor: 604800 },
      month: { name: "Mois (30j)", factor: 2592000 },
      year: { name: "Année (365j)", factor: 31536000 }
    }
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [fromUnit, setFromUnit] = useState<string>("m");
  const [toUnit, setToUnit] = useState<string>("km");
  const [inputValue, setInputValue] = useState<string>("1");
  const [outputValue, setOutputValue] = useState<string>("");

  useEffect(() => {
    convertValue();
  }, [category, fromUnit, toUnit, inputValue]);

  const convertValue = () => {
    if (!inputValue || isNaN(Number(inputValue))) {
      setOutputValue("");
      return;
    }

    const value = parseFloat(inputValue);
    
    // Température a besoin d'un traitement spécial à cause des offsets
    if (category === "temperature") {
      const fromConfig = unitCategories[category].units[fromUnit];
      const toConfig = unitCategories[category].units[toUnit];
      
      // Conversion en Celsius comme base intermédiaire
      let celsiusValue: number;
      
      if (fromUnit === "c") {
        celsiusValue = value;
      } else if (fromUnit === "f") {
        celsiusValue = (value - 32) * (5/9);
      } else if (fromUnit === "k") {
        celsiusValue = value - 273.15;
      } else {
        celsiusValue = 0;
      }
      
      // Conversion de Celsius vers l'unité cible
      let result: number;
      
      if (toUnit === "c") {
        result = celsiusValue;
      } else if (toUnit === "f") {
        result = (celsiusValue * (9/5)) + 32;
      } else if (toUnit === "k") {
        result = celsiusValue + 273.15;
      } else {
        result = 0;
      }
      
      setOutputValue(formatResult(result));
    } else {
      // Conversion standard avec facteur
      const fromFactor = unitCategories[category].units[fromUnit].factor;
      const toFactor = unitCategories[category].units[toUnit].factor;
      
      // Convertir en unité standard puis en unité cible
      const result = (value * fromFactor) / toFactor;
      setOutputValue(formatResult(result));
    }
  };

  const formatResult = (value: number): string => {
    // Afficher un nombre approprié de décimales en fonction de la magnitude
    if (Math.abs(value) >= 1000) {
      return value.toFixed(2);
    } else if (Math.abs(value) >= 10) {
      return value.toFixed(4);
    } else if (Math.abs(value) >= 0.01) {
      return value.toFixed(6);
    } else {
      return value.toExponential(6);
    }
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IconRuler size={24} className="text-green-500 mr-2" />
          Convertisseur d'unités
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Catégorie
          </label>
          <select
            value={category}
            onChange={(e) => {
              const newCategory = e.target.value as UnitCategory;
              setCategory(newCategory);
              
              // Réinitialiser les unités en prenant les deux premières de la nouvelle catégorie
              const units = Object.keys(unitCategories[newCategory].units);
              setFromUnit(units[0]);
              setToUnit(units[1]);
            }}
            className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
          >
            {Object.entries(unitCategories).map(([key, config]) => (
              <option key={key} value={key}>
                {config.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              De
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                {Object.entries(unitCategories[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="Valeur"
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Vers
              </label>
              <button
                onClick={swapUnits}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                <IconArrowsExchange size={16} className="inline mr-1" />
                Inverser
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                {Object.entries(unitCategories[category].units).map(([key, unit]) => (
                  <option key={key} value={key}>
                    {unit.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={outputValue}
                readOnly
                className="bg-slate-900 border border-slate-700 rounded-md p-2 text-white font-medium"
                placeholder="Résultat"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-700 rounded-md p-4 text-sm text-slate-300 mt-2">
          <h3 className="font-medium text-white mb-2">Formule de conversion</h3>
          {category === 'temperature' ? (
            <div>
              {fromUnit === 'c' && toUnit === 'f' && <p>°F = (°C × 9/5) + 32</p>}
              {fromUnit === 'c' && toUnit === 'k' && <p>K = °C + 273.15</p>}
              {fromUnit === 'f' && toUnit === 'c' && <p>°C = (°F - 32) × 5/9</p>}
              {fromUnit === 'f' && toUnit === 'k' && <p>K = (°F - 32) × 5/9 + 273.15</p>}
              {fromUnit === 'k' && toUnit === 'c' && <p>°C = K - 273.15</p>}
              {fromUnit === 'k' && toUnit === 'f' && <p>°F = (K - 273.15) × 9/5 + 32</p>}
            </div>
          ) : (
            <p>
              {unitCategories[category].units[toUnit].name} = {inputValue} {unitCategories[category].units[fromUnit].name} × 
              <span className="font-mono"> {(unitCategories[category].units[fromUnit].factor / unitCategories[category].units[toUnit].factor).toString()}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}