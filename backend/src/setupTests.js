// Setup global de tests backend.
// Propósito único: eliminar la FUGA de conexión real a MySQL/Aivencloud.
//
// database.js ejecuta mysql.createPool() + pool.getConnection() en su top-level.
// Cualquier require() de app.js, controllers o services dispara esa cadena e
// intenta abrir socket a producción (ECONNREFUSED en cada corrida).
//
// Este setup se ejecuta ANTES de cada archivo de test y reemplaza createPool
// por un pool fake que nunca llega a la red.
import { vi } from "vitest";

const mysql2 = require("mysql2");

const fakeConnection = { release: vi.fn() };

const fakePool = {
  query: vi.fn().mockResolvedValue([[], []]),
  promise: function () {
    return { query: this.query };
  },
  getConnection: function (cb) {
    cb(null, fakeConnection);
  },
};

// spyOn sobre la misma instancia CJS que usará database.js al hacer require("mysql2").
vi.spyOn(mysql2, "createPool").mockReturnValue(fakePool);