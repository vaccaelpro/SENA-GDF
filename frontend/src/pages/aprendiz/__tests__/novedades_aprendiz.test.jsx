import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Novedades_aprendiz from "../novedades_aprendiz";

const mocks = vi.hoisted(() => ({
  listarPublicos: vi.fn(),
}));

vi.mock("../../../services/admin/comunicados.service", () => ({
  listarPublicos: mocks.listarPublicos,
}));

describe("novedades_aprendiz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza los comunicados públicos", async () => {
    mocks.listarPublicos.mockResolvedValue([
      {
        id_comunicado: 1,
        titulo: "Novedad 1",
        contenido: "Contenido de prueba",
        categoria: "Noticias",
        fecha_publicacion: "2026-09-01T00:00:00.000Z",
      },
    ]);

    render(
      <MemoryRouter>
        <Novedades_aprendiz />
      </MemoryRouter>
    );

    expect(await screen.findByText("Novedad 1")).toBeInTheDocument();
    expect(mocks.listarPublicos).toHaveBeenCalled();
  });

  it("muestra mensaje cuando no hay novedades", async () => {
    mocks.listarPublicos.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Novedades_aprendiz />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("No hay novedades disponibles.")
    ).toBeInTheDocument();
  });
});