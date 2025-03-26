"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { IconUpload, IconDownload, IconCopy, IconTrash, IconFile } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

export default function Base64FileConverter() {
  const [fileBase64, setFileBase64] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract the base64 part after the comma
      const base64 = result.split(',')[1];
      setFileBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Input = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileBase64(e.target.value);
  };

  const handleDownload = () => {
    if (!fileBase64) {
      toast.error("Aucun contenu à télécharger");
      return;
    }

    try {
      // Pour le décodage, on attend une chaîne Base64 pure
      const dataUrl = mode === "decode" 
        ? `data:application/octet-stream;base64,${fileBase64}`
        : `data:${fileType};base64,${fileBase64}`;
      
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = fileName || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Fichier téléchargé");
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const copyToClipboard = () => {
    if (fileBase64) {
      navigator.clipboard.writeText(fileBase64);
      toast.success("Base64 copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setFileBase64("");
    setFileName("");
    setFileType("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (textAreaRef.current) textAreaRef.current.value = "";
  };

  const toggleMode = () => {
    setMode(prev => prev === "encode" ? "decode" : "encode");
    clearAll();
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Convertisseur de Fichier {mode === "encode" ? "→ Base64" : "← Base64"}
        </h2>
        <button
          onClick={toggleMode}
          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
        >
          {mode === "encode" ? "Passer au décodage" : "Passer à l'encodage"}
        </button>
      </div>

      <div className="space-y-4">
        {mode === "encode" ? (
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
            <IconFile size={48} className="mx-auto mb-4 text-slate-400" />
            <p className="text-slate-300 mb-4">
              Sélectionnez un fichier à convertir en Base64
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block cursor-pointer"
            >
              <IconUpload size={16} className="inline-block mr-1" />
              Choisir un fichier
            </label>
            {fileName && (
              <p className="mt-3 text-green-400">
                Fichier sélectionné: {fileName}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Collez le code Base64 à convertir en fichier
            </label>
            <textarea
              ref={textAreaRef}
              value={fileBase64}
              onChange={handleBase64Input}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-40 font-mono"
              placeholder="Collez le code Base64 ici..."
            />
            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nom du fichier à générer (optionnel)
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="file.txt"
              />
            </div>
          </div>
        )}

        {fileBase64 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {mode === "encode" && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-slate-300">
                    Résultat Base64
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="text-slate-400 hover:text-white"
                      title="Copier"
                    >
                      <IconCopy size={18} />
                    </button>
                    <button
                      onClick={clearAll}
                      className="text-slate-400 hover:text-white"
                      title="Effacer"
                    >
                      <IconTrash size={18} />
                    </button>
                  </div>
                </div>
                <textarea
                  value={fileBase64}
                  readOnly
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-40 font-mono"
                />
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <IconDownload size={18} className="mr-2" />
                {mode === "encode" ? "Télécharger le code Base64" : "Télécharger le fichier"}
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
          <h3 className="font-medium text-white mb-2">À propos de l'encodage Base64 pour fichiers</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Le format Base64 permet de représenter des données binaires sous forme de texte</li>
            <li>Utile pour transmettre des fichiers via des protocoles textuels (email, JSON, etc.)</li>
            <li>L'encodage augmente la taille d'environ 33% par rapport au fichier original</li>
            <li>Attention à la taille des fichiers - les très gros fichiers peuvent ralentir votre navigateur</li>
          </ul>
        </div>
      </div>
    </div>
  );
}