import "../../css/IAFinance.css";
import { useEffect, useRef, useState, useCallback } from "react";
import Chart from "chart.js/auto";
import {
  FaPaperPlane,
  FaWallet,
  FaPlus,
  FaTrash,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
  FaPiggyBank,
  FaExchangeAlt,
  FaCalendarAlt,
  FaRobot,
  FaExclamationTriangle,
} from "react-icons/fa";
import { listarMetas } from "../../services/aprendiz/metas.service";
import {
  listarIngresos,
  crearIngreso,
  eliminarIngreso,
  listarGastos,
  crearGasto,
  eliminarGasto,
} from "../../services/aprendiz/presupuesto.service";
import {
  enviarMensajeIA,
  obtenerHistorialIA,
  evaluarAlertaFinanciera,
} from "../../services/aprendiz/ia.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(valor || 0);

const hoy = () => new Date().toISOString().split("T")[0];

/** Convierte texto plano con URLs en elementos React con <a> clicables */
const renderizarTextoConLinks = (texto) => {
  if (!texto) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const partes = texto.split(urlRegex);
  return partes.map((parte, i) =>
    urlRegex.test(parte) ? (
      <a key={i} href={parte} target="_blank" rel="noopener noreferrer">
        {parte}
      </a>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
};

/** Sugerencias rápidas para el chat */
const SUGERENCIAS = [
  "¿Cómo aplico la regla 50/30/20?",
  "¿Qué es un fondo de emergencia?",
  "¿Cómo puedo ahorrar más cada mes?",
  "Muéstrame videos de educación financiera",
];

// ─── Modal de Gestión de Presupuesto ─────────────────────────────────────────
const ModalPresupuesto = ({ onClose, onRefresh, idUsuario, ingresos, gastos }) => {
  const [activeTab, setActiveTab] = useState("ingresos");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("Alimentación");
  const [fecha, setFecha] = useState(hoy());
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) {
      return setError("El monto debe ser mayor a 0.");
    }
    setError("");
    setSubmitting(true);
    try {
      if (activeTab === "ingresos") {
        await crearIngreso({
          monto: Number(monto),
          fecha_registro: fecha,
          usuario_id_usuario: idUsuario,
        });
      } else {
        await crearGasto({
          categoria,
          monto: Number(monto),
          fecha_registro: fecha,
          usuario_id_usuario: idUsuario,
        });
      }
      setMonto("");
      setFecha(hoy());
      onRefresh();
    } catch (err) {
      setError("Error al registrar la transacción. Intenta de nuevo.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = async (id, tipo) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      if (tipo === "ingreso") {
        await eliminarIngreso(id);
      } else {
        await eliminarGasto(id);
      }
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon green">
            <FaExchangeAlt />
          </div>
          <div>
            <h2>Mi Presupuesto</h2>
            <p>Controla tus ingresos y egresos de este mes</p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === "ingresos" ? "active" : ""}`}
            onClick={() => { setActiveTab("ingresos"); setError(""); }}
          >
            <FaArrowUp className="text-success me-2" /> Ingresos
          </button>
          <button
            className={`tab-btn ${activeTab === "gastos" ? "active" : ""}`}
            onClick={() => { setActiveTab("gastos"); setError(""); }}
          >
            <FaArrowDown className="text-danger me-2" /> Gastos
          </button>
        </div>

        <div className="modal-body-content row p-4">
          <div className="col-md-5 border-end">
            <h5 className="fw-bold mb-3">
              Agregar {activeTab === "ingresos" ? "Ingreso" : "Gasto"}
            </h5>
            <form onSubmit={handleSubmit} className="modal-form">
              {error && <div className="modal-error mb-3">{error}</div>}

              <div className="form-group mb-3">
                <label>Monto (COP) *</label>
                <input
                  type="number"
                  min="1"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 50000"
                  required
                />
              </div>

              {activeTab === "gastos" && (
                <div className="form-group mb-3">
                  <label>Categoría *</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    required
                  >
                    <option value="Alimentación">Alimentación</option>
                    <option value="Transporte">Transporte</option>
                    <option value="Salud">Salud</option>
                    <option value="Vivienda">Vivienda</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              )}

              <div className="form-group mb-3">
                <label>
                  <FaCalendarAlt /> Fecha *
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn-modal-submit w-100 ${activeTab === "gastos" ? "btn-danger" : ""}`}
                disabled={submitting}
              >
                <FaPlus className="me-2" />
                {submitting
                  ? "Guardando..."
                  : `Registrar ${activeTab === "ingresos" ? "Ingreso" : "Gasto"}`}
              </button>
            </form>
          </div>

          <div className="col-md-7 px-4">
            <h5 className="fw-bold mb-3">
              Historial de {activeTab === "ingresos" ? "Ingresos" : "Gastos"}
            </h5>
            <div className="transaction-list">
              {activeTab === "ingresos" ? (
                ingresos.length === 0 ? (
                  <p className="text-muted">No has registrado ingresos.</p>
                ) : (
                  ingresos.map((i) => (
                    <div
                      className="transaction-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom"
                      key={i.id_ingreso}
                    >
                      <div>
                        <span className="fw-semibold text-success d-block">
                          {formatCOP(i.monto)}
                        </span>
                        <small className="text-muted">
                          {new Date(i.fecha_registro).toLocaleDateString()}
                        </small>
                      </div>
                      <button
                        className="btn btn-sm text-danger"
                        onClick={() => handleEliminar(i.id_ingreso, "ingreso")}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )
              ) : gastos.length === 0 ? (
                <p className="text-muted">No has registrado gastos.</p>
              ) : (
                gastos.map((g) => (
                  <div
                    className="transaction-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom"
                    key={g.id_gasto}
                  >
                    <div>
                      <span className="fw-semibold text-danger d-block">
                        {formatCOP(g.monto)}
                      </span>
                      <small className="badge bg-secondary me-2">
                        {g.categoria}
                      </small>
                      <small className="text-muted">
                        {new Date(g.fecha_registro).toLocaleDateString()}
                      </small>
                    </div>
                    <button
                      className="btn btn-sm text-danger"
                      onClick={() => handleEliminar(g.id_gasto, "gasto")}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
const IAFinance = () => {
  const idUsuario = JSON.parse(localStorage.getItem("usuario") || "{}").id_usuario;

  // ── Refs ──────────────────────────────────────────────────────────────────
  const chartRef       = useRef(null);
  const chartInstance  = useRef(null);
  const mensajesEndRef = useRef(null);

  // ── Estado: datos financieros ─────────────────────────────────────────────
  const [metas,    setMetas]    = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [gastos,   setGastos]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // ── Estado: chat IA ───────────────────────────────────────────────────────
  const [mensajes,       setMensajes]       = useState([]); // [{tipo, contenido, ts}]
  const [inputMensaje,   setInputMensaje]   = useState("");
  const [enviando,       setEnviando]       = useState(false);
  const [alertaBanner,   setAlertaBanner]   = useState(null); // mensaje de alerta o null

  // ── Scroll automático al último mensaje ───────────────────────────────────
  useEffect(() => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, enviando]);

  // ── Cargar datos financieros y alertas ────────────────────────────────────
  const cargarDatos = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    try {
      const [metasData, ingresosData, gastosData] = await Promise.all([
        listarMetas(idUsuario),
        listarIngresos(idUsuario),
        listarGastos(idUsuario),
      ]);
      setMetas(metasData);
      setIngresos(ingresosData);
      setGastos(gastosData);
    } catch (error) {
      console.error("Error al cargar datos financieros:", error);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  // ── Cargar historial del chat desde la BD ─────────────────────────────────
  const cargarHistorialChat = useCallback(async () => {
    if (!idUsuario) return;
    try {
      const historial = await obtenerHistorialIA(idUsuario);
      const msgs = historial.map((row) => ({
        tipo: row.tipo,       // 'CHAT_USER' | 'CHAT_IA' | 'ALERTA'
        contenido: row.contenido,
        ts: row.fecha_interaccion,
        id: row.id_interaccion,
      }));
      setMensajes(msgs);
    } catch (err) {
      console.error("Error al cargar historial IA:", err);
    }
  }, [idUsuario]);

  // ── Evaluar alerta de balance al cargar ───────────────────────────────────
  const verificarAlerta = useCallback(async () => {
    if (!idUsuario) return;
    try {
      const alerta = await evaluarAlertaFinanciera(idUsuario);
      if (alerta.alertaActiva) {
        setAlertaBanner(alerta.mensaje);
      } else {
        setAlertaBanner(null);
      }
    } catch (err) {
      console.error("Error al verificar alerta financiera:", err);
    }
  }, [idUsuario]);

  useEffect(() => {
    cargarDatos();
    cargarHistorialChat();
  }, [cargarDatos, cargarHistorialChat]);

  // Verificar alerta después de cargar los datos
  useEffect(() => {
    if (!loading) {
      verificarAlerta();
    }
  }, [loading, verificarAlerta]);

  // ── Gráfico de categorías ─────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;

    const dataCategorias = {
      Alimentación: 0,
      Transporte: 0,
      Salud: 0,
      Vivienda: 0,
      Otros: 0,
    };

    gastos.forEach((g) => {
      if (dataCategorias[g.categoria] !== undefined) {
        dataCategorias[g.categoria] += Number(g.monto);
      } else {
        dataCategorias.Otros += Number(g.monto);
      }
    });

    const labels = Object.keys(dataCategorias);
    const data   = Object.values(dataCategorias);
    const totalGasto = data.reduce((acc, curr) => acc + curr, 0);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const finalLabels = totalGasto === 0 ? ["Sin gastos"] : labels.filter((_, idx) => data[idx] > 0);
    const finalData   = totalGasto === 0 ? [100] : data.filter((d) => d > 0);
    const finalColors = totalGasto === 0
      ? ["#dfe6e9"]
      : ["#28a745", "#0d6efd", "#ffc107", "#fd7e14", "#dc3545"].filter((_, idx) => data[idx] > 0);

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: finalLabels,
        datasets: [{ data: finalData, backgroundColor: finalColors, borderWidth: 1 }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                totalGasto === 0
                  ? " Sin egresos registrados"
                  : ` ${ctx.label}: ${formatCOP(ctx.raw)}`,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [gastos, loading]);

  // ── Enviar mensaje ────────────────────────────────────────────────────────
  const handleEnviarMensaje = async () => {
    const texto = inputMensaje.trim();
    if (!texto || enviando) return;

    // Agregar mensaje del usuario en la UI inmediatamente
    const msgUsuario = { tipo: "CHAT_USER", contenido: texto, ts: new Date().toISOString(), id: Date.now() };
    setMensajes((prev) => [...prev, msgUsuario]);
    setInputMensaje("");
    setEnviando(true);

    try {
      const resultado = await enviarMensajeIA(idUsuario, texto);

      // Agregar respuesta de la IA
      const msgIA = {
        tipo: "CHAT_IA",
        contenido: resultado.respuesta,
        ts: new Date().toISOString(),
        id: Date.now() + 1,
      };
      setMensajes((prev) => [...prev, msgIA]);

      // Si hay alerta nueva, agregarla al chat y al banner
      if (resultado.alertaFinanciera?.alertaActiva) {
        setAlertaBanner(resultado.alertaFinanciera.mensaje);
        // Solo agregar alerta al chat si no existe una ya visible
        const yaHayAlertaEnChat = msgUsuario && resultado.alertaFinanciera.mensaje;
        if (yaHayAlertaEnChat) {
          setMensajes((prev) => [
            ...prev,
            {
              tipo: "ALERTA",
              contenido: resultado.alertaFinanciera.mensaje,
              ts: new Date().toISOString(),
              id: Date.now() + 2,
            },
          ]);
        }
      } else {
        setAlertaBanner(null);
      }
    } catch (err) {
      console.error("Error al enviar mensaje a la IA:", err);
      setMensajes((prev) => [
        ...prev,
        {
          tipo: "CHAT_IA",
          contenido: "❌ Hubo un problema al conectar con el asistente. Por favor, intenta de nuevo en unos momentos.",
          ts: new Date().toISOString(),
          id: Date.now() + 1,
        },
      ]);
    } finally {
      setEnviando(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje();
    }
  };

  const handleSugerencia = (texto) => {
    setInputMensaje(texto);
  };

  // ── Cálculos globales ─────────────────────────────────────────────────────
  const totalAhorrado  = metas.reduce((acc, m) => acc + Number(m.monto_ahorrado || 0), 0);
  const totalIngresos  = ingresos.reduce((acc, i) => acc + Number(i.monto || 0), 0);
  const totalGastos    = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  const balanceNeto    = totalIngresos - totalGastos;
  const metaActiva     = metas[0];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <br />
      <div className="container p-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-3 text-muted">Cargando tu resumen financiero...</p>
          </div>
        ) : (
          <div className="row g-4 animate-fade-in">
            {/* ── Panel principal: Chat IA ── */}
            <div className="col-lg-8">
              {/* Tarjeta del chat */}
              <div className="ia-card">
                {/* Header del chat */}
                <div className="ia-chat-header">
                  <div className="ia-chat-header-avatar">
                    <FaRobot />
                  </div>
                  <div className="ia-chat-header-info">
                    <h6>FinanceBot IA</h6>
                    <small>
                      <span className="ia-status-dot" />
                      Especialista en Ahorro &amp; Finanzas
                    </small>
                  </div>
                </div>

                {/* Área de mensajes */}
                <div className="chat-messages">
                  {mensajes.length === 0 ? (
                    <div className="chat-welcome">
                      <div className="chat-welcome-icon">🤖💰</div>
                      <h6>¡Hola! Soy FinanceBot</h6>
                      <p>
                        Tu asistente especializado en <strong style={{ color: "#55efc4" }}>ahorro y educación financiera</strong>.
                        <br />
                        Pregúntame sobre presupuesto, metas de ahorro, la regla 50/30/20 o pídeme videos educativos.
                      </p>
                    </div>
                  ) : (
                    mensajes.map((msg) => {
                      if (msg.tipo === "ALERTA") {
                        return (
                          <div key={msg.id} className="msg-bubble alerta">
                            <div className="msg-alerta">
                              <FaExclamationTriangle style={{ marginRight: 6 }} />
                              {msg.contenido}
                            </div>
                          </div>
                        );
                      }
                      if (msg.tipo === "CHAT_USER") {
                        return (
                          <div key={msg.id} className="msg-bubble user">
                            <div className="msg-text">{msg.contenido}</div>
                            <span className="msg-timestamp">
                              {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        );
                      }
                      // CHAT_IA
                      return (
                        <div key={msg.id} className="msg-bubble ia">
                          <div className="msg-text">
                            {renderizarTextoConLinks(msg.contenido)}
                          </div>
                          <span className="msg-timestamp">
                            {new Date(msg.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      );
                    })
                  )}

                  {/* Indicador "IA escribiendo..." */}
                  {enviando && (
                    <div className="typing-bubble">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  )}

                  {/* Ref para auto-scroll */}
                  <div ref={mensajesEndRef} />
                </div>

                {/* Sugerencias rápidas (solo cuando el chat está vacío o pocas respuestas) */}
                {mensajes.filter((m) => m.tipo === "CHAT_USER").length < 2 && (
                  <div className="sugerencias-wrapper">
                    {SUGERENCIAS.map((s) => (
                      <button
                        key={s}
                        className="sugerencia-btn"
                        onClick={() => handleSugerencia(s)}
                        disabled={enviando}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input del chat */}
                <div className="chat-input-wrapper">
                  <div className="chat-box">
                    <input
                      id="ia-finance-input"
                      type="text"
                      className="chat-input"
                      placeholder="Escribe tu pregunta sobre ahorro o finanzas..."
                      value={inputMensaje}
                      onChange={(e) => setInputMensaje(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={enviando}
                      maxLength={1000}
                    />
                    <button
                      id="ia-finance-send-btn"
                      className="chat-btn"
                      onClick={handleEnviarMensaje}
                      disabled={enviando || !inputMensaje.trim()}
                      aria-label="Enviar mensaje"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner de alerta de balance crítico (debajo del chat) */}
              {alertaBanner && (
                <div className="alerta-banner mt-3">
                  <span className="alerta-banner-icon">⚠️</span>
                  <span>{alertaBanner}</span>
                </div>
              )}
            </div>

            {/* ── Panel lateral: Resumen Financiero ── */}
            <div className="col-lg-4">
              {/* Meta de Ahorro */}
              <div className="card meta-card p-3">
                <h6 className="fw-bold d-flex align-items-center gap-2">
                  <FaPiggyBank className="text-success" /> Meta de Ahorro
                </h6>
                {metaActiva ? (
                  <>
                    <p className="text-muted mb-1">{metaActiva.meta}</p>
                    <h5 className="fw-bold text-success mb-1">Dinero Ahorrado</h5>
                    <h4 className="fw-bold">{formatCOP(metaActiva.monto_ahorrado)}</h4>
                    <small className="text-muted">
                      Objetivo total: {formatCOP(metaActiva.valor_objetivo)}
                    </small>
                    <div className="progress mt-2" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              (metaActiva.monto_ahorrado / metaActiva.valor_objetivo) * 100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-muted">No tienes metas de ahorro activas.</p>
                    <h5 className="fw-bold text-success">Dinero Ahorrado</h5>
                    <h4 className="fw-bold">{formatCOP(totalAhorrado)}</h4>
                  </>
                )}
              </div>

              {/* Mi Presupuesto */}
              <div
                className="card presupuesto-card p-3 mt-4 interactive-card"
                onClick={() => setModalOpen(true)}
                style={{ cursor: "pointer" }}
              >
                <h6 className="fw-bold d-flex align-items-center gap-2">
                  <FaWallet /> Mi Presupuesto (Ver detalles)
                </h6>
                <p className="text-muted small mb-3">
                  Ingresa y contabiliza tus ingresos y egresos de este mes.
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="small text-muted d-block">Ingresos</span>
                    <span className="fw-bold text-success">{formatCOP(totalIngresos)}</span>
                  </div>
                  <div>
                    <span className="small text-muted d-block">Egresos</span>
                    <span className="fw-bold text-danger">{formatCOP(totalGastos)}</span>
                  </div>
                  <div className="border-start ps-3">
                    <span className="small text-muted d-block">Balance</span>
                    <span className={`fw-bold ${balanceNeto >= 0 ? "text-success" : "text-danger"}`}>
                      {formatCOP(balanceNeto)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Categorías de Gastos */}
              <div className="card categorias-card p-3 mt-4">
                <h6 className="fw-bold mb-3">Categorías de Gastos</h6>
                <canvas ref={chartRef} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de presupuesto */}
      {modalOpen && (
        <ModalPresupuesto
          onClose={() => setModalOpen(false)}
          onRefresh={() => {
            cargarDatos();
            verificarAlerta();
          }}
          idUsuario={idUsuario}
          ingresos={ingresos}
          gastos={gastos}
        />
      )}
    </>
  );
};

export default IAFinance;