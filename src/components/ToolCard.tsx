import Link from "next/link";
import { motion } from "framer-motion";
import { IconArrowRight } from "@tabler/icons-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color?: string;
}

export default function ToolCard({ title, description, icon, link, color = "bg-blue-600" }: ToolCardProps) {
  return (
    <Link href={link} className="block h-full">
      <motion.div
        whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
        whileTap={{ scale: 0.98 }}
        className="bg-slate-800 border border-slate-700 rounded-lg p-6 h-full cursor-pointer hover:bg-slate-750 transition-all"
      >
        <div className={`${color} p-3 rounded-lg inline-block mb-4`}>
          {icon}
        </div>

        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-400 mb-4">{description}</p>
        
        <div className="flex items-center text-purple-400 text-sm font-medium">
          Découvrir <IconArrowRight size={16} className="ml-1" />
        </div>
      </motion.div>
    </Link>
  );
}