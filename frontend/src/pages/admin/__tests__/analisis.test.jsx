import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Analisis from "../analisis.jsx";

const mocks = vi.hoisted(() => ({
  listarEncuestas: vi.fn(),
  obtenerAnalisisEncuesta: vi.fn(),
  eliminarEncuesta: vi.fn(),
}));

vi.mock("../../../services/admin/encuestas.service", () => ({
  listarEncuestas: mocks.listarEncuestas,
  obtenerAnalisisEncuesta: mocks.obtenerAnalisisEncuesta,
  eliminarEncuesta: mocks.eliminarEncuesta,
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

describe("Analisis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza la lista de encuestas", async () => {
    mocks.listarEncuestas.mockResolvedValue([
      { id_formulario: 1, titulo: "Encuesta A", descripcion: "d", total_respuestas: 3 },
      { id_formulario: 2, titulo: "Encuesta B", descripcion: "", total_respuestas: 0 },
    ]);

    render(<Analisis />);

    expect(await screen.findByText("Encuesta A")).toBeInTheDocument();
    expect(screen.getByText("Encuesta B")).toBeInTheDocument();
  });

  it("elimina una encuesta tras confirmar", async () => {
    mocks.listarEncuestas.mockResolvedValue([
      { id_formulario: 1, titulo: "Encuesta A", descripcion: "d", total_respuestas: 3 },
    ]);
    mocks.eliminarEncuesta.mockResolvedValue({});

    const Swal = (await import("sweetalert2")).default;
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    render(<Analisis />);

    const btnEliminar = await screen.findByRole("button", { name: /eliminar/i });
    await userEvent.click(btnEliminar);

    expect(mocks.eliminarEncuesta).toHaveBeenCalledWith(1);
  });
});