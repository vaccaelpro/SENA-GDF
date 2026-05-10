import React, { useState } from "react";
import {
  FaPlusCircle,
  FaTag,
  FaRegStickyNote,
  FaInfoCircle,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Crear_grupo = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoApoyo, setTipoApoyo] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !tipoApoyo) {
      setMensaje({ texto: "El nombre y tipo de apoyo son obligatorios", tipo: "danger" });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/admin/grupos", {
        nombre,
        descripcion,
        tipo_apoyo: tipoApoyo,
      });

      if (response.data.success) {
        setMensaje({ texto: "Grupo creado exitosamente", tipo: "success" });
        setTimeout(() => {
          navigate("/Lista_grupos");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setMensaje({ texto: "Error al crear el grupo", tipo: "danger" });
    }
  };

  return (
    <div className="p-4">
      <div className="card shadow-sm border-0">
        <div
          className="card-header text-white"
          style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}
        >
          <h4 className="mb-0 d-flex align-items-center gap-2">
            <FaPlusCircle /> Crear Nuevo Grupo
          </h4>
        </div>

        <div className="card-body p-4">
          {mensaje.texto && (
            <div className={`alert alert-${mensaje.tipo}`} role="alert">
              {mensaje.texto}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <FaTag /> Nombre del Grupo
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Ej: Apoyo regular 2025"
                maxLength={100}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <FaRegStickyNote /> Descripción
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Descripción breve del grupo"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                Seleccionar el tipo de ayuda
              </label>

              <div
                className="border rounded p-3 bg-light"
                style={{ maxHeight: "350px", overflowY: "auto" }}
              >
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipo_apoyo"
                    value="regular"
                    id="apoyo_regular"
                    checked={tipoApoyo === "regular"}
                    onChange={(e) => setTipoApoyo(e.target.value)}
                    required
                  />
                  <label className="form-check-label" htmlFor="apoyo_regular">
                    Apoyo regular
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipo_apoyo"
                    value="alimentacion"
                    id="apoyo_alimentacion"
                    checked={tipoApoyo === "alimentacion"}
                    onChange={(e) => setTipoApoyo(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="apoyo_alimentacion">
                    Apoyo de alimentación
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="tipo_apoyo"
                    value="transporte"
                    id="apoyo_transporte"
                    checked={tipoApoyo === "transporte"}
                    onChange={(e) => setTipoApoyo(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor="apoyo_transporte">
                    Apoyo de transporte
                  </label>
                </div>
              </div>

              <small className="text-muted d-flex align-items-center gap-1 mt-2">
                <FaInfoCircle /> Selecciona la opción que corresponde al apoyo de este grupo
              </small>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success btn-lg d-flex align-items-center gap-2">
                <FaCheckCircle /> Crear Grupo
              </button>

              <Link to="/Lista_grupos" className="btn btn-secondary btn-lg d-flex align-items-center gap-2">
                <FaArrowLeft /> Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Crear_grupo;
