import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Crear_grupo from "../crear_grupo";

const mocks = vi.hoisted(() => ({
  crearGrupo: vi.fn(),
}));

vi.mock("../../../services/admin/grupos.service", () => ({
  crearGrupo: mocks.crearGrupo,
}));

describe("crear_grupo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida campos obligatorios y no llama al servicio", async () => {
    const { container } = render(
      <MemoryRouter>
        <Crear_grupo />
      </MemoryRouter>
    );

    fireEvent.submit(container.querySelector("form"));

    expect(
      await screen.findByText(/El nombre del grupo es obligatorio\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText("Corrige los errores del formulario antes de continuar.")
    ).toBeInTheDocument();
    expect(mocks.crearGrupo).not.toHaveBeenCalled();
  });

  it("llama crearGrupo con datos válidos", async () => {
    mocks.crearGrupo.mockResolvedValue({ success: true });

    render(
      <MemoryRouter>
        <Crear_grupo />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ej: Apoyo regular 2025"), {
      target: { value: "Grupo Nuevo" },
    });
    fireEvent.click(screen.getByLabelText("Apoyo regular"));

    fireEvent.click(screen.getByRole("button", { name: /Crear Grupo/i }));

    await waitFor(() => expect(mocks.crearGrupo).toHaveBeenCalled());
    expect(mocks.crearGrupo).toHaveBeenCalledWith({
      nombre: "Grupo Nuevo",
      descripcion: "",
      tipo_apoyo: "regular",
    });
  });
});