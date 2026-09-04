import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout";

const renderLayout = () =>
  render(
    <MemoryRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<div>Contenido del Outlet</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe("Layout", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the layout and the Outlet content", () => {
    renderLayout();

    expect(screen.getByText("Contenido del Outlet")).toBeInTheDocument();
    expect(screen.getByText("SENA GDF")).toBeInTheDocument();
  });

  it("shows the backdrop when the header toggle is clicked", () => {
    renderLayout();

    expect(document.querySelector(".sidebar-open")).not.toBeInTheDocument();
    expect(document.querySelector(".sidebar-backdrop")).not.toBeInTheDocument();

    fireEvent.click(document.querySelector(".menu-toggle-btn"));

    expect(document.querySelector(".layout-container")).toHaveClass(
      "sidebar-open"
    );
    expect(document.querySelector(".sidebar-backdrop")).toBeInTheDocument();
  });
});