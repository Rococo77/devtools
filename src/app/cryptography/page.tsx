"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import WebToolCard from "@/components/WebToolCard";
import HashGenerator from "@/components/tools/cryptography/HashGenerator";
import AESEncryption from "@/components/tools/cryptography/AesEncryption";
import { IconLock, IconShieldLock } from "@tabler/icons-react";

export default function CryptographyTools() {
  const [activeTab, setActiveTab] = useState("hash");

  const tools = [
    {
      id: "hash",
      title: "Générateur de hash",
      description: "SHA-256, MD5, Bcrypt et autres algorithmes",
      icon: <IconShieldLock size={24} />,
      color: "bg-purple-600"
    },
    {
      id: "aes",
      title: "Chiffrement AES",
      description: "Chiffrer et déchiffrer avec AES",
      icon: <IconLock size={24} />,
      color: "bg-blue-600"
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
        <h1 className="text-3xl font-bold mb-4">Outils de Cryptographie</h1>
        <p className="text-slate-400 mb-8">
          Outils pour sécuriser vos données: hachage, chiffrement et génération de clés cryptographiques.
        </p>

        <AdBanner adSlot="1234567890" format="horizontal" className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
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
          <TabsContent value="hash">
            <HashGenerator />
          </TabsContent>

          <TabsContent value="aes">
            <AESEncryption />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}