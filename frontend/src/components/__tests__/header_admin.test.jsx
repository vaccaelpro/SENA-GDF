import { render, screen, fireEvent } from "@testing-library/react";
import Header_admin from "../header_admin";

describe("Header_admin", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders 'Admin' when there is no user in localStorage", () => {
    render(<Header_admin onToggleSidebar={() => {}} />);

    expect(screen.getByText("Bienvenid@, Admin")).toBeInTheDocument();
  });

  it("renders the full name when localStorage has a valid user", () => {
    localStorage.setItem(
      "usuario",
      JSON.stringify({ primer_nombre: "Juan", primer_apellido: "Perez" })
    );

    render(<Header_admin onToggleSidebar={() => {}} />);

    expect(screen.getByText("Bienvenid@, Juan Perez")).toBeInTheDocument();
  });

  it("does not break and shows 'Admin' when localStorage has invalid JSON", () => {
    localStorage.setItem("usuario", "{not-valid-json");

    render(<Header_admin onToggleSidebar={() => {}} />);

    expect(screen.getByText("Bienvenid@, Admin")).toBeInTheDocument();
  });

  it("calls onToggleSidebar when the toggle button is clicked", () => {
    const onToggleSidebar = vi.fn();

    render(<Header_admin onToggleSidebar={onToggleSidebar} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onToggleSidebar).toHaveBeenCalledTimes(1);
  });
});