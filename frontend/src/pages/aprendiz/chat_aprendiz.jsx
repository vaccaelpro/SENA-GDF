import "../../css/chat_aprendiz.css"
import { Link } from "react-router-dom";
import {
  FaComments,
  FaEye,
  FaInfoCircle,
  FaShieldAlt,
  FaCalendarAlt,
  FaLock,
  FaArrowLeft,
} from "react-icons/fa";

const Chat_aprenidiz = () => {
  return (
    <>
      <br />
      <div className="p-4">
        <div className="card shadow-sm border-0">
          <div
            className="card-header text-white d-flex justify-content-between align-items-center"
            style={{ background: "linear-gradient(135deg, #28a745, #218838)" }}
          >
            <div>
              <h5 className="mb-0 d-flex align-items-center gap-2">
                <FaComments /> Mensajes de Bienestar
              </h5>
              <small>Solo lectura - Información del instructor</small>
            </div>

            <span className="badge bg-light text-success d-flex align-items-center gap-1">
              <FaEye /> Modo lectura
            </span>
          </div>

          <div className="card-body p-0">
            <div className="chat-container" id="chatContainer">
              <div className="mensaje mensaje-info">
                <FaInfoCircle /> Inicio del chat - 01/12/2025
              </div>

              <div className="mensaje mensaje-admin">
                <div className="mensaje-header d-flex align-items-center gap-2">
                  <FaShieldAlt /> Leidy Callejas
                </div>
                <div>
                  Bienvenidos al chat del grupo. Aquí podrán recibir información
                  importante sobre todo el tema del apoyo.
                </div>
                <div className="mensaje-fecha">Hoy 08:30 AM</div>
              </div>

              <div className="mensaje mensaje-admin">
                <div className="mensaje-header d-flex align-items-center gap-2">
                  <FaShieldAlt /> Leidy Callejas
                </div>
                <div>
                  Buenos días aprendices, por favor las personas que les tengo
                  dotación pasar por bienestar el día de hoy.
                </div>
                <div className="mensaje-fecha">Hoy 09:15 AM</div>
              </div>

              <div className="mensaje mensaje-admin">
                <div className="mensaje-header d-flex align-items-center gap-2">
                  <FaShieldAlt /> Leidy Callejas
                </div>
                <div>
                  Estimados aprendices: Durante el año se presentaron varias
                  convocatorias para apoyos de sostenimiento, por lo que la
                  gestión de los desembolsos se realiza de manera gradual durante
                  el mes.
                </div>
                <div className="mensaje-fecha">Hoy 10:20 AM</div>
              </div>

              <div className="mensaje mensaje-info">
                <FaCalendarAlt /> 2 de Diciembre, 2025
              </div>

              <div className="mensaje mensaje-admin">
                <div className="mensaje-header d-flex align-items-center gap-2">
                  <FaShieldAlt /> Leidy Callejas
                </div>
                <div>
                  Recuerden que los aprendices nuevos este mes no les llega el
                  desembolso
                </div>
                <div className="mensaje-fecha">Hoy 08:20 AM</div>
              </div>
            </div>

            <div className="p-3 border-top bg-light text-center">
              <div className="alert alert-info mb-0">
                <FaLock /> Solo el administrador puede enviar mensajes en este
                chat.
                <br />
                <small>
                  Aquí recibirás información importante sobre bienestar y
                  sostenimiento.
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <Link to="/Mi_grupo" className="btn btn-secondary d-inline-flex align-items-center gap-2">
            <FaArrowLeft /> Volver a Mi Grupo
          </Link>
        </div>
      </div>
    </>
  );
};

export default Chat_aprenidiz;
