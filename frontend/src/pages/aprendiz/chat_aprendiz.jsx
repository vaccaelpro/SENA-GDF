import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../css/chat_grupo_admin.css";
import { obtenerMiGrupo, obtenerMensajesGrupo } from "../../services/aprendiz/grupo.service";
import {
  FaComments,
  FaCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaArrowLeft,
  FaLock,
  FaUser,
  FaExclamationTriangle
} from "react-icons/fa";

const Chat_aprendiz = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grupo, setGrupo] = useState(null);
  const [error, setError] = useState(null);

  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const fetchData = async () => {
      if (!usuarioActual || !usuarioActual.id_usuario) {
        setError("No se pudo identificar tu usuario. Por favor, inicia sesión de nuevo.");
        setLoading(false);
        return;
      }

      try {
        // Ejecutamos ambas peticiones
        const [dataGrupo, dataMensajes] = await Promise.all([
          obtenerMiGrupo(usuarioActual.id_usuario),
          obtenerMensajesGrupo(usuarioActual.id_usuario)
        ]);

        setGrupo(dataGrupo);
        setMensajes(dataMensajes);
      } catch (err) {
        console.error("Error al cargar el chat:", err);
        setError(err.response?.data?.error || "No se pudo cargar la información del grupo.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Solo al montar

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-success mb-3"></div>
        <p>Cargando mensajes del canal...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-center">
        <div className="alert alert-warning d-inline-block shadow-sm border-0">
          <FaExclamationTriangle size={30} className="mb-2" />
          <h5>Atención</h5>
          <p className="mb-0">{error}</p>
          <hr />
          <Link to="/Mi_grupo" className="btn btn-outline-secondary btn-sm">
            Volver a Mi Grupo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-admin-wrapper p-4">
      <br />
      {/* CARD DEL CHAT */}
      <div className="chat-admin-card shadow-sm mb-4">
        <div className="chat-admin-header d-flex justify-content-between align-items-center"
          style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}>
          <div>
            <h5 className="mb-0 d-flex align-items-center gap-2 text-white">
              <FaComments /> Canal de Comunicación ({grupo?.nombre || "Cargando..."})
            </h5>
            <small className="text-white-50">Información importante de Bienestar y Apoyos</small>
          </div>

          <span className="chat-admin-status text-white">
            <FaCircle className="text-light me-1" /> En línea
          </span>
        </div>

        <div className="chat-admin-body" style={{ maxHeight: "500px", overflowY: "auto" }}>
          {mensajes.length === 0 ? (
            <div className="chat-admin-info-block">
              <FaInfoCircle /> Aún no hay mensajes oficiales en este canal.
            </div>
          ) : (
            mensajes.map((msg) => {
              const isAdmin = msg.rol === 'ADMIN';
              const isMyMessage = String(usuarioActual.id_usuario) === String(msg.usuario_id);

              return (
                <div key={msg.id_mensaje} className={`chat-admin-message ${isMyMessage ? 'my-message' : ''}`}>
                  <div className="chat-admin-author">
                    {isAdmin ? <FaShieldAlt className="text-success" /> : <FaUser />} {msg.primer_nombre} {msg.primer_apellido} {isAdmin ? '(Instructor)' : ''}
                  </div>
                  <p>{msg.mensaje}</p>
                  <span className="chat-admin-time">
                    {new Date(msg.fecha_envio).toLocaleString()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* PIE DE CHAT */}
        <div className="chat-admin-footer bg-light p-3 border-top">
          <div className="alert alert-info d-flex align-items-center gap-3 mb-0 border-0 shadow-sm">
            <FaLock size={20} />
            <div>
              <strong>Canal de solo lectura</strong>
              <br />
              <small>Solo los administradores pueden enviar mensajes. Aquí recibirás novedades oficiales sobre tu apoyo.</small>
            </div>
          </div>
        </div>
      </div>
      {/* BOTON VOLVER */}
      <div className="mb-4">
        <Link to="/Mi_grupo" className="btn btn-outline-secondary d-flex align-items-center gap-2" style={{ maxWidth: "200px" }}>
          <FaArrowLeft /> Volver a Mi Grupo
        </Link>
      </div>
    </div>
  );
};

export default Chat_aprendiz;
