import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Eliminar_novedad from "../eliminar_novedad";
import Swal from "sweetalert2";

const mocks = vi.hoisted(() => ({
  listarAdmin: vi.fn(),
  eliminar: vi.fn(),
}));

vi.mock("../../../services/admin/comunicados.service", () => ({
  listarAdmin: mocks.listarAdmin,
  eliminar: mocks.eliminar,
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

const comunicados = [
  {
    id_comunicado: 1,
    titulo: "Novedad 1",
    contenido: "Contenido de prueba",
    categoria: "Noticias",
    fecha_publicacion: "2026-09-01T00:00:00.000Z",
  },
];

describe("eliminar_novedad", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.listarAdmin.mockResolvedValue(comunicados);
  });

  it("renderiza la lista de novedades", async () => {
    render(
      <MemoryRouter>
        <Eliminar_novedad />
      </MemoryRouter>
    );

    expect(await screen.findByText("Novedad 1")).toBeInTheDocument();
  });

  it("llama eliminar al confirmar", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    mocks.eliminar.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Eliminar_novedad />
      </MemoryRouter>
    );

    await screen.findByText("Novedad 1");

    fireEvent.click(screen.getByRole("button", { name: /Borrar/i }));

    await waitFor(() => expect(mocks.eliminar).toHaveBeenCalledWith(1));
  });
});