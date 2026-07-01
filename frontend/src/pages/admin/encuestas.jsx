import "../../css/encuestas.css";
import { FaPlusCircle, FaTrashAlt, FaSave } from "react-icons/fa";
import { useState } from "react";
import { crearEncuesta } from "../../services/admin/encuestas.service";
import Swal from "sweetalert2";

const Encuestas = () => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [preguntas, setPreguntas] = useState([
    { pregunta: "", tipo: "escala" }
  ]);

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { pregunta: "", tipo: "escala" }]);
  };

  const eliminarPregunta = (index) => {
    if (preguntas.length === 1) return;
    const nuevas = preguntas.filter((_, idx) => idx !== index);
    setPreguntas(nuevas);
  };

  const handlePreguntaChange = (index, value) => {
    const nuevas = [...preguntas];
    nuevas[index].pregunta = value;
    setPreguntas(nuevas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      return Swal.fire("Campo requerido", "Por favor ingresa un título para la encuesta.", "warning");
    }
    const preguntasVacias = preguntas.some(p => !p.pregunta.trim());
    if (preguntasVacias) {
      return Swal.fire("Campos incompletos", "Por favor completa el texto de todas las preguntas.", "warning");
    }

    try {
      const adminStorage = localStorage.getItem("usuario");
      let idAdmin = 5;
      if (adminStorage) {
        try {
          idAdmin = JSON.parse(adminStorage).id_usuario;
        } catch {}
      }

      await crearEncuesta({
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        preguntas: preguntas.map(p => ({ pregunta: p.pregunta.trim(), tipo: "escala" })),
        admin_id: idAdmin
      });

      Swal.fire({
        icon: "success",
        title: "¡Creada con éxito!",
        text: "La encuesta ha sido publicada para los aprendices.",
        confirmButtonColor: "#28a745"
      });

      setTitulo("");
      setDescripcion("");
      setPreguntas([{ pregunta: "", tipo: "escala" }]);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo publicar la encuesta. Intenta nuevamente.", "error");
    }
  };

  return (
    <div className="contenido p-5">
      <div className="card encuesta-card shadow border-0" style={{ borderRadius: "20px" }}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}>
            📋
          </div>
          <div>
            <h2 className="mb-0 fw-bold text-dark">Crear Nueva Encuesta</h2>
            <p className="text-muted mb-0">Diseña encuestas de satisfacción para los aprendices</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold text-secondary">Título de la Encuesta *</label>
            <input
              type="text"
              className="form-control custom-input py-2"
              placeholder="Ej: Encuesta de Satisfacción GDF"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-secondary">Descripción o Introducción</label>
            <textarea
              className="form-control custom-input"
              rows="2"
              placeholder="Ej: Califica los siguientes aspectos del software de 1 a 10..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>

          <hr className="my-4 text-muted" />

          {/* CONTENEDOR DE PREGUNTAS */}
          <h4 className="fw-bold text-dark mb-3">Preguntas (Calificación 1 - 10)</h4>
          <div id="preguntas-container" className="mb-4">
            {preguntas.map((p, idx) => (
              <div
                key={idx}
                className="pregunta-box mb-3 p-3 border rounded shadow-sm position-relative animate-fade-in"
                style={{ backgroundColor: "#fdfdfd", borderLeft: "5px solid #28a745" }}
              >
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-bold mb-0 text-success">
                    Pregunta {idx + 1}
                  </label>
                  {preguntas.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-link text-danger p-0"
                      onClick={() => eliminarPregunta(idx)}
                    >
                      <FaTrashAlt /> Eliminar
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  className="form-control custom-input mb-2"
                  placeholder="Ej: ¿Qué tan intuitiva es la sección de Metas de Ahorro?"
                  value={p.pregunta}
                  onChange={(e) => handlePreguntaChange(idx, e.target.value)}
                  required
                />
                <span className="text-muted small">ℹ️ Tipo de respuesta: Calificación del 1 (Muy malo) al 10 (Excelente).</span>
              </div>
            ))}
          </div>

          <div className="d-flex gap-3 mt-4">
            <button
              type="button"
              onClick={agregarPregunta}
              className="btn btn-outline-success px-4 py-2 d-flex align-items-center gap-2"
            >
              <FaPlusCircle /> Agregar Pregunta
            </button>
            <button type="submit" className="btn btn-success px-5 py-2 flex-grow-1 d-flex align-items-center justify-content-center gap-2 fw-bold text-white shadow">
              <FaSave /> Publicar Encuesta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Encuestas;
