import { Link } from "react-router-dom";
import {
  BsPeople,
  BsCalendar3,
  BsPersonBadge,
  BsCardText,
  BsChatDots,
  BsPeopleFill,
  BsPersonCircle,
  BsCheckCircleFill
} from "react-icons/bs";

const Mi_grupo = () => {
  return (
    <>
      <br />
      <div className="p-4">
        <div className="card shadow-sm border-0 mb-4">
          <div
            className="card-header text-white"
            style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}
          >
            <h4 className="mb-0">
              <BsPeople className="me-2" /> Grupo sostenimiento regular
            </h4>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>
                    <BsCalendar3 className="text-success me-1" />
                    Fecha de creación:
                  </strong>{" "}
                  01/12/2025
                </p>

                <p>
                  <strong>
                    <BsPersonBadge className="text-success me-1" />
                    Leydi callejas
                  </strong>
                </p>

                <p>
                  <strong>
                    <BsPeople className="text-success me-1" />
                    Total de miembros:
                  </strong>{" "}
                  15 aprendices
                </p>
              </div>

              <div className="col-md-6">
                <p>
                  <strong>
                    <BsCardText className="text-success me-1" />
                    Descripción:
                  </strong>
                </p>
                <p className="text-muted">
                  Grupo de aprendices que están adjudicados al sostenimiento
                  regular
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Link to="/Chat_aprenidiz" className="btn btn-success">
                <BsChatDots className="me-2" /> Ver Mensajes
              </Link>
            </div>
          </div>
        </div>

        <div className="card shadow-sm border-0">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <BsPeopleFill className="text-success me-2" />
              Miembros del Grupo
            </h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              {[
                "Juan Pérez García",
                "María López Ramírez",
                "Carlos Rodríguez Sánchez",
                "Ana Martínez Torres",
                "Luis Gómez Hernández",
                "Laura Díaz Moreno",
                "Pedro Ramírez Cruz",
                "Sofía González Vargas",
              ].map((nombre, index) => (
                <div className="col-md-6 col-lg-4" key={index}>
                  <div className="d-flex align-items-center p-2 border rounded">
                    <BsPersonCircle
                      className="text-success"
                      size={32}
                    />
                    <div className="ms-3">
                      <strong>{nombre}</strong>
                      <br />
                      <small className="text-muted">Ficha: 3147211</small>
                    </div>
                  </div>
                </div>
              ))}

              <div className="col-md-6 col-lg-4">
                <div className="d-flex align-items-center p-2 border rounded bg-success bg-opacity-10">
                  <BsPersonCircle
                    className="text-success"
                    size={32}
                  />
                  <div className="ms-3">
                    <strong>Tu Nombre</strong>
                    <br />
                    <small className="text-success">
                      <BsCheckCircleFill className="me-1" />
                      Tú
                    </small>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mi_grupo;
