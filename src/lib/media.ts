// Bibliothèque d'utilitaires pour les médias
import { Canvg } from 'canvg';

/**
 * Convertit une chaîne SVG en PNG blob
 * @param svgString Le contenu SVG à convertir
 * @param size La taille souhaitée du PNG en pixels
 * @returns Une promesse qui se résout en un Blob PNG
 */
export async function convertSvgToPng(svgString: string, size: number = 1024): Promise<Blob> {
  // Extraire la largeur et la hauteur du SVG
  let width = size;
  let height = size;
  
  // Essayer d'extraire viewBox ou width/height du SVG si possible
  const viewBoxMatch = svgString.match(/viewBox=["']([^"']*)["']/);
  const widthMatch = svgString.match(/width=["']([^"']*)["']/);
  const heightMatch = svgString.match(/height=["']([^"']*)["']/);
  
  if (viewBoxMatch && viewBoxMatch[1]) {
    const [, , vbWidth, vbHeight] = viewBoxMatch[1].split(/\s+/).map(parseFloat);
    if (!isNaN(vbWidth) && !isNaN(vbHeight)) {
      // Conserver le ratio d'aspect du viewBox
      const ratio = vbWidth / vbHeight;
      if (ratio > 1) {
        height = size / ratio;
      } else {
        width = size * ratio;
      }
    }
  } else if (widthMatch && heightMatch) {
    // Extraire width et height (en px, pt, etc.)
    const extractSize = (str: string): number => {
      const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? 0 : num;
    };
    
    const svgWidth = extractSize(widthMatch[1]);
    const svgHeight = extractSize(heightMatch[1]);
    
    if (svgWidth > 0 && svgHeight > 0) {
      const ratio = svgWidth / svgHeight;
      if (ratio > 1) {
        height = size / ratio;
      } else {
        width = size * ratio;
      }
    }
  }
  
  // Créer un canvas avec la taille souhaitée
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  try {
    // Utiliser Canvg pour rendre le SVG sur le canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("Impossible de créer le contexte de canvas");
    }
    
    const v = await Canvg.fromString(ctx, svgString, {
      ignoreMouse: true,
      ignoreAnimation: true,
    });
    
    await v.render();
    
    // Convertir le canvas en PNG blob
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Échec de la conversion en PNG"));
        }
      }, 'image/png');
    });
  } catch (error) {
    throw new Error(`Erreur lors de la conversion SVG: ${(error as Error).message}`);
  }
}

/**
 * Générer un QR code pour une connexion WiFi
 * @param ssid Nom du réseau WiFi
 * @param password Mot de passe
 * @param encryption Type de chiffrement (WPA, WEP, etc.)
 * @returns Chaîne de texte formatée pour QR code WiFi
 */
export function generateWiFiQRCode(ssid: string, password: string, encryption: string): string {
  return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
}

/**
 * Générer un QR code pour un contact (vCard)
 * @param name Nom
 * @param phone Téléphone
 * @param email Email
 * @param address Adresse
 * @returns Chaîne de texte formatée en vCard
 */
export function generateContactQRCode(
  name: string, 
  phone: string, 
  email: string, 
  address: string
): string {
  return `BEGIN:VCARD
VERSION:3.0
N:${name}
TEL:${phone}
EMAIL:${email}
ADR:${address}
END:VCARD`;
}

/**
 * Générer un QR code pour un email (mailto)
 * @param email Adresse email
 * @param subject Sujet
 * @param body Corps du message
 * @returns URL mailto formatée
 */
export function generateEmailQRCode(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Redimensionner une image à une taille maximale donnée
 * @param file Fichier image
 * @param maxWidth Largeur maximale
 * @param maxHeight Hauteur maximale
 * @returns Promise contenant le Blob de l'image redimensionnée
 */
export function resizeImage(
  file: File, 
  maxWidth: number = 800, 
  maxHeight: number = 800
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        // Calculer les nouvelles dimensions en conservant le ratio
        let width = image.width;
        let height = image.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // Créer un canvas pour le redimensionnement
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Impossible de créer le contexte de canvas"));
          return;
        }
        
        ctx.drawImage(image, 0, 0, width, height);
        
        // Convertir en blob avec le même type que l'original
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Échec de la conversion en Blob"));
              return;
            }
            resolve(blob);
          },
          file.type,
          0.9 // Qualité de compression (0-1)
        );
      };
      
      image.onerror = () => {
        reject(new Error("Échec du chargement de l'image"));
      };
      
      if (typeof readerEvent.target?.result === 'string') {
        image.src = readerEvent.target.result;
      } else {
        reject(new Error("Échec de la lecture du fichier"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Échec de la lecture du fichier"));
    };
    
    reader.readAsDataURL(file);
  });
}