"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import WebToolCard from "@/components/WebToolCard";
import Base64Tool from "@/components/tools/web/Base64Tool";
import UrlEncoder from "@/components/tools/web/UrlEncoder";
import JwtParser from "@/components/tools/web/JwtParser";
import MetaTagGenerator from "@/components/tools/web/MetaTagGenerator";
import UserAgentChecker from "@/components/tools/web/UserAgentChecker";
import { IconBinary, IconLink, IconKey, IconBrowser, IconSeo } from "@tabler/icons-react";

export default function WebTools() {
  const [activeTab, setActiveTab] = useState("base64");

  const tools = [
    {
      id: "base64",
      title: "Base64 Encoder/Decoder",
      description: "Convertir du texte en Base64 et vice-versa",
      icon: <IconBinary size={24} />,
      color: "bg-blue-600"
    },
    {
      id: "urlencoder",
      title: "Encodeur URL",
      description: "Encoder et décoder des URLs",
      icon: <IconLink size={24} />,
      color: "bg-green-600"
    },
    {
      id: "jwt",
      title: "JWT Parser",
      description: "Analyser et décoder les tokens JWT",
      icon: <IconKey size={24} />,
      color: "bg-purple-600"
    },
    {
      id: "metatags",
      title: "Générateur Open Graph",
      description: "Créer des balises meta pour réseaux sociaux",
      icon: <IconSeo size={24} />,
      color: "bg-yellow-600"
    },
    {
      id: "useragent",
      title: "User-Agent Checker",
      description: "Analyser les données du navigateur",
      icon: <IconBrowser size={24} />,
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
        <h1 className="text-3xl font-bold mb-4">Outils Web</h1>
        <p className="text-slate-400 mb-8">
          Outils pour le développement web, encodage/décodage et manipulation de données web.
        </p>

        <AdBanner adSlot="3456789012" format="horizontal" className="mb-6" />

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
          <TabsContent value="base64">
            <Base64Tool />
          </TabsContent>

          <TabsContent value="urlencoder">
            <UrlEncoder />
          </TabsContent>

          <TabsContent value="jwt">
            <JwtParser />
          </TabsContent>
          
          <TabsContent value="metatags">
            <MetaTagGenerator />
          </TabsContent>
          
          <TabsContent value="useragent">
            <UserAgentChecker />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}