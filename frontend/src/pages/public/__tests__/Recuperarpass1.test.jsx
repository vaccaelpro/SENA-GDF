import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RecuperarPassword from "../Recuperarpass1";

const authMocks = vi.hoisted(() => ({
  recuperarPassword: vi.fn(),
}));

vi.mock("../../../services/auth/auth.service", () => ({
  recuperarPassword: authMocks.recuperarPassword,
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

describe("RecuperarPassword", () => {
  beforeEach(() => {
    authMocks.recuperarPassword.mockReset();
    Swal.fire.mockReset();
  });

  it("renderiza el formulario con el campo de correo y el botón Enviar enlace", () => {
    render(
      <MemoryRouter>
        <RecuperarPassword />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText("Correo electrónico (ejemplo@correo.com)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar enlace" })
    ).toBeInTheDocument();
  });

  it("no llama a recuperarPassword y muestra Swal 'Correo Inválido' con correo vacío", () => {
    render(
      <MemoryRouter>
        <RecuperarPassword />
      </MemoryRouter>
    );

    userEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(authMocks.recuperarPassword).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Correo Inválido" })
    );
  });

  it("no llama a recuperarPassword y muestra Swal 'Correo Inválido' con correo inválido", () => {
    render(
      <MemoryRouter>
        <RecuperarPassword />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Correo electrónico (ejemplo@correo.com)"),
      { target: { value: "correo-invalido" } }
    );
    userEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

    expect(authMocks.recuperarPassword).not.toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Correo Inválido" })
    );
  });

  it("llama a recuperarPassword y muestra Swal '¡Correo Enviado!' con correo válido", async () => {
    authMocks.recuperarPassword.mockResolvedValue({ message: "ok" });

    render(
      <MemoryRouter>
        <RecuperarPassword />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Correo electrónico (ejemplo@correo.com)"),
      { target: { value: "correo@test.com" } }
    );
    userEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

    await waitFor(() =>
      expect(authMocks.recuperarPassword).toHaveBeenCalledWith("correo@test.com")
    );

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "¡Correo Enviado!" })
      )
    );
  });

  it("muestra Swal 'Error' cuando el servicio rechaza", async () => {
    authMocks.recuperarPassword.mockRejectedValue({
      response: { data: { message: "fallo" } },
    });

    render(
      <MemoryRouter>
        <RecuperarPassword />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByPlaceholderText("Correo electrónico (ejemplo@correo.com)"),
      { target: { value: "correo@test.com" } }
    );
    userEvent.click(screen.getByRole("button", { name: "Enviar enlace" }));

    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Error" })
      )
    );
  });
});