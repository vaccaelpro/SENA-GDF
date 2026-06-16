import React, { useEffect, useRef, useState } from "react";
import { FaDownload } from "react-icons/fa";
import Chart from "chart.js/auto";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import { obtenerFinanzasGenerales } from "../../services/admin/finanzas.service";
import { registrarExportacion } from "../../services/admin/exportaciones.service";
import "../../css/exportar_finanzas.css";

const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0
  }).format(valor || 0);

const Exportar_finanzas = () => {
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);
  const chartsRef = useRef({});

  const [finanzas, setFinanzas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  // Cargar finanzas de todos los usuarios
  const cargarFinanzas = async () => {
    setLoading(true);
    try {
      const data = await obtenerFinanzasGenerales();
      setFinanzas(data);
      setFiltradas(data);
    } catch (error) {
      console.error("Error al cargar finanzas de usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las finanzas de los usuarios."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFinanzas();
  }, []);

  // Filtrar lista por búsqueda
  useEffect(() => {
    const term = busqueda.toLowerCase().trim();
    if (!term) {
      setFiltradas(finanzas);
    } else {
      const result = finanzas.filter(
        (f) =>
          `${f.primer_nombre} ${f.primer_apellido}`.toLowerCase().includes(term) ||
          String(f.documento).includes(term)
      );
      setFiltradas(result);
    }
  }, [busqueda, finanzas]);

  // Dibujar y actualizar los gráficos dinámicos
  useEffect(() => {
    if (loading || filtradas.length === 0) {
      // Si no hay datos, destruimos gráficos existentes
      Object.values(chartsRef.current).forEach((chart) => {
        if (chart) chart.destroy();
      });
      return;
    }

    // Preparar datos para Bar Chart (Ingresos vs Gastos por Usuario)
    // Mostramos los primeros 8 para no saturar el eje X si hay muchos
    const limitedData = filtradas.slice(0, 8);
    const labels = limitedData.map((f) => `${f.primer_nombre} ${f.primer_apellido.split(" ")[0]}`);
    const ingresos = limitedData.map((f) => Number(f.total_ingresos));
    const gastos = limitedData.map((f) => Number(f.total_gastos));

    // Calcular totales generales para Pie Chart
    const totalIngresos = filtradas.reduce((a, b) => a + Number(b.total_ingresos), 0);
    const totalGastos = filtradas.reduce((a, b) => a + Number(b.total_gastos), 0);

    // Destruir gráficos previos
    Object.values(chartsRef.current).forEach((chart) => {
      if (chart) chart.destroy();
    });

    // Bar Chart
    if (barChartRef.current) {
      chartsRef.current.bar = new Chart(barChartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label: "Ingresos", data: ingresos, backgroundColor: "#28a745" },
            { label: "Gastos", data: gastos, backgroundColor: "#dc3545" },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (val) => formatCOP(val)
              }
            }
          }
        },
      });
    }

    // Pie Chart
    if (pieChartRef.current) {
      chartsRef.current.pie = new Chart(pieChartRef.current, {
        type: "pie",
        data: {
          labels: ["Ingresos Totales", "Gastos Totales"],
          datasets: [
            {
              data: [totalIngresos, totalGastos],
              backgroundColor: ["#28a745", "#dc3545"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: (context) => ` ${context.label}: ${formatCOP(context.raw)}`
              }
            }
          }
        },
      });
    }

    return () => {
      Object.values(chartsRef.current).forEach((chart) => {
        if (chart) chart.destroy();
      });
    };
  }, [filtradas, loading]);

  // Exportar los datos filtrados a un archivo Excel
  const exportarAExcel = async () => {
    if (filtradas.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Sin datos",
        text: "No hay registros financieros para exportar."
      });
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Finanzas Aprendices");

      // Columnas
      worksheet.columns = [
        { header: "Nombre Completo", key: "nombre", width: 30 },
        { header: "Documento", key: "documento", width: 18 },
        { header: "Total Ingresos (COP)", key: "ingresos", width: 22 },
        { header: "Total Gastos (COP)", key: "gastos", width: 22 },
        { header: "Balance Neto (COP)", key: "balance", width: 22 }
      ];

      // Formatear cabeceras
      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF28A745" }
      };

      // Rellenar filas
      filtradas.forEach((f) => {
        const ingresosNum = Number(f.total_ingresos);
        const gastosNum = Number(f.total_gastos);
        const balance = ingresosNum - gastosNum;

        worksheet.addRow({
          nombre: `${f.primer_nombre} ${f.primer_apellido}`,
          documento: f.documento,
          ingresos: ingresosNum,
          gastos: gastosNum,
          balance: balance
        });
      });

      // Formatear números en columnas monetarias
      worksheet.getColumn("ingresos").numFmt = '"$"#,##0';
      worksheet.getColumn("gastos").numFmt = '"$"#,##0';
      worksheet.getColumn("balance").numFmt = '"$"#,##0';

      const buffer = await workbook.xlsx.writeBuffer();
      const filename = `Reporte_Finanzas_SENA_GDF_${new Date().toISOString().split("T")[0]}.xlsx`;
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, filename);

      // Registrar exportación en la base de datos
      const adminStorage = localStorage.getItem("usuario");
      let idAdmin = 5; // Fallback por defecto
      if (adminStorage) {
        try {
          idAdmin = JSON.parse(adminStorage).id_usuario;
        } catch {}
      }

      await registrarExportacion(filename, idAdmin, "Finanzas");

      Swal.fire({
        icon: "success",
        title: "Exportado con éxito",
        text: `El reporte financiero se descargó como ${filename} y se registró en la bitácora.`
      });
    } catch (error) {
      console.error("Error al exportar finanzas:", error);
      Swal.fire({
        icon: "error",
        title: "Error al exportar",
        text: "Ocurrió un error inesperado al intentar generar el archivo Excel."
      });
    }
  };

  return (
    <div className="contenido p-4 animate-fade-in">
      <h2 className="titulo-seccion">Exportación de Finanzas</h2>
      <p className="subtitulo">
        Descarga los registros financieros de los usuarios en formato Excel y
        visualiza el resumen en gráficas interactivas.
      </p>

      <div className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control custom-input"
          placeholder="Buscar usuario por nombre o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn btn-success px-4" onClick={exportarAExcel} disabled={loading}>
          <FaDownload /> Exportar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando finanzas de los aprendices...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-5">
            <table className="table table-hover align-middle custom-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Documento</th>
                  <th>Ingresos</th>
                  <th>Gastos</th>
                  <th>Total Neto</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      No se encontraron registros de finanzas.
                    </td>
                  </tr>
                ) : (
                  filtradas.map((f) => {
                    const ingresosNum = Number(f.total_ingresos);
                    const gastosNum = Number(f.total_gastos);
                    const balance = ingresosNum - gastosNum;

                    return (
                      <tr key={f.id_usuario}>
                        <td>{`${f.primer_nombre} ${f.primer_apellido}`}</td>
                        <td>{f.documento}</td>
                        <td className="text-success">{formatCOP(ingresosNum)}</td>
                        <td className="text-danger">{formatCOP(gastosNum)}</td>
                        <td>
                          <strong className={balance >= 0 ? "text-success" : "text-danger"}>
                            {formatCOP(balance)}
                          </strong>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card shadow p-3 bg-white">
                <h5 className="mb-3 fw-bold">Ingresos vs Gastos</h5>
                {filtradas.length === 0 ? (
                  <div className="text-center py-5 text-muted">No hay datos para el gráfico.</div>
                ) : (
                  <canvas ref={barChartRef}></canvas>
                )}
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card shadow p-3 bg-white">
                <h5 className="mb-3 fw-bold">Distribución de Finanzas</h5>
                {filtradas.length === 0 ? (
                  <div className="text-center py-5 text-muted">No hay datos para el gráfico.</div>
                ) : (
                  <canvas ref={pieChartRef}></canvas>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Exportar_finanzas;
