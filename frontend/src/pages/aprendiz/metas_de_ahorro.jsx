import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlusCircle, FaPiggyBank, FaWallet, FaBullseye, FaChevronUp } from "react-icons/fa";
import "../../css/metas_de_ahorro.css";

const metasIniciales = [
  {
    id: 1,
    nombre: "Ahorro Viaje",
    descripcion: "Fondo para el próximo viaje de intercambio",
    ahorrado: 350000,
    meta: 1000000,
    fecha: "12 / 03 / 2025",
    color: "#28a745",
    icono: "✈️",
  },
  {
    id: 2,
    nombre: "Laptop Nueva",
    descripcion: "Ahorro para herramientas de estudio",
    ahorrado: 780000,
    meta: 1500000,
    fecha: "20 / 01 / 2025",
    color: "#1abc9c",
    icono: "💻",
  },
  {
    id: 3,
    nombre: "Fondo Emergencias",
    descripcion: "Colchón de seguridad personal",
    ahorrado: 200000,
    meta: 500000,
    fecha: "05 / 04 / 2025",
    color: "#28a745",
    icono: "🛡️",
  },
];

const formatCOP = (valor) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

const MetasDeAhorro = () => {
  const [metas, setMetas] = useState(metasIniciales);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const totalAhorrado = metas.reduce((acc, m) => acc + m.ahorrado, 0);
  const totalMeta = metas.reduce((acc, m) => acc + m.meta, 0);
  const progresGlobal = totalMeta > 0 ? Math.round((totalAhorrado / totalMeta) * 100) : 0;

  const handleDelete = (id) => {
    setMetas((prev) => prev.filter((m) => m.id !== id));
    setConfirmDelete(null);
  };

  return (
    <section className="metas-wrapper">
      {/* ── Header / Estadísticas ── */}
      <div className="metas-header">
        <div className="metas-header-title">
          <FaPiggyBank className="metas-header-icon" />
          <div>
            <h1>Metas de Ahorro</h1>
            <p>Sigue el progreso de tus objetivos financieros</p>
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
          <div className="stat-pill">
            <FaBullseye className="stat-icon" />
            <div>
              <span className="stat-label">Progreso Global</span>
              <span className="stat-value">{progresGlobal}%</span>
            </div>
          </div>
          <div className="stat-pill">
            <FaChevronUp className="stat-icon" />
            <div>
              <span className="stat-label">Metas Activas</span>
              <span className="stat-value">{metas.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Barra de Progreso Global ── */}
      <div className="progreso-global-wrap">
        <div className="progreso-global-bar">
          <div
            className="progreso-global-fill"
            style={{ width: `${progresGlobal}%` }}
          />
        </div>
        <span className="progreso-global-text">Progreso total: {progresGlobal}%</span>
      </div>

      {/* ── Cards de Metas ── */}
      <div className="metas-grid">
        {metas.map((meta) => {
          const porcentaje = Math.min(Math.round((meta.ahorrado / meta.meta) * 100), 100);
          return (
            <div className="meta-card" key={meta.id}>
              <div className="meta-card-top">
                <div className="meta-emoji">{meta.icono}</div>
                <div className="meta-info">
                  <h3>{meta.nombre}</h3>
                  <p className="meta-desc">{meta.descripcion}</p>
                </div>
                <div
                  className="meta-badge"
                  style={{ background: porcentaje >= 100 ? "#28a745" : "#2d3436" }}
                >
                  {porcentaje}%
                </div>
              </div>

              <div className="meta-amounts">
                <span className="amount-saved">{formatCOP(meta.ahorrado)}</span>
                <span className="amount-separator">de</span>
                <span className="amount-goal">{formatCOP(meta.meta)}</span>
              </div>

              <div className="meta-progress-bar">
                <div
                  className="meta-progress-fill"
                  style={{ width: `${porcentaje}%`, background: meta.color }}
                />
              </div>

              <div className="meta-footer">
                <span className="meta-date">📅 {meta.fecha}</span>
                <div className="meta-actions">
                  <Link to="/Editar_meta" className="meta-btn edit-btn">
                    <FaEdit /> Editar
                  </Link>
                  {confirmDelete === meta.id ? (
                    <div className="confirm-row">
                      <span>¿Eliminar?</span>
                      <button
                        className="meta-btn confirm-yes"
                        onClick={() => handleDelete(meta.id)}
                      >
                        Sí
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
                      onClick={() => setConfirmDelete(meta.id)}
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
              <Link to="/Agregar_meta" className="add-btn primary">
                <FaPlusCircle /> Agregar Meta
              </Link>
              <Link to="/Agregar_monto" className="add-btn secondary">
                <FaWallet /> Agregar Monto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetasDeAhorro;