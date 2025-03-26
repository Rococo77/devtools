import { Metadata } from "next";
import "./globals.css";
import Script from 'next/script';
import Navigation from "@/components/Navigation";


export const metadata: Metadata = {
  title: "DevToolbox - Outils pour développeurs",
  description: "Collection d'outils essentiels pour les développeurs web, mobile et système",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-slate-900 text-white min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-8 pb-24">
          {children}
        </main>
        <footer className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 text-center text-slate-400 text-sm py-4">
          <p>© {new Date().getFullYear()} DevToolbox - Tous les outils sont exécutés localement dans votre navigateur</p>
        </footer>
      </body>
    </html>
  );
}