// Validadores y generadores de mensajes explicativos por tipo de campo

export const ONLY_LETTERS_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
export const ONLY_NUMBERS_REGEX = /^[0-9]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Valida un campo de texto que debe contener solo letras (nombres, apellidos)
 */
export const validateOnlyLetters = (val, fieldName = "este campo") => {
  if (!val || !val.trim()) return `${fieldName} es obligatorio.`;
  if (!ONLY_LETTERS_REGEX.test(val.trim())) {
    return `Este campo es solo específico para letras (nombres y apellidos).`;
  }
  return "";
};

/**
 * Valida opcionalmente texto con solo letras (por ejemplo segundo nombre)
 */
export const validateOptionalLetters = (val) => {
  if (val && val.trim() && !ONLY_LETTERS_REGEX.test(val.trim())) {
    return `Este campo es solo específico para letras.`;
  }
  return "";
};

/**
 * Valida un campo numérico obligatorio (documento, celular, ficha)
 */
export const validateOnlyNumbers = (val, fieldName = "este campo", minLen = 1, maxLen = 20) => {
  if (!val || !val.toString().trim()) return `${fieldName} es obligatorio.`;
  const strVal = val.toString().trim();
  if (!ONLY_NUMBERS_REGEX.test(strVal)) {
    return `Este campo es solo específico para números.`;
  }
  if (strVal.length < minLen || strVal.length > maxLen) {
    return `Debe tener entre ${minLen} y ${maxLen} dígitos numéricos.`;
  }
  return "";
};

/**
 * Valida correo electrónico
 */
export const validateEmail = (val) => {
  if (!val || !val.trim()) return "El correo electrónico es obligatorio.";
  if (!EMAIL_REGEX.test(val.trim())) {
    return "Este campo es solo específico para un correo electrónico válido (ejemplo@dominio.com).";
  }
  return "";
};

/**
 * Valida contraseña segura
 */
export const validatePassword = (val) => {
  if (!val) return "La contraseña es obligatoria.";
  if (!PASSWORD_REGEX.test(val)) {
    return "Este campo requiere una contraseña de mínimo 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.";
  }
  return "";
};

/**
 * Valida montos numéricos mayores a cero
 */
export const validateAmount = (val, fieldName = "El monto") => {
  if (val === "" || val === null || val === undefined) return `${fieldName} es obligatorio.`;
  const num = Number(val);
  if (isNaN(num)) return `Este campo es solo específico para números.`;
  if (num <= 0) return `${fieldName} debe ser un valor positivo mayor a 0.`;
  return "";
};

/**
 * Valida URLs
 */
export const validateUrl = (val) => {
  if (!val || !val.trim()) return "";
  if (!URL_REGEX.test(val.trim())) {
    return "Este campo es solo específico para URLs de enlace válidas (ejemplo: https://sitio.com).";
  }
  return "";
};
