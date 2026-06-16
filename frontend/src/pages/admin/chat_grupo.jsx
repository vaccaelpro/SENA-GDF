import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import "../../css/chat_grupo_admin.css";
import {
  obtenerMensajesGrupo,
  obtenerMiembrosGrupo,
  obtenerDetalleGrupo,
  enviarMensajeGrupo,
  actualizarMensaje,
  eliminarMensaje
} from "../../services/admin/grupos.service";
import {
  FaComments,
  FaCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaPaperPlane,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaUsers,
  FaUserCircle
} from "react-icons/fa";

const Chat_admin = () => {
  const { id } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [miembros, setMiembros] = useState([]);
  const [grupo, setGrupo] = useState(null);

  // States for inline editing
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editMessageText, setEditMessageText] = useState("");
  
  // State for dropdown menu
  const [dropdownOpenId, setDropdownOpenId] = useState(null);

  const usuarioActual = JSON.parse(localStorage.getItem("usuario"));

  const fetchMensajes = useCallback(async () => {
    try {
      const data = await obtenerMensajesGrupo(id);
      setMensajes(data);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchMiembros = useCallback(async () => {
    try {
      const data = await obtenerMiembrosGrupo(id);
      setMiembros(data);
    } catch (error) {
      console.error("Error al obtener miembros:", error);
    }
  }, [id]);

  const fetchGrupo = useCallback(async () => {
    try {
      const data = await obtenerDetalleGrupo(id);
      setGrupo(data);
    } catch (error) {
      console.error("Error al obtener detalle del grupo:", error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchMensajes();
      fetchMiembros();
      fetchGrupo();
    }
  }, [id, fetchMensajes, fetchMiembros, fetchGrupo]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    if (!usuarioActual || !usuarioActual.id_usuario) {
      alert("No se encontró la información del usuario en sesión.");
      return;
    }

    try {
      await enviarMensajeGrupo(id, {
        usuario_id: usuarioActual.id_usuario,
        mensaje: nuevoMensaje
      });
      setNuevoMensaje("");
      fetchMensajes(); // Recargar los mensajes tras enviar
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar el mensaje.");
    }
  };

  const startEditing = (msg) => {
    setEditingMessageId(msg.id_mensaje);
    setEditMessageText(msg.mensaje);
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditMessageText("");
  };

  const handleSaveMessage = async (msgId) => {
    if (!editMessageText.trim()) return;
    try {
      await actualizarMensaje(msgId, editMessageText);
      setEditingMessageId(null);
      fetchMensajes();
    } catch (error) {
      console.error("Error al actualizar mensaje:", error);
      alert("Error al actualizar el mensaje.");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")) return;
    try {
      await eliminarMensaje(msgId);
      fetchMensajes();
    } catch (error) {
      console.error("Error al eliminar mensaje:", error);
      alert("Error al eliminar el mensaje.");
    }
  };

  return (
    <div className="chat-admin-wrapper p-4" onClick={() => setDropdownOpenId(null)}>
      
      {/* BOTON VOLVER */}
      <div className="mb-4">
        <Link to="/Lista_grupos" className="btn btn-outline-secondary d-flex align-items-center gap-2" style={{ maxWidth: "200px" }}>
          <FaArrowLeft /> Volver a Grupos
        </Link>
      </div>


      {/* CARD DEL CHAT */}
      <div className="chat-admin-card shadow-sm mb-4" onClick={(e) => e.stopPropagation()}>
        <div className="chat-admin-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 d-flex align-items-center gap-2">
              <FaComments /> Canal de Comunicación ({grupo?.nombre})
            </h5>
            <small>Mensajes para todos los aprendices del grupo</small>
          </div>

          <span className="chat-admin-status">
            <FaCircle /> En línea
          </span>
        </div>

        <div className="chat-admin-body" style={{ maxHeight: "450px", overflowY: "auto" }}>
          {loading ? (
            <div className="text-center p-3">Cargando mensajes...</div>
          ) : mensajes.length === 0 ? (
            <div className="chat-admin-info-block">
              <FaInfoCircle /> Aún no hay mensajes en este grupo.
            </div>
          ) : (
            mensajes.map((msg, idx) => {
              const isEditing = editingMessageId === msg.id_mensaje;
              const isMyMessage = usuarioActual && String(usuarioActual.id_usuario) === String(msg.usuario_id);

              return (
                <div key={msg.id_mensaje} className={`chat-admin-message ${isMyMessage ? 'my-message' : ''}`} style={{ position: "relative" }}>
                  <div className="chat-admin-author d-flex justify-content-between align-items-center">
                    <div>
                      <FaShieldAlt /> {msg.primer_nombre} {msg.primer_apellido} {msg.rol === 'ADMIN' ? '(Admin)' : ''}
                    </div>
                    {!isEditing && (
                      <div className="msg-actions position-relative">
                        <button 
                          className="btn-action-trigger p-0 border-0 bg-transparent" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDropdownOpenId(dropdownOpenId === msg.id_mensaje ? null : msg.id_mensaje);
                          }}
                        >
                          <FaChevronDown size={12} />
                        </button>
                        
                        {dropdownOpenId === msg.id_mensaje && (
                          <div className="dropdown-menu-custom position-absolute end-0 mt-1" style={{ zIndex: 1000 }}>
                            <button 
                              className="dropdown-item-custom" 
                              onClick={(e) => { e.stopPropagation(); startEditing(msg); setDropdownOpenId(null); }}
                            >
                              <FaEdit className="text-primary" /> <span>Editar</span>
                            </button>
                            <button 
                              className="dropdown-item-custom text-danger" 
                              onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id_mensaje); setDropdownOpenId(null); }}
                            >
                              <FaTrash /> <span>Eliminar</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                {isEditing ? (
                  <div className="mt-2 mb-2 d-flex gap-2 align-items-center">
                    <input 
                      type="text" 
                      className="form-control form-control-sm flex-grow-1"
                      value={editMessageText}
                      onChange={(e) => setEditMessageText(e.target.value)}
                      autoFocus
                    />
                    <button className="btn btn-sm btn-success" onClick={() => handleSaveMessage(msg.id_mensaje)}><FaCheck /></button>
                    <button className="btn btn-sm btn-secondary" onClick={cancelEditing}><FaTimes /></button>
                  </div>
                ) : (
                  <p>{msg.mensaje}</p>
                )}
                <span className="chat-admin-time">
                  {new Date(msg.fecha_envio).toLocaleString()}
                </span>
              </div>
            )})
          )}
        </div>

        {/* INPUT */}
        <div className="chat-admin-footer">
          <form className="chat-admin-input-box" onSubmit={handleEnviarMensaje}>
            <input
              type="text"
              className="chat-admin-input"
              placeholder="Escribe un mensaje para el grupo..."
              aria-label="Escribir mensaje"
              value={nuevoMensaje}
              onChange={(e) => setNuevoMensaje(e.target.value)}
            />
            <button type="submit" className="chat-admin-send-btn" aria-label="Enviar mensaje">
              <FaPaperPlane /> Enviar
            </button>
          </form>

          <small className="chat-admin-note">
            <FaInfoCircle /> Solo tú y otros administradores pueden enviar mensajes aquí.
          </small>
        </div>
      </div>

      {/* SECCION DE MIEMBROS - Estilo Mi_grupo.jsx */}
      <div className="card shadow-sm border-0 mt-4 mb-5">
        <div className="card-header bg-light py-3">
          <h5 className="mb-0 d-flex align-items-center gap-2">
            <FaUsers className="text-success" />
            Miembros del Grupo ({miembros.length})
          </h5>
        </div>

        <div className="card-body">
          <div className="row g-3">
            {miembros.length === 0 ? (
              <div className="col-12 text-center text-muted p-3">
                No hay aprendices registrados con este tipo de apoyo.
              </div>
            ) : (
              miembros.map((miembro) => (
                <div className="col-md-6 col-lg-4" key={miembro.id_usuario}>
                  <div className="d-flex align-items-center p-3 border rounded shadow-sm bg-white">
                    <FaUserCircle
                      className="text-success"
                      size={32}
                    />
                    <div className="ms-3">
                      <strong className="d-block text-dark">
                        {miembro.primer_nombre} {miembro.primer_apellido}
                      </strong>
                      <small className="text-muted">
                        Ficha: {miembro.grupo_formacion || 'N/A'}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat_admin;