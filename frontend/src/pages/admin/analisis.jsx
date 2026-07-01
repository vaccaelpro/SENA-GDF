import "../../css/analisis.css";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaEye, FaDownload, FaTrashAlt, FaArrowLeft, FaChartBar, FaComments } from "react-icons/fa";
import { listarEncuestas, obtenerAnalisisEncuesta, eliminarEncuesta } from "../../services/admin/encuestas.service";
import Swal from "sweetalert2";
import Chart from "chart.js/auto";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const Analisis = () => {
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analisis, setAnalisis] = useState(null);
  const chartRefs = useRef({});

  const cargarEncuestas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarEncuestas();
      setEncuestas(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron obtener las encuestas.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEncuestas();
  }, [cargarEncuestas]);

  const verAnalisis = async (idFormulario) => {
    setLoading(true);
    try {
      const data = await obtenerAnalisisEncuesta(idFormulario);
      setAnalisis(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo obtener el análisis.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (idFormulario) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la encuesta y todas las respuestas asociadas.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        await eliminarEncuesta(idFormulario);
        Swal.fire("Eliminado", "La encuesta ha sido eliminada.", "success");
        cargarEncuestas();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar la encuesta.", "error");
      }
    }
  };

  // Renderizar gráficos de barras para las preguntas
  useEffect(() => {
    if (!analisis) return;

    // Destruir gráficos anteriores
    Object.values(chartRefs.current).forEach(chart => {
      if (chart) chart.destroy();
    });
    chartRefs.current = {};

    analisis.preguntas.forEach(p => {
      const canvasId = `chart_${p.id_pregunta}`;
      const canvasEl = document.getElementById(canvasId);
      if (canvasEl) {
        const labels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        const dataValues = labels.map(l => p.distribucion[l] || 0);

        chartRefs.current[p.id_pregunta] = new Chart(canvasEl, {
          type: "bar",
          data: {
            labels,
            datasets: [
              {
                label: "Frecuencia de calificación",
                data: dataValues,
                backgroundColor: "#28a745",
                borderRadius: 5
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
              }
            }
          }
        });
      }
    });

    return () => {
      Object.values(chartRefs.current).forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [analisis]);

  // Exportar los datos del análisis a un archivo Excel
  const exportarAExcel = async () => {
    if (!analisis) return;

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Análisis de Encuesta");

      worksheet.columns = [
        { header: "Pregunta", key: "pregunta", width: 45 },
        { header: "Calificación Promedio", key: "promedio", width: 20 },
        { header: "Total Calificaciones", key: "total", width: 20 },
        { header: "Comentarios Adicionales", key: "comentarios", width: 60 }
      ];

      worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF28A745" }
      };

      analisis.preguntas.forEach(p => {
        const comentariosTexto = p.comentarios.map(c => `[${c.usuario}]: ${c.texto}`).join("\r\n");
        worksheet.addRow({
          pregunta: p.pregunta,
          promedio: p.promedio,
          total: p.total_respuestas,
          comentarios: comentariosTexto
        });
      });

      // Habilitar salto de línea para comentarios
      worksheet.getColumn("comentarios").alignment = { wrapText: true };

      const buffer = await workbook.xlsx.writeBuffer();
      const filename = `Analisis_Encuesta_${analisis.encuesta.titulo.replace(/\s+/g, "_")}.xlsx`;
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, filename);

      Swal.fire("Exportado", "El reporte de análisis se ha descargado.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo exportar a Excel.", "error");
    }
  };

  if (loading && encuestas.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando datos del análisis...</p>
      </div>
    );
  }

  return (
    <div className="contenido p-4">
      {analisis ? (
        <div className="animate-fade-in">
          <button className="btn btn-link text-success p-0 mb-3 d-flex align-items-center gap-2 text-decoration-none fw-bold" onClick={() => setAnalisis(null)}>
            <FaArrowLeft /> Volver a encuestas
          </button>

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 className="mb-0 fw-bold text-dark">{analisis.encuesta.titulo}</h2>
              <p className="text-muted mb-0">{analisis.encuesta.descripcion || "Resultados generales recopilados."}</p>
            </div>
            <button className="btn btn-success d-flex align-items-center gap-2 px-4 shadow" onClick={exportarAExcel}>
              <FaDownload /> Exportar Análisis (Excel)
            </button>
          </div>

          <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: "15px", backgroundColor: "#fdfdfd" }}>
            <h5 className="fw-bold mb-0 text-secondary">
              Participación Total: <span className="text-success">{analisis.total_participantes} Aprendices</span>
            </h5>
          </div>

          {/* PREGUNTAS DETALLADAS */}
          <div className="row">
            {analisis.preguntas.map((p, idx) => (
              <div className="col-12 mb-4" key={p.id_pregunta}>
                <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: "15px", borderLeft: "5px solid #28a745" }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <h5 className="fw-bold text-dark mb-0">
                      {idx + 1}. {p.pregunta}
                    </h5>
                    <div className="bg-success text-white px-3 py-1 rounded-pill fw-bold">
                      Promedio: {p.promedio} / 10
                    </div>
                  </div>

                  <div className="row align-items-center">
                    <div className="col-md-7 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-bold">
                        <FaChartBar /> Distribución de Puntuaciones
                      </div>
                      <div style={{ height: "180px", position: "relative" }}>
                        <canvas id={`chart_${p.id_pregunta}`}></canvas>
                      </div>
                    </div>

                    <div className="col-md-5">
                      <div className="d-flex align-items-center gap-2 mb-2 text-muted small fw-bold">
                        <FaComments /> Comentarios Recientes
                      </div>
                      <div className="border rounded p-3 bg-light scroll-comments" style={{ maxHeight: "180px", overflowY: "auto" }}>
                        {p.comentarios.length === 0 ? (
                          <span className="text-muted small">No hay comentarios en esta pregunta.</span>
                        ) : (
                          p.comentarios.map((c, cIdx) => (
                            <div key={cIdx} className="mb-2 pb-2 border-bottom last-no-border">
                              <span className="fw-bold d-block text-success small">{c.usuario}</span>
                              <span className="text-dark small">{c.texto.replace("Comentario: ", "")}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h2 className="mb-2 text-success fw-bold">Análisis y Resultados de Encuestas</h2>
          <p className="text-muted mb-4">Revisa las respuestas, el promedio de satisfacción y exporta los datos agregados.</p>

          {encuestas.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
              <h5 className="text-muted">Aún no se han creado o respondido encuestas.</h5>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle custom-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th className="text-center">Respuestas Recibidas</th>
                    <th className="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {encuestas.map(enc => (
                    <tr key={enc.id_formulario}>
                      <td className="fw-bold">{enc.titulo}</td>
                      <td>{enc.descripcion || "Sin descripción."}</td>
                      <td className="text-center">
                        <span className="badge bg-success rounded-pill px-3 py-1">
                          {enc.total_respuestas}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-sm btn-outline-success d-flex align-items-center gap-1" onClick={() => verAnalisis(enc.id_formulario)}>
                            <FaEye /> Ver Resultados
                          </button>
                          <button className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" onClick={() => handleEliminar(enc.id_formulario)}>
                            <FaTrashAlt /> Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Analisis;