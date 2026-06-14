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
  FaCalendarAlt
} from "react-icons/fa";
import { listarMetas } from "../../services/aprendiz/metas.service";
import { 
  listarIngresos, 
  crearIngreso, 
  eliminarIngreso, 
  listarGastos, 
  crearGasto, 
  eliminarGasto 
} from "../../services/aprendiz/presupuesto.service";

const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { 
    style: "currency", 
    currency: "COP", 
    maximumFractionDigits: 0 
  }).format(valor || 0);

const hoy = () => new Date().toISOString().split("T")[0];

// ─── Modal de Gestión de Presupuesto ──────────────────────────────────────────
const ModalPresupuesto = ({ onClose, onRefresh, idUsuario, ingresos, gastos }) => {
  const [activeTab, setActiveTab] = useState("ingresos"); // "ingresos" o "gastos"
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
        // Guarda ÚNICAMENTE en la tabla de ingresos
        await crearIngreso({
          monto: Number(monto),
          fecha_registro: fecha,
          usuario_id_usuario: idUsuario
        });
      } else {
        await crearGasto({
          categoria,
          monto: Number(monto),
          fecha_registro: fecha,
          usuario_id_usuario: idUsuario
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
                <label><FaCalendarAlt /> Fecha *</label>
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
                {submitting ? "Guardando..." : `Registrar ${activeTab === "ingresos" ? "Ingreso" : "Gasto"}`}
              </button>
            </form>
          </div>

          <div className="col-md-7 px-4">
            <h5 className="fw-bold mb-3">Historial de {activeTab === "ingresos" ? "Ingresos" : "Gastos"}</h5>
            <div className="transaction-list">
              {activeTab === "ingresos" ? (
                ingresos.length === 0 ? (
                  <p className="text-muted">No has registrado ingresos.</p>
                ) : (
                  ingresos.map((i) => (
                    <div className="transaction-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom" key={i.id_ingreso}>
                      <div>
                        <span className="fw-semibold text-success d-block">{formatCOP(i.monto)}</span>
                        <small className="text-muted">{new Date(i.fecha_registro).toLocaleDateString()}</small>
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
              ) : (
                gastos.length === 0 ? (
                  <p className="text-muted">No has registrado gastos.</p>
                ) : (
                  gastos.map((g) => (
                    <div className="transaction-item d-flex justify-content-between align-items-center mb-2 p-2 border-bottom" key={g.id_gasto}>
                      <div>
                        <span className="fw-semibold text-danger d-block">{formatCOP(g.monto)}</span>
                        <small className="badge bg-secondary me-2">{g.categoria}</small>
                        <small className="text-muted">{new Date(g.fecha_registro).toLocaleDateString()}</small>
                      </div>
                      <button 
                        className="btn btn-sm text-danger" 
                        onClick={() => handleEliminar(g.id_gasto, "gasto")}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))
                )
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

  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const [metas, setMetas] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar todos los datos financieros
  const cargarDatos = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    try {
      const [metasData, ingresosData, gastosData] = await Promise.all([
        listarMetas(idUsuario),
        listarIngresos(idUsuario),
        listarGastos(idUsuario)
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

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // Dibujar y actualizar el gráfico dinámico de categorías de gastos
  useEffect(() => {
    if (loading) return;

    // Calcular montos acumulados por categorías de gastos
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
    const data = Object.values(dataCategorias);
    const totalGasto = data.reduce((acc, curr) => acc + curr, 0);

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Si no hay gastos, dibujamos un gráfico circular con una categoría dummy "Sin gastos"
    const finalLabels = totalGasto === 0 ? ["Sin gastos"] : labels.filter((_, idx) => data[idx] > 0);
    const finalData = totalGasto === 0 ? [100] : data.filter((d) => d > 0);
    const finalColors = totalGasto === 0 ? ["#dfe6e9"] : [
      "#28a745", // Alimentación - verde
      "#0d6efd", // Transporte - azul
      "#ffc107", // Salud - amarillo
      "#fd7e14", // Vivienda - naranja
      "#dc3545"  // Otros/Personal - rojo
    ].filter((_, idx) => data[idx] > 0);

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: finalLabels,
        datasets: [
          {
            data: finalData,
            backgroundColor: finalColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: function (context) {
                if (totalGasto === 0) return " Sin egresos registrados";
                return ` ${context.label}: ${formatCOP(context.raw)}`;
              }
            }
          }
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [gastos, loading]);

  // Cálculos globales
  const totalAhorrado = metas.reduce((acc, m) => acc + Number(m.monto_ahorrado || 0), 0);
  const totalIngresos = ingresos.reduce((acc, i) => acc + Number(i.monto || 0), 0);
  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);
  const balanceNeto = totalIngresos - totalGastos;

  // Primera meta activa si existe
  const metaActiva = metas[0];

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
            <div className="col-lg-8">
              <div className="ia-card">
                <div className="chat-messages p-3">
                  <p><strong>Este es un espacio para el asistente IA Finance</strong></p>
                  <p>
                    Pregunta lo que necesites sobre finanzas.
                    <br />
                    El bot estará aquí para ayudarte :)
                  </p>
                </div>
              </div>

              <div className="chat-input-wrapper mt-3">
                <div className="chat-box">
                  <input
                    type="text"
                    className="chat-input"
                    placeholder="Ingresa una pregunta para hablar"
                  />
                  <button className="chat-btn">
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              {/* Meta de Ahorro Card */}
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
                        style={{ width: `${Math.min(100, Math.round((metaActiva.monto_ahorrado / metaActiva.valor_objetivo) * 100))}%` }}
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

              {/* Mi Presupuesto Card (Clicable) */}
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

              {/* Categorías de Gastos Card */}
              <div className="card categorias-card p-3 mt-4">
                <h6 className="fw-bold mb-3">Categorías de Gastos</h6>
                <canvas ref={chartRef}></canvas>
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