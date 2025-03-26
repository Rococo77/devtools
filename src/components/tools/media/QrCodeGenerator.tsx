"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QRCode from "qrcode.react";
import { toPng } from 'html-to-image';
import toast, { Toaster } from "react-hot-toast";
import { IconDownload, IconRefresh, IconWifi, IconMail, IconUser, IconWorld } from "@tabler/icons-react";

export default function QrCodeGenerator() {
  const [activeTab, setActiveTab] = useState<"url" | "text" | "wifi" | "contact" | "email">("url");
  const [qrData, setQrData] = useState("https://example.com");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(200);
  const [includeMargin, setIncludeMargin] = useState(true);
  
  // Données spécifiques pour chaque type
  const [url, setUrl] = useState("https://example.com");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState({ ssid: "", password: "", encryption: "WPA" });
  const [contact, setContact] = useState({ name: "", phone: "", email: "", address: "" });
  const [email, setEmail] = useState({ address: "", subject: "", body: "" });

  const qrRef = useRef<HTMLDivElement>(null);
  
  // Générer le contenu QR en fonction du type actif
  useEffect(() => {
    updateQRCode();
  }, [activeTab, url, text, wifi, contact, email]);
  
  const updateQRCode = () => {
    let data = "";
    
    switch (activeTab) {
      case "url":
        data = url;
        break;
      case "text":
        data = text;
        break;
      case "wifi":
        // Format WiFi: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
        data = `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;`;
        break;
      case "contact":
        // Format vCard simplifié
        data = `BEGIN:VCARD
VERSION:3.0
N:${contact.name}
TEL:${contact.phone}
EMAIL:${contact.email}
ADR:${contact.address}
END:VCARD`;
        break;
      case "email":
        // Format mailto:
        data = `mailto:${email.address}?subject=${encodeURIComponent(email.subject)}&body=${encodeURIComponent(email.body)}`;
        break;
      default:
        data = "https://example.com";
    }
    
    setQrData(data);
  };
  
  const downloadQRCode = () => {
    if (qrRef.current) {
      toast.promise(
        toPng(qrRef.current, { cacheBust: true })
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `qrcode-${activeTab}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }),
        {
          loading: 'Génération du QR Code...',
          success: 'QR Code téléchargé !',
          error: 'Erreur lors du téléchargement',
        }
      );
    }
  };
  
  const resetForm = () => {
    switch (activeTab) {
      case "url":
        setUrl("https://example.com");
        break;
      case "text":
        setText("");
        break;
      case "wifi":
        setWifi({ ssid: "", password: "", encryption: "WPA" });
        break;
      case "contact":
        setContact({ name: "", phone: "", email: "", address: "" });
        break;
      case "email":
        setEmail({ address: "", subject: "", body: "" });
        break;
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <Toaster position="top-right" />
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Générateur de QR Code</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full mb-6">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="url" className="flex items-center gap-1">
                <IconWorld size={16} />
                <span className="hidden sm:inline">URL</span>
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-1">
                <IconRefresh size={16} />
                <span className="hidden sm:inline">Texte</span>
              </TabsTrigger>
              <TabsTrigger value="wifi" className="flex items-center gap-1">
                <IconWifi size={16} />
                <span className="hidden sm:inline">WiFi</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-1">
                <IconUser size={16} />
                <span className="hidden sm:inline">Contact</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-1">
                <IconMail size={16} />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="https://example.com"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="text">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Texte</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white h-32"
                  placeholder="Entrez le texte à encoder..."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="wifi">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nom du réseau (SSID)</label>
                <input
                  type="text"
                  value={wifi.ssid}
                  onChange={(e) => setWifi({...wifi, ssid: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="Nom du réseau WiFi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mot de passe</label>
                <input
                  type="text"
                  value={wifi.password}
                  onChange={(e) => setWifi({...wifi, password: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="Mot de passe WiFi"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Type de sécurité</label>
                <select
                  value={wifi.encryption}
                  onChange={(e) => setWifi({...wifi, encryption: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                >
                  <option value="WPA">WPA/WPA2/WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="">Sans sécurité</option>
                </select>
              </div>
            </TabsContent>
            
            <TabsContent value="contact">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nom</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({...contact, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="Nom complet"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({...contact, phone: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="+33612345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({...contact, email: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse</label>
                <input
                  type="text"
                  value={contact.address}
                  onChange={(e) => setContact({...contact, address: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="123 rue Example, 75000 Paris"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="email">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Adresse email</label>
                <input
                  type="email"
                  value={email.address}
                  onChange={(e) => setEmail({...email, address: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Sujet</label>
                <input
                  type="text"
                  value={email.subject}
                  onChange={(e) => setEmail({...email, subject: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white"
                  placeholder="Sujet du message"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Corps du message</label>
                <textarea
                  value={email.body}
                  onChange={(e) => setEmail({...email, body: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md p-2 text-white h-24"
                  placeholder="Contenu du message..."
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Couleur du QR Code</label>
                <div className="flex">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-l-md p-1 h-10 w-12"
                  />
                  <input
                    type="text"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Couleur de fond</label>
                <div className="flex">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-l-md p-1 h-10 w-12"
                  />
                  <input
                    type="text"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-r-md p-2 text-white flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Taille du QR Code (px)</label>
              <input
                type="range"
                min="100"
                max="400"
                step="10"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>100px</span>
                <span>{qrSize}px</span>
                <span>400px</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeMargin"
                checked={includeMargin}
                onChange={(e) => setIncludeMargin(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeMargin" className="text-sm text-slate-300">
                Inclure une marge
              </label>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={resetForm}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-md flex items-center text-sm"
              >
                <IconRefresh size={16} className="mr-1" />
                Réinitialiser
              </button>
              
              <button
                onClick={downloadQRCode}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center text-sm"
              >
                <IconDownload size={16} className="mr-1" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-center bg-slate-700/30 rounded-lg p-4">
          <div 
            ref={qrRef}
            className="p-4 bg-white rounded-lg flex items-center justify-center"
            style={{ backgroundColor: qrBgColor, width: `${qrSize + 16}px`, height: `${qrSize + 16}px` }}
          >
            <QRCode 
              value={qrData}
              size={qrSize}
              bgColor={qrBgColor}
              fgColor={qrColor}
              includeMargin={includeMargin}
              level="H"
              renderAs="svg"
            />
          </div>
          
          <p className="mt-4 text-sm text-slate-400 text-center max-w-xs">
            Scannez ce QR code avec votre smartphone ou téléchargez-le pour l'imprimer ou le partager.
          </p>
        </div>
      </div>
    </div>
  );
}