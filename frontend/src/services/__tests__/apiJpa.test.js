import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";

// Mock de axios: create() devuelve siempre la misma instancia falsa y
// captura los handlers de los interceptores para probarlos directamente.
const instance = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    request: { handlers: [], use: vi.fn((f, r) => instance.interceptors.request.handlers.push({ fulfilled: f, rejected: r })) },
    response: { handlers: [], use: vi.fn((f, r) => instance.interceptors.response.handlers.push({ fulfilled: f, rejected: r })) },
  },
};
const createMock = vi.fn(() => instance);

vi.mock("axios", () => ({
  default: { create: createMock },
}));

let apiJpa;
let service;

beforeAll(async () => {
  apiJpa = (await import("../apiJpa")).default;
  service = await import("../admin/usuariosJpa.service");
});

describe("apiJpa (cliente axios JPA)", () => {
  it("crea la instancia sin JWT con la URL por defecto del microservicio", () => {
    expect(createMock).toHaveBeenCalledWith(
      expect.objectContaining({ baseURL: "http://localhost:8080" })
    );
    // Sin interceptor de request: no se adjunta Authorization
    expect(apiJpa.interceptors.request.handlers.length).toBe(0);
  });

  describe("interceptor de response (ApiError envelope)", () => {
    const rejected = () => apiJpa.interceptors.response.handlers[0].rejected;

    it("traduce un 404 al ApiJpaError con status y message del envelope", async () => {
      const error = {
        response: {
          status: 404,
          data: { status: 404, error: "Not Found", message: "User with id 999 not found", path: "/api/users/999" },
          headers: {},
        },
      };
      await expect(rejected()(error)).rejects.toMatchObject({
        name: "ApiJpaError",
        status: 404,
        message: "User with id 999 not found",
        path: "/api/users/999",
      });
    });

    it("en 429 adjunta retryAfter desde el header Retry-After", async () => {
      const error = {
        response: {
          status: 429,
          data: { status: 429, message: "Too many requests" },
          headers: { "retry-after": "42" },
        },
      };
      await expect(rejected()(error)).rejects.toMatchObject({
        status: 429,
        retryAfter: 42,
      });
    });

    it("en 429 sin header usa 60 segundos por defecto", async () => {
      const error = {
        response: { status: 429, data: { message: "Too many requests" }, headers: {} },
      };
      await expect(rejected()(error)).rejects.toMatchObject({ status: 429, retryAfter: 60 });
    });

    it("sin respuesta (servicio caído / CORS) devuelve mensaje de conexión", async () => {
      await expect(rejected()({ response: undefined })).rejects.toMatchObject({
        status: 0,
        message: expect.stringContaining("No se pudo conectar con el servicio JPA"),
      });
    });

    it("sin message en el envelope cae a un mensaje genérico con el status", async () => {
      const error = { response: { status: 500, data: {} , headers: {} } };
      await expect(rejected()(error)).rejects.toMatchObject({
        message: "Error 500 del servicio JPA",
      });
    });
  });
});

describe("usuariosJpa.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("listarUsuariosJpa pide page/size 7 y devuelve el envelope completo", async () => {
    const envelope = { content: [{ id: 1 }], page: { size: 7, number: 0, totalElements: 1, totalPages: 1 } };
    instance.get.mockResolvedValueOnce({ data: envelope });

    const data = await service.listarUsuariosJpa(0);

    expect(instance.get).toHaveBeenCalledWith("/api/users", { params: { page: 0, size: 7 } });
    expect(data).toBe(envelope);
  });

  it("buscarUsuariosJpa usa el endpoint OR con el término", async () => {
    instance.get.mockResolvedValueOnce({ data: { content: [], page: { number: 0, totalPages: 1 } } });

    await service.buscarUsuariosJpa("Ana", 2);

    expect(instance.get).toHaveBeenCalledWith("/api/users/search/or", {
      params: { term: "Ana", page: 2, size: 7 },
    });
  });

  it("crearUsuarioJpa hace POST del payload y devuelve el usuario creado", async () => {
    const payload = { primerNombre: "Ana", documento: 1032547896, contrasena: "super-secret-123" };
    instance.post.mockResolvedValueOnce({ data: { id: 42, primerNombre: "Ana" } });

    const creado = await service.crearUsuarioJpa(payload);

    expect(instance.post).toHaveBeenCalledWith("/api/users", payload);
    expect(creado.id).toBe(42);
  });

  it("actualizarUsuarioJpa hace PUT al id", async () => {
    instance.put.mockResolvedValueOnce({ data: { id: 7 } });

    await service.actualizarUsuarioJpa(7, { primerNombre: "Ana" });

    expect(instance.put).toHaveBeenCalledWith("/api/users/7", { primerNombre: "Ana" });
  });

  it("eliminarUsuarioJpa hace DELETE al id (204 sin cuerpo)", async () => {
    instance.delete.mockResolvedValueOnce({ data: null });

    const res = await service.eliminarUsuarioJpa(7);

    expect(instance.delete).toHaveBeenCalledWith("/api/users/7");
    expect(res).toBeNull();
  });
});
