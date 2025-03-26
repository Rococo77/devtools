"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdBanner from "@/components/AdBanner";
import WebToolCard from "@/components/WebToolCard";
import CrontabGenerator from "@/components/tools/devtools/CrontabGenerator";
import DockerCommandGenerator from "@/components/tools/devtools/DockerCommandGenerator";
import CodeFormatter from "@/components/tools/devtools/CodeFormatter";
import { IconClock, IconBox, IconCode } from "@tabler/icons-react";

export default function DevTools() {
  const [activeTab, setActiveTab] = useState("crontab");

  const tools = [
    {
      id: "crontab",
      title: "Générateur Crontab",
      description: "Créer des expressions cron facilement",
      icon: <IconClock size={24} />,
      color: "bg-blue-600"
    },
    {
      id: "docker",
      title: "Commandes Docker",
      description: "Générer des commandes Docker et docker-compose",
      icon: <IconBox size={24} />,
      color: "bg-purple-600"
    },
    {
      id: "formatter",
      title: "Formateur de Code",
      description: "Formater JSON, SQL et autres langages",
      icon: <IconCode size={24} />,
      color: "bg-green-600"
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
        <h1 className="text-3xl font-bold mb-4">Outils pour Développeurs</h1>
        <p className="text-slate-400 mb-8">
          Outils pratiques pour faciliter les tâches quotidiennes des développeurs.
        </p>

        <AdBanner adSlot="5678901234" format="horizontal" className="mb-6" />

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
          <TabsContent value="crontab">
            <CrontabGenerator />
          </TabsContent>

          <TabsContent value="docker">
            <DockerCommandGenerator />
          </TabsContent>

          <TabsContent value="formatter">
            <CodeFormatter />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}