import React, { useEffect, useState } from 'react';
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
  const windowWidth = useWindowWidth();
  const [clientId, setClientId] = useState('');
  
  useEffect(() => {
    // Remplacez par votre client ID Google AdSense
    setClientId('ca-pub-XXXXXXXXXXXXXXXX');
    
    // Charge le script AdSense si ce n'est pas déjà fait
    const hasAdScript = document.querySelector('script[src*="adsbygoogle.js"]');
    
    if (!hasAdScript) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.adClient = clientId;
      document.head.appendChild(script);
    }
    
    // Force la tentative de chargement des annonces
    //try {
      //(window.adsbygoogle = window.adsbygoogle || []).push({});
      //setAdLoaded(true);
    //} catch (error) {
      //console.error('Error loading AdSense ads:', error);
    //}
  }, [clientId]);
  
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

  return (
    <div className={`ad-container my-4 ${className}`}>
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