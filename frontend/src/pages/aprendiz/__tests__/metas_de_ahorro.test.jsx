import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MetasDeAhorro from "../metas_de_ahorro";

const mocks = vi.hoisted(() => ({
  listarMetas: vi.fn(),
  crearMeta: vi.fn(),
  editarMeta: vi.fn(),
  agregarMonto: vi.fn(),
  eliminarMeta: vi.fn(),
  listarGastos: vi.fn(),
  crearGasto: vi.fn(),
  eliminarGasto: vi.fn(),
}));

vi.mock("../../../services/aprendiz/metas.service", () => ({
  listarMetas: mocks.listarMetas,
  crearMeta: mocks.crearMeta,
  editarMeta: mocks.editarMeta,
  agregarMonto: mocks.agregarMonto,
  eliminarMeta: mocks.eliminarMeta,
}));

vi.mock("../../../services/aprendiz/presupuesto.service", () => ({
  listarGastos: mocks.listarGastos,
  crearGasto: mocks.crearGasto,
  eliminarGasto: mocks.eliminarGasto,
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

const metas = [
  { id_ahorro: 1, meta: "Viaje", valor_objetivo: 1000000, monto_ahorrado: 250000, fecha_objetivo: "2026-12-31" },
  { id_ahorro: 2, meta: "Computador", valor_objetivo: 2000000, monto_ahorrado: 0, fecha_objetivo: "2026-11-30" },
];

describe("metas_de_ahorro", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 10 }));
    mocks.listarMetas.mockResolvedValue(metas);
    mocks.listarGastos.mockResolvedValue([]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("renderiza el listado de metas", async () => {
    render(
      <MemoryRouter>
        <MetasDeAhorro />
      </MemoryRouter>
    );

    expect(mocks.listarMetas).toHaveBeenCalledWith(10);
    expect(await screen.findByText("Viaje")).toBeInTheDocument();
    expect(screen.getByText("Computador")).toBeInTheDocument();
  });

  it("muestra mensaje de lista vacía si no hay metas", async () => {
    mocks.listarMetas.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <MetasDeAhorro />
      </MemoryRouter>
    );

    expect(await screen.findByText("Nueva Meta")).toBeInTheDocument();
    expect(screen.queryByText("Viaje")).not.toBeInTheDocument();
  });

  it("llama crearMeta al enviar el formulario de nueva meta", async () => {
    mocks.crearMeta.mockResolvedValue({});

    render(
      <MemoryRouter>
        <MetasDeAhorro />
      </MemoryRouter>
    );

    await screen.findByText("Viaje");

    fireEvent.click(screen.getByRole("button", { name: /Agregar Meta/i }));

    fireEvent.change(screen.getByPlaceholderText("Ej: Ahorro para viaje"), {
      target: { value: "Moto" },
    });
    fireEvent.change(screen.getByPlaceholderText("Ej: 1000000"), {
      target: { value: "5000000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Crear Meta/i }));

    await waitFor(() => expect(mocks.crearMeta).toHaveBeenCalled());
    expect(mocks.crearMeta).toHaveBeenCalledWith(
      expect.objectContaining({ meta: "Moto", usuario_id_usuario: 10 })
    );
  });

  it("llama eliminarMeta al confirmar la eliminación", async () => {
    mocks.eliminarMeta.mockResolvedValue({});

    render(
      <MemoryRouter>
        <MetasDeAhorro />
      </MemoryRouter>
    );

    await screen.findByText("Viaje");

    const borrarButtons = screen.getAllByRole("button", { name: /Borrar/i });
    fireEvent.click(borrarButtons[0]);

    const siButton = screen.getByRole("button", { name: "Sí" });
    fireEvent.click(siButton);

    await waitFor(() => expect(mocks.eliminarMeta).toHaveBeenCalledWith(1));
  });
});