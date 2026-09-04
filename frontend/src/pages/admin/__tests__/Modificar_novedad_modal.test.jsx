import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Modificar_novedad_modal from "../Modificar_novedad_modal";

const mocks = vi.hoisted(() => ({
  actualizar: vi.fn(),
}));

vi.mock("../../../services/admin/comunicados.service", () => ({
  actualizar: mocks.actualizar,
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

const comunicado = {
  id_comunicado: 1,
  titulo: "Título original",
  contenido: "Contenido original",
  categoria: "Noticias",
  url_referencia: "",
};

describe("Modificar_novedad_modal", () => {
  let onClose;
  let onActualizado;

  beforeEach(() => {
    vi.clearAllMocks();
    onClose = vi.fn();
    onActualizado = vi.fn();
  });

  it("renderiza el modal con los datos del comunicado", () => {
    render(
      <Modificar_novedad_modal
        comunicado={comunicado}
        onClose={onClose}
        onActualizado={onActualizado}
      />
    );

    expect(screen.getByDisplayValue("Título original")).toBeInTheDocument();
    expect(screen.getByText("Modificar Publicación")).toBeInTheDocument();
  });

  it("devuelve null sin comunicado", () => {
    const { container } = render(
      <Modificar_novedad_modal comunicado={null} onClose={onClose} onActualizado={onActualizado} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("llama actualizar al enviar el formulario", async () => {
    mocks.actualizar.mockResolvedValue({});

    render(
      <Modificar_novedad_modal
        comunicado={comunicado}
        onClose={onClose}
        onActualizado={onActualizado}
      />
    );

    fireEvent.change(screen.getByDisplayValue("Título original"), {
      target: { value: "Nuevo título" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Guardar cambios/i }));

    await waitFor(() => expect(mocks.actualizar).toHaveBeenCalledWith(1, expect.objectContaining({ titulo: "Nuevo título" })));
    expect(onActualizado).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});