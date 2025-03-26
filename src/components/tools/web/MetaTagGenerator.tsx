"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { IconBrandFacebook, IconBrandTwitter, IconLink, IconCopy, IconTrash, IconRefresh } from "@tabler/icons-react";
import toast, { Toaster } from "react-hot-toast";

interface MetaTag {
  name?: string;
  content: string;
  property?: string;
}

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [type, setType] = useState("website");
  const [locale, setLocale] = useState("fr_FR");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [showPreview, setShowPreview] = useState(false);

  const generateMetaTags = (): MetaTag[] => {
    const tags: MetaTag[] = [];

    // Basic Meta Tags
    if (title) {
      tags.push({ name: "title", content: title });
      tags.push({ property: "og:title", content: title });
      tags.push({ name: "twitter:title", content: title });
    }

    if (description) {
      tags.push({ name: "description", content: description });
      tags.push({ property: "og:description", content: description });
      tags.push({ name: "twitter:description", content: description });
    }

    // Open Graph Tags
    if (url) {
      tags.push({ property: "og:url", content: url });
    }

    if (imageUrl) {
      tags.push({ property: "og:image", content: imageUrl });
      tags.push({ name: "twitter:image", content: imageUrl });
    }

    if (siteName) {
      tags.push({ property: "og:site_name", content: siteName });
    }

    if (type) {
      tags.push({ property: "og:type", content: type });
    }

    if (locale) {
      tags.push({ property: "og:locale", content: locale });
    }

    // Twitter Card Tags
    if (twitterCard) {
      tags.push({ name: "twitter:card", content: twitterCard });
    }

    return tags;
  };

  const generateMetaHtml = (): string => {
    const tags = generateMetaTags();
    return tags
      .map((tag) => {
        if (tag.property) {
          return `<meta property="${tag.property}" content="${tag.content}">`;
        } else {
          return `<meta name="${tag.name}" content="${tag.content}">`;
        }
      })
      .join("\n");
  };

  const copyToClipboard = () => {
    const html = generateMetaHtml();
    navigator.clipboard.writeText(html);
    toast.success("Meta tags copiés dans le presse-papiers");
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
    setShowPreview(false);
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
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <IconRefresh size={16} className="mr-1" />
            Exemple
          </button>
          <button
            onClick={clearAll}
            className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm"
          >
            <IconTrash size={16} className="mr-1" />
            Effacer
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
              placeholder="Titre de votre page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white h-24"
              placeholder="Description de votre page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              URL de la page
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 bg-slate-700 border border-r-0 border-slate-700 rounded-l-md text-gray-400">
                <IconLink size={16} />
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white"
                placeholder="https://votresite.com/page"
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
              placeholder="https://votresite.com/image.jpg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Nom du site
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                placeholder="Nom de votre site"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                <option value="website">Site web</option>
                <option value="article">Article</option>
                <option value="product">Produit</option>
                <option value="profile">Profil</option>
                <option value="video">Vidéo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <option value="en_GB">Anglais (en_GB)</option>
                <option value="de_DE">Allemand (de_DE)</option>
                <option value="es_ES">Espagnol (es_ES)</option>
                <option value="it_IT">Italien (it_IT)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Type de carte Twitter
              </label>
              <select
                value={twitterCard}
                onChange={(e) => setTwitterCard(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
              >
                <option value="summary">Résumé</option>
                <option value="summary_large_image">Résumé avec grande image</option>
                <option value="app">Application</option>
                <option value="player">Lecteur</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium flex items-center">
              <IconBrandFacebook size={18} className="mr-1 text-blue-400" />
              <IconBrandTwitter size={18} className="mr-1 text-sky-400" />
              Meta Tags générés
            </h3>
            <button
              onClick={copyToClipboard}
              disabled={!title && !description}
              className={`text-slate-400 hover:text-white ${
                !title && !description ? "opacity-50 cursor-not-allowed" : ""
              }`}
              title="Copier"
            >
              <IconCopy size={18} />
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-700 rounded-md p-4 font-mono text-sm overflow-auto h-60">
            {generateMetaTags().length > 0 ? (
              <pre className="text-green-400 whitespace-pre-wrap">
                {generateMetaHtml()}
              </pre>
            ) : (
              <div className="text-slate-500 flex items-center justify-center h-full">
                Remplissez le formulaire pour générer les meta tags
              </div>
            )}
          </div>

          {(title || description || imageUrl) && (
            <div className="mt-4">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="text-purple-400 hover:text-purple-300 text-sm mb-2"
              >
                {showPreview ? "Masquer" : "Afficher"} la prévisualisation
              </button>

              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-md overflow-hidden"
                >
                  <div className="bg-slate-100 p-2 flex items-center space-x-1 text-xs text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-2">Aperçu Facebook</span>
                  </div>
                  
                  <div className="border border-gray-300">
                    {imageUrl && (
                      <div className="h-40 bg-gray-200 overflow-hidden relative">
                        <img
                          src={imageUrl}
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/1200x630/e2e8f0/64748b?text=Image+non+disponible";
                          }}
                        />
                      </div>
                    )}
                    <div className="p-3">
                      <div className="text-xs text-blue-600 uppercase mb-1">
                        {siteName || "VOTRE SITE"}
                      </div>
                      <div className="text-base font-bold text-gray-900 mb-1 line-clamp-2">
                        {title || "Titre de votre page"}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-2">
                        {description || "Description de votre page qui apparaîtra dans les résultats de recherche et sur les réseaux sociaux."}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {url ? url.replace(/^https?:\/\//, "") : "votresite.com"}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-slate-700/30 p-4 rounded-md text-sm text-slate-300">
        <h3 className="font-medium text-white mb-2">À propos des Meta Tags Open Graph</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Les meta tags Open Graph améliorent l'apparence de vos liens sur les réseaux sociaux.</li>
          <li>Ils sont utilisés par Facebook, Twitter, LinkedIn et d'autres plateformes.</li>
          <li>Pour une image optimale, utilisez une taille de 1200x630 pixels.</li>
          <li>Incluez ces tags dans la section &lt;head&gt; de votre page HTML.</li>
        </ul>
      </div>
    </div>
  );
}