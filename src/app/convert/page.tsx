"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import WebToolCard from "@/components/WebToolCard";
import DateTimeConverter from "@/components/tools/convert/DateTimeConverter";
import YamlJsonConverter from "@/components/tools/convert/JsonToYamlConverter";
import Base64FileConverter from "@/components/tools/convert/Base64FileConverter";
import UnitConverter from "@/components/tools/convert/UnitConverter";
import NumberBaseConverter from "@/components/tools/convert/NumberBaseConverter";
import { 
  IconCalendar, 
  IconCode, 
  IconFile, 
  IconRuler, 
  IconBinary 
} from "@tabler/icons-react";

export default function ConvertTools() {
  const [activeTab, setActiveTab] = useState("datetime");

  const tools = [
    {
      id: "datetime",
      title: "Convertisseur Date/Heure",
      description: "ISO, UNIX, UTC et formats personnalisés",
      icon: <IconCalendar size={24} />,
      color: "bg-green-600"
    },
    {
      id: "yaml",
      title: "Convertisseur YAML/JSON",
      description: "Convertir entre YAML, JSON et TOML",
      icon: <IconCode size={24} />,
      color: "bg-orange-600"
    },
    {
      id: "base64file",
      title: "Fichier → Base64",
      description: "Convertir des fichiers en Base64 et vice-versa",
      icon: <IconFile size={24} />,
      color: "bg-blue-600"
    },
    {
      id: "units",
      title: "Convertisseur d'unités",
      description: "Longueur, masse, volume, température, etc.",
      icon: <IconRuler size={24} />,
      color: "bg-purple-600"
    },
    {
      id: "base",
      title: "Convertisseur de bases",
      description: "Binaire, octal, décimal, hexadécimal",
      icon: <IconBinary size={24} />,
      color: "bg-pink-600"
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
        <h1 className="text-3xl font-bold mb-4">Outils de Conversion</h1>
        <p className="text-slate-400 mb-8">
          Convertissez facilement entre différents formats de données, dates et unités.
        </p>

        <AdBanner adSlot="2345678901" format="horizontal" className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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
          <TabsContent value="datetime">
            <DateTimeConverter />
          </TabsContent>

          <TabsContent value="yaml">
            <YamlJsonConverter />
          </TabsContent>
          
          <TabsContent value="base64file">
            <Base64FileConverter />
          </TabsContent>
          
          <TabsContent value="units">
            <UnitConverter />
          </TabsContent>
          
          <TabsContent value="base">
            <NumberBaseConverter />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}