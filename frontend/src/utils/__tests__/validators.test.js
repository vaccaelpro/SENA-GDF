import { describe, it, expect } from "vitest";
import {
  validateOnlyLetters,
  validateOptionalLetters,
  validateOnlyNumbers,
  validateEmail,
  validatePassword,
  validateAmount,
  validateUrl,
} from "../validators";

describe("validators", () => {
  describe("validateOnlyLetters", () => {
    it("retorna error cuando el valor es vacío", () => {
      expect(validateOnlyLetters("", "nombre")).toBe("nombre es obligatorio.");
      expect(validateOnlyLetters("   ", "nombre")).toBe("nombre es obligatorio.");
    });

    it("retorna '' para texto con solo letras", () => {
      expect(validateOnlyLetters("Juan Perez", "nombre")).toBe("");
    });

    it("retorna error de letras cuando hay números", () => {
      expect(validateOnlyLetters("Juan1", "nombre")).toBe(
        "Este campo es solo específico para letras (nombres y apellidos)."
      );
    });
  });

  describe("validateOptionalLetters", () => {
    it("retorna '' para vacío (opcional)", () => {
      expect(validateOptionalLetters("")).toBe("");
      expect(validateOptionalLetters(undefined)).toBe("");
    });

    it("retorna error si tiene contenido no alfabético", () => {
      expect(validateOptionalLetters("abc123")).toBe(
        "Este campo es solo específico para letras."
      );
    });

    it("retorna '' para contenido válido", () => {
      expect(validateOptionalLetters("María")).toBe("");
    });
  });

  describe("validateOnlyNumbers", () => {
    it("retorna obligatorio para vacío", () => {
      expect(validateOnlyNumbers("", "documento")).toBe("documento es obligatorio.");
    });

    it("retorna error de tipo para no numérico", () => {
      expect(validateOnlyNumbers("12a", "documento")).toBe(
        "Este campo es solo específico para números."
      );
    });

    it("retorna error de longitud fuera de rango", () => {
      expect(validateOnlyNumbers("123", "documento", 5, 20)).toBe(
        "Debe tener entre 5 y 20 dígitos numéricos."
      );
    });

    it("retorna '' para número válido dentro del rango", () => {
      expect(validateOnlyNumbers("123456", "documento", 5, 20)).toBe("");
    });
  });

  describe("validateEmail", () => {
    it("retorna obligatorio para vacío", () => {
      expect(validateEmail("")).toBe("El correo electrónico es obligatorio.");
    });

    it("retorna error para email inválido", () => {
      expect(validateEmail("notanemail")).toBe(
        "Este campo es solo específico para un correo electrónico válido (ejemplo@dominio.com)."
      );
    });

    it("retorna '' para email válido", () => {
      expect(validateEmail("juan@test.com")).toBe("");
    });
  });

  describe("validatePassword", () => {
    it("retorna obligatorio para vacío", () => {
      expect(validatePassword("")).toBe("La contraseña es obligatoria.");
    });

    it("retorna error para contraseña débil", () => {
      expect(validatePassword("abc")).toContain("mínimo 8 caracteres");
    });

    it("retorna '' para contraseña fuerte", () => {
      expect(validatePassword("Abc12345")).toBe("");
    });
  });

  describe("validateAmount", () => {
    it("retorna obligatorio para vacío/null/undefined", () => {
      expect(validateAmount("", "El monto")).toBe("El monto es obligatorio.");
      expect(validateAmount(null, "El monto")).toBe("El monto es obligatorio.");
      expect(validateAmount(undefined, "El monto")).toBe("El monto es obligatorio.");
    });

    it("retorna error para no numérico", () => {
      expect(validateAmount("abc", "El monto")).toBe(
        "Este campo es solo específico para números."
      );
    });

    it("retorna error para cero o negativo", () => {
      expect(validateAmount(0, "El monto")).toBe(
        "El monto debe ser un valor positivo mayor a 0."
      );
      expect(validateAmount(-10, "El monto")).toBe(
        "El monto debe ser un valor positivo mayor a 0."
      );
    });

    it("retorna '' para valor positivo", () => {
      expect(validateAmount(100, "El monto")).toBe("");
      expect(validateAmount("50.5", "El monto")).toBe("");
    });
  });

  describe("validateUrl", () => {
    it("retorna '' para vacío (opcional)", () => {
      expect(validateUrl("")).toBe("");
    });

    it("retorna error para URL inválida", () => {
      expect(validateUrl("notaurl")).toBe(
        "Este campo es solo específico para URLs de enlace válidas (ejemplo: https://sitio.com)."
      );
    });

    it("retorna '' para URL válida", () => {
      expect(validateUrl("https://sitio.com")).toBe("");
    });
  });
});