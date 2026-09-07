import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  FaFileUpload,
  FaFilePdf,
  FaRobot,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaDownload,
  FaInfoCircle,
  FaEye,
  FaHistory,
  FaMapMarkerAlt,
  FaPenFancy,
  FaIdCard,
  FaTimes,
} from "react-icons/fa";
import {
  analizarDocumentoMetro,
  obtenerMisSolicitudesMetro,
  obtenerUrlPlantillaMetro,
  obtenerUrlDescargaMetroAprendiz,
  descargarArchivoMetroAprendizBlob,
} from "../../services/aprendiz/documentos_metro.service";
import plantillaImg from "../../assets/img/formato_metro_plantilla.jpg";
import "../../css/validador_metro.css";

const obtenerUrlCompleta = (ruta) => {
  if (!ruta) return "";
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
  const base = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";
  const limpia = ruta.startsWith("/") ? ruta : `/${ruta}`;
  return `${base}${limpia}`;
};

const PASOS_GUIA = [
  {
    titulo: "1. Tarjeta Cívica y Fecha",
    icono: <FaIdCard />,
    descripcion:
      "Diligencia el número completo de tu tarjeta Cívica personalizada en la parte superior derecha. Registra el día, mes y año de diligenciamiento.",
    tip: "Si tu Cívica no está personalizada a tu nombre, debes acudir primero a un Punto de Atención al Cliente (PAC) del Metro.",
  },
  {
    titulo: "2. Datos Personales y Documento",
    icono: <FaIdCard />,
    descripcion:
      "Escribe tus nombres y apellidos completos tal como figuran en tu documento. Marca con una 'X' el tipo (R.C, T.I, C.C u OTRO) y escribe el número con claridad sin tachones.",
    tip: "Asegúrate de que la letra sea nítida para que los sistemas de escaneo la lean sin dificultad.",
  },
  {
    titulo: "3. Dirección de Residencia y Barrio",
    icono: <FaMapMarkerAlt />,
    descripcion:
      "La dirección debe tener nomenclatura estándar (Calle, Carrera, Transversal o Diagonal seguido de #). El barrio y municipio deben pertenecer al Valle de Aburrá (Medellín, Bello, Itagüí, etc.).",
    tip: "El beneficio de perfil estudiante cubre únicamente municipios del Área Metropolitana del Valle de Aburrá.",
  },
  {
    titulo: "4. Institución y Estrato",
    icono: <FaInfoCircle />,
    descripcion:
      "En Institución Educativa escribe 'SENA' o el centro de formación correspondiente, junto con el grado o tecnología. Indica tu estrato (1, 2 o 3 para el subsidio).",
    tip: "Los estratos 4, 5 y 6 generalmente no califican para la tarifa preferencial de estudiante.",
  },
  {
    titulo: "5. Firmas (¡El error más común!)",
    icono: <FaPenFancy />,
    descripcion:
      "Si eres MAYOR de 18 años, firma en 'Firma y documento de Estudiantes mayores de edad'. Si eres MENOR de 18 años, tu acudiente o padre DEBE firmar en 'Firma y documento de Padre de Familia o Acudiente'.",
    tip: "¡Nunca dejes la casilla de firma en blanco! Es causal inmediata de rechazo por el Metro.",
  },
];

