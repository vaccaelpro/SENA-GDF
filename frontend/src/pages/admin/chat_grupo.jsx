import { Link } from "react-router-dom";
import "../../css/chat_grupo_admin.css";
import {
  FaComments,
  FaCircle,
  FaInfoCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaPaperPlane,
  FaArrowLeft,
} from "react-icons/fa";

const Chat_admin = () => {
  return (
    <div className="chat-admin-wrapper p-4">
      <div className="chat-admin-card shadow-sm">
        <div className="chat-admin-header d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 d-flex align-items-center gap-2">
              <FaComments /> Chat Administrativo
            </h5>
            <small>Mensajes para todos los aprendices</small>
          </div>

          <span className="chat-admin-status">
            <FaCircle /> En línea
          </span>
        </div>

        <div className="chat-admin-body">
          <div className="chat-admin-info-block">
            <FaInfoCircle /> Inicio del chat - 01/12/2025
          </div>

          <div className="chat-admin-message">
            <div className="chat-admin-author">
              <FaShieldAlt /> Leidy Callejas
            </div>
            <p>
              Bienvenidos al chat del grupo. Aquí podrán recibir información
              importante sobre todo el tema del apoyo.
            </p>
            <span className="chat-admin-time">Hoy 08:30 AM</span>
          </div>

          <div className="chat-admin-message">
            <div className="chat-admin-author">
              <FaShieldAlt /> Leidy Callejas
            </div>
            <p>
              Buenos días aprendices, por favor las personas que les tengo
              dotación pasar por bienestar el día de hoy.
            </p>
            <span className="chat-admin-time">Hoy 09:15 AM</span>
          </div>

          <div className="chat-admin-message">
            <div className="chat-admin-author">
              <FaShieldAlt /> Leidy Callejas
            </div>
            <p>
              Durante el año se presentaron varias convocatorias para apoyos de
              sostenimiento, por lo que los desembolsos se realizan de manera
              gradual durante el mes.
            </p>
            <span className="chat-admin-time">Hoy 10:20 AM</span>
          </div>

          <div className="chat-admin-date-block">
            <FaCalendarAlt /> 2 de Diciembre, 2025
          </div>

          <div className="chat-admin-message">
            <div className="chat-admin-author">
              <FaShieldAlt /> Leidy Callejas
            </div>
            <p>
              Recuerden que los aprendices nuevos este mes no reciben el
              desembolso.
            </p>
            <span className="chat-admin-time">Hoy 08:20 AM</span>
          </div>
        </div>

        {/* INPUT */}
        <div className="chat-admin-footer">
          <form className="chat-admin-input-box" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="chat-admin-input"
              placeholder="Escribe un mensaje para todos los aprendices..."
              aria-label="Escribir mensaje"
            />
            <button type="submit" className="chat-admin-send-btn" aria-label="Enviar mensaje">
              <FaPaperPlane /> Enviar
            </button>
          </form>

          <small className="chat-admin-note">
            <FaInfoCircle /> Solo el administrador puede enviar mensajes
          </small>
        </div>
      </div>

      <div className="mt-3">
        <Link to="/Lista_grupos" className="btn btn-secondary d-flex align-items-center gap-2">
          <FaArrowLeft /> Volver a Grupos
        </Link>
      </div>
    </div>
  );
};

export default Chat_admin;