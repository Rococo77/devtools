"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import WebToolCard from "@/components/WebToolCard";
import QrCodeGenerator from "@/components/tools/media/QrCodeGenerator";
import SVGConverter from "@/components/tools/media/SVGConverter";
import WebcamRecorder from "@/components/tools/media/WebcamRecorder";
import { IconQrcode, IconPhoto, IconVideo } from "@tabler/icons-react";

export default function MediaTools() {
  const [activeTab, setActiveTab] = useState("qrcode");

  const tools = [
    {
      id: "qrcode",
      title: "Générateur de QR Code",
      description: "Générez des QR codes pour différents types de contenu",
      icon: <IconQrcode size={24} />,
      color: "bg-purple-600"
    },
    {
      id: "svg",
      title: "Convertisseur SVG",
      description: "Convertir des SVG en PNG et autres formats",
      icon: <IconPhoto size={24} />,
      color: "bg-green-600"
    },
    {
      id: "webcam",
      title: "Enregistreur Webcam",
      description: "Enregistrez des vidéos depuis votre webcam",
      icon: <IconVideo size={24} />,
      color: "bg-red-600"
    }
  ];

  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <h1 className="text-3xl font-bold mb-4">Outils Médias</h1>
        <p className="text-slate-400 mb-8">
          Créez, manipulez et convertissez des médias et des images.
        </p>

        <AdBanner adSlot="4567890123" format="horizontal" className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {tools.map((tool) => (
            <WebToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              color={tool.color}
              isActive={activeTab === tool.id}
              onClick={() => setActiveTab(tool.id)}
            />
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="qrcode">
            <QrCodeGenerator />
          </TabsContent>

          <TabsContent value="svg">
            <SVGConverter />
          </TabsContent>

          <TabsContent value="webcam">
            <WebcamRecorder />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}