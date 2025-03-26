"use client";
import { useEffect } from 'react';

declare global {
  interface Window {
    __tcfapi: any;
    OnetrustActiveGroups: string;
    OneTrust: any;
  }
}

export default function ConsentManager() {
  useEffect(() => {
    // OneTrust Cookie Consent
    const script = document.createElement('script');
    script.src = 'https://cdn.cookielaw.org/scripttemplates/otSDKStub.js';
    script.type = 'text/javascript';
    script.charset = 'UTF-8';
    script.setAttribute('data-domain-script', 'VOTRE-ID-ONETRUST');
    document.head.appendChild(script);

    // Fonction pour vérifier si OneTrust est chargé et accessible
    const checkOneTrust = () => {
      if (typeof window.OneTrust !== 'undefined') {
        console.log('OneTrust chargé avec succès');
      } else {
        setTimeout(checkOneTrust, 500);
      }
    };

    checkOneTrust();

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        console.error('Erreur lors du nettoyage du script CMP:', e);
      }
    };
  }, []);

  return null;
}