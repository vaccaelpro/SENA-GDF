import { describe, it, expect, vi, beforeEach } from "vitest";

// Nota: la fuga de DB (mysql2.createPool) se neutraliza en src/setupTests.js
// (setupFiles global). Aquí solo probamos los smoke endpoints.
const request = require("supertest");
const app = require("../app.js");

describe("app smoke test", () => {
  it("GET /api/test responde 200 con mensaje de conexión", async () => {
    const res = await request(app).get("/api/test");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Backend conectado correctamente" });
  });

  it("GET /api/ruta-inexistente responde 404", async () => {
    const res = await request(app).get("/api/ruta-inexistente");

    expect(res.status).toBe(404);
  });
});