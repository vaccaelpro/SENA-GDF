import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Tabla_gestion_usuarios from "../gestion_usuarios";
import Swal from "sweetalert2";

const mocks = vi.hoisted(() => ({
  listarUsuarios: vi.fn(),
  actualizarUsuario: vi.fn(),
  eliminarUsuario: vi.fn(),
}));

vi.mock("../../../services/admin/usuarios.service", () => ({
  listarUsuarios: mocks.listarUsuarios,
  actualizarUsuario: mocks.actualizarUsuario,
  eliminarUsuario: mocks.eliminarUsuario,
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

const usuarios = [
  {
    id_usuario: 1,
    primer_nombre: "Juan",
    segundo_nombre: "",
    primer_apellido: "Perez",
    segundo_apellido: "",
    tipo_documento: "CC",
    documento: "123456789",
    celular: "3001234567",
    grupo_formacion: "123",
    correo_electronico: "juan@example.com",
    rol: "USUARIO",
    tipo_apoyo: "regular",
  },
];

describe("gestion_usuarios", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.listarUsuarios.mockResolvedValue(usuarios);
  });

  it("renderiza la tabla de usuarios", async () => {
    render(
      <MemoryRouter>
        <Tabla_gestion_usuarios />
      </MemoryRouter>
    );

    expect(await screen.findByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Perez")).toBeInTheDocument();
    expect(screen.getByText("123456789")).toBeInTheDocument();
  });

  it("llama eliminarUsuario al confirmar la eliminación", async () => {
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    mocks.eliminarUsuario.mockResolvedValue({});

    render(
      <MemoryRouter>
        <Tabla_gestion_usuarios />
      </MemoryRouter>
    );

    await screen.findByText("Juan");

    fireEvent.click(screen.getByTitle("Eliminar Usuario"));

    await waitFor(() => expect(mocks.eliminarUsuario).toHaveBeenCalledWith(1));
  });
});