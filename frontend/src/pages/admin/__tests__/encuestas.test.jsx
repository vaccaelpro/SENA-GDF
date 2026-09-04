import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Encuestas from "../encuestas.jsx";

const mocks = vi.hoisted(() => ({ crearEncuesta: vi.fn() }));

vi.mock("../../../services/admin/encuestas.service", () => ({
  crearEncuesta: mocks.crearEncuesta,
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

describe("Encuestas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza el título del formulario", () => {
    render(<Encuestas />);
    expect(
      screen.getByRole("heading", { name: /crear nueva encuesta/i })
    ).toBeInTheDocument();
  });

  it("valida que el título sea obligatorio", async () => {
    render(<Encuestas />);
    await userEvent.click(
      screen.getByRole("button", { name: /publicar encuesta/i })
    );
    expect(mocks.crearEncuesta).not.toHaveBeenCalled();
  });

  it("valida que las preguntas no estén vacías", async () => {
    render(<Encuestas />);
    await userEvent.type(
      screen.getByPlaceholderText(/encuesta de satisfacción gdf/i),
      "Encuesta de prueba"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /publicar encuesta/i })
    );
    expect(mocks.crearEncuesta).not.toHaveBeenCalled();
  });

  it("llama a crearEncuesta al enviar el formulario completo", async () => {
    mocks.crearEncuesta.mockResolvedValue({});
    render(<Encuestas />);

    await userEvent.type(
      screen.getByPlaceholderText(/encuesta de satisfacción gdf/i),
      "Encuesta de prueba"
    );
    await userEvent.type(
      screen.getByPlaceholderText(/qué tan intuitiva es la sección/i),
      "¿Qué tan buena es la app?"
    );
    await userEvent.click(
      screen.getByRole("button", { name: /publicar encuesta/i })
    );

    expect(mocks.crearEncuesta).toHaveBeenCalledTimes(1);
    expect(mocks.crearEncuesta).toHaveBeenCalledWith(
      expect.objectContaining({
        titulo: "Encuesta de prueba",
        admin_id: 5,
      })
    );
  });
});