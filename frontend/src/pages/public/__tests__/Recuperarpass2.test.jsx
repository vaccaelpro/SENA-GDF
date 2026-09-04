import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RestablecerPassword from "../Recuperarpass2";

const authMocks = vi.hoisted(() => ({
  restablecerPassword: vi.fn(),
}));

vi.mock("../../../services/auth/auth.service", () => ({
  restablecerPassword: authMocks.restablecerPassword,
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

import Swal from "sweetalert2";

const renderConToken = (token = "abc123token") =>
  render(
    <MemoryRouter initialEntries={[`/restablecer/${token}`]}>
      <Routes>
        <Route path="/restablecer/:token" element={<RestablecerPassword />} />
      </Routes>
    </MemoryRouter>
  );

describe("RestablecerPassword", () => {
  beforeEach(() => {
    authMocks.restablecerPassword.mockReset();
    Swal.fire.mockReset();
  });

  it("renderiza el formulario para restablecer contraseña", () => {
    renderConToken();

    expect(
      screen.getByPlaceholderText("Nueva contraseña (mín. 8 caracteres)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cambiar Contraseña" })
    ).toBeInTheDocument();
  });

  it("no llama a restablecerPassword y muestra Swal 'Contraseña No Segura' con contraseña débil", () => {
    renderConToken();

    fireEvent.change(
      screen.getByPlaceholderText("Nueva contraseña (mín. 8 caracteres)"),
      { target: { value: "abc" } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Cambiar Contraseña" }));

    expect(authMocks.restablecerPassword).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Contraseña No Segura" })
    );
  });

  it("llama a restablecerPassword y muestra Swal de éxito con contraseña fuerte", async () => {
    authMocks.restablecerPassword.mockResolvedValue({});

    renderConToken("abc123token");

    fireEvent.change(
      screen.getByPlaceholderText("Nueva contraseña (mín. 8 caracteres)"),
      { target: { value: "Abc12345" } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Cambiar Contraseña" }));

    await waitFor(() =>
      expect(authMocks.restablecerPassword).toHaveBeenCalledWith(
        "abc123token",
        "Abc12345"
      )
    );

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "¡Contraseña Actualizada!" })
      )
    );
  });

  it("muestra Swal 'Error' cuando el servicio rechaza", async () => {
    authMocks.restablecerPassword.mockRejectedValue({
      response: { data: { message: "fallo" } },
    });

    renderConToken();

    fireEvent.change(
      screen.getByPlaceholderText("Nueva contraseña (mín. 8 caracteres)"),
      { target: { value: "Abc12345" } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Cambiar Contraseña" }));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error" })
      )
    );
  });
});