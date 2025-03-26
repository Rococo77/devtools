import { motion } from "framer-motion";

interface InputRangeProps {
  length: number;
  setLength: (length: number) => void;
}

export default function InputRange({ length, setLength }: InputRangeProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label htmlFor="length" className="text-white font-medium">
          Longueur du mot de passe
        </label>
        <motion.span 
          key={length}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="bg-purple-600 text-white rounded-md px-2.5 py-0.5 text-sm font-semibold"
        >
          {length}
        </motion.span>
      </div>
      <div className="px-1"> {/* Ajout d'un padding pour aligner avec l'échelle */}
        <input
          id="length"
          type="range"
          min="4"
          max="32"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
          style={{
            WebkitAppearance: 'none',
            width: 'calc(100% - 8px)',
            margin: '0 4px'
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-400 mt-2 px-0.5">
        <span>4</span>
        <span>12</span>
        <span>24</span>
        <span>32</span>
      </div>
    </div>
  );
}