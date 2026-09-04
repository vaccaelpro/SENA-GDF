import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../header";

describe("Header", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders 'Aprendiz' when there is no user in localStorage", () => {
    render(<Header onToggleSidebar={() => {}} />);

    expect(screen.getByText("Bienvenid@, Aprendiz")).toBeInTheDocument();
    expect(screen.getByText("Aprendiz")).toBeInTheDocument();
  });

  it("renders the full name when localStorage has a valid user", () => {
    localStorage.setItem(
      "usuario",
      JSON.stringify({ primer_nombre: "Juan", primer_apellido: "Perez" })
    );

    render(<Header onToggleSidebar={() => {}} />);

    expect(screen.getByText("Bienvenid@, Juan Perez")).toBeInTheDocument();
  });

  it("does not break and shows 'Aprendiz' when localStorage has invalid JSON", () => {
    localStorage.setItem("usuario", "{not-valid-json");

    render(<Header onToggleSidebar={() => {}} />);

    expect(screen.getByText("Bienvenid@, Aprendiz")).toBeInTheDocument();
  });

  it("calls onToggleSidebar when the toggle button is clicked", () => {
    const onToggleSidebar = vi.fn();

    render(<Header onToggleSidebar={onToggleSidebar} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});