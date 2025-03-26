"use client";
import { useState, createContext, useContext } from "react";
import { motion } from "framer-motion";

type TabsContextType = {
  value: string;
  onChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a TabsProvider");
  }
  return context;
}

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className = "" }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabsList({ children, className = "" }: TabsListProps) {
  return (
    <div className={`flex rounded-lg bg-slate-800 p-1 ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = "" }: TabsTriggerProps) {
  const { value: selectedValue, onChange } = useTabs();
  const isActive = selectedValue === value;

  return (
    <button
      className={`relative px-3 py-1.5 text-sm font-medium transition-all rounded-md ${
        isActive 
          ? "text-white" 
          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
      } ${className}`}
      onClick={() => onChange(value)}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-slate-700 rounded-md -z-10"
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { value: selectedValue } = useTabs();
  
  if (selectedValue !== value) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}