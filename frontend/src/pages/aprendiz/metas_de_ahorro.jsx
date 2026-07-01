import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlusCircle, FaPiggyBank, FaWallet, FaBullseye, FaChevronUp, FaTimes, FaPlus, FaCalendarAlt } from "react-icons/fa";
import "../../css/metas_de_ahorro.css";
import { listarMetas, crearMeta, editarMeta, agregarMonto, eliminarMeta } from "../../services/aprendiz/metas.service";
import { listarGastos, crearGasto, eliminarGasto } from "../../services/aprendiz/presupuesto.service";
import Swal from "sweetalert2";

const COLORES = ["#28a745", "#1abc9c", "#3498db", "#9b59b6", "#e67e22", "#e74c3c", "#f39c12", "#1e3799"];

const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor || 0);

const hoy = () => new Date().toISOString().split("T")[0];

// ─── Modal de Agregar Meta ───────────────────────────────────────────────────
const ModalAgregarMeta = ({ onClose, onSuccess, idUsuario }) => {
  const [form, setForm] = useState({
    meta: "",
    valor_objetivo: "",
    monto_ahorrado: "",
    fecha_objetivo: hoy(),
    color: "#28a745",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.meta.trim()) return setError("El nombre es obligatorio.");
    if (!form.valor_objetivo || Number(form.valor_objetivo) <= 0)
      return setError("El valor objetivo debe ser mayor a 0.");
    setLoading(true);
    setError("");
    try {
      await crearMeta({
        meta: form.meta.trim(),
        valor_objetivo: Number(form.valor_objetivo),
        monto_ahorrado: Number(form.monto_ahorrado) || 0,
        fecha_objetivo: form.fecha_objetivo,
        color: form.color,
        usuario_id_usuario: idUsuario,
      });
      onSuccess();
    } catch {
      setError("Error al crear la meta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon">
            <FaPlusCircle />
          </div>
          <div>
            <h2>Nueva Meta de Ahorro</h2>
            <p>Define tu objetivo y empieza a crecer</p>
          </div>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label>Nombre de la meta *</label>
            <input
              name="meta"
              value={form.meta}
              onChange={handleChange}
              placeholder="Ej: Ahorro para viaje"
              maxLength={45}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor objetivo (COP) *</label>
              <input
                name="valor_objetivo"
                type="number"
                min="1"
                value={form.valor_objetivo}
                onChange={handleChange}
                placeholder="Ej: 1000000"
                required
              />
            </div>
            <div className="form-group">
              <label>Monto inicial ahorrado</label>
              <input
                name="monto_ahorrado"
                type="number"
                min="0"
                value={form.monto_ahorrado}
                onChange={handleChange}
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label><FaCalendarAlt /> Fecha objetivo *</label>
            <input
              name="fecha_objetivo"
              type="date"
              value={form.fecha_objetivo}
              onChange={handleChange}
              min={hoy()}
              required
            />
          </div>


          <div className="form-group">
            <label>Color de progreso</label>
            <div className="color-picker">
              {COLORES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-btn${form.color === c ? " selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => setForm((p) => ({ ...p, color: c }))}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? "Creando..." : <><FaPlus /> Crear Meta</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal de Agregar Monto ──────────────────────────────────────────────────
const ModalAgregarMonto = ({ onClose, onSuccess, metas }) => {
  const [form, setForm] = useState({ id_ahorro: metas[0]?.id_ahorro || "", monto: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id_ahorro) return setError("Selecciona una meta.");
    if (!form.monto || Number(form.monto) <= 0) return setError("El monto debe ser mayor a 0.");
    setLoading(true);
    setError("");
    try {
      await agregarMonto(form.id_ahorro, Number(form.monto));
      onSuccess();
    } catch {
      setError("Error al agregar el monto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const metaSeleccionada = metas.find((m) => m.id_ahorro === Number(form.id_ahorro));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon green">
            <FaWallet />
          </div>
          <div>
            <h2>Añadir Monto</h2>
            <p>Suma a tu progreso de ahorro</p>
          </div>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label>Selecciona la meta</label>
            <select name="id_ahorro" value={form.id_ahorro} onChange={handleChange} required>
              <option value="">-- Seleccionar --</option>
              {metas.map((m) => (
                <option key={m.id_ahorro} value={m.id_ahorro}>
                  {m.meta}
                </option>
              ))}
            </select>
          </div>

          {metaSeleccionada && (
            <div className="meta-preview">
              <div className="meta-preview-bar-wrap">
                <div className="meta-preview-bar">
                  <div
                    className="meta-preview-fill"
                    style={{
                      width: `${Math.min(100, Math.round((metaSeleccionada.monto_ahorrado / metaSeleccionada.valor_objetivo) * 100))}%`,
                    }}
                  />
                </div>
                <span>
                  {formatCOP(metaSeleccionada.monto_ahorrado)} / {formatCOP(metaSeleccionada.valor_objetivo)}
                </span>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Monto a añadir (COP) *</label>
            <input
              name="monto"
              type="number"
              min="1"
              value={form.monto}
              onChange={handleChange}
              placeholder="Ej: 50000"
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit" disabled={loading}>
              {loading ? "Guardando..." : <><FaWallet /> Añadir Monto</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Modal de Editar Meta ─────────────────────────────────────────────────────
const ModalEditarMeta = ({ onClose, onSuccess, meta }) => {
  const [form, setForm] = useState({
    meta: meta.meta,
    valor_objetivo: meta.valor_objetivo,
    fecha_objetivo: meta.fecha_objetivo ? meta.fecha_objetivo.split("T")[0] : hoy(),
    color: meta.color || "#28a745",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.meta.trim()) return setError("El nombre es obligatorio.");
    if (!form.valor_objetivo || Number(form.valor_objetivo) <= 0)
      return setError("El valor objetivo debe ser mayor a 0.");
    setLoading(true);
    setError("");
    try {
      await editarMeta(meta.id_ahorro, {
        meta: form.meta.trim(),
        valor_objetivo: Number(form.valor_objetivo),
        fecha_objetivo: form.fecha_objetivo,
        color: form.color,
      });
      onSuccess();
    } catch {
      setError("Error al actualizar la meta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-icon yellow">
            <FaEdit />
          </div>
          <div>
            <h2>Editar Meta</h2>
            <p>Actualiza los datos de tu objetivo</p>
          </div>
          <button className="modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {error && <div className="modal-error">{error}</div>}

          <div className="form-group">
            <label>Nombre de la meta *</label>
            <input
              name="meta"
              value={form.meta}
              onChange={handleChange}
              placeholder="Nombre del ahorro"
              maxLength={45}
              required
            />
          </div>

          <div className="form-group">
            <label>Valor objetivo (COP) *</label>
            <input
              name="valor_objetivo"
              type="number"
              min="1"
              value={form.valor_objetivo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label><FaCalendarAlt /> Fecha objetivo *</label>
            <input
              name="fecha_objetivo"
              type="date"
              value={form.fecha_objetivo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Color de progreso</label>
            <div className="color-picker">
              {COLORES.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-btn${form.color === c ? " selected" : ""}`}
                  style={{ background: c }}
                  onClick={() => setForm((p) => ({ ...p, color: c }))}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-modal-submit yellow-btn" disabled={loading}>
              {loading ? "Guardando..." : <><FaEdit /> Actualizar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Componente Principal ─────────────────────────────────────────────────────
const MetasDeAhorro = () => {
  const idUsuario = JSON.parse(localStorage.getItem("usuario") || "{}").id_usuario;

  const [activeTab, setActiveTab] = useState("metas"); // "metas" | "egresos"
  const [metas, setMetas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalMonto, setModalMonto] = useState(false);
  const [modalEditar, setModalEditar] = useState(null); // meta a editar
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Formulario de nuevo Gasto/Egreso
  const [gastoForm, setGastoForm] = useState({
    categoria: "Transporte",
    monto: "",
    fecha_registro: hoy()
  });
  const [gastoLoading, setGastoLoading] = useState(false);

  // Las categorías como pares label/valor — el valor debe coincidir con el ENUM de la BD
  const categoriasMedellin = [
    { label: "🚌 Transporte (Metro / Cívica / Buses)", value: "Transporte" },
    { label: "🍽️ Alimentación (Almuerzos / Mercado)", value: "Alimentacion" },
    { label: "📚 Estudios (Fotocopias / Materiales / SENA)", value: "Estudios" },
    { label: "🏠 Vivienda (Arriendo / Servicios)", value: "Vivienda" },
    { label: "🎉 Entretenimiento (Salidas / Parche)", value: "Entretenimiento" },
    { label: "💊 Salud (Consultas / Medicamentos)", value: "Salud" },
    { label: "📦 Otros Gastos Diarios", value: "Otros" }
  ];

  // Paleta de colores por índice para cada card
  const coloresMeta = [
    "#28a745", "#1abc9c", "#3498db", "#9b59b6",
    "#e67e22", "#e74c3c", "#f39c12", "#1e3799",
  ];

  const cargarMetas = useCallback(async () => {
    if (!idUsuario) return;
    setLoading(true);
    try {
      const data = await listarMetas(idUsuario);
      setMetas(data);
    } catch {
      setMetas([]);
    } finally {
      setLoading(false);
    }
  }, [idUsuario]);

  const cargarGastos = useCallback(async () => {
    if (!idUsuario) return;
    try {
      const data = await listarGastos(idUsuario);
      setGastos(data);
    } catch (err) {
      console.error("Error al cargar gastos:", err);
    }
  }, [idUsuario]);

  useEffect(() => {
    cargarMetas();
    cargarGastos();
  }, [cargarMetas, cargarGastos]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await eliminarMeta(id);
      setMetas((prev) => prev.filter((m) => m.id_ahorro !== id));
    } catch {
      // silencioso
    } finally {
      setDeletingId(null);
      setConfirmDelete(null);
    }
  };

  const handleGastoSubmit = async (e) => {
    e.preventDefault();
    if (!gastoForm.monto || Number(gastoForm.monto) <= 0) {
      return Swal.fire("Monto inválido", "Por favor ingresa un monto válido.", "warning");
    }

    setGastoLoading(true);
    try {
      await crearGasto({
        categoria: gastoForm.categoria,
        monto: Number(gastoForm.monto),
        fecha_registro: gastoForm.fecha_registro,
        usuario_id_usuario: idUsuario
      });

      Swal.fire({
        icon: "success",
        title: "¡Egreso Registrado!",
        text: "Tu gasto se guardó correctamente.",
        timer: 1500,
        showConfirmButton: false
      });

      setGastoForm({
        categoria: "Transporte",
        monto: "",
        fecha_registro: hoy()
      });
      cargarGastos();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo registrar el gasto.", "error");
    } finally {
      setGastoLoading(false);
    }
  };

  const handleEliminarGasto = async (idGasto) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar este gasto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, eliminar"
    });

    if (confirm.isConfirmed) {
      try {
        await eliminarGasto(idGasto);
        cargarGastos();
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo eliminar el gasto.", "error");
      }
    }
  };

  const totalAhorrado = metas.reduce((acc, m) => acc + Number(m.monto_ahorrado || 0), 0);
  const totalMeta = metas.reduce((acc, m) => acc + Number(m.valor_objetivo || 0), 0);
  const progresoGlobal = totalMeta > 0 ? Math.min(Math.round((totalAhorrado / totalMeta) * 100), 100) : 0;
  const totalEgresos = gastos.reduce((acc, g) => acc + Number(g.monto || 0), 0);

  return (
    <section className="metas-wrapper">
      {/* ── Header / Estadísticas ── */}
      <div className="metas-header">
        <div className="metas-header-title">
          <FaPiggyBank className="metas-header-icon" />
          <div>
            <h1>Control Financiero</h1>
            <p>Sigue el progreso de tus metas y controla tus gastos diarios</p>
          </div>
        </div>
        <div className="metas-stats">
          <div className="stat-pill">
            <FaWallet className="stat-icon" />
            <div>
              <span className="stat-label">Total Ahorrado</span>
              <span className="stat-value">{formatCOP(totalAhorrado)}</span>
            </div>
          </div>
          <div className="stat-pill" style={{ borderColor: "rgba(220, 53, 69, 0.4)" }}>
            <div className="stat-icon text-danger">💸</div>
            <div>
              <span className="stat-label">Total Egresos</span>
              <span className="stat-value text-danger" style={{ color: "#ff7675" }}>{formatCOP(totalEgresos)}</span>
            </div>
          </div>
          <div className="stat-pill">
            <FaBullseye className="stat-icon" />
            <div>
              <span className="stat-label">Progreso Ahorro</span>
              <span className="stat-value">{progresoGlobal}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABS DE SELECCIÓN */}
      <div className="d-flex gap-2 mb-4 border-bottom pb-2">
        <button
          className={`btn ${activeTab === "metas" ? "btn-success" : "btn-light"} px-4 fw-bold`}
          onClick={() => setActiveTab("metas")}
          style={{ borderRadius: "10px" }}
        >
          🎯 Mis Metas de Ahorro
        </button>
        <button
          className={`btn ${activeTab === "egresos" ? "btn-success" : "btn-light"} px-4 fw-bold`}
          onClick={() => setActiveTab("egresos")}
          style={{ borderRadius: "10px" }}
        >
          💸 Registrar Egresos (Gastos)
        </button>
      </div>

      {activeTab === "metas" ? (
        <>
          {/* ── Barra de Progreso Global ── */}
          <div className="progreso-global-wrap">
            <div className="progreso-global-bar">
              <div className="progreso-global-fill" style={{ width: `${progresoGlobal}%` }} />
            </div>
            <span className="progreso-global-text">Progreso total: {progresoGlobal}%</span>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="metas-loading">
              <div className="spinner" />
              <span>Cargando metas...</span>
            </div>
          )}

          {/* ── Grid de Cards ── */}
          {!loading && (
            <div className="metas-grid">
              {metas.map((meta, idx) => {
                const ahorrado = Number(meta.monto_ahorrado || 0);
                const objetivo = Number(meta.valor_objetivo || 0);
                const porcentaje = objetivo > 0 ? Math.min(Math.round((ahorrado / objetivo) * 100), 100) : 0;
                const color = meta.color || coloresMeta[idx % coloresMeta.length];
                const fecha = meta.fecha_objetivo
                  ? new Date(meta.fecha_objetivo).toLocaleDateString("es-CO")
                  : "-";

                return (
                  <div className="meta-card" key={meta.id_ahorro}>
                    <div className="meta-card-top">
                      <div className="meta-icon-badge" style={{ background: `${color}15`, color: color, border: `1px solid ${color}30`, borderRadius: '12px', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                        <FaBullseye />
                      </div>
                      <div className="meta-info">
                        <h3>{meta.meta}</h3>
                        <p className="meta-desc">📅 {fecha}</p>
                      </div>
                      <div
                        className="meta-badge"
                        style={{ background: porcentaje >= 100 ? "#28a745" : "#2d3436" }}
                      >
                        {porcentaje}%
                      </div>
                    </div>

                    <div className="meta-amounts">
                      <span className="amount-saved">{formatCOP(ahorrado)}</span>
                      <span className="amount-separator">de</span>
                      <span className="amount-goal">{formatCOP(objetivo)}</span>
                    </div>

                    <div className="meta-progress-bar">
                      <div
                        className="meta-progress-fill"
                        style={{ width: `${porcentaje}%`, background: color }}
                      />
                    </div>

                    <div className="meta-footer">
                      <button
                        className="meta-btn-add-monto"
                        onClick={() => {
                          setModalMonto(true);
                        }}
                      >
                        <FaWallet /> Añadir monto
                      </button>
                      <div className="meta-actions">
                        <button
                          className="meta-btn edit-btn"
                          onClick={() => setModalEditar(meta)}
                        >
                          <FaEdit /> Editar
                        </button>
                        {confirmDelete === meta.id_ahorro ? (
                          <div className="confirm-row">
                            <span>¿Eliminar?</span>
                            <button
                              className="meta-btn confirm-yes"
                              onClick={() => handleDelete(meta.id_ahorro)}
                              disabled={deletingId === meta.id_ahorro}
                            >
                              {deletingId === meta.id_ahorro ? "..." : "Sí"}
                            </button>
                            <button
                              className="meta-btn confirm-no"
                              onClick={() => setConfirmDelete(null)}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            className="meta-btn delete-btn"
                            onClick={() => setConfirmDelete(meta.id_ahorro)}
                          >
                            <FaTrash /> Borrar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* ── Card Agregar ── */}
              <div className="meta-card add-card">
                <div className="add-card-content">
                  <div className="add-icon-wrap">
                    <FaPlusCircle />
                  </div>
                  <h3>Nueva Meta</h3>
                  <p>Crea un nuevo objetivo de ahorro y comienza a crecer financieramente.</p>
                  <div className="add-buttons">
                    <button
                      className="add-btn primary"
                      onClick={() => setModalAgregar(true)}
                    >
                      <FaPlusCircle /> Agregar Meta
                    </button>
                    <button
                      className="add-btn secondary"
                      onClick={() => setModalMonto(true)}
                      disabled={metas.length === 0}
                    >
                      <FaWallet /> Agregar Monto
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* PANEL DE REGISTRO DE EGRESOS (GASTOS) */
        <div className="row animate-fade-in">
          <div className="col-md-5 mb-4">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: "15px" }}>
              <h4 className="fw-bold mb-3 text-success">Registrar Nuevo Egreso</h4>
              <form onSubmit={handleGastoSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Categoría del Gasto *</label>
                  <select
                    className="form-select custom-input py-2"
                    value={gastoForm.categoria}
                    onChange={(e) => setGastoForm({ ...gastoForm, categoria: e.target.value })}
                    required
                  >
                    {categoriasMedellin.map((cat, idx) => (
                      <option key={idx} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold text-secondary">Monto (COP) *</label>
                  <input
                    type="number"
                    className="form-control custom-input py-2"
                    placeholder="Ej: 5000"
                    value={gastoForm.monto}
                    onChange={(e) => setGastoForm({ ...gastoForm, monto: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold text-secondary">Fecha de Registro *</label>
                  <input
                    type="date"
                    className="form-control custom-input py-2"
                    value={gastoForm.fecha_registro}
                    onChange={(e) => setGastoForm({ ...gastoForm, fecha_registro: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-bold text-white shadow"
                  disabled={gastoLoading}
                >
                  {gastoLoading ? "Registrando..." : "Registrar Gasto"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: "15px" }}>
              <h4 className="fw-bold mb-3 text-dark">Historial de Gastos</h4>
              
              {gastos.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <span style={{ fontSize: "2rem" }}>💸</span>
                  <p className="mt-2">No has registrado ningún gasto todavía.</p>
                </div>
              ) : (
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Categoría</th>
                        <th>Fecha</th>
                        <th>Monto</th>
                        <th className="text-end">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastos.map((g) => (
                        <tr key={g.id_gasto}>
                          <td className="fw-bold text-secondary small">{g.categoria}</td>
                          <td className="small">{new Date(g.fecha_registro).toLocaleDateString("es-CO")}</td>
                          <td className="text-danger fw-bold">{formatCOP(g.monto)}</td>
                          <td className="text-end">
                            <button
                              className="btn btn-sm btn-outline-danger border-0"
                              onClick={() => handleEliminarGasto(g.id_gasto)}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALES ── */}
      {modalAgregar && (
        <ModalAgregarMeta
          onClose={() => setModalAgregar(false)}
          onSuccess={() => { setModalAgregar(false); cargarMetas(); }}
          idUsuario={idUsuario}
        />
      )}

      {modalMonto && metas.length > 0 && (
        <ModalAgregarMonto
          onClose={() => setModalMonto(false)}
          onSuccess={() => { setModalMonto(false); cargarMetas(); }}
          metas={metas}
        />
      )}

      {modalEditar && (
        <ModalEditarMeta
          onClose={() => setModalEditar(null)}
          onSuccess={() => { setModalEditar(null); cargarMetas(); }}
          meta={modalEditar}
        />
      )}
    </section>
  );
};

export default MetasDeAhorro;