"use client";
import { useEffect, useState, useRef } from 'react';
import { useWindowWidth } from '@react-hook/window-size';

interface AdBannerProps {
  adSlot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
  className?: string;
}

export default function AdBanner({ 
  adSlot, 
  format = 'auto', 
  style = {}, 
  className = '' 
}: AdBannerProps) {
  const [adLoaded, setAdLoaded] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const windowWidth = useWindowWidth();
  const [clientId] = useState('ca-pub-5880015622493733');
  const adRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkConsent = () => {
      // OneTrust integration - Vérifier le groupe de consentement pour la publicité (généralement C0004)
      if (typeof window !== 'undefined') {
        // 1. Via l'API TCF v2 si disponible
        if (window.__tcfapi) {
          window.__tcfapi('addEventListener', 2, (tcData: any, success: boolean) => {
            if (success && (tcData.eventStatus === 'useractioncomplete' || tcData.eventStatus === 'tcloaded')) {
              // Vérifier les consentements pour les Purposes pertinents pour la pub (2 = Publicité personnalisée)
              const hasConsent = tcData.purpose?.consents?.[2] || false;
              setConsentGiven(hasConsent);
              
              if (hasConsent) {
                loadAdScript();
              }
            }
          });
        } 
        // 2. Via l'API OneTrust si disponible
        else if (window.OneTrust && window.OnetrustActiveGroups) {
          // Vérifier si le groupe de consentement pour la publicité (C0004) est activé
          const hasConsent = window.OnetrustActiveGroups.includes('C0004');
          setConsentGiven(hasConsent);
          
          if (hasConsent) {
            loadAdScript();
          }
          
          // Écouter les changements de consentement
          document.addEventListener('consent.onetrust', () => {
            const updatedConsent = window.OnetrustActiveGroups.includes('C0004');
            setConsentGiven(updatedConsent);
            
            if (updatedConsent && !adLoaded) {
              loadAdScript();
            }
          });
        } 
        // 3. Si aucune API n'est disponible, on attend ou on suppose le consentement par défaut
        else {
          // On peut soit considérer qu'il n'y a pas de consentement par défaut (plus sûr)
          // setConsentGiven(false);
          
          // Ou attendre que les APIs soient disponibles
          setTimeout(checkConsent, 500);
        }
      }
    };
    
    checkConsent();
  }, [adLoaded]);
  
  const loadAdScript = () => {
    // Charge le script AdSense si ce n'est pas déjà fait
    const hasAdScript = document.querySelector('script[src*="adsbygoogle.js"]');
    
    if (!hasAdScript) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.adClient = clientId;
      document.head.appendChild(script);
      
      script.onload = () => {
        pushAd();
      };
    } else {
      pushAd();
    }
  };
  
  const pushAd = () => {
    // Si l'annonce n'a pas encore été chargée et que l'élément est dans le DOM
    if (!adLoaded && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setAdLoaded(true);
      } catch (error) {
        console.error('Error loading AdSense ad:', error);
      }
    }
  };
  
  // Définir les dimensions en fonction du format
  let adStyle: React.CSSProperties = { display: 'block' };
  
  switch (format) {
    case 'rectangle':
      adStyle = { ...adStyle, width: '300px', height: '250px' };
      break;
    case 'horizontal':
      adStyle = { ...adStyle, width: '728px', height: '90px' };
      if (windowWidth < 768) {
        adStyle = { ...adStyle, width: '320px', height: '100px' };
      }
      break;
    case 'vertical':
      adStyle = { ...adStyle, width: '160px', height: '600px' };
      break;
    default:
      // Format auto
      adStyle = { ...adStyle, width: '100%', height: 'auto' };
  }

  // Si on n'a pas le consentement, afficher un message ou un placeholder
  if (!consentGiven) {
    return (
      <div className={`ad-container my-4 ${className}`}>
        <div
          style={{
            ...adStyle,
            background: 'rgba(100, 116, 139, 0.1)',
            border: '1px dashed rgba(100, 116, 139, 0.3)',
            borderRadius: '4px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            textAlign: 'center',
          }}
        >
          <p className="text-sm text-slate-400">
            Nous utilisons des publicités pour financer ce service. 
            <button 
              onClick={() => window.OneTrust?.ToggleInfoDisplay()} 
              className="text-blue-400 hover:text-blue-300 ml-1 underline"
            >
              Gérer les préférences
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ad-container my-4 ${className}`} ref={adRef}>
      <div className="text-xs text-slate-500 text-center mb-1">Publicité</div>
      <ins
        className="adsbygoogle"
        style={{ ...adStyle, ...style }}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={format === 'auto' ? 'auto' : 'rectangle'}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Ajouter pour TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
    __tcfapi: any;
    OnetrustActiveGroups: string;
    OneTrust: any;
  }
}