import { motion } from "framer-motion";

interface WebToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: string;
  isActive: boolean;
  onClick: () => void;
}

export default function WebToolCard({ 
  title, 
  description, 
  icon, 
  color = "bg-blue-600", 
  isActive, 
  onClick 
}: WebToolCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        p-4 rounded-lg cursor-pointer transition-all
        ${isActive 
          ? 'bg-slate-700 border-2 border-purple-500' 
          : 'bg-slate-800 border border-slate-700 hover:bg-slate-750'}
      `}
      onClick={onClick}
    >
      <div className={`${color} p-2 rounded-lg inline-block mb-2`}>
        {icon}
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </motion.div>
  );
}