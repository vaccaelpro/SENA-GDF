import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Error404 from "../Error404";

describe("Error404", () => {
  it("renders the 'Acceso Restringido' subtitle", () => {
    // Arrange
    // Act
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText("¡Ups! Acceso Restringido")).toBeInTheDocument();
  });

  it("renders the 'Volver al Inicio' link", () => {
    // Arrange
    // Act
    render(
      <MemoryRouter>
        <Error404 />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText("Volver al Inicio")).toBeInTheDocument();
  });
});