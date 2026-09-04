import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to login and does NOT render children when there is no valid session", () => {
    // Arrange
    // (localStorage vacío → no sesión válida)

    // Act
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRole="ADMIN">
          <div>Contenido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByText("Contenido")).not.toBeInTheDocument();
  });

  it("renders Error404 when the role does not match allowedRole", () => {
    // Arrange
    localStorage.setItem("rol", "USUARIO");
    localStorage.setItem("usuario", "test");
    localStorage.setItem("token", "abc");

    // Act
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRole="ADMIN">
          <div>AdminContent</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText("¡Ups! Acceso Restringido")).toBeInTheDocument();
    expect(screen.queryByText("AdminContent")).not.toBeInTheDocument();
  });

  it("renders children when the role matches allowedRole", () => {
    // Arrange
    localStorage.setItem("rol", "ADMIN");
    localStorage.setItem("usuario", "test");
    localStorage.setItem("token", "abc");

    // Act
    render(
      <MemoryRouter>
        <ProtectedRoute allowedRole="ADMIN">
          <div>AdminContent</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText("AdminContent")).toBeInTheDocument();
  });
});