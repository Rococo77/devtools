/**
 * Encode une chaîne de caractères en Base64
 * @param str Chaîne à encoder
 * @returns Chaîne encodée en Base64
 */
export function encodeBase64(str: string): string {
  try {
    return window.btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    throw new Error("Erreur lors de l'encodage en Base64");
  }
}

/**
 * Décode une chaîne Base64 en texte
 * @param base64 Chaîne Base64 à décoder
 * @returns Chaîne décodée
 */
export function decodeBase64(base64: string): string {
  try {
    return decodeURIComponent(escape(window.atob(base64)));
  } catch (error) {
    throw new Error("Erreur lors du décodage Base64");
  }
}

/**
 * Encode une chaîne de caractères pour URL
 * @param str Chaîne à encoder
 * @returns Chaîne encodée pour URL
 */
export function encodeURL(str: string): string {
  try {
    return encodeURIComponent(str);
  } catch (error) {
    throw new Error("Erreur lors de l'encodage URL");
  }
}

/**
 * Décode une chaîne URL encodée
 * @param url Chaîne URL à décoder
 * @returns Chaîne décodée
 */
export function decodeURL(url: string): string {
  try {
    return decodeURIComponent(url);
  } catch (error) {
    throw new Error("Erreur lors du décodage URL");
  }
}

/**
 * Parse un token JWT
 * @param token Token JWT à parser
 * @returns Objet contenant le header, payload et signature du token
 */
export function parseJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error("Format de token JWT invalide");
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = parts[2];

    // Vérification très basique (ne vérifie pas la signature cryptographique)
    const valid = parts[0].length > 0 && parts[1].length > 0 && parts[2].length > 0;

    return {
      header,
      payload,
      signature,
      valid
    };
  } catch (error) {
    throw new Error("Erreur lors du parsing du token JWT");
  }
}

/**
 * Génère des meta tags Open Graph à partir des données fournies
 * @param options Options pour les meta tags
 * @returns Chaîne HTML contenant les meta tags
 */
export function generateOpenGraphTags(options: {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  siteName?: string;
  type?: string;
  locale?: string;
  twitterCard?: string;
}): string {
  const tags: string[] = [];

  if (options.title) {
    tags.push(`<meta property="og:title" content="${options.title}">`);
    tags.push(`<meta name="twitter:title" content="${options.title}">`);
  }

  if (options.description) {
    tags.push(`<meta property="og:description" content="${options.description}">`);
    tags.push(`<meta name="twitter:description" content="${options.description}">`);
  }

  if (options.url) {
    tags.push(`<meta property="og:url" content="${options.url}">`);
  }

  if (options.image) {
    tags.push(`<meta property="og:image" content="${options.image}">`);
    tags.push(`<meta name="twitter:image" content="${options.image}">`);
  }

  if (options.siteName) {
    tags.push(`<meta property="og:site_name" content="${options.siteName}">`);
  }

  if (options.type) {
    tags.push(`<meta property="og:type" content="${options.type}">`);
  }

  if (options.locale) {
    tags.push(`<meta property="og:locale" content="${options.locale}">`);
  }

  if (options.twitterCard) {
    tags.push(`<meta name="twitter:card" content="${options.twitterCard}">`);
  }

  return tags.join('\n');
}

/**
 * Vérifie si un User Agent correspond à un appareil mobile
 * @param userAgent Chaîne User Agent à vérifier
 * @returns true si l'appareil est mobile, false sinon
 */
export function isMobileDevice(userAgent: string): boolean {
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

/**
 * Détecte le navigateur à partir d'un User Agent
 * @param userAgent Chaîne User Agent à analyser
 * @returns Nom du navigateur
 */
export function detectBrowser(userAgent: string): string {
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) return "Internet Explorer";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
  
  return "Inconnu";
}