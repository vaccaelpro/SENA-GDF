import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Satisfaccion_encuestas from "../satisfaccion_encuestas.jsx";

const mocks = vi.hoisted(() => ({
  listarEncuestas: vi.fn(),
  obtenerEncuesta: vi.fn(),
  enviarRespuestasEncuesta: vi.fn(),
  verificarRespuestaUsuario: vi.fn(),
}));

vi.mock("../../../services/admin/encuestas.service", () => ({
  listarEncuestas: mocks.listarEncuestas,
  obtenerEncuesta: mocks.obtenerEncuesta,
  enviarRespuestasEncuesta: mocks.enviarRespuestasEncuesta,
  verificarRespuestaUsuario: mocks.verificarRespuestaUsuario,
}));

vi.mock("sweetalert2", () => {
  const swal = {
    fire: vi.fn(),
    mixin: vi.fn(() => ({ fire: vi.fn() })),
    stopTimer: vi.fn(),
    resumeTimer: vi.fn(),
  };
  return { default: swal };
});

describe("Satisfaccion_encuestas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 9 }));
  });

  const renderPage = () =>
    render(
      <MemoryRouter>
        <Satisfaccion_encuestas />
      </MemoryRouter>
    );

  it("renderiza las encuestas disponibles", async () => {
    mocks.listarEncuestas.mockResolvedValue([
      { id_formulario: 1, titulo: "Encuesta de Satisfacción", descripcion: "d", total_preguntas: 2 },
    ]);

    renderPage();

    expect(await screen.findByText("Encuesta de Satisfacción")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /responder/i })).toBeInTheDocument();
  });

  it("muestra 'ya respondió' al verificar respuesta", async () => {
    mocks.listarEncuestas.mockResolvedValue([
      { id_formulario: 1, titulo: "Encuesta de Satisfacción", descripcion: "d", total_preguntas: 2 },
    ]);
    mocks.obtenerEncuesta.mockResolvedValue({
      id_formulario: 1,
      titulo: "Encuesta de Satisfacción",
      descripcion: "d",
      preguntas: [{ id_pregunta: 1, pregunta: "¿Cómo calificas?" }],
    });
    mocks.verificarRespuestaUsuario.mockResolvedValue({ yaRespondio: true });

    renderPage();

    const responderBtn = await screen.findByRole("button", { name: /responder/i });
    await userEvent.click(responderBtn);

    expect(
      await screen.findByText(/ya respondiste esta encuesta/i)
    ).toBeInTheDocument();
  });
});