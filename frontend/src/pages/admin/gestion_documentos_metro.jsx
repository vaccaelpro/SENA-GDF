import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  FaSubway,
  FaSearch,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaDownload,
  FaEye,
  FaFilter,
  FaTimes,
  FaPenFancy,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  listarDocumentosMetroAdmin,
  actualizarEstadoDocumentoMetroAdmin,
  obtenerUrlDescargaMetroAdmin,
  descargarArchivoMetroBlob,
} from "../../services/admin/documentos_metro_admin.service";
import "../../css/gestion_documentos_metro.css";

const obtenerUrlCompleta = (ruta) => {
  if (!ruta) return "";
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
  const base = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
  const limpia = ruta.startsWith("/") ? ruta : `/${ruta}`;
  return `${base}${limpia}`;
};

const GestionDocumentosMetro = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [busqueda, setBusqueda] = useState("");
  const [modalSolicitud, setModalSolicitud] = useState(null);
  const [descargando, setDescargando] = useState(false);

  const cargarSolicitudes = async () => {
    setLoading(true);
    try {
      const data = await listarDocumentosMetroAdmin({
        estado: filtroEstado,
        busqueda,
      });
      setSolicitudes(data || []);
    } catch (error) {
      console.error("Error al cargar solicitudes metro:", error);
      Swal.fire({
        icon: "error",
        title: "Error de conexión",
        text: "No se pudieron obtener las solicitudes del servidor.",
        confirmButtonColor: "#39a900",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, [filtroEstado]);

  const handleBuscar = (e) => {
    e.preventDefault();
    cargarSolicitudes();
  };

  const handleCambiarEstado = async (idSolicitud, nuevoEstado) => {
    const confirm = await Swal.fire({
      title: `¿Confirmar cambio a ${nuevoEstado}?`,
      text: "El estado de validación del aprendiz será actualizado.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#39a900",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await actualizarEstadoDocumentoMetroAdmin(idSolicitud, nuevoEstado);
      Swal.fire({
        icon: "success",
        title: "Estado actualizado",
        text: `La solicitud ahora está ${nuevoEstado}.`,
        confirmButtonColor: "#39a900",
      });
      if (modalSolicitud && modalSolicitud.id_solicitud === idSolicitud) {
        setModalSolicitud((prev) => ({ ...prev, estado_validacion: nuevoEstado }));
      }
      cargarSolicitudes();
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo actualizar el estado de la solicitud.",
        confirmButtonColor: "#39a900",
      });
    }
  };

  const handleDescargar = async (idSolicitud, nombreOriginal) => {
    try {
      setDescargando(true);
      await descargarArchivoMetroBlob(idSolicitud, nombreOriginal);
    } catch (error) {
      console.error("Error al descargar documento:", error);
      Swal.fire({
        icon: "error",
        title: "Error de descarga",
        text: "No se pudo descargar el archivo físico. Verifica que el archivo exista en el servidor.",
        confirmButtonColor: "#39a900",
      });
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="gestion-metro-container p-4 animate-fade-in">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="d-flex align-items-center">
          <div className="admin-header-icon me-3">
            <FaSubway />
          </div>
          <div>
            <h3 className="fw-bold mb-0 text-dark">Validación de Beneficios Metro</h3>
            <p className="text-muted mb-0 small">
              Auditoría y control de calidad de formularios radicados por aprendices
            </p>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-light text-dark border p-2">
            Total Solicitudes: <strong>{solicitudes.length}</strong>
          </span>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="admin-filters-card card p-3 mb-4 border-0 shadow-sm rounded-3">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <form onSubmit={handleBuscar} className="d-flex gap-2">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Buscar por aprendiz, cédula o Cívica..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-sena-admin">
                Buscar
              </button>
            </form>
          </div>

          <div className="col-md-7 d-flex flex-wrap justify-content-md-end gap-2">
            <div className="btn-group" role="group">
              {["TODOS", "APROBADO", "REQUIERE_REVISION", "RECHAZADO"].map((est) => (
                <button
                  key={est}
                  type="button"
                  className={`btn btn-sm ${
                    filtroEstado === est ? "btn-success fw-bold active-filter" : "btn-outline-secondary"
                  }`}
                  onClick={() => setFiltroEstado(est)}
                >
                  {est === "TODOS" ? "Todos" : est.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Solicitudes */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Fecha</th>
                <th>Aprendiz</th>
                <th>Cívica N°</th>
                <th>Documento</th>
                <th>Municipio / Barrio</th>
                <th>Dictamen IA</th>
                <th>Confianza</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <div className="spinner-border text-success" />
                    <p className="mt-2 text-muted small">Cargando solicitudes...</p>
                  </td>
                </tr>
              ) : solicitudes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5 text-muted">
                    <FaSubway size={40} className="mb-2 opacity-50 text-secondary" />
                    <h6>No se encontraron solicitudes registradas</h6>
                    <p className="small">No hay formularios radicados con los filtros seleccionados.</p>
                  </td>
                </tr>
              ) : (
                solicitudes.map((sol) => (
                  <tr key={sol.id_solicitud}>
                    <td className="small text-muted">
                      {sol.fecha_subida
                        ? new Date(sol.fecha_subida).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </td>
                    <td>
                      <div className="fw-bold text-dark">
                        {sol.primer_nombre} {sol.primer_apellido}
                      </div>
                      <small className="text-muted">{sol.grupo_formacion || sol.correo_electronico}</small>
                    </td>
                    <td className="fw-bold text-dark">{sol.tarjeta_civica || <span className="text-danger">Sin número</span>}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {sol.tipo_documento} {sol.numero_documento}
                      </span>
                    </td>
                    <td className="small">
                      <div>{sol.municipio || "-"}</div>
                      <small className="text-muted">{sol.barrio || ""}</small>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          sol.estado_validacion === "APROBADO"
                            ? "bg-success"
                            : sol.estado_validacion === "REQUIERE_REVISION"
                            ? "bg-warning text-dark"
                            : "bg-danger"
                        }`}
                      >
                        {sol.estado_validacion}
                      </span>
                    </td>
                    <td>
                      <div className="progress" style={{ height: "6px", width: "70px" }}>
                        <div
                          className={`progress-bar ${
                            sol.puntaje_confianza >= 80
                              ? "bg-success"
                              : sol.puntaje_confianza >= 50
                              ? "bg-warning"
                              : "bg-danger"
                          }`}
                          style={{ width: `${sol.puntaje_confianza || 0}%` }}
                        />
                      </div>
                      <small className="text-muted">{sol.puntaje_confianza}%</small>
                    </td>
                    <td className="text-center">
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Ver Detalle y Auditoría"
                          onClick={() => setModalSolicitud(sol)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          title="Descargar Documento Original"
                          onClick={() => handleDescargar(sol.id_solicitud, sol.nombre_archivo_original)}
                          disabled={descargando}
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle y Auditoría */}
      {modalSolicitud && (
        <div className="modal-backdrop-custom animate-fade-in">
          <div className="modal-dialog-custom">
            <div className="modal-content-custom">
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <FaSubway className="text-success" size={20} />
                  <h5 className="mb-0 fw-bold">Detalle de Solicitud #{modalSolicitud.id_solicitud}</h5>
                </div>
                <button
                  className="btn btn-sm btn-light rounded-circle"
                  onClick={() => setModalSolicitud(null)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="modal-body-custom p-4">
                <div className="row g-4">
                  {/* Columna Izquierda: Vista Previa del Archivo */}
                  <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Documento Escaneado:</h6>
                      <span className="badge bg-light text-secondary border small">
                        {modalSolicitud.nombre_archivo_original || "Documento Adjunto"}
                      </span>
                    </div>

                    <div className="document-preview-frame rounded border shadow-sm p-2 bg-light text-center">
                      {modalSolicitud.ruta_archivo?.toLowerCase().endsWith(".pdf") ? (
                        <div className="pdf-preview-box">
                          <iframe
                            src={obtenerUrlCompleta(modalSolicitud.ruta_archivo)}
                            title="Documento PDF"
                            className="w-100 rounded border"
                            style={{ height: "460px", border: "none" }}
                          />
                          <div className="mt-2 text-center">
                            <a
                              href={obtenerUrlDescargaMetroAdmin(modalSolicitud.id_solicitud)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success"
                            >
                              <FaEye className="me-1" /> Abrir PDF en pestaña nueva
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="img-preview-box">
                          <img
                            src={obtenerUrlCompleta(modalSolicitud.ruta_archivo)}
                            alt="Documento escaneado"
                            className="img-fluid rounded modal-doc-img"
                            onError={(e) => {
                              if (!e.target.dataset.tried) {
                                e.target.dataset.tried = "true";
                                e.target.src = `http://localhost:3001${modalSolicitud.ruta_archivo.startsWith('/') ? '' : '/'}${modalSolicitud.ruta_archivo}`;
                              }
                            }}
                          />
                          <div className="mt-2 text-center">
                            <a
                              href={obtenerUrlCompleta(modalSolicitud.ruta_archivo)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success"
                            >
                              <FaEye className="me-1" /> Ver imagen completa
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Columna Derecha: Auditoría de la IA */}
                  <div className="col-lg-6">
                    <h6 className="fw-bold mb-2">Resultados de la Auditoría Inteligente:</h6>

                    {/* Estado actual */}
                    <div className="p-3 mb-3 bg-light rounded d-flex justify-content-between align-items-center">
                      <div>
                        <span className="small text-muted d-block">Estado de Validación:</span>
                        <strong className="fs-6">{modalSolicitud.estado_validacion}</strong>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleCambiarEstado(modalSolicitud.id_solicitud, "APROBADO")}
                        >
                          <FaCheckCircle className="me-1" /> Aprobar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleCambiarEstado(modalSolicitud.id_solicitud, "RECHAZADO")}
                        >
                          <FaTimesCircle className="me-1" /> Rechazar
                        </button>
                      </div>
                    </div>

                    {/* Datos Detectados */}
                    <div className="card p-3 mb-3 border">
                      <h6 className="small fw-bold text-uppercase text-muted mb-2">Datos Extraídos por OCR</h6>
                      <ul className="list-unstyled mb-0 small">
                        <li className="mb-1">
                          <strong>Nombre:</strong> {modalSolicitud.nombre_completo || `${modalSolicitud.primer_nombre} ${modalSolicitud.primer_apellido}`}
                        </li>
                        <li className="mb-1">
                          <strong>Documento:</strong> {modalSolicitud.tipo_documento} {modalSolicitud.numero_documento}
                        </li>
                        <li className="mb-1">
                          <strong>Tarjeta Cívica:</strong> {modalSolicitud.tarjeta_civica || "No detectada"}
                        </li>
                        <li className="mb-1">
                          <strong>Dirección:</strong> {modalSolicitud.direccion || "No detectada"}
                        </li>
                        <li className="mb-1">
                          <strong>Barrio / Municipio:</strong> {modalSolicitud.barrio}, {modalSolicitud.municipio}
                        </li>
                        <li className="mb-1">
                          <strong>Estrato:</strong> {modalSolicitud.estrato || "No especificado"}
                        </li>
                      </ul>
                    </div>

                    {/* Verificación de Firmas */}
                    <div className="card p-3 mb-3 border">
                      <h6 className="small fw-bold text-uppercase text-muted mb-2">
                        <FaPenFancy className="me-1" /> Firmas y Mayoría de Edad
                      </h6>
                      <div className="row g-2 small">
                        <div className="col-6">
                          Firma Estudiante:{" "}
                          {modalSolicitud.tiene_firma_estudiante ? (
                            <span className="badge bg-success">Detectada</span>
                          ) : (
                            <span className="badge bg-danger">Faltante</span>
                          )}
                        </div>
                        <div className="col-6">
                          Firma Acudiente:{" "}
                          {modalSolicitud.tiene_firma_acudiente ? (
                            <span className="badge bg-success">Detectada</span>
                          ) : (
                            <span className="badge bg-secondary">No requerida/No</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Observaciones de la IA */}
                    {modalSolicitud.observaciones_ia?.evaluacion?.inconsistencias?.length > 0 && (
                      <div className="p-3 bg-warning-subtle border-warning-subtle rounded small">
                        <strong className="text-warning-emphasis d-block mb-1">
                          <FaExclamationTriangle className="me-1" /> Inconsistencias Reportadas:
                        </strong>
                        <ul className="mb-0 ps-3">
                          {modalSolicitud.observaciones_ia.evaluacion.inconsistencias.map((inc, i) => (
                            <li key={i} className="text-warning-emphasis">
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionDocumentosMetro;
