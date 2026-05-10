import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  BsPeople,
  BsCalendar3,
  BsPersonBadge,
  BsCardText,
  BsChatDots,
  BsPeopleFill,
  BsPersonCircle,
  BsCheckCircleFill,
  BsExclamationTriangle
} from "react-icons/bs";

const Mi_grupo = () => {
  const [grupo, setGrupo] = useState(null);
  const [miembros, setMiembros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const fetchData = async () => {
      if (!usuarioActual || !usuarioActual.id_usuario) {
        setError("No se encontró sesión de usuario.");
        setLoading(false);
        return;
      }

      try {
        const resGrupo = await axios.get(`http://localhost:3001/api/aprendiz/mi-grupo/${usuarioActual.id_usuario}`);
        setGrupo(resGrupo.data);

        const resMiembros = await axios.get(`http://localhost:3001/api/aprendiz/mi-grupo/${usuarioActual.id_usuario}/miembros`);
        setMiembros(resMiembros.data);
      } catch (err) {
        console.error("Error al cargar datos del grupo:", err);
        setError(err.response?.data?.error || "Aún no tienes un grupo asignado.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando información de tu grupo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="alert alert-info d-inline-block border-0 shadow-sm">
          <BsExclamationTriangle size={40} className="mb-2 text-warning" />
          <h5>{error}</h5>
          <p className="mb-0">Cuando seas asignado a un grupo de apoyo, aparecerá aquí.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <br />
      <div className="p-4">
        {/* CARD INFO GRUPO */}
        <div className="card shadow-sm border-0 mb-4">
          <div
            className="card-header text-white"
            style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}
          >
            <h4 className="mb-0">
              <BsPeople className="me-2" /> {grupo?.nombre || "Mi Grupo"}
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
                  {grupo?.fecha_creacion ? new Date(grupo.fecha_creacion).toLocaleDateString() : "N/A"}
                </p>

                <p>
                  <strong>
                    <BsPersonBadge className="text-success me-1" />
                    Administrador:
                  </strong>{" "}
                  Leydi Callejas
                </p>

                <p>
                  <strong>
                    <BsPeople className="text-success me-1" />
                    Total de miembros:
                  </strong>{" "}
                  {miembros.length} aprendices
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
                  {grupo?.descripcion || "Sin descripción disponible."}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <Link to="/Chat_aprenidiz" className="btn btn-success d-inline-flex align-items-center">
                <BsChatDots className="me-2" /> Ver Mensajes
              </Link>
            </div>
          </div>
        </div>

        {/* LISTA DE MIEMBROS */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light">
            <h5 className="mb-0">
              <BsPeopleFill className="text-success me-2" />
              Miembros del Grupo ({miembros.length})
            </h5>
          </div>

          <div className="card-body">
            <div className="row g-3">
              {miembros.map((miembro) => {
                const isMe = miembro.id_usuario === usuarioActual.id_usuario;
                return (
                  <div className="col-md-6 col-lg-4" key={miembro.id_usuario}>
                    <div className={`d-flex align-items-center p-2 border rounded ${isMe ? 'bg-success bg-opacity-10' : ''}`}>
                      <BsPersonCircle
                        className="text-success"
                        size={32}
                      />
                      <div className="ms-3">
                        <strong>{miembro.primer_nombre} {miembro.primer_apellido}</strong>
                        <br />
                        {isMe ? (
                          <small className="text-success">
                            <BsCheckCircleFill className="me-1" />
                            Tú
                          </small>
                        ) : (
                          <small className="text-muted">Ficha: {miembro.grupo_formacion || 'N/A'}</small>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mi_grupo;
