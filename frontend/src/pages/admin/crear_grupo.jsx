import {
  FaPlusCircle,
  FaTag,
  FaRegStickyNote,
  FaInfoCircle,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Crear_grupo = () => {
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
          <form>
            <div className="mb-4">
              <label className="form-label fw-bold d-flex align-items-center gap-2">
                <FaTag /> Nombre del Grupo
              </label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Ej: Apoyo regular 2025"
                maxLength={100}
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
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">
                    Apoyo regular
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">
                    Apoyo de alimentación
                  </label>
                </div>

                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" />
                  <label className="form-check-label">
                    Apoyo de transporte
                  </label>
                </div>
              </div>

              <small className="text-muted d-flex align-items-center gap-1 mt-2">
                <FaInfoCircle /> Selecciona la opción que corresponde
              </small>
            </div>

            <div className="d-flex gap-2">
              <Link to="/Lista_grupos" type="button" className="btn btn-success btn-lg d-flex align-items-center gap-2">
                <FaCheckCircle /> Crear Grupo
              </Link>

              <Link to="/Lista_grupos" type="button" className="btn btn-secondary btn-lg d-flex align-items-center gap-2">
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
