"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconKey, IconCopy, IconTrash, IconBrandGoogle, IconAlertTriangle } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";
import { parseJWT } from "@/lib/web";

interface JWTPayload {
  [key: string]: any;
}

interface JWTHeader {
  alg: string;
  typ: string;
  [key: string]: any;
}

interface ParsedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  valid: boolean;
}

export default function JwtParser() {
  const [jwt, setJwt] = useState("");
  const [parsedData, setParsedData] = useState<ParsedJWT | null>(null);
  const [activeTab, setActiveTab] = useState<"payload" | "header" | "raw">("payload");
  const [error, setError] = useState("");

  useEffect(() => {
    if (jwt.trim()) {
      try {
        const parsed = parseJWT(jwt);
        setParsedData(parsed);
        setError("");
      } catch (err) {
        setError("Token JWT invalide");
        setParsedData(null);
      }
    } else {
      setParsedData(null);
      setError("");
    }
  }, [jwt]);

  const formatTime = (timestamp: number): string => {
    if (!timestamp) return "N/A";
    
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const isExpired = date < now;
    
    return `${date.toLocaleString()} ${isExpired ? '(expiré)' : ''}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copié dans le presse-papiers");
  };

  const clearAll = () => {
    setJwt("");
    setParsedData(null);
    setError("");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IconKey className="mr-2 text-purple-500" size={24} />
          Analyseur de Tokens JWT
        </h2>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="block text-sm font-medium text-slate-300">
            Token JWT
          </label>
          <button
            onClick={clearAll}
            className="text-slate-400 hover:text-white"
            title="Effacer"
          >
            <IconTrash size={16} />
          </button>
        </div>
        <textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Collez votre token JWT ici..."
          className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-20 font-mono"
        />
      </div>

      {error && (
        <div className="bg-red-900/40 border border-red-800 text-red-100 p-3 rounded-md mb-4 flex items-center">
          <IconAlertTriangle className="mr-2" size={20} />
          {error}
        </div>
      )}

      {parsedData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div className="flex border-b border-slate-700 mb-4">
            <button
              className={`px-4 py-2 ${
                activeTab === "payload"
                  ? "text-purple-400 border-b-2 border-purple-500"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("payload")}
            >
              Payload
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "header"
                  ? "text-purple-400 border-b-2 border-purple-500"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("header")}
            >
              Header
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "raw"
                  ? "text-purple-400 border-b-2 border-purple-500"
                  : "text-slate-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("raw")}
            >
              Raw
            </button>
          </div>

          {activeTab === "payload" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">Payload</h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(parsedData.payload, null, 2))}
                  className="text-slate-400 hover:text-white"
                  title="Copier"
                >
                  <IconCopy size={16} />
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-md overflow-auto p-4 font-mono text-sm max-h-96">
                {parsedData.payload.exp && (
                  <div className="mb-4 p-2 bg-slate-800 rounded-md">
                    <span className="text-green-400">Expiration:</span> {formatTime(parsedData.payload.exp)}
                    <br />
                    <span className="text-green-400">Émis à:</span> {formatTime(parsedData.payload.iat || 0)}
                  </div>
                )}
                
                {Object.entries(parsedData.payload).map(([key, value]) => (
                  key !== 'exp' && key !== 'iat' && (
                    <div key={key} className="mb-1">
                      <span className="text-purple-400">{key}:</span>{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {activeTab === "header" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">Header</h3>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(parsedData.header, null, 2))}
                  className="text-slate-400 hover:text-white"
                  title="Copier"
                >
                  <IconCopy size={16} />
                </button>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 rounded-md overflow-auto p-4 font-mono text-sm">
                <div className="mb-2">
                  <span className="text-blue-400">alg:</span> {parsedData.header.alg}
                </div>
                <div className="mb-2">
                  <span className="text-blue-400">typ:</span> {parsedData.header.typ}
                </div>
                {Object.entries(parsedData.header)
                  .filter(([key]) => key !== 'alg' && key !== 'typ')
                  .map(([key, value]) => (
                    <div key={key} className="mb-1">
                      <span className="text-blue-400">{key}:</span>{" "}
                      {typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "raw" && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">Raw Token</h3>
                <button
                  onClick={() => copyToClipboard(jwt)}
                  className="text-slate-400 hover:text-white"
                  title="Copier"
                >
                  <IconCopy size={16} />
                </button>
              </div>
              
              <div className="bg-slate-900 border border-slate-700 rounded-md p-4 font-mono text-sm break-all">
                {jwt.split(".").map((part, i) => (
                  <div key={i} className={`mb-2 p-2 rounded ${
                    i === 0 ? "bg-blue-900/20 border border-blue-800/30" : 
                    i === 1 ? "bg-purple-900/20 border border-purple-800/30" : 
                    "bg-red-900/20 border border-red-800/30"
                  }`}>
                    <div className="text-xs text-slate-400 mb-1">
                      {i === 0 ? "HEADER" : i === 1 ? "PAYLOAD" : "SIGNATURE"}
                    </div>
                    {part}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
        <h3 className="font-medium text-white mb-2">À propos des tokens JWT</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>JWT (JSON Web Token) est un standard ouvert pour transmettre des informations de manière sécurisée.</li>
          <li>Les tokens JWT sont composés de trois parties: header, payload et signature.</li>
          <li>Les tokens sont souvent utilisés pour l'authentification et les API REST.</li>
          <li>Attention: cet outil ne vérifie pas cryptographiquement la signature.</li>
        </ul>
      </div>
    </div>
  );
}