import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Exportar_finanzas from "../exportar_finanzas.jsx";

const mocks = vi.hoisted(() => ({
  obtenerFinanzasGenerales: vi.fn(),
  registrarExportacion: vi.fn(),
}));

vi.mock("../../../services/admin/finanzas.service", () => ({
  obtenerFinanzasGenerales: mocks.obtenerFinanzasGenerales,
}));

vi.mock("../../../services/admin/exportaciones.service", () => ({
  registrarExportacion: mocks.registrarExportacion,
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

vi.mock("exceljs", () => ({
  default: {
    Workbook: class {
      addWorksheet() {
        return {
          columns: undefined,
          getRow: () => ({ font: {}, fill: {}, eachCell: () => {}, getCell: () => ({}) }),
          addRow: () => ({ eachCell: () => {} }),
          getColumn: () => ({ numFmt: "", alignment: {} }),
        };
      }
      xlsx = { writeBuffer: async () => new ArrayBuffer(8) };
    },
  },
}));

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

describe("Exportar_finanzas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza el título de la sección", async () => {
    mocks.obtenerFinanzasGenerales.mockResolvedValue([]);
    render(<Exportar_finanzas />);
    expect(
      await screen.findByRole("heading", { name: /exportación de finanzas/i })
    ).toBeInTheDocument();
  });

  it("carga y muestra las finanzas del mock", async () => {
    mocks.obtenerFinanzasGenerales.mockResolvedValue([
      {
        id_usuario: 1,
        primer_nombre: "Laura",
        primer_apellido: "Pérez",
        documento: "1001",
        total_ingresos: "1000000",
        total_gastos: "400000",
      },
    ]);

    render(<Exportar_finanzas />);

    expect(await screen.findByText("Laura Pérez")).toBeInTheDocument();
    expect(screen.getByText("1001")).toBeInTheDocument();
  });

  it("el botón exportar llama a registrarExportacion con datos de localStorage", async () => {
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 42 }));
    mocks.obtenerFinanzasGenerales.mockResolvedValue([
      {
        id_usuario: 1,
        primer_nombre: "Laura",
        primer_apellido: "Pérez",
        documento: "1001",
        total_ingresos: "1000000",
        total_gastos: "400000",
      },
    ]);
    mocks.registrarExportacion.mockResolvedValue({});

    render(<Exportar_finanzas />);

    const exportarBtn = await screen.findByRole("button", { name: /exportar/i });
    await userEvent.click(exportarBtn);

    expect(mocks.registrarExportacion).toHaveBeenCalledTimes(1);
    expect(mocks.registrarExportacion).toHaveBeenCalledWith(
      expect.stringMatching(/Reporte_Finanzas_SENA_GDF_.*\.xlsx/),
      42,
      "Finanzas"
    );
  });
});