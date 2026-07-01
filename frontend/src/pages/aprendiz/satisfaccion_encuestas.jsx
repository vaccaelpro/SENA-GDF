import "../../css/satisfaccion_encuestas.css";
import React, { useEffect, useState, useCallback } from "react";
import { listarEncuestas, obtenerEncuesta, enviarRespuestasEncuesta, verificarRespuestaUsuario } from "../../services/admin/encuestas.service";
import Swal from "sweetalert2";
import { FaCheckCircle, FaClipboardList, FaArrowLeft } from "react-icons/fa";

const Satisfaccion_encuestas = () => {
  const usuarioInfo = JSON.parse(localStorage.getItem("usuario") || "{}");
  const idUsuario = usuarioInfo.id_usuario;

  const [encuestas, setEncuestas] = useState([]);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [respuestas, setRespuestas] = useState({}); // { [preguntaId]: { rating: X, comentario: Y } }
  const [yaRespondio, setYaRespondio] = useState(false);

  const cargarEncuestas = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listarEncuestas();
      setEncuestas(data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudieron cargar las encuestas.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEncuestas();
  }, [cargarEncuestas]);

  const seleccionarEncuesta = async (encuesta) => {
    setLoading(true);
    try {
      const data = await obtenerEncuesta(encuesta.id_formulario);
      const resVerif = await verificarRespuestaUsuario(encuesta.id_formulario, idUsuario);
      
      setEncuestaSeleccionada(data);
      setYaRespondio(resVerif.yaRespondio);
      
      // Inicializar estado de respuestas
      const initResps = {};
      data.preguntas.forEach(p => {
        initResps[p.id_pregunta] = { rating: "", comentario: "" };
      });
      setRespuestas(initResps);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo obtener el detalle de la encuesta.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (preguntaId, val) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        rating: val
      }
    }));
  };

  const handleComentarioChange = (preguntaId, val) => {
    setRespuestas(prev => ({
      ...prev,
      [preguntaId]: {
        ...prev[preguntaId],
        comentario: val
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se hayan calificado todas las preguntas
    const incompletas = encuestaSeleccionada.preguntas.some(p => !respuestas[p.id_pregunta].rating);
    if (incompletas) {
      return Swal.fire("Evaluación incompleta", "Por favor califica todas las preguntas de la encuesta.", "warning");
    }

    try {
      // Formatear respuestas para guardar.
      // Si hay comentario, lo concatenamos o enviamos por separado. Guardaremos la calificación y el comentario como respuestas separadas, o consolidamos
      const payloadRespuestas = [];
      encuestaSeleccionada.preguntas.forEach(p => {
        const respObj = respuestas[p.id_pregunta];
        // Enviar la calificación numérica
        payloadRespuestas.push({
          pregunta_id: p.id_pregunta,
          respuesta: respObj.rating
        });
        // Si hay comentario, enviarlo como respuesta asociada
        if (respObj.comentario.trim()) {
          payloadRespuestas.push({
            pregunta_id: p.id_pregunta,
            respuesta: `Comentario: ${respObj.comentario.trim()}`
          });
        }
      });

      await enviarRespuestasEncuesta(encuestaSeleccionada.id_formulario, {
        usuario_id: idUsuario,
        respuestas: payloadRespuestas
      });

      Swal.fire({
        icon: "success",
        title: "¡Gracias por calificar!",
        text: "Tu retroalimentación nos ayuda a mejorar constantemente.",
        confirmButtonColor: "#28a745"
      });

      setEncuestaSeleccionada(null);
      cargarEncuestas();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al enviar tus respuestas.", "error");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando módulo de encuestas...</p>
      </div>
    );
  }

  return (
    <div className="contenido p-4">
      {encuestaSeleccionada ? (
        <div className="containeree mt-2">
          <button className="btn btn-link text-success p-0 mb-3 d-flex align-items-center gap-2 text-decoration-none fw-bold" onClick={() => setEncuestaSeleccionada(null)}>
            <FaArrowLeft /> Volver a la lista
          </button>
          
          <h2 className="mb-2 text-success fw-bold">
            {encuestaSeleccionada.titulo}
          </h2>
          <p className="mb-4 text-muted">
            {encuestaSeleccionada.descripcion || "Por favor responde la siguiente encuesta."}
          </p>

          {yaRespondio ? (
            <div className="card shadow-sm p-5 text-center border-0" style={{ borderRadius: "15px" }}>
              <FaCheckCircle className="text-success mb-3" style={{ fontSize: "4rem" }} />
              <h3 className="fw-bold">Ya respondiste esta encuesta</h3>
              <p className="text-muted">¡Muchas gracias por tu tiempo y opiniones!</p>
              <button className="btn btn-success px-4 mt-2" onClick={() => setEncuestaSeleccionada(null)}>
                Regresar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {encuestaSeleccionada.preguntas.map((p, idx) => (
                <div className="question-card shadow-sm border-0 mb-4" key={p.id_pregunta} style={{ borderRadius: "15px", padding: "24px" }}>
                  <h5 className="question-title text-dark fw-bold mb-3">
                    {idx + 1}. {p.pregunta}
                  </h5>

                  <div className="mb-4">
                    <label className="form-label text-muted small fw-bold">
                      Calificación (1 = Muy insatisfecho, 10 = Excelente) *
                    </label>

                    <div className="rating-options d-flex gap-1 flex-wrap justify-content-between mt-2" style={{ maxWidth: "500px" }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <label className={`rating-item border rounded d-flex flex-column align-items-center justify-content-center p-2`} key={num} style={{ width: "40px", height: "45px", cursor: "pointer", transition: "0.2s", backgroundColor: respuestas[p.id_pregunta]?.rating === num ? "#28a745" : "#f8f9fa", color: respuestas[p.id_pregunta]?.rating === num ? "white" : "black" }}>
                          <input
                            type="radio"
                            name={`pregunta_${p.id_pregunta}`}
                            value={num}
                            checked={respuestas[p.id_pregunta]?.rating === num}
                            onChange={() => handleRatingChange(p.id_pregunta, num)}
                            style={{ display: "none" }}
                            required
                          />
                          <span className="fw-bold">{num}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="form-label fw-bold text-secondary small">Comentarios adicionales (opcional):</label>
                    <textarea
                      className="form-control custom-input"
                      rows="2"
                      placeholder="Cuéntanos más sobre tu respuesta..."
                      value={respuestas[p.id_pregunta]?.comentario || ""}
                      onChange={(e) => handleComentarioChange(p.id_pregunta, e.target.value)}
                    />
                  </div>
                </div>
              ))}

              <div className="text-center mt-4 mb-5">
                <button type="submit" className="btn btn-success btn-lg px-5 shadow fw-bold">
                  Enviar Encuesta
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-2">
          <h2 className="mb-2 text-success fw-bold">Encuestas Disponibles</h2>
          <p className="text-muted mb-4">Ayúdanos a mejorar evaluando los aspectos del sistema y servicios.</p>
          
          {encuestas.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
              <FaClipboardList className="text-muted mb-3 mx-auto" style={{ fontSize: "3rem" }} />
              <h5 className="text-muted">No hay encuestas publicadas en este momento.</h5>
            </div>
          ) : (
            <div className="row">
              {encuestas.map(enc => (
                <div className="col-md-6 mb-4" key={enc.id_formulario}>
                  <div className="card shadow-sm border-0 h-100 p-4" style={{ borderRadius: "15px", borderLeft: "5px solid #28a745" }}>
                    <h5 className="fw-bold text-dark">{enc.titulo}</h5>
                    <p className="text-muted small flex-grow-1">{enc.descripcion || "Sin descripción proporcionada."}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="badge bg-light text-dark">{enc.total_preguntas} Preguntas</span>
                      <button className="btn btn-success btn-sm px-4 fw-bold" onClick={() => seleccionarEncuesta(enc)}>
                        Responder
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Satisfaccion_encuestas;