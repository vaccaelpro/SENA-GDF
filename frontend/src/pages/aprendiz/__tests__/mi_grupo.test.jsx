import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Mi_grupo from "../mi_grupo";

const mocks = vi.hoisted(() => ({
  obtenerMiGrupo: vi.fn(),
  obtenerMiembrosGrupo: vi.fn(),
}));

vi.mock("../../../services/aprendiz/grupo.service", () => ({
  obtenerMiGrupo: mocks.obtenerMiGrupo,
  obtenerMiembrosGrupo: mocks.obtenerMiembrosGrupo,
}));

describe("mi_grupo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza el grupo y sus miembros", async () => {
    localStorage.setItem(
      "usuario",
      JSON.stringify({ id_usuario: 10, primer_nombre: "Juan" })
    );
    mocks.obtenerMiGrupo.mockResolvedValue({
      nombre: "Grupo A",
      descripcion: "Apoyo regular",
      fecha_creacion: "2026-01-01T00:00:00.000Z",
    });
    mocks.obtenerMiembrosGrupo.mockResolvedValue([
      { id_usuario: 10, primer_nombre: "Juan", primer_apellido: "Perez" },
      { id_usuario: 11, primer_nombre: "Ana", primer_apellido: "Lopez", grupo_formacion: "123" },
    ]);

    render(
      <MemoryRouter>
        <Mi_grupo />
      </MemoryRouter>
    );

    expect(await screen.findByText("Grupo A")).toBeInTheDocument();
    expect(screen.getByText("Juan Perez")).toBeInTheDocument();
    expect(screen.getByText("Ana Lopez")).toBeInTheDocument();
  });

  it("muestra estado sin sesión cuando no hay usuario", async () => {
    localStorage.removeItem("usuario");

    render(
      <MemoryRouter>
        <Mi_grupo />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("No se encontró sesión de usuario.")
    ).toBeInTheDocument();
  });

  it("muestra mensaje de sin grupo asignado cuando el servicio falla", async () => {
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 10 }));
    mocks.obtenerMiGrupo.mockRejectedValue(new Error("sin grupo"));

    render(
      <MemoryRouter>
        <Mi_grupo />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Aún no tienes un grupo asignado.")
    ).toBeInTheDocument();
  });
});