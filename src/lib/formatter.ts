import { format as sqlFormatter } from 'sql-formatter';

/**
 * Formate une chaîne JSON
 * @param jsonString Chaîne JSON à formater
 * @param indent Taille de l'indentation (nombre d'espaces)
 * @returns Le JSON formaté
 */
export function formatJSON(jsonString: string, indent: number = 2): string {
  try {
    // Analyser la chaîne JSON pour vérifier qu'elle est valide
    const parsedJson = JSON.parse(jsonString);
    
    // Formater avec l'indentation spécifiée
    return JSON.stringify(parsedJson, null, indent);
  } catch (error) {
    // Gérer les erreurs de parsing
    throw new Error(`JSON invalide: ${(error as Error).message}`);
  }
}

/**
 * Minifie une chaîne JSON en supprimant tout l'espace blanc non nécessaire
 * @param jsonString Chaîne JSON à minifier
 * @returns Le JSON minifié
 */
export function minifyJSON(jsonString: string): string {
  try {
    const parsedJson = JSON.parse(jsonString);
    return JSON.stringify(parsedJson);
  } catch (error) {
    throw new Error(`JSON invalide: ${(error as Error).message}`);
  }
}

interface SQLFormatOptions {
  uppercase?: boolean;
  linesBetweenQueries?: number;
  indentSize?: number;
}

/**
 * Formate une chaîne SQL
 * @param sqlString Chaîne SQL à formater
 * @param options Options de formatage SQL
 * @returns Le SQL formaté
 */
export function formatSQL(sqlString: string, options: SQLFormatOptions = {}): string {
  try {
    // Créer un objet d'options compatible avec la bibliothèque sql-formatter
    // Utiliser tabWidth au lieu de indent pour la compatibilité
    const formatterOptions = {
      language: 'sql',
      keywordCase: options.uppercase ? 'upper' : 'preserve',
      linesBetweenQueries: options.linesBetweenQueries ?? 1,
      tabWidth: options.indentSize ?? 2
    } as any; // Utiliser une assertion de type pour éviter les erreurs
    
    const formattedSQL = sqlFormatter(sqlString, formatterOptions);
    
    return formattedSQL;
  } catch (error) {
    throw new Error(`Erreur de formatage SQL: ${(error as Error).message}`);
  }
}

/**
 * Valide que la chaîne est un JSON valide
 * @param jsonString Chaîne à valider
 * @returns true si le JSON est valide, false sinon
 */
export function isValidJSON(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}

/**
 * Convertit un objet JavaScript en chaîne JSON formatée
 * @param obj Objet à convertir
 * @param indent Taille de l'indentation
 * @returns Chaîne JSON formatée
 */
export function objectToJSON(obj: any, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch (error) {
    throw new Error(`Impossible de convertir l'objet en JSON: ${(error as Error).message}`);
  }
}