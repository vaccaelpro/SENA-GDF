import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Chat_aprendiz from "../chat_aprendiz.jsx";

const mocks = vi.hoisted(() => ({
  obtenerMiGrupo: vi.fn(),
  obtenerMensajesGrupo: vi.fn(),
}));

vi.mock("../../../services/aprendiz/grupo.service", () => ({
  obtenerMiGrupo: mocks.obtenerMiGrupo,
  obtenerMensajesGrupo: mocks.obtenerMensajesGrupo,
}));

describe("Chat_aprendiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Chat_aprendiz />
      </MemoryRouter>
    );

  it("renderiza los mensajes del grupo", async () => {
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 5 }));
    mocks.obtenerMiGrupo.mockResolvedValue({ nombre: "Grupo 1" });
    mocks.obtenerMensajesGrupo.mockResolvedValue([
      {
        id_mensaje: 1,
        rol: "ADMIN",
        usuario_id: 3,
        primer_nombre: "Prof",
        primer_apellido: "Díaz",
        mensaje: "Bienvenidos",
        fecha_envio: "2026-01-01T00:00:00.000Z",
      },
    ]);

    renderPage();

    expect(
      await screen.findByText(/información importante de bienestar/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Bienvenidos")).toBeInTheDocument();
    expect(screen.getByText(/grupo 1/i)).toBeInTheDocument();
  });

  it("muestra estado de error cuando no hay usuario logueado", async () => {
    renderPage();

    expect(
      await screen.findByText(/no se pudo identificar tu usuario/i)
    ).toBeInTheDocument();
  });

  it("muestra mensaje cuando no hay mensajes en el canal", async () => {
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 5 }));
    mocks.obtenerMiGrupo.mockResolvedValue({ nombre: "Grupo 1" });
    mocks.obtenerMensajesGrupo.mockResolvedValue([]);

    renderPage();

    expect(
      await screen.findByText(/aún no hay mensajes oficiales/i)
    ).toBeInTheDocument();
  });
});