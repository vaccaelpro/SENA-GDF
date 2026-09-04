import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../sidebar";

vi.mock("../../services/auth/auth.service", () => ({
  logout: vi.fn(),
}));

import { logout } from "../../services/auth/auth.service";

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
};

const renderSidebar = () =>
  render(
    <MemoryRouter initialEntries={["/Novedades_aprendiz"]}>
      <Routes>
        <Route
          path="*"
          element={
            <>
              <Sidebar isOpen={false} onClose={() => {}} />
              <LocationDisplay />
            </>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("Sidebar", () => {
  beforeEach(() => {
    logout.mockReset();
  });

  it("renders navigation links", () => {
    renderSidebar();

    expect(screen.getByText("Novedades")).toBeInTheDocument();
    expect(screen.getByText("Metas de Ahorro")).toBeInTheDocument();
    expect(screen.getByText("Mi Grupo")).toBeInTheDocument();
  });

  it("calls logout and navigates to / when clicking 'Cerrar Sesión'", async () => {
    renderSidebar();

    fireEvent.click(screen.getByRole("button", { name: /Cerrar Sesión/i }));

    expect(logout).toHaveBeenCalledTimes(1);
    await screen.findByTestId("location");
    expect(screen.getByTestId("location")).toHaveTextContent("/");
  });
});