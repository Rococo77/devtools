"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconBrandFacebook, IconBrandTwitter, IconLink, IconCopy, IconTrash, IconRefresh } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

interface MetaTag {
  property: string;
  content: string;
}

export default function OpenGraphGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [type, setType] = useState("website");
  const [locale, setLocale] = useState("fr_FR");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
  const [htmlOutput, setHtmlOutput] = useState("");

  const types = [
    "website", "article", "book", "profile", "music.song", 
    "music.album", "music.playlist", "video.movie", "video.episode"
  ];

  const twitterCards = [
    "summary", "summary_large_image", "app", "player"
  ];

  useEffect(() => {
    generateMetaTags();
  }, [title, description, url, imageUrl, siteName, type, locale, twitterCard]);

  const generateMetaTags = () => {
    const tags: MetaTag[] = [];
    
    // Open Graph tags
    if (title) tags.push({ property: "og:title", content: title });
    if (description) tags.push({ property: "og:description", content: description });
    if (url) tags.push({ property: "og:url", content: url });
    if (imageUrl) tags.push({ property: "og:image", content: imageUrl });
    if (siteName) tags.push({ property: "og:site_name", content: siteName });
    if (type) tags.push({ property: "og:type", content: type });
    if (locale) tags.push({ property: "og:locale", content: locale });
    
    // Twitter Card tags
    if (twitterCard) tags.push({ property: "twitter:card", content: twitterCard });
    if (title) tags.push({ property: "twitter:title", content: title });
    if (description) tags.push({ property: "twitter:description", content: description });
    if (imageUrl) tags.push({ property: "twitter:image", content: imageUrl });
    
    setMetaTags(tags);
    
    // Generate HTML
    const html = tags.map(tag => 
      `<meta property="${tag.property}" content="${tag.content}" />`
    ).join('\n');
    
    setHtmlOutput(html);
  };

  const copyToClipboard = () => {
    if (htmlOutput) {
      navigator.clipboard.writeText(htmlOutput);
      toast.success("Code HTML copié dans le presse-papiers");
    }
  };

  const clearAll = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setImageUrl("");
    setSiteName("");
    setType("website");
    setLocale("fr_FR");
    setTwitterCard("summary_large_image");
  };

  const fillExample = () => {
    setTitle("DevToolbox - Outils pour développeurs");
    setDescription("Collection d'outils essentiels pour les développeurs web, mobile et système");
    setUrl("https://devtoolbox.example.com");
    setImageUrl("https://devtoolbox.example.com/og-image.jpg");
    setSiteName("DevToolbox");
    setType("website");
    setLocale("fr_FR");
    setTwitterCard("summary_large_image");
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Générateur de Meta Tags Open Graph</h2>
        <div className="flex space-x-2">
          <button
            onClick={fillExample}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
            title="Remplir avec un exemple"
          >
            <IconRefresh size={16} className="mr-1" />
            Exemple
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              placeholder="Titre de votre page..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white h-20"
              placeholder="Description concise de votre page..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              URL
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 text-gray-500 bg-slate-800 border border-r-0 border-slate-700 rounded-l-md">
                <IconLink size={16} />
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white"
                placeholder="https://example.com/page"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              URL de l'image
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-slate-400 mt-1">
              Taille recommandée: 1200 x 630 pixels
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nom du site
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              placeholder="Nom de votre site..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                {types.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Locale
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                <option value="fr_FR">Français (fr_FR)</option>
                <option value="en_US">Anglais (en_US)</option>
                <option value="es_ES">Espagnol (es_ES)</option>
                <option value="de_DE">Allemand (de_DE)</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="flex items-center text-sm font-medium text-slate-300 mb-1">
              <IconBrandTwitter size={16} className="mr-1" />
              Type de Twitter Card
            </label>
            <select
              value={twitterCard}
              onChange={(e) => setTwitterCard(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
            >
              {twitterCards.map(card => (
                <option key={card} value={card}>{card}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-300">
                Aperçu
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!htmlOutput}
                  className="text-slate-400 hover:text-white disabled:opacity-50"
                  title="Copier"
                >
                  <IconCopy size={18} />
                </button>
                <button
                  onClick={clearAll}
                  disabled={!title && !description && !url}
                  className="text-slate-400 hover:text-white disabled:opacity-50"
                  title="Effacer"
                >
                  <IconTrash size={18} />
                </button>
              </div>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 rounded-t-md p-3 text-xs font-mono text-slate-300 h-64 overflow-auto">
              {htmlOutput ? (
                htmlOutput.split('\n').map((line, i) => (
                  <div key={i} className="my-1">{line}</div>
                ))
              ) : (
                <p className="text-slate-500">Les balises meta apparaîtront ici...</p>
              )}
            </div>
            
            <div className="bg-slate-700 border border-slate-600 border-t-0 rounded-b-md p-3">
              <p className="text-xs text-slate-300 font-medium mb-2">
                Comment utiliser ces meta tags :
              </p>
              <ol className="text-xs text-slate-400 list-decimal pl-4 space-y-1">
                <li>Copiez le code HTML généré</li>
                <li>Collez-le dans la section <code>&lt;head&gt;</code> de votre page HTML</li>
                <li>Ces balises permettront un partage optimisé sur les réseaux sociaux</li>
              </ol>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
              <IconBrandFacebook size={16} className="mr-2" />
              Aperçu Facebook
            </h3>
            <div className="border border-slate-700 rounded-md p-3 bg-white text-black">
              {imageUrl && (
                <div className="h-40 bg-slate-300 rounded-md mb-2 overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Open Graph preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ccc'/%3E%3Cpath d='M30 50 L70 50 M50 30 L50 70' stroke='%23999' stroke-width='4'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}
              <div className="text-xs text-slate-500 uppercase">
                {siteName || "example.com"}
              </div>
              <div className="text-sm font-bold">
                {title || "Titre de la page"}
              </div>
              <div className="text-xs text-slate-600 line-clamp-2">
                {description || "Description de la page qui apparaîtra dans l'aperçu..."}
              </div>
            </div>
            
            <h3 className="text-sm font-medium text-slate-300 mb-2 mt-4 flex items-center">
              <IconBrandTwitter size={16} className="mr-2" />
              Aperçu Twitter
            </h3>
            <div className="border border-slate-700 rounded-md p-3 bg-white text-black">
              {twitterCard === "summary_large_image" && imageUrl && (
                <div className="h-40 bg-slate-300 rounded-md mb-2 overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Twitter preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23ccc'/%3E%3Cpath d='M30 50 L70 50 M50 30 L50 70' stroke='%23999' stroke-width='4'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              )}
              <div className="text-sm font-bold mb-1">
                {title || "Titre de la page"}
              </div>
              <div className="text-xs text-slate-600 line-clamp-2">
                {description || "Description de la page qui apparaîtra dans l'aperçu..."}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {url ? new URL(url).hostname : "example.com"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}