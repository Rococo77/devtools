interface PasswordOptions {
    length: number;
    includeLowercase: boolean;
    includeUppercase: boolean;
    includeNumbers: boolean;
    includeSymbols: boolean;
  }
  
  export function generatePassword(options: PasswordOptions): string {
    const { length, includeLowercase, includeUppercase, includeNumbers, includeSymbols } = options;
    
    // Vérifier qu'au moins un type de caractère est inclus
    if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
      throw new Error("Veuillez sélectionner au moins un type de caractères");
    }
  
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/";
    
    let validChars = "";
    if (includeLowercase) validChars += lowercase;
    if (includeUppercase) validChars += uppercase;
    if (includeNumbers) validChars += numbers;
    if (includeSymbols) validChars += symbols;
  
    // S'assurer que le mot de passe contient au moins un caractère de chaque type sélectionné
    let newPassword = "";
    
    // Ajouter un caractère de chaque type sélectionné
    if (includeLowercase) {
      newPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    }
    if (includeUppercase) {
      newPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    }
    if (includeNumbers) {
      newPassword += numbers[Math.floor(Math.random() * numbers.length)];
    }
    if (includeSymbols) {
      newPassword += symbols[Math.floor(Math.random() * symbols.length)];
    }
    
    // Compléter avec des caractères aléatoires
    while (newPassword.length < length) {
      newPassword += validChars[Math.floor(Math.random() * validChars.length)];
    }
    
    // Mélanger les caractères
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('').substring(0, length);
    
    return newPassword;
  }
  
  export function calculatePasswordStrength(password: string): number {
    let strength = 0;
    
    // Longueur
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    if (password.length >= 16) strength += 1;
    
    // Complexité
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;
    
    // Normaliser sur 100
    return Math.min(Math.floor((strength / 7) * 100), 100);
  }