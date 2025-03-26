"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { IconUpload, IconDownload, IconTrash, IconPhoto, IconFileVector } from "@tabler/icons-react";
import { convertSvgToPng } from "@/lib/media";

export default function SVGConverter() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [svgUrl, setSvgUrl] = useState<string>("");
  const [pngUrl, setPngUrl] = useState<string>("");
  const [pngSize, setPngSize] = useState<number>(1024);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Vérifier que c'est bien un SVG
    if (!file.type.includes('svg')) {
      toast.error("Veuillez sélectionner un fichier SVG.");
      return;
    }
    
    // Sauvegarder le nom du fichier sans extension
    const baseName = file.name.replace(/\.svg$/i, '');
    setFileName(baseName);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgContent(content);
      
      // Créer une URL pour prévisualiser le SVG
      const blob = new Blob([content], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setSvgUrl(url);
      
      // Réinitialiser l'URL PNG précédente
      if (pngUrl) {
        URL.revokeObjectURL(pngUrl);
        setPngUrl("");
      }
    };
    
    reader.readAsText(file);
  };
  
  const handleSvgInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setSvgContent(content);
    
    // Créer une URL pour prévisualiser le SVG
    try {
      const blob = new Blob([content], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setSvgUrl(url);
    } catch (error) {
      // Si le SVG est invalide, ne pas mettre à jour l'URL
    }
  };
  
  const convertToPng = async () => {
    if (!svgContent) {
      toast.error("Veuillez d'abord ajouter un SVG.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const pngBlob = await convertSvgToPng(svgContent, pngSize);
      const url = URL.createObjectURL(pngBlob);
      
      // Libérer l'ancienne URL si elle existe
      if (pngUrl) {
        URL.revokeObjectURL(pngUrl);
      }
      
      setPngUrl(url);
      toast.success("Conversion réussie!");
    } catch (error) {
      toast.error("Erreur lors de la conversion: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const downloadPng = () => {
    if (!pngUrl) {
      toast.error("Veuillez d'abord convertir le SVG en PNG.");
      return;
    }
    
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${fileName || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadSvg = () => {
    if (!svgContent) {
      toast.error("Aucun SVG à télécharger.");
      return;
    }
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName || 'image'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };
  
  const clearAll = () => {
    setSvgContent("");
    if (svgUrl) URL.revokeObjectURL(svgUrl);
    if (pngUrl) URL.revokeObjectURL(pngUrl);
    setSvgUrl("");
    setPngUrl("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <IconFileVector size={24} className="mr-2 text-purple-500" />
          Convertisseur SVG → PNG
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".svg"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
              id="svg-upload"
            />
            <label
              htmlFor="svg-upload"
              className="cursor-pointer block"
            >
              <IconUpload size={40} className="mx-auto mb-2 text-slate-400" />
              <p className="text-slate-300 mb-2">
                Déposez votre fichier SVG ici ou cliquez pour sélectionner
              </p>
              <span className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md inline-block">
                Sélectionner un SVG
              </span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Ou collez le code SVG
            </label>
            <textarea
              value={svgContent}
              onChange={handleSvgInput}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-3 text-white h-48 font-mono text-sm"
              placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Taille de l'image PNG (pixels)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="32"
                max="2048"
                step="16"
                value={pngSize}
                onChange={(e) => setPngSize(parseInt(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min="32"
                max="2048"
                value={pngSize}
                onChange={(e) => setPngSize(parseInt(e.target.value) || 32)}
                className="w-20 bg-slate-900 border border-slate-700 rounded-md p-1 text-white text-center"
              />
            </div>
          </div>
          
          <div className="flex justify-between gap-2">
            <button
              onClick={clearAll}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center"
              disabled={!svgContent}
            >
              <IconTrash size={16} className="mr-1" />
              Effacer
            </button>
            
            <div className="space-x-2">
              <button
                onClick={downloadSvg}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={!svgContent}
              >
                <IconDownload size={16} className="mr-1" />
                SVG
              </button>
              
              <button
                onClick={convertToPng}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
                disabled={!svgContent || isLoading}
              >
                <IconPhoto size={16} className="mr-1" />
                Convertir
              </button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-md font-medium mb-2 flex items-center">
              <IconFileVector size={18} className="mr-1 text-blue-400" />
              Prévisualisation SVG
            </h3>
            <div 
              className="bg-white rounded-md flex items-center justify-center overflow-hidden h-48"
              ref={svgContainerRef}
            >
              {svgUrl ? (
                <img 
                  src={svgUrl} 
                  alt="SVG Preview" 
                  className="max-w-full max-h-full object-contain"
                  style={{ backgroundColor: 'white' }}
                />
              ) : (
                <p className="text-slate-400">Prévisualisation SVG</p>
              )}
            </div>
          </div>
          
          <div className="bg-slate-700/30 rounded-lg p-4">
            <h3 className="text-md font-medium mb-2 flex items-center">
              <IconPhoto size={18} className="mr-1 text-green-400" />
              Prévisualisation PNG
            </h3>
            <div className="bg-white rounded-md flex items-center justify-center overflow-hidden h-48 relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/30">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : pngUrl ? (
                <img 
                  src={pngUrl} 
                  alt="PNG Preview" 
                  className="max-w-full max-h-full object-contain"
                  style={{ backgroundColor: 'white' }}
                />
              ) : (
                <p className="text-slate-400">Prévisualisation PNG</p>
              )}
            </div>
            
            {pngUrl && (
              <button
                onClick={downloadPng}
                className="mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center mx-auto"
              >
                <IconDownload size={16} className="mr-1" />
                Télécharger PNG
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
        <h3 className="font-medium text-white mb-2">À propos de la conversion SVG vers PNG</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Les fichiers SVG sont vectoriels et peuvent être redimensionnés sans perte de qualité.</li>
          <li>La conversion en PNG crée une image raster dont la qualité dépend de la résolution choisie.</li>
          <li>Certains effets SVG complexes peuvent ne pas être parfaitement rendus lors de la conversion.</li>
          <li>Pour les SVGs avec des références externes (images, polices), la conversion peut être incomplète.</li>
        </ul>
      </div>
    </div>
  );
}