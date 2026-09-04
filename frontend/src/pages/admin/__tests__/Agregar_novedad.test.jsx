import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Agregar_novedad from "../Agregar_novedad";

const mocks = vi.hoisted(() => ({
  crear: vi.fn(),
  actualizar: vi.fn(),
  obtenerPorId: vi.fn(),
}));

vi.mock("../../../services/admin/comunicados.service", () => ({
  crear: mocks.crear,
  actualizar: mocks.actualizar,
  obtenerPorId: mocks.obtenerPorId,
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

describe("Agregar_novedad", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 10 }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza el formulario", () => {
    render(
      <MemoryRouter>
        <Agregar_novedad />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Ingrese el título de la publicación")).toBeInTheDocument();
  });

  it("llama crear al enviar el formulario", async () => {
    mocks.crear.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Agregar_novedad />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Ingrese el título de la publicación"), {
      target: { value: "Título" },
    });
    fireEvent.change(screen.getByPlaceholderText("Escriba el contenido de la publicación"), {
      target: { value: "Contenido" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Publicar/i }));

    await waitFor(() => expect(mocks.crear).toHaveBeenCalled());
    expect(mocks.crear).toHaveBeenCalledWith(
      expect.objectContaining({ titulo: "Título", contenido: "Contenido", usuario_id: 10 })
    );
  });
});