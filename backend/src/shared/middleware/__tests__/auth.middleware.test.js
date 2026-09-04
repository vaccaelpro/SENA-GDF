import { describe, it, expect, vi, beforeAll } from "vitest";

// verifyToken usa jsonwebtoken y process.env.JWT_SECRET.
const middleware = require("../auth.middleware.js");

function createRes() {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res),
  };
  return res;
}

describe("auth.middleware.verifyToken", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("responde 401 'Token de sesión requerido' cuando no hay authorization", async () => {
    const req = { headers: {} };
    const res = createRes();
    const next = vi.fn();

    await middleware.verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token de sesión requerido",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("responde 401 'Token inválido o expirado' cuando el token no es válido", async () => {
    const req = { headers: { authorization: "Bearer token-invalido" } };
    const res = createRes();
    const next = vi.fn();

    await middleware.verifyToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Token inválido o expirado",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("puebla req.usuario y llama next() con token válido", async () => {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { id: 7, rol: "ADMIN" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createRes();
    const next = vi.fn();

    await middleware.verifyToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(req.usuario).toEqual({ id: 7, rol: "ADMIN" });
    expect(res.status).not.toHaveBeenCalled();
  });
});