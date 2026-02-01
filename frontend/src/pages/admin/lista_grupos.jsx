import "../../css/lista_grupos.css"
import {
  FaUsers,
  FaPlusCircle,
  FaCalendarAlt,
  FaComments,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Lista_grupos = () =>{
    return(
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="d-flex align-items-center gap-2">
          <FaUsers className="text-success" />
          Lista de Grupos
        </h3>

        <Link to="/Crear_grupo" className="btn btn-success d-flex align-items-center gap-2">
          <FaPlusCircle />
          Crear Nuevo Grupo
        </Link>
      </div>

      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div
              className="card-header text-white"
              style={{
                background: "linear-gradient(135deg, #28a745, #218838)",
              }}
            >
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <FaUsers />
                Grupo sostenimiento regular 2025
              </h5>
            </div>

            <div className="card-body">
              <p className="text-muted mb-2 d-flex align-items-center gap-2">
                <FaCalendarAlt />
                Creado: 01/12/2025
              </p>

              <p className="card-text">
                Grupo de aprendices que están adjudicados al sostenimiento
                regular.
              </p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="badge bg-success d-flex align-items-center gap-1">
                  <FaUsers /> 15 miembros
                </span>

                <div className="btn-group">
                  <Link to="/Chat_admin" className="btn btn-sm btn-outline-success">
                    <FaComments />
                  </Link>
                  <button className="btn btn-sm btn-outline-primary">
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div
              className="card-header text-white"
              style={{
                background: "linear-gradient(135deg, #28a745, #218838)",
              }}
            >
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <FaUsers />
                Grupo sostenimiento de transporte 2025
              </h5>
            </div>

            <div className="card-body">
              <p className="text-muted mb-2 d-flex align-items-center gap-2">
                <FaCalendarAlt />
                Creado: 28/11/2025
              </p>

              <p className="card-text">
                Grupo de aprendices adjudicados al sostenimiento de transporte.
              </p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="badge bg-success d-flex align-items-center gap-1">
                  <FaUsers /> 12 miembros
                </span>

                <div className="btn-group">
                  <Link to="/Chat_admin" className="btn btn-sm btn-outline-success">
                    <FaComments />
                  </Link>
                  <button className="btn btn-sm btn-outline-primary">
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div
              className="card-header text-white"
              style={{
                background: "linear-gradient(135deg, #28a745, #218838)",
              }}
            >
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <FaUsers />
                Grupo sostenimiento de alimentación 2025
              </h5>
            </div>

            <div className="card-body">
              <p className="text-muted mb-2 d-flex align-items-center gap-2">
                <FaCalendarAlt />
                Creado: 25/11/2025
              </p>

              <p className="card-text">
                Grupo de aprendices adjudicados al sostenimiento de alimentación.
              </p>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <span className="badge bg-success d-flex align-items-center gap-1">
                  <FaUsers /> 18 miembros
                </span>

                <div className="btn-group">
                  <Link to="/Chat_admin" className="btn btn-sm btn-outline-success">
                    <FaComments />
                  </Link>
                  <button className="btn btn-sm btn-outline-primary">
                    <FaEdit />
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default Lista_grupos;