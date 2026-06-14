import { useState, useEffect } from "react";
import "../../css/exportar_personal.css";
import { FaDownload } from "react-icons/fa";
import { listarUsuarios } from "../../services/admin/usuarios.service";
import { registrarExportacion } from "../../services/admin/exportaciones.service";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

const Exportar_personal = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      const usuariosSinAdmin = data.filter(usuario => usuario.rol !== 'ADMIN');
      setUsuarios(usuariosSinAdmin);
      setCargando(false);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
      setCargando(false);
    }
  };

  const handleExportarExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Usuarios");

      worksheet.columns = [
        { header: "Primer Nombre", key: "primer_nombre", width: 20 },
        { header: "Segundo Nombre", key: "segundo_nombre", width: 20 },
        { header: "Primer Apellido", key: "primer_apellido", width: 20 },
        { header: "Segundo Apellido", key: "segundo_apellido", width: 20 },
        { header: "Tipo Documento", key: "tipo_documento", width: 25 },
        { header: "Documento", key: "documento", width: 15 },
        { header: "Grupo Formación", key: "grupo_formacion", width: 25 },
        { header: "Correo Electrónico", key: "correo_electronico", width: 30 },
        { header: "Tipo de Apoyo", key: "tipo_apoyo", width: 20 },
        { header: "Rol", key: "rol", width: 15 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF39A900" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 12,
        };
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      usuarios.forEach((u) => {
        const row = worksheet.addRow({
          primer_nombre: u.primer_nombre,
          segundo_nombre: u.segundo_nombre || "",
          primer_apellido: u.primer_apellido,
          segundo_apellido: u.segundo_apellido || "",
          tipo_documento: u.tipo_documento,
          documento: u.documento,
          grupo_formacion: u.grupo_formacion,
          correo_electronico: u.correo_electronico,
          tipo_apoyo: u.tipo_apoyo || "N/A",
          rol: u.rol,
        });

        row.eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { vertical: "middle", horizontal: "left" };
        });
      });

      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const fileName = `exportacion_personal_${year}-${month}-${day}.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, fileName);

      const usuarioSession = JSON.parse(localStorage.getItem("usuario"));
      if (usuarioSession && usuarioSession.id_usuario) {
        try {
          await registrarExportacion(fileName, usuarioSession.id_usuario, "Personal");
          Swal.fire("Éxito", "La exportación se ha completado y registrado correctamente", "success");
        } catch (recordingError) {
          console.error("Error al registrar la exportación en la base de datos:", recordingError);
          Swal.fire("Avance", "Excel descargado, pero no se pudo registrar en la base de datos", "warning");
        }
      } else {
        console.warn("No se encontró id_usuario en localStorage. Saltando registro.");
        Swal.fire("Éxito", "Excel descargado (Sin registro: Sesión inválida)", "info");
      }
    } catch (error) {
      console.error("Error al exportar Excel:", error);
      Swal.fire("Error", "No se pudo generar o registrar el archivo Excel", "error");
    }
  };

  return (
    <div className="contenido p-4">
      <h2 className="titulo-seccion">Exportación de Datos Personales</h2>
      <p className="subtitulo">
        Descarga los datos personales de los usuarios en formato Excel con un diseño mejorado.
      </p>

      <div className="d-flex gap-2 mb-4 justify-content-end">
        <button
          className="btn btn-success px-4"
          onClick={handleExportarExcel}
          disabled={cargando || usuarios.length === 0}
        >
          <FaDownload /> Exportar
        </button>
      </div>

      <div className="table-responsive">
        {cargando ? (
          <div className="text-center p-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <table className="table table-hover align-middle custom-table" id="tablaUsuarios">
            <thead>
              <tr>
                <th>Primer Nombre</th>
                <th>Segundo Nombre</th>
                <th>Primer Apellido</th>
                <th>Segundo Apellido</th>
                <th>Tipo Documento</th>
                <th>Documento</th>
                <th>Grupo Formación</th>
                <th>Correo Electrónico</th>
                <th>Tipo de Apoyo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id_usuario || usuario.documento}>
                    <td>{usuario.primer_nombre}</td>
                    <td>{usuario.segundo_nombre || ""}</td>
                    <td>{usuario.primer_apellido}</td>
                    <td>{usuario.segundo_apellido || ""}</td>
                    <td>{usuario.tipo_documento}</td>
                    <td>{usuario.documento}</td>
                    <td>{usuario.grupo_formacion}</td>
                    <td>{usuario.correo_electronico}</td>
                    <td>{usuario.tipo_apoyo || "N/A"}</td>
                    <td>{usuario.rol}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-muted p-4 text-center">
                    No se encontraron usuarios para exportar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Exportar_personal;