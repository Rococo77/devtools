"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconBrowser, IconDevices, IconCopy, IconInfoCircle } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import * as UAParserModule from "ua-parser-js";

const UAParser = UAParserModule.default || UAParserModule;
interface UADetails {
  browser: {
    name?: string;
    version?: string;
  };
  engine: {
    name?: string;
    version?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
  device: {
    type?: string;
    vendor?: string;
    model?: string;
  };
  cpu: {
    architecture?: string;
  };
}

export default function UserAgentChecker() {
  const [userAgent, setUserAgent] = useState("");
  const [details, setDetails] = useState<UADetails | null>(null);
  const [customUA, setCustomUA] = useState("");
  const [displayMode, setDisplayMode] = useState<"current" | "custom">("current");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      setUserAgent(ua);
      parseUserAgent(ua);
    }
  }, []);

  const parseUserAgent = (ua: string) => {
    try {
      const parser = new (UAParser as any)(ua);
      setDetails({
        browser: parser.getBrowser(),
        engine: parser.getEngine(),
        os: parser.getOS(),
        device: parser.getDevice(),
        cpu: parser.getCPU()
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse de l'User Agent:", error);
      setDetails(null);
    }
  };

  const handleCustomUASubmit = () => {
    if (customUA.trim()) {
      parseUserAgent(customUA.trim());
      setDisplayMode("custom");
      toast.success("User Agent analysé avec succès");
    } else {
      toast.error("Veuillez entrer un User Agent valide");
    }
  };

  const resetToCurrentUA = () => {
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      setUserAgent(ua);
      parseUserAgent(ua);
      setCustomUA("");
      setDisplayMode("current");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers");
  };

  const getBrowserIcon = (name?: string) => {
    if (!name) return "⚫";
    
    const browserIcons: {[key: string]: string} = {
      'Chrome': "🌐",
      'Firefox': "🦊",
      'Safari': "🧭",
      'Edge': "🌀",
      'IE': "🔵",
      'Opera': "🔴",
    };
    
    return browserIcons[name] || "🌍";
  };

  const getOSIcon = (name?: string) => {
    if (!name) return "⚫";
    
    const osIcons: {[key: string]: string} = {
      'Windows': "🪟",
      'Mac OS': "🍎",
      'iOS': "📱",
      'Android': "🤖",
      'Linux': "🐧",
      'Ubuntu': "🐧",
    };
    
    for (const key in osIcons) {
      if (name.includes(key)) {
        return osIcons[key];
      }
    }
    
    return "💻";
  };

  const getDeviceIcon = (type?: string) => {
    if (!type) return "💻";
    
    const deviceIcons: {[key: string]: string} = {
      'mobile': "📱",
      'tablet': "📱",
      'desktop': "💻",
      'smarttv': "📺",
      'wearable': "⌚",
      'console': "🎮",
    };
    
    return deviceIcons[type] || "📱";
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IconBrowser className="mr-2 text-blue-500" size={24} />
          User Agent Checker
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              User Agent actuel
            </label>
            <div className="flex">
              <input
                type="text"
                value={userAgent}
                readOnly
                className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white font-mono text-sm overflow-x-auto"
              />
              <button
                onClick={() => copyToClipboard(userAgent)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-r-md"
                title="Copier"
              >
                <IconCopy size={16} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Analyser un User Agent personnalisé
            </label>
            <div className="flex">
              <input
                type="text"
                value={customUA}
                onChange={(e) => setCustomUA(e.target.value)}
                placeholder="Collez un User Agent à analyser..."
                className="w-full bg-slate-900 border border-slate-700 rounded-l-md p-2 text-white font-mono text-sm"
              />
              <button
                onClick={handleCustomUASubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md"
              >
                Analyser
              </button>
            </div>
          </div>

          {displayMode === "custom" && (
            <button
              onClick={resetToCurrentUA}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Revenir à mon User Agent actuel
            </button>
          )}

          {details && (
            <div className="bg-slate-700/30 p-4 rounded-md">
              <h3 className="font-medium text-white mb-2 flex items-center">
                <IconInfoCircle size={16} className="mr-1 text-blue-400" />
                Informations principales
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getBrowserIcon(details.browser.name)}</span>
                  <div>
                    <p className="text-white">
                      <span className="text-slate-400">Navigateur:</span>{" "}
                      {details.browser.name || "Inconnu"}{" "}
                      {details.browser.version && `v${details.browser.version}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getOSIcon(details.os.name)}</span>
                  <div>
                    <p className="text-white">
                      <span className="text-slate-400">Système d'exploitation:</span>{" "}
                      {details.os.name || "Inconnu"}{" "}
                      {details.os.version && `${details.os.version}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <span className="text-lg mr-2">{getDeviceIcon(details.device.type)}</span>
                  <div>
                    <p className="text-white">
                      <span className="text-slate-400">Appareil:</span>{" "}
                      {details.device.type 
                        ? `${details.device.type.charAt(0).toUpperCase() + details.device.type.slice(1)}`
                        : "Ordinateur de bureau"}{" "}
                      {details.device.vendor && `${details.device.vendor}`}{" "}
                      {details.device.model && `${details.device.model}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {details && (
          <div>
            <h3 className="font-medium text-white mb-3 flex items-center">
              <IconDevices size={18} className="mr-1 text-purple-400" />
              Détails techniques
            </h3>
            
            <div className="space-y-3">
              <div className="bg-slate-900 border border-slate-700 rounded-md p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Navigateur</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400">Nom</div>
                  <div className="text-white">{details.browser.name || "Inconnu"}</div>
                  <div className="text-slate-400">Version</div>
                  <div className="text-white">{details.browser.version || "Inconnue"}</div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 rounded-md p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Système d'exploitation</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400">Nom</div>
                  <div className="text-white">{details.os.name || "Inconnu"}</div>
                  <div className="text-slate-400">Version</div>
                  <div className="text-white">{details.os.version || "Inconnue"}</div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 rounded-md p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Appareil</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400">Type</div>
                  <div className="text-white">
                    {details.device.type 
                      ? details.device.type.charAt(0).toUpperCase() + details.device.type.slice(1)
                      : "Ordinateur de bureau"}
                  </div>
                  <div className="text-slate-400">Fabricant</div>
                  <div className="text-white">{details.device.vendor || "Inconnu"}</div>
                  <div className="text-slate-400">Modèle</div>
                  <div className="text-white">{details.device.model || "Inconnu"}</div>
                </div>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 rounded-md p-3">
                <h4 className="text-sm font-medium text-slate-300 mb-1">Moteur de rendu</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-400">Nom</div>
                  <div className="text-white">{details.engine.name || "Inconnu"}</div>
                  <div className="text-slate-400">Version</div>
                  <div className="text-white">{details.engine.version || "Inconnue"}</div>
                </div>
              </div>
              
              {details.cpu.architecture && (
                <div className="bg-slate-900 border border-slate-700 rounded-md p-3">
                  <h4 className="text-sm font-medium text-slate-300 mb-1">CPU</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-400">Architecture</div>
                    <div className="text-white">{details.cpu.architecture}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
        <h3 className="font-medium text-white mb-2">À quoi sert l'User Agent ?</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>L'User Agent est une chaîne de texte que votre navigateur envoie aux sites web que vous visitez.</li>
          <li>Il contient des informations sur votre navigateur, système d'exploitation et appareil.</li>
          <li>Les sites web l'utilisent pour adapter leur contenu à votre appareil et navigateur.</li>
          <li>Il est également utilisé pour les statistiques et la détection des robots.</li>
        </ul>
      </div>
    </div>
  );
}