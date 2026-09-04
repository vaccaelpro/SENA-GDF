import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar_administrador from "../sidebar_admin";

vi.mock("../../services/auth/auth.service", () => ({
  logout: vi.fn(),
}));

import { logout } from "../../services/auth/auth.service";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

const renderSidebarAdmin = () =>
  render(
    <MemoryRouter initialEntries={["/Lista_grupos"]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Sidebar_administrador isOpen={false} onClose={() => {}} />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("Sidebar_administrador", () => {
  beforeEach(() => {
    logout.mockReset();
  });

  it("renders navigation links", () => {
    renderSidebarAdmin();

    expect(screen.getByText("Gestión de Usuarios")).toBeInTheDocument();
    expect(screen.getByText("Grupos")).toBeInTheDocument();
    expect(screen.getByText("Cerrar Sesión")).toBeInTheDocument();
  });

  it("calls logout when clicking 'Cerrar Sesión'", async () => {
    renderSidebarAdmin();

    fireEvent.click(screen.getByRole("button", { name: /Cerrar Sesión/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    await screen.findByTestId("location");
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });
});