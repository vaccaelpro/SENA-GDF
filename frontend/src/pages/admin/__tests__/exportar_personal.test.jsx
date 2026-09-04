import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Exportar_personal from "../exportar_personal.jsx";

const mocks = vi.hoisted(() => ({
  listarUsuarios: vi.fn(),
  registrarExportacion: vi.fn(),
}));

vi.mock("../../../services/admin/usuarios.service", () => ({
  listarUsuarios: mocks.listarUsuarios,
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

describe("Exportar_personal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza la lista de usuarios del mock", async () => {
    mocks.listarUsuarios.mockResolvedValue([
      {
        id_usuario: 1,
        primer_nombre: "Carlos",
        segundo_nombre: "",
        primer_apellido: "Gómez",
        segundo_apellido: "",
        tipo_documento: "CC",
        documento: "12345",
        grupo_formacion: "G1",
        correo_electronico: "carlos@mail.com",
        tipo_apoyo: "Alimentación",
        rol: "USUARIO",
      },
      {
        id_usuario: 2,
        primer_nombre: "Admin",
        primer_apellido: "Root",
        documento: "999",
        rol: "ADMIN",
      },
    ]);

    render(<Exportar_personal />);

    expect(await screen.findByText("Carlos")).toBeInTheDocument();
    expect(screen.getByText("Gómez")).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("el botón exportar llama a registrarExportacion", async () => {
    localStorage.setItem("usuario", JSON.stringify({ id_usuario: 7 }));
    mocks.listarUsuarios.mockResolvedValue([
      {
        id_usuario: 1,
        primer_nombre: "Carlos",
        segundo_nombre: "",
        primer_apellido: "Gómez",
        segundo_apellido: "",
        tipo_documento: "CC",
        documento: "12345",
        grupo_formacion: "G1",
        correo_electronico: "carlos@mail.com",
        tipo_apoyo: "Alimentación",
        rol: "USUARIO",
      },
    ]);
    mocks.registrarExportacion.mockResolvedValue({});

    render(<Exportar_personal />);

    const exportarBtn = await screen.findByRole("button", {
      name: /exportar/i,
    });
    await userEvent.click(exportarBtn);

    expect(mocks.registrarExportacion).toHaveBeenCalledTimes(1);
    expect(mocks.registrarExportacion).toHaveBeenCalledWith(
      expect.stringMatching(/exportacion_personal_.*\.xlsx/),
      7,
      "Personal"
    );
  });
});