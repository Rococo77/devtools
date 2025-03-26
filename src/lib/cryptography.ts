import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

// Fonctions de hachage
export const hashMD5 = (text: string): string => {
  return CryptoJS.MD5(text).toString();
};

export const hashSHA1 = (text: string): string => {
  return CryptoJS.SHA1(text).toString();
};

export const hashSHA256 = (text: string): string => {
  return CryptoJS.SHA256(text).toString();
};

export const hashSHA512 = (text: string): string => {
  return CryptoJS.SHA512(text).toString();
};

export const hashBcrypt = async (text: string, saltRounds: number): Promise<string> => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(text, salt);
};

export const compareBcrypt = async (plainText: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plainText, hash);
};

// Fonctions de chiffrement AES
export const encryptAES = (text: string, key: string, mode = CryptoJS.mode.CBC): string => {
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: mode,
    padding: CryptoJS.pad.Pkcs7
  });
  
  // Concaténer IV et texte chiffré pour pouvoir le déchiffrer plus tard
  return iv.toString() + ":" + encrypted.toString();
};

export const decryptAES = (ciphertext: string, key: string, mode = CryptoJS.mode.CBC): string => {
  try {
    const textParts = ciphertext.split(':');
    const iv = CryptoJS.enc.Hex.parse(textParts[0]);
    const encryptedText = textParts[1];
    
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv: iv,
      mode: mode,
      padding: CryptoJS.pad.Pkcs7
    });
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error("Échec du déchiffrement. Vérifiez la clé et le texte chiffré.");
  }
};

// Génération de clés et de nonces
export const generateRandomKey = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString();
};

export const generateSecurePassword = (length: number = 16): string => {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  const randomValues = CryptoJS.lib.WordArray.random(length).words;
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.abs(randomValues[i % randomValues.length]) % charset.length;
    password += charset[randomIndex];
  }
  
  return password;
};