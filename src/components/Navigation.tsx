"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  IconMenu2, IconX, IconHome, IconLock, IconCode, 
  IconWorld, IconPhoto, IconRefresh, IconArrowsExchange 
} from "@tabler/icons-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Accueil", href: "/", icon: <IconHome size={20} /> },
    { name: "Mots de passe", href: "/password", icon: <IconLock size={20} /> },
    { name: "Cryptographie", href: "/cryptography", icon: <IconRefresh size={20} /> },
    { name: "Web", href: "/web", icon: <IconWorld size={20} /> },
    { name: "Conversion", href: "/convert", icon: <IconArrowsExchange size={20} /> },
    { name: "Développement", href: "/devtools", icon: <IconCode size={20} /> },
    { name: "Médias", href: "/media", icon: <IconPhoto size={20} /> },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-white text-glow">DevToolbox</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-2">
                {links.map((link) => {
                  const isActive = pathname === link.href || 
                                  (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium flex items-center relative ${
                        isActive
                          ? "bg-slate-700 text-white"
                          : "text-gray-300 hover:bg-slate-700 hover:text-white"
                      }`}
                    >
                      <span className="mr-2">{link.icon}</span>
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 focus:outline-none"
            >
              {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => {
              const isActive = pathname === link.href || 
                              (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium flex items-center ${
                    isActive
                      ? "bg-slate-700 text-white"
                      : "text-gray-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </nav>
  );
}