const ValidadorMetro = () => {
  const fileInputRef = useRef(null);
  const [subpestaña, setSubpestaña] = useState("validar"); // 'validar' | 'guia' | 'historial' | 'plantilla'
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analizando, setAnalizando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [modalDetalle, setModalDetalle] = useState(null);
  const [descargando, setDescargando] = useState(false);

  // Cargar historial
  const cargarHistorial = async () => {
    setCargandoHistorial(true);
    try {
      const idUsuario = JSON.parse(localStorage.getItem("usuario") || "{}").id_usuario;
      const data = await obtenerMisSolicitudesMetro(idUsuario);
      setHistorial(data || []);
    } catch (error) {
      console.error("Error al cargar historial de documentos metro:", error);
    } finally {
      setCargandoHistorial(false);
    }
  };

  const handleDescargarMiArchivo = async (idSolicitud, nombreOriginal) => {
    try {
      setDescargando(true);
      await descargarArchivoMetroAprendizBlob(idSolicitud, nombreOriginal);
    } catch (error) {
      console.error("Error al descargar documento del aprendiz:", error);
      Swal.fire({
        icon: "error",
        title: "Error al descargar",
        text: "No se pudo descargar el archivo. Por favor verifica que el archivo siga disponible.",
        confirmButtonColor: "#39a900",
      });
    } finally {
      setDescargando(false);
    }
  };

  // Cerrar modal con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalDetalle) {
        setModalDetalle(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalDetalle]);

  useEffect(() => {
    if (subpestaña === "historial") {
      cargarHistorial();
    }
  }, [subpestaña]);

  // Manejo de archivo seleccionado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo
    const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!tiposPermitidos.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Tipo de archivo no permitido",
        text: "Por favor sube una imagen (JPG, PNG, WEBP) o un documento PDF.",
        confirmButtonColor: "#39a900",
      });
      return;
    }

    // Validar tamaño (máx 10 MB)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Archivo muy pesado",
        text: "El tamaño máximo permitido es de 10 MB.",
        confirmButtonColor: "#39a900",
      });
      return;
    }

    setArchivoSeleccionado(file);
    setResultado(null);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Enviar a la IA
  const handleAnalizar = async () => {
    if (!archivoSeleccionado) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona un documento",
        text: "Primero adjunta la foto o escaneo del formulario diligenciado.",
        confirmButtonColor: "#39a900",
      });
      return;
    }

    setAnalizando(true);

    try {
      const idUsuario = JSON.parse(localStorage.getItem("usuario") || "{}").id_usuario;

      // Optimizar resolución si es imagen muy pesada para subida instantánea
      const obtenerBase64Optimizado = () => {
        return new Promise((resolve, reject) => {
          if (!archivoSeleccionado.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(archivoSeleccionado);
            return;
          }

          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const maxDim = 1800;
              let width = img.width;
              let height = img.height;

              if (width > maxDim || height > maxDim) {
                if (width > height) {
                  height = Math.round((height * maxDim) / width);
                  width = maxDim;
                } else {
                  width = Math.round((width * maxDim) / height);
                  height = maxDim;
                }
              }

              const canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL("image/jpeg", 0.9));
            };
            img.onerror = reject;
            img.src = e.target.result;
          };
          reader.onerror = reject;
          reader.readAsDataURL(archivoSeleccionado);
        });
      };

      const base64Data = await obtenerBase64Optimizado();

      const res = await analizarDocumentoMetro(
        base64Data,
        archivoSeleccionado.name,
        archivoSeleccionado.type,
        idUsuario
      );

      setResultado(res.data);
      cargarHistorial();

      if (res.data.estadoValidacion === "APROBADO") {
        Swal.fire({
          icon: "success",
          title: "¡Documento Aprobado por la IA!",
          text: "El formulario cumple con todos los requisitos y firmas del Metro de Medellín.",
          confirmButtonColor: "#39a900",
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Se detectaron observaciones",
          text: "Revisa el desglose de errores para corregir el formulario antes de radicarlo.",
          confirmButtonColor: "#39a900",
        });
      }
    } catch (err) {
      console.error("Error al analizar documento:", err);
      Swal.fire({
        icon: "error",
        title: "Error en el análisis",
        text: err.response?.data?.error || err.message || "No se pudo completar el análisis del documento.",
        confirmButtonColor: "#39a900",
      });
    } finally {
      setAnalizando(false);
    }
  };

  // Limpiar selección
  const handleLimpiar = () => {
    setArchivoSeleccionado(null);
    setPreviewUrl(null);
    setResultado(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="validador-metro-wrapper animate-fade-in">
      {/* Barra de navegación de subpestañas */}
      <div className="metro-subnav mb-4">
        <button
          className={`metro-subnav-btn ${subpestaña === "validar" ? "active" : ""}`}
          onClick={() => setSubpestaña("validar")}
        >
          <FaFileUpload /> Subir y Auditar con IA
        </button>
        <button
          className={`metro-subnav-btn ${subpestaña === "guia" ? "active" : ""}`}
          onClick={() => setSubpestaña("guia")}
        >
          <FaRobot /> ¿Cómo Diligenciar el Formulario?
        </button>
        <button
          className={`metro-subnav-btn ${subpestaña === "plantilla" ? "active" : ""}`}
          onClick={() => setSubpestaña("plantilla")}
        >
          <FaFilePdf /> Formato Oficial (PDF / Imagen)
        </button>
        <button
          className={`metro-subnav-btn ${subpestaña === "historial" ? "active" : ""}`}
          onClick={() => setSubpestaña("historial")}
        >
          <FaHistory /> Mis Solicitudes
        </button>
      </div>

      {/* ── SUBPESTAÑA 1: SUBIR Y AUDITAR ── */}
      {subpestaña === "validar" && (
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="metro-card">
              <div className="metro-card-header">
                <div className="metro-card-icon">
                  <FaFileUpload />
                </div>
                <div>
                  <h5 className="mb-0">Subir Formulario Metro de Medellín</h5>
                  <small className="text-muted">
                    Formato de inscripción beneficiarios Perfil Estudiante Municipio
                  </small>
                </div>
              </div>

              <div className="metro-card-body">
                <div
                  className={`metro-dropzone ${archivoSeleccionado ? "has-file" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    style={{ display: "none" }}
                  />

                  {previewUrl ? (
                    <div className="preview-container">
                      <img src={previewUrl} alt="Vista previa" className="img-preview" />
                      <div className="preview-overlay">
                        <span>Clic para cambiar imagen</span>
                      </div>
                    </div>
                  ) : archivoSeleccionado ? (
                    <div className="p-4 text-center">
                      <FaFilePdf size={48} className="text-danger mb-2" />
                      <p className="fw-bold mb-1">{archivoSeleccionado.name}</p>
                      <small className="text-muted">
                        {(archivoSeleccionado.size / (1024 * 1024)).toFixed(2)} MB - Clic para cambiar
                      </small>
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <FaFileUpload size={48} className="text-success mb-2" />
                      <h6 className="fw-bold">Arrastra tu foto/PDF aquí o haz clic</h6>
                      <p className="text-muted small mb-0">
                        Sube una foto clara del formulario diligenciado a mano o digitalmente.
                      </p>
                      <span className="badge bg-light text-dark mt-2">JPG, PNG, WEBP o PDF (Máx 10MB)</span>
                    </div>
                  )}
                </div>

                {archivoSeleccionado && (
                  <div className="d-flex gap-2 mt-3">
                    <button
                      className="btn btn-sena-primary flex-grow-1"
                      onClick={handleAnalizar}
                      disabled={analizando}
                    >
                      {analizando ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Auditoría con Gemini en progreso...
                        </>
                      ) : (
                        <>
                          <FaRobot className="me-2" />
                          Analizar con IA y Validar
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={handleLimpiar}
                      disabled={analizando}
                    >
                      Limpiar
                    </button>
                  </div>
                )}

                <div className="metro-info-box mt-3">
                  <FaInfoCircle className="text-success me-2 flex-shrink-0" />
                  <small>
                    La IA analizará: <strong>N° de Cívica</strong>, documento de identidad, correspondencia de{" "}
                    <strong>firma según mayoría de edad</strong>, y verificará que tu dirección y barrio coincidan en el Valle de Aburrá.
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* ── RESULTADOS DE LA AUDITORÍA ── */}
          <div className="col-lg-6">
            <div className="metro-card h-100">
              <div className="metro-card-header">
                <div className="metro-card-icon">
                  <FaRobot />
                </div>
                <div>
                  <h5 className="mb-0">Dictamen de la IA Auditora</h5>
                  <small className="text-muted">Resultado de validación y control de calidad</small>
                </div>
              </div>

              <div className="metro-card-body">
                {analizando ? (
                  <div className="text-center py-5">
                    <div className="spinner-grow text-success mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                      <span className="visually-hidden">Procesando...</span>
                    </div>
                    <h6 className="fw-bold">Gemini Vision está examinando tu documento...</h6>
                    <p className="text-muted small">
                      Extrayendo campos manuscritos, detectando firmas y validando la nomenclatura en OpenStreetMap.
                    </p>
                  </div>
                ) : resultado ? (
                  <div className="resultado-analisis animate-fade-in">
                    {/* Semáforo de Estado */}
                    <div className={`status-badge-container ${resultado.estadoValidacion?.toLowerCase()}`}>
                      <div className="d-flex align-items-center">
                        {resultado.estadoValidacion === "APROBADO" ? (
                          <FaCheckCircle className="status-icon text-success me-3" size={32} />
                        ) : resultado.estadoValidacion === "REQUIERE_REVISION" ? (
                          <FaExclamationTriangle className="status-icon text-warning me-3" size={32} />
                        ) : (
                          <FaTimesCircle className="status-icon text-danger me-3" size={32} />
                        )}
                        <div>
                          <h6 className="status-title mb-0">
                            {resultado.estadoValidacion === "APROBADO"
                              ? "DOCUMENTO APROBADO"
                              : resultado.estadoValidacion === "REQUIERE_REVISION"
                              ? "REQUIERE CORRECCIONES"
                              : "DOCUMENTO RECHAZADO"}
                          </h6>
                          <small className="text-muted">
                            Confianza de lectura: {resultado.puntajeConfianza}%
                          </small>
                        </div>
                      </div>
                    </div>

                    {/* Mensaje amigable */}
                    {resultado.evaluacionGeneral?.mensaje_resumen_amigable && (
                      <div className="resumen-amigable mt-3 p-3 bg-light rounded">
                        <strong>Comentario de la IA:</strong> {resultado.evaluacionGeneral.mensaje_resumen_amigable}
                      </div>
                    )}

                    {/* Instrucciones de corrección si hay errores */}
                    {resultado.evaluacionGeneral?.instrucciones_correccion_para_usuario?.length > 0 && (
                      <div className="correcciones-box mt-3 p-3 border-danger-subtle bg-danger-subtle rounded">
                        <h6 className="text-danger fw-bold mb-2">
                          <FaExclamationTriangle className="me-2" />
                          ¿Dónde está el error y qué debes corregir?
                        </h6>
                        <ul className="mb-0 ps-3">
                          {resultado.evaluacionGeneral.instrucciones_correccion_para_usuario.map((inst, i) => (
                            <li key={i} className="text-danger-emphasis mb-1">
                              {inst}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Verificación de Firmas */}
                    <div className="firmas-card mt-3 p-3 bg-light rounded">
                      <h6 className="fw-bold mb-2">
                        <FaPenFancy className="me-2 text-success" />
                        Auditoría de Firmas
                      </h6>
                      <div className="row g-2 small">
                        <div className="col-6">
                          Firma Estudiante:{" "}
                          {resultado.verificacionFirmas?.firma_estudiante_presente ? (
                            <span className="badge bg-success">Presente</span>
                          ) : (
                            <span className="badge bg-danger">Faltante</span>
                          )}
                        </div>
                        <div className="col-6">
                          Firma Acudiente:{" "}
                          {resultado.verificacionFirmas?.firma_acudiente_presente ? (
                            <span className="badge bg-success">Presente</span>
                          ) : (
                            <span className="badge bg-secondary">No detectada</span>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 small text-muted">
                        {resultado.verificacionFirmas?.detalle_firma}
                      </div>
                    </div>

                    {/* Desglose de Datos Extraídos */}
                    <h6 className="fw-bold mt-4 mb-2">Datos Detectados en el Formulario:</h6>
                    <div className="datos-extraidos-grid">
                      <div className="dato-item">
                        <span className="dato-label">Tarjeta Cívica:</span>
                        <span className="dato-val fw-bold">{resultado.datosExtraidos?.tarjeta_civica || "⚠️ No detectada"}</span>
                      </div>
                      <div className="dato-item">
                        <span className="dato-label">Estudiante:</span>
                        <span className="dato-val">{resultado.datosExtraidos?.nombre_completo || "No legible"}</span>
                      </div>
                      <div className="dato-item">
                        <span className="dato-label">Documento:</span>
                        <span className="dato-val">
                          {resultado.datosExtraidos?.tipo_documento} {resultado.datosExtraidos?.numero_documento || "No legible"}
                        </span>
                      </div>
                      <div className="dato-item">
                        <span className="dato-label">Ubicación:</span>
                        <span className="dato-val">
                          {resultado.datosExtraidos?.direccion || ""}, {resultado.datosExtraidos?.barrio || ""},{" "}
                          {resultado.datosExtraidos?.municipio || ""}
                        </span>
                      </div>
                      <div className="dato-item">
                        <span className="dato-label">Estrato:</span>
                        <span className="dato-val">{resultado.datosExtraidos?.estrato || "No especificado"}</span>
                      </div>
                      <div className="dato-item">
                        <span className="dato-label">Institución:</span>
                        <span className="dato-val">{resultado.datosExtraidos?.institucion_educativa || "SENA"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted">
                    <FaRobot size={48} className="mb-3 text-secondary opacity-50" />
                    <h6>Esperando documento...</h6>
                    <p className="small">
                      Adjunta tu formato a la izquierda y presiona <strong>'Analizar con IA'</strong> para ver la auditoría en tiempo real.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBPESTAÑA 2: GUÍA DE DILIGENCIAMIENTO ── */}
      {subpestaña === "guia" && (
        <div className="metro-card animate-fade-in">
          <div className="metro-card-header">
            <div className="metro-card-icon">
              <FaRobot />
            </div>
            <div>
              <h5 className="mb-0">Guía de la IA: Cómo Diligenciar Correctamente tu Formato Metro</h5>
              <small className="text-muted">
                Sigue estas instrucciones para evitar que tu solicitud sea rechazada por la Alcaldía de Medellín o el Metro.
              </small>
            </div>
          </div>

          <div className="metro-card-body p-4">
            <div className="row g-4">
              {PASOS_GUIA.map((paso, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="paso-guia-card">
                    <div className="d-flex align-items-center mb-2">
                      <div className="paso-icono-circulo me-3">{paso.icono}</div>
                      <h6 className="fw-bold mb-0">{paso.titulo}</h6>
                    </div>
                    <p className="text-muted small mb-2">{paso.descripcion}</p>
                    <div className="paso-tip-box">
                      <FaInfoCircle className="text-success me-2" />
                      <span>{paso.tip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-4 pt-3 border-top">
              <button
                className="btn btn-sena-primary px-4 py-2"
                onClick={() => setSubpestaña("validar")}
              >
                <FaFileUpload className="me-2" />
                ¡Entendido! Ir a Subir y Auditar mi Documento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUBPESTAÑA 3: FORMATO OFICIAL (PDF/IMAGEN) ── */}
      {subpestaña === "plantilla" && (
        <div className="metro-card animate-fade-in">
          <div className="metro-card-header d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="metro-card-icon me-3">
                <FaFilePdf />
              </div>
              <div>
                <h5 className="mb-0">Formato Oficial de Inscripción (Metro de Medellín)</h5>
                <small className="text-muted">
                  Descárgalo para imprimirlo o diligenciarlo antes de subirlo
                </small>
              </div>
            </div>

            <a
              href={obtenerUrlPlantillaMetro()}
              download="Formato_Inscripcion_Metro_Medellin.jpg"
              className="btn btn-sena-primary"
            >
              <FaDownload className="me-2" /> Descargar Formato Oficial
            </a>
          </div>

          <div className="metro-card-body text-center p-4">
            <p className="text-muted mb-3">
              Puedes descargar este formato limpio, imprimirlo, llenarlo a mano con letra legible y tinta negra, y luego tomarle una foto nítida para que la IA lo audite.
            </p>
            <div className="plantilla-preview-wrapper shadow-sm rounded overflow-hidden">
              <img
                src={plantillaImg}
                alt="Formato Oficial Metro de Medellín"
                className="img-fluid plantilla-img"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── SUBPESTAÑA 4: MIS SOLICITUDES ── */}
      {subpestaña === "historial" && (
        <div className="metro-card animate-fade-in">
          <div className="metro-card-header">
            <div className="metro-card-icon">
              <FaHistory />
            </div>
            <div>
              <h5 className="mb-0">Historial de Solicitudes Enviadas</h5>
              <small className="text-muted">Estado de revisión de tus formatos radicados</small>
            </div>
          </div>

          <div className="metro-card-body p-0">
            {cargandoHistorial ? (
              <div className="text-center py-5">
                <div className="spinner-border text-success" />
                <p className="mt-2 text-muted">Cargando tus solicitudes...</p>
              </div>
            ) : historial.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <FaHistory size={40} className="mb-2 opacity-50" />
                <h6>Aún no has radicado ningún documento del Metro</h6>
                <p className="small">Sube tu formulario en la pestaña de validación para empezar.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Fecha</th>
                      <th>Cívica N°</th>
                      <th>Documento</th>
                      <th>Ubicación</th>
                      <th>Estado IA</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historial.map((item) => (
                      <tr key={item.id_solicitud}>
                        <td className="small">
                          {item.fecha_subida ? new Date(item.fecha_subida).toLocaleDateString("es-CO") : "Reciente"}
                        </td>
                        <td className="fw-bold">{item.tarjeta_civica || "Sin Cívica"}</td>
                        <td>
                          {item.tipo_documento} {item.numero_documento}
                        </td>
                        <td className="small">
                          {item.barrio}, {item.municipio}
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              item.estado_validacion === "APROBADO"
                                ? "bg-success"
                                : item.estado_validacion === "REQUIERE_REVISION"
                                ? "bg-warning text-dark"
                                : "bg-danger"
                            }`}
                          >
                            {item.estado_validacion}
                          </span>
                        </td>
                        <td className="text-center">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              title="Ver Detalle y Documento"
                              onClick={() => setModalDetalle(item)}
                            >
                              <FaEye className="me-1" /> Ver Detalle
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              title="Descargar Documento"
                              onClick={() => handleDescargarMiArchivo(item.id_solicitud, item.nombre_archivo_original)}
                              disabled={descargando}
                            >
                              <FaDownload />
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
        </div>
      )}

      {/* ── MODAL DETALLE DE SOLICITUD DEL APRENDIZ ── */}
      {modalDetalle && (
        <div
          className="modal-backdrop-custom animate-fade-in"
          onClick={() => setModalDetalle(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="modal-dialog-custom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content-custom">
              <div className="modal-header-custom d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <FaRobot className="text-success" size={22} />
                  <h5 className="mb-0 fw-bold">Detalle de Solicitud #{modalDetalle.id_solicitud}</h5>
                </div>
                <button
                  type="button"
                  className="modal-btn-exit rounded-circle p-2 d-flex align-items-center justify-content-center"
                  onClick={() => setModalDetalle(null)}
                  title="Salir / Cerrar"
                  aria-label="Cerrar modal"
                  style={{ width: "34px", height: "34px", border: "1px solid #ced4da", cursor: "pointer" }}
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <div className="modal-body-custom p-4">
                <div className="row g-4">
                  {/* Vista Previa del Documento */}
                  <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="fw-bold mb-0">Tu Formulario Cargado:</h6>
                      <span className="badge bg-light text-secondary border small">
                        {modalDetalle.nombre_archivo_original || "Documento Metro"}
                      </span>
                    </div>

                    <div className="document-preview-frame rounded border shadow-sm p-2 bg-light text-center">
                      {modalDetalle.ruta_archivo?.toLowerCase().endsWith(".pdf") ? (
                        <div className="pdf-preview-box">
                          <iframe
                            src={obtenerUrlCompleta(modalDetalle.ruta_archivo)}
                            title="Documento PDF"
                            className="w-100 rounded border"
                            style={{ height: "450px", border: "none" }}
                          />
                          <div className="mt-2 text-center">
                            <a
                              href={obtenerUrlDescargaMetroAprendiz(modalDetalle.id_solicitud)}
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
                            src={obtenerUrlCompleta(modalDetalle.ruta_archivo)}
                            alt="Formulario cargado"
                            className="img-fluid rounded modal-doc-img"
                            onError={(e) => {
                              if (!e.target.dataset.tried) {
                                e.target.dataset.tried = "true";
                                e.target.src = `http://localhost:3001${modalDetalle.ruta_archivo.startsWith('/') ? '' : '/'}${modalDetalle.ruta_archivo}`;
                              }
                            }}
                          />
                          <div className="mt-2 text-center">
                            <a
                              href={obtenerUrlCompleta(modalDetalle.ruta_archivo)}
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

                  {/* Auditoría de la IA */}
                  <div className="col-lg-6">
                    <h6 className="fw-bold mb-2">Auditoría Realizada por la IA:</h6>

                    <div className="p-3 mb-3 bg-light rounded d-flex justify-content-between align-items-center">
                      <div>
                        <span className="small text-muted d-block">Estado de Validación:</span>
                        <span
                          className={`badge fs-6 ${
                            modalDetalle.estado_validacion === "APROBADO"
                              ? "bg-success"
                              : modalDetalle.estado_validacion === "REQUIERE_REVISION"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {modalDetalle.estado_validacion}
                        </span>
                      </div>
                      <div className="text-end">
                        <span className="small text-muted d-block">Confianza de IA:</span>
                        <strong className="fs-6 text-success">{modalDetalle.puntaje_confianza || 0}%</strong>
                      </div>
                    </div>

                    {/* Datos Extraídos */}
                    <div className="card p-3 mb-3 border">
                      <h6 className="small fw-bold text-uppercase text-muted mb-2">Datos Extraídos de tu Formulario</h6>
                      <ul className="list-unstyled mb-0 small">
                        <li className="mb-1">
                          <strong>Nombre:</strong> {modalDetalle.nombre_completo || "No detectado"}
                        </li>
                        <li className="mb-1">
                          <strong>Documento:</strong> {modalDetalle.tipo_documento} {modalDetalle.numero_documento}
                        </li>
                        <li className="mb-1">
                          <strong>Tarjeta Cívica:</strong> {modalDetalle.tarjeta_civica || "No detectada"}
                        </li>
                        <li className="mb-1">
                          <strong>Dirección:</strong> {modalDetalle.direccion || "No detectada"}
                        </li>
                        <li className="mb-1">
                          <strong>Barrio / Municipio:</strong> {modalDetalle.barrio}, {modalDetalle.municipio}
                        </li>
                        <li className="mb-1">
                          <strong>Estrato:</strong> {modalDetalle.estrato || "No especificado"}
                        </li>
                      </ul>
                    </div>

                    {/* Verificación de Firmas */}
                    <div className="card p-3 mb-3 border">
                      <h6 className="small fw-bold text-uppercase text-muted mb-2">
                        <FaPenFancy className="me-1" /> Firmas
                      </h6>
                      <div className="row g-2 small">
                        <div className="col-6">
                          Firma Estudiante:{" "}
                          {modalDetalle.tiene_firma_estudiante ? (
                            <span className="badge bg-success">Detectada</span>
                          ) : (
                            <span className="badge bg-danger">Faltante</span>
                          )}
                        </div>
                        <div className="col-6">
                          Firma Acudiente:{" "}
                          {modalDetalle.tiene_firma_acudiente ? (
                            <span className="badge bg-success">Detectada</span>
                          ) : (
                            <span className="badge bg-secondary">No requerida/No</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Observaciones de la IA */}
                    {modalDetalle.observaciones_ia?.evaluacion?.inconsistencias?.length > 0 && (
                      <div className="p-3 bg-warning-subtle border-warning-subtle rounded small mb-2">
                        <strong className="text-warning-emphasis d-block mb-1">
                          <FaExclamationTriangle className="me-1" /> Aspectos a Corregir:
                        </strong>
                        <ul className="mb-0 ps-3">
                          {modalDetalle.observaciones_ia.evaluacion.inconsistencias.map((inc, i) => (
                            <li key={i} className="text-warning-emphasis">
                              {inc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {modalDetalle.observaciones_ia?.evaluacion?.instrucciones_correccion_para_usuario?.length > 0 && (
                      <div className="p-3 bg-info-subtle border-info-subtle rounded small">
                        <strong className="text-info-emphasis d-block mb-1">
                          <FaInfoCircle className="me-1" /> Recomendaciones:
                        </strong>
                        <ul className="mb-0 ps-3">
                          {modalDetalle.observaciones_ia.evaluacion.instrucciones_correccion_para_usuario.map((inst, i) => (
                            <li key={i} className="text-info-emphasis">
                              {inst}
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

export default ValidadorMetro;
