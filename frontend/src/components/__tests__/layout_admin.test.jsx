import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout_admin from "../layout_admin";

const renderLayoutAdmin = () =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout_admin />}>
          <Route index element={<div>Contenido del Outlet Admin</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("Layout_admin", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the layout and the Outlet content", () => {
    renderLayoutAdmin();

    expect(
      screen.getByText("Contenido del Outlet Admin")
    ).toBeInTheDocument();
    expect(screen.getByText("SENA GDF")).toBeInTheDocument();
  });

  it("shows the backdrop when the header toggle is clicked", () => {
    renderLayoutAdmin();

    expect(document.querySelector(".sidebar-open")).not.toBeInTheDocument();
    expect(document.querySelector(".sidebar-backdrop")).not.toBeInTheDocument();

    fireEvent.click(document.querySelector(".menu-toggle-btn"));

    expect(document.querySelector(".layout-container")).toHaveClass(
      "sidebar-open"
    );
    expect(document.querySelector(".sidebar-backdrop")).toBeInTheDocument();
  });
});