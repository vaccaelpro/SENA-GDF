import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Lista_grupos from "../lista_grupos";

const mocks = vi.hoisted(() => ({
  listarGrupos: vi.fn(),
  eliminarGrupo: vi.fn(),
  actualizarGrupo: vi.fn(),
}));

vi.mock("../../../services/admin/grupos.service", () => ({
  listarGrupos: mocks.listarGrupos,
  eliminarGrupo: mocks.eliminarGrupo,
  actualizarGrupo: mocks.actualizarGrupo,
}));

const grupos = [
  {
    id_grupo: 1,
    nombre: "Grupo A",
    descripcion: "Descripción",
    fecha_creacion: "2026-01-01T00:00:00.000Z",
    cantidad_miembros: 3,
  },
];

describe("lista_grupos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.listarGrupos.mockResolvedValue(grupos);
  });

  it("renderiza la lista de grupos", async () => {
    render(
      <MemoryRouter>
        <Lista_grupos />
      </MemoryRouter>
    );

    expect(await screen.findByText("Grupo A")).toBeInTheDocument();
  });

  it("llama eliminarGrupo al confirmar", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mocks.eliminarGrupo.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Lista_grupos />
      </MemoryRouter>
    );

    await screen.findByText("Grupo A");

    fireEvent.click(screen.getByTitle("Eliminar"));

    await waitFor(() => expect(mocks.eliminarGrupo).toHaveBeenCalledWith(1));
  });
});