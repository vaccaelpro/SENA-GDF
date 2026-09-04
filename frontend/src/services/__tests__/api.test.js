import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// --- Mock de localStorage global ---
// Se stubbea UNA vez y se mantiene para toda la suite (no unstub).
let store = {};
const localStorageMock = {
  getItem: vi.fn((k) => store[k] ?? null),
  setItem: vi.fn((k, v) => (store[k] = String(v))),
  removeItem: vi.fn((k) => {
    delete store[k];
  }),
  clear: vi.fn(() => {
    store = {};
  }),
};

vi.stubGlobal("localStorage", localStorageMock);

// Mock de window.location (jsdom la hace read-only y su asignación lanza).
const locationMock = { href: "" };
Object.defineProperty(window, "location", {
  value: locationMock,
  configurable: true,
  writable: true,
});

let api;
beforeAll(async () => {
  api = (await import("../api")).default;
});

describe("api (cliente axios)", () => {
  beforeEach(() => {
    store = {};
    vi.clearAllMocks();
    locationMock.href = "";
  });

  describe("interceptor de request", () => {
    it("agrega Authorization si hay token", () => {
      localStorageMock.setItem("token", "abc123");
      const handler = api.interceptors.request.handlers[0];
      const config = handler.fulfilled({ headers: {} });

      expect(config.headers.Authorization).toBe("Bearer abc123");
    });

    it("NO agrega Authorization sin token", () => {
      const handler = api.interceptors.request.handlers[0];
      const config = handler.fulfilled({ headers: {} });

      expect(config.headers.Authorization).toBeUndefined();
    });
  });

  describe("interceptor de response (401 global)", () => {
    it("limpia sesión y redirige en 401 en ruta NO-auth", async () => {
      localStorageMock.setItem("token", "abc");
      localStorageMock.setItem("usuario", "juan");
      localStorageMock.setItem("rol", "USUARIO");

      const handler = api.interceptors.response.handlers[0];
      const error = { config: { url: "/api/aprendiz/metas/1" }, response: { status: 401 } };

      await expect(handler.rejected(error)).rejects.toBe(error);

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("token");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("usuario");
      expect(localStorageMock.removeItem).toHaveBeenCalledWith("rol");
      expect(locationMock.href).toBe("/");
    });

    it("NO limpia en 401 de ruta auth", async () => {
      localStorageMock.setItem("token", "abc");
      const handler = api.interceptors.response.handlers[0];
      const error = { config: { url: "/api/auth/login" }, response: { status: 401 } };

      await expect(handler.rejected(error)).rejects.toBe(error);
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });

    it("rechaza sin limpiar cuando NO es 401", async () => {
      const handler = api.interceptors.response.handlers[0];
      const error = { config: { url: "/x" }, response: { status: 500 } };

      await expect(handler.rejected(error)).rejects.toBe(error);
      expect(localStorageMock.removeItem).not.toHaveBeenCalled();
    });
  });
});