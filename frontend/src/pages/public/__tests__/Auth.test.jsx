import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Auth from "../Auth";

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
  registrar: vi.fn(),
}));

vi.mock("../../services/auth/auth.service", () => ({
  login: authMocks.login,
  registrar: authMocks.registrar,
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

describe("Auth", () => {
  beforeEach(() => {
    authMocks.login.mockReset();
    authMocks.registrar.mockReset();
  });

  it("does not call login and shows document error on empty submit", () => {
    // Arrange
    render(
      <MemoryRouter>
        <Auth />
      </MemoryRouter>
    );

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    // Assert
    expect(authMocks.login).not.toHaveBeenCalled();
    expect(screen.getAllByText(/El documento es obligatorio\./)[0]).toBeInTheDocument();
  });

  it("does not call registrar and shows weak password error", () => {
    // Arrange
    render(
      <MemoryRouter initialEntries={["/Registro"]}>
        <Auth />
      </MemoryRouter>
    );

    // Act
    fireEvent.change(screen.getByPlaceholderText("Primer Nombre"), {
      target: { value: "Juan" },
    });
    fireEvent.change(screen.getByPlaceholderText("Primer Apellido"), {
      target: { value: "Perez" },
    });
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { value: "CC" },
    });
    fireEvent.change(screen.getByPlaceholderText("N° Documento"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Número de Celular"), {
      target: { value: "3001234567" },
    });
    fireEvent.change(screen.getByPlaceholderText("Correo Electrónico"), {
      target: { value: "juan@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Contraseña (mín 8 car.)"), {
      target: { value: "abc12" },
    });
    fireEvent.change(screen.getByPlaceholderText("N° Ficha (Grupo)"), {
      target: { value: "1234567" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Registrarse" }));

    // Assert
    expect(authMocks.registrar).not.toHaveBeenCalled();
    expect(
      screen.getByText(/contraseña de mínimo 8 caracteres/i)
    ).toBeInTheDocument();
  });

  });