import yaml from 'js-yaml';
import toml from 'toml';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// JSON <-> YAML conversion
export function jsonToYaml(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr);
    return yaml.dump(obj, { indent: 2 });
  } catch (error) {
    throw new Error("JSON invalide");
  }
}

export function yamlToJson(yamlStr: string): string {
  try {
    const obj = yaml.load(yamlStr);
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    throw new Error("YAML invalide");
  }
}

// JSON <-> TOML conversion
export function jsonToToml(jsonStr: string): string {
  try {
    const obj = JSON.parse(jsonStr);
    // Cette fonction est simplifiée, une vraie implémentation 
    // devrait utiliser un package TOML writer
    return convertJsonToToml(obj, 0);
  } catch (error) {
    throw new Error("JSON invalide");
  }
}

export function tomlToJson(tomlStr: string): string {
  try {
    const obj = toml.parse(tomlStr);
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    throw new Error("TOML invalide");
  }
}

// Helper pour JSON -> TOML
function convertJsonToToml(obj: any, level: number): string {
  let result = '';
  const indent = '  '.repeat(level);
  
  if (typeof obj !== 'object' || obj === null) {
    return String(obj);
  }
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result += `${indent}[${key}]\n`;
      result += convertJsonToToml(value, level + 1);
    } else if (Array.isArray(value)) {
      result += `${indent}${key} = [`;
      result += value.map(item => 
        typeof item === 'string' ? `"${item}"` : String(item)
      ).join(', ');
      result += ']\n';
    } else if (typeof value === 'string') {
      result += `${indent}${key} = "${value}"\n`;
    } else {
      result += `${indent}${key} = ${value}\n`;
    }
  }
  
  return result;
}

// Date conversion functions
export function formatDate(date: Date, formatString: string): string {
  try {
    return format(date, formatString, { locale: fr });
  } catch (error) {
    throw new Error("Format de date invalide");
  }
}

export function dateToUnixTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function unixTimestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000);
